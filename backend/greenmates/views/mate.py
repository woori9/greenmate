from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Moim, Mate
from ..serializers.moim import MoimSerializer
from ..serializers.mate import MatePutPostSerializer
from ..serializers.evaluation import UserReviewPostSerializer
from notifications.views import send_message, create_single_alirm
from notifications.models import FirebaseToken
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_409_CONFLICT,
)
import datetime
from django.contrib.auth import get_user_model
from accounts.views.token import get_request_user

User = get_user_model()
# user = User.objects.get(pk=3)

def make_massage(me, you, title, body):
    token = FirebaseToken.objects.filter(user=you).values_list('registration_token', flat=True)
    if token:
        if send_message(list(token), body):
            create_single_alirm(you.pk, 2, title, body, me.pk)

@api_view(['POST'])
def apply_mate(request, moim_id):
    '''
    POST: 해당 모임에 대기 신청
    ''' 
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    moim = get_object_or_404(Moim, pk=moim_id)
    user_in_mate = moim.mate_set.values('user').filter(user=user.id)
    if len(user_in_mate): # 호스트 or 이전에 거절/합류 된 유저라면 대기 신청 못함
        return Response(
            data='이 모임에 대기 신청이 불가합니다.',
            status=HTTP_409_CONFLICT
        )

    serializer = MatePutPostSerializer(data={'moim': moim_id, 'user': user.id, 'mate_staus': 0})
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        body = f'[{moim.title[:6]}…] {user.nickname}님이 모임 참여 신청했습니다.'
        make_massage(user, moim.author, '대기 신청', body)
        return Response(
            data=f'{moim_id}번 모임에 대기 신청되었습니다.',
            status=HTTP_201_CREATED
        )

@api_view(['DELETE'])
def cancle_mate(request, mate_id):
    '''
    DELETE: 게스트가 대기 신청을 취소
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    mate = get_object_or_404(Mate, pk=mate_id)
    if mate.user.pk != user.id: # 대기 신청자 본인이 아닌 경우
        return Response(
            data='접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if mate.mate_status != 0: # 대기 상태가 아닌 경우 (대기 취소가 아닌, 모임 나가기 해야 함)
        return Response(
            data='대기 취소가 불가합니다.',
            status=HTTP_409_CONFLICT
        )
    moim = mate.moim
    body = f'[{moim.title[:6]}…] {user.nickname}님이 모임 신청을 취소했습니다.'
    make_massage(user, moim.author, '대기 취소', body)
    mate.delete()
    return Response(
        data='대기 신청이 정상적으로 취소되었습니다.',
        status=HTTP_204_NO_CONTENT
    )

@api_view(['PUT'])
def accept_mate(request, mate_id):
    '''
    PUT: 해당 모임의 호스트가 게스트의 참여를 수락
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    mate = get_object_or_404(Mate, pk=mate_id)
    moim = mate.moim
    if moim.author.pk != user.id: # 모임의 호스트가 아닌 경우
        return Response(
            data='접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if mate.mate_status != 0 or moim.status != 0: # 게스트가 대기 상태가 아닌 경우거나 모임 모집중이 아닌 경우
        return Response(
            data='참여 수락이 불가합니다.',
            status=HTTP_409_CONFLICT
        )
    mate.mate_status = 1
    mate.save()
    moim_serializer = MoimSerializer(moim).data
    if moim_serializer['now_cnt'] == moim_serializer['head_cnt']:
        moim.status = 1
        moim.save()
    body = f'[{moim.title[:6]}…] 모임 참여가 수락되었습니다.'
    make_massage(user, mate.user, '참여 수락', body)
    return Response(
        data='게스트 참여를 수락했습니다.',
        status=HTTP_201_CREATED
    )

@api_view(['PUT'])
def decline_mate(request, mate_id):
    '''
    PUT: 호스트가 게스트의 참여를 거절
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    mate = get_object_or_404(Mate, pk=mate_id)
    moim = mate.moim
    if moim.author.pk != user.id: # 모임의 호스트가 아닌 경우
        return Response(
            data='접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if mate.mate_status > 1: # 게스트가 대기 상태 또는 참여 상태가 아닌 경우
        return Response(
            data='참여 거절이 불가합니다.',
            status=HTTP_409_CONFLICT
        )
    if mate.mate_status == 1:
        two_hrs = datetime.datetime.now() + datetime.timedelta(hours=2) 
        appointment = moim.time
        if two_hrs >= appointment: # 2시간 전인지 확인
            return Response(
                data='모임 시간 2시간 이전부터는 모임 나가기가 불가합니다.',
                status=HTTP_405_METHOD_NOT_ALLOWED
            )
    mate.mate_status = 2
    mate.save()
    body = f'[{moim.title[:6]}…] 모임 참여가 거절되었습니다.'
    make_massage(user, mate.user, '참여 거절', body)
    return Response(
        data='게스트 참여를 거절했습니다.',
        status=HTTP_201_CREATED
    )

@api_view(['DELETE'])
def out_mate(request, mate_id):
    '''
    DELETE: 모임 나가기
      case1: 호스트가 아직 참여한 게스트가 0명일 때, 모임 2시간이 되기 전에 모임을 취소 
      case2: 참여 수락된 게스트가 모임 나감
    '''
    def out_host():
        moim_serializer = MoimSerializer(moim).data
        if two_hrs < appointment and moim_serializer['now_cnt'] == 1:
            mate.mate_status = 3
            mate.save()
            moim.status = 2
            moim.save() 
            return Response(
                data='모임을 나갔습니다.',
                status=HTTP_204_NO_CONTENT
            )
        return Response(
                data='모임 나가기가 불가합니다.',
                status=HTTP_405_METHOD_NOT_ALLOWED
            )

    def out_guest():
        if mate.mate_status != 1: # 참여 수락된 게스트만 나갈 수 있음
            return Response(
                data='모임 나가기가 불가합니다.',
                status=HTTP_409_CONFLICT
            )

        if two_hrs >= appointment: # 2시간 전인지 확인
            return Response(
                data='모임 시간 2시간 이전부터는 모임 나가기가 불가합니다.',
                status=HTTP_405_METHOD_NOT_ALLOWED
            )

        mate.delete()
        moim_serializer = MoimSerializer(moim).data
        if moim_serializer['now_cnt'] < moim_serializer['head_cnt'] and moim.status == 1:
            moim.status = 0
            moim.save()
        body = f'[{moim.title[:6]}…] {user.nickname}님이 모임을 나갔습니다.'
        make_massage(user, moim.author, '모임 나감', body)
        return Response(
            data='모임을 나갔습니다.',
            status=HTTP_204_NO_CONTENT
        )

    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    mate = get_object_or_404(Mate, pk=mate_id)
    moim = mate.moim
    two_hrs = datetime.datetime.now() + datetime.timedelta(hours=2) 
    appointment = moim.time
    
    # case1. 호스트인 경우
    if moim.author.pk == user.id == mate.user.pk:
        return out_host()
    
    # case2. 게스트인 경우
    elif mate.user.pk == user.id:
        return out_guest()
        
    return Response(
        data='접근 권한이 없습니다.',
        status=HTTP_403_FORBIDDEN
    )

@api_view(['POST'])
def evaluate_mate(request):
    '''
    POST: 유저 평가
    '''
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    evaluations_list = request.data
    serializer = UserReviewPostSerializer(
        data=evaluations_list, 
        many=True, 
        context={'user':user}
        )
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(
            status=HTTP_201_CREATED
        )
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)