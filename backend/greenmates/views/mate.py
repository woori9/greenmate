from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from uritemplate import partial
from ..models import Moim, Mate
from ..serializers.moim import MoimSerializer
from ..serializers.mate import (
    MatePutPostSerializer
)

from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_403_FORBIDDEN,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_409_CONFLICT,
)
import datetime
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(pk=2) 

@api_view(['POST'])
def apply_mate(request, moim_id):
    '''
    POST: 해당 모임에 대기 신청
    ''' 
    moim = get_object_or_404(Moim, pk=moim_id)
    user_in_mate = moim.mate_set.values('user').filter(user=user.pk)
    print(user_in_mate)
    if len(user_in_mate): # 호스트 or 이전에 거절/합류 된 유저라면 대기 신청 못함
        return Response(
            data='이 모임에 대기 신청이 불가합니다.',
            status=HTTP_409_CONFLICT
        )

    serializer = MatePutPostSerializer(data={'moim': moim_id, 'user': user.pk, 'mate_staus': 0})
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(
            data=f'{moim_id}번 모임에 대기 신청되었습니다.',
            status=HTTP_201_CREATED
        )

@api_view(['DELETE'])
def cancle_mate(request, mate_id):
    '''
    DELETE: 게스트가 대기 신청을 취소
    '''
    mate = get_object_or_404(Mate, pk=mate_id)
    if mate.user.pk != user.pk: # 대기 신청자 본인이 아닌 경우
        return Response(
            data='접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if mate.mate_status != 0: # 대기 상태가 아닌 경우 (대기 취소가 아닌, 모임 나가기 해야 함)
        return Response(
            data='대기 취소가 불가합니다.',
            status=HTTP_409_CONFLICT
        )

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
    mate = get_object_or_404(Mate, pk=mate_id)
    moim = mate.moim
    if moim.author.pk != 3: # 모임의 호스트가 아닌 경우
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
    return Response(
        data='게스트 참여를 수락했습니다.',
        status=HTTP_201_CREATED
    )

@api_view(['PUT'])
def decline_mate(request, mate_id):
    '''
    PUT: 호스트가 게스트의 참여를 거절
    '''
    mate = get_object_or_404(Mate, pk=mate_id)
    moim = mate.moim
    if moim.author.pk != user.pk: # 모임의 호스트가 아닌 경우
        return Response(
            data='접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if mate.mate_status != 0: # 게스트가 대기 상태가 아닌 경우
        return Response(
            data='참여 거절이 불가합니다.',
            status=HTTP_409_CONFLICT
        )
    mate.mate_status = 2
    mate.save()
    return Response(
        data='게스트 참여를 거절했습니다.',
        status=HTTP_201_CREATED
    )

@api_view(['DELETE'])
def out_mate(request, mate_id):
    '''
    DELETE: 모임 나가기
      case1: 참여 수락된 게스트가 모임 나감
      case2: 호스트가 모임 2시간이 되기 전에 모임을 취소
      case3: 모임 2시간 전까지 인원 모집이 안됨
    '''
    pass

@api_view(['PUT'])
def evaluate_mate(request, moim_id):
    pass