from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Prefetch
from ..models import Moim, Mate
from ..serializers.moim import (
    MoimSimpleSerializer,
    MoimDetailSerializer, 
    MoimAllSerializer,
    MoimTransSerializer,
    MoimPostPutSerializer,
)

from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_403_FORBIDDEN,
    HTTP_405_METHOD_NOT_ALLOWED,
)
import datetime
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(pk=2)   # TODO: request.user로 변경 (현재 pk=2로 TEST중)
# TODO: 유저정보
# 1. request.user 언어정보
# 2. login_required
# 3. 

@api_view(['GET', 'POST'])
def get_create_moim_list(request):
    '''
    GET: 모집 중인 모든 모임 글을 조회
    POST: 새로운 모임 글을 작성
    '''
    def moim_list():
        moims = Moim.objects.filter(status=0)
        serializer = MoimSimpleSerializer(moims, many=True)
        return Response(serializer.data)

    def moim_create():
        serializer = MoimPostPutSerializer(data=request.data, context={'user': user}) 
        author = user
        content_trans = 'English version of context' # TODO: community 번역 함수 활용예정
        if serializer.is_valid(raise_exception=True):
            serializer.save(author=author, content_trans=content_trans)
        return Response(
            data='모임이 정상적으로 작성되었습니다.',
            status=HTTP_201_CREATED
        )
    
    if request.method == 'GET':
        return moim_list()

    elif request.method =="POST":
        return moim_create()

@api_view(['GET', 'PUT'])
def get_update_moim_detail(request, moim_id):
    '''
    GET : 해당 모임 글의 상세 조회
    PUT : 해당 모임 글의 날짜, 시간 수정 (2시간 전까지)
    '''
    def moim_detail():
        serializer = MoimDetailSerializer(moim)
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
            return Response(serializer.data)
    
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
    # TODO: author_id를 request.user에서 가져오기. 현재 2번 user로 TEST 중.
    moims = get_list_or_404(Moim.objects.filter(mate__user=2, mate__mate_status=0))
    serializer = MoimDetailSerializer(moims, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_joined_moim(request):
    '''
    GET: 유저가 게스트로 합류중인 모임 리스트 조회
    ''' 
    moims = get_list_or_404(Moim.objects.filter(mate__user=2, mate__mate_status=1).exclude(author_id=2))
    serializer = MoimDetailSerializer(moims, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_opened_moim(request):
    '''
    GET: 유저가 호스트로 개설한 모임 리스트 조회
    '''
    moims = get_list_or_404(Moim.objects.filter(author_id=2, status__lt=2))
    serializer = MoimAllSerializer(moims, many=True) 
    return Response(serializer.data)

@api_view(['GET'])
def get_finished_moim(request):
    '''
    GET: 유저가 호스트 / 게스트로 참여한 종료된 모임 리스트 조회
    '''
    moims = get_list_or_404(Moim.objects.filter(mate__user=2, mate__mate_status=4))
    serializer = MoimDetailSerializer(moims, many=True)
    return Response(serializer.data)