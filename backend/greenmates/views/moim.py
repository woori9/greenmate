# 비속어 검열 모듈 korcen 
# 출처: https://github.com/TANAT96564/korcen

from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Moim
from ..serializers.moim import (
    MoimSimpleSerializer,
    MoimDetailSerializer, 
    MoimAllSerializer,
    MoimTransSerializer,
    MoimPostPutSerializer,
    MoimFinishedSerializer,
)
from notifications.views import send_message, create_multiple_alirm
from notifications.models import FirebaseToken
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_405_METHOD_NOT_ALLOWED,
)
import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.contrib.auth import get_user_model
from accounts.views.token import get_request_user
from .community import n2mt
# from korcen import korcen

User = get_user_model()
# user = get_object_or_404(User, pk=3)

@api_view(['GET', 'POST'])
def get_create_moim_list(request):
    '''
    GET: 모집 중인 모든 모임 글을 조회
    POST: 새로운 모임 글을 작성
    '''
    def moim_list():
        moims = Moim.objects.filter(status=0).order_by('time')
        serializer = MoimSimpleSerializer(moims, context={'user': user}, many=True)
        return Response(serializer.data)

    def moim_create():
        serializer = MoimPostPutSerializer(data=request.data, context={'user': user}) 
        author = user
        content_trans = n2mt(request.data['content'])
        if serializer.is_valid(raise_exception=True):
            serializer.save(author=author, content_trans=content_trans)
            context = {
                'id': serializer.data['id']
            }
            return Response(
                data=context,
                status=HTTP_201_CREATED
            )
    
    # def is_badword():
    #     korcen = korcen.korcen()
    #     return korcen.check(request.data['title'] + ' ' + request.data['content'])

    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        return moim_list()

    elif request.method =="POST":
        # if is_badword():
        #    return Response(
        #        data='욕설이 감지되었습니다. 고운말로 다시 작성해 주세요.',
        #        status=HTTP_400_BAD_REQUEST
        #    ) 
        return moim_create()

@api_view(['GET', 'PUT'])
def get_update_moim_detail(request, moim_id):
    '''
    GET : 해당 모임 글의 상세 조회
    PUT : 해당 모임 글의 날짜, 시간 수정 (2시간 전까지)
    '''
    def moim_detail():
        # guest
        if moim.author != user:
            serializer = MoimDetailSerializer(moim, context={'user': user},)
        # host
        else:
            serializer = MoimAllSerializer(moim, context={'user': user}) 
        return Response(serializer.data)

    def moim_update():
        # request.user가 호스트인지 확인
        if moim.author != user:
            return Response(
                data='약속 시간 수정 권한이 없습니다.',
                status=HTTP_403_FORBIDDEN
            )
        # 2시간 전인지 확인
        two_hrs = datetime.datetime.now() + datetime.timedelta(hours=2)
        appointment = moim.time
        if two_hrs >= appointment:
            return Response(
                data='약속 시간 수정이 불가합니다.',
                status=HTTP_405_METHOD_NOT_ALLOWED
            )
        serializer = MoimPostPutSerializer(moim, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            tokens = FirebaseToken.objects.filter(user__mate__moim_id=moim_id).values_list('registration_token', flat=True).exclude(user=user)
            body = f'[{moim.title[:6]}…] 모임 시간이 변경되었습니다.'
            if tokens:
                if send_message(list(tokens), body):
                    guests_list = moim.mate_set.values_list('user_id', flat=True).exclude(user_id=user.pk)
                    create_multiple_alirm(guests_list, 2, '모임 시간 수정', body, user.pk)
            return Response(serializer.data)

    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    moim = get_object_or_404(Moim, pk=moim_id)
    if request.method == 'GET':
        return moim_detail()
    
    elif request.method == 'PUT':
        return moim_update()

@api_view(['GET'])
def get_trans_moim(request, moim_id):
    '''
    GET: 해당 모임글의 번역글을 조회
    '''
    moim = get_object_or_404(Moim, pk=moim_id)
    serializer = MoimTransSerializer(moim)
    return Response(serializer.data)

@api_view(['GET'])
def get_waiting_moim(request):
    '''
    GET: 유저가 게스트로 대기중인 모임 리스트 조회
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    moims_list = Moim.objects.filter(mate__user=user.id, mate__mate_status=0).order_by('time')
    serializer = MoimDetailSerializer(moims_list, context={'user': user}, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_joined_moim(request):
    '''
    GET: 유저가 게스트로 합류중인 모임 리스트 조회
    ''' 
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    moims_list = Moim.objects.filter(mate__user=user.id, mate__mate_status=1).exclude(author_id=user.id).order_by('time')
    serializer = MoimDetailSerializer(moims_list, context={'user': user}, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_opened_moim(request):
    '''
    GET: 유저가 호스트로 개설한 모임 리스트 조회
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    moims_list = Moim.objects.filter(author_id=user.id, status__lt=2).order_by('time')
    serializer = MoimAllSerializer(moims_list, context={'user': user}, many=True) 
    return Response(serializer.data)

@api_view(['GET'])
def get_finished_moim(request):
    '''
    GET: 유저가 호스트 / 게스트로 참여한 종료된 모임 리스트 조회
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    three_months = datetime.datetime.now() - relativedelta(months=3)
    moims_list = Moim.objects.filter(time__gte=three_months, mate__user=user.id, mate__mate_status=4).order_by('-time')
    serializer = MoimFinishedSerializer(moims_list, context={'user': user}, many=True) 
    return Response(serializer.data)

@api_view(['GET'])
def search_moim(request):
    '''
    GET: 모임 검색
        {"word": "검색어", "period": "기간", "day": "요일"}
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    word = request.GET.get('word', None)
    period = request.GET.get('period', None)
    day = request.GET.get('day', None)
    q = Q()
    if word:
        q = Q(author__nickname__icontains=word)
        q |= Q(restaurant__restaurantinfo__name__icontains=word)  
        q |= Q(restaurant__restaurantinfo__address__icontains=word)  
    if period:
        startdate = datetime.datetime.today()
        enddate = startdate + datetime.timedelta(days=int(period))
        q &= Q(time__range=[startdate, enddate])   
    if day:
        q &= Q(time__week_day=int(day)) 
    q &= Q(status=0)   
    moim_list = Moim.objects.filter(q).distinct().order_by('time')
    serializer = MoimSimpleSerializer(moim_list, context={'user': user}, many=True)
    return Response(serializer.data)