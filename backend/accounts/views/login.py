import requests
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_412_PRECONDITION_FAILED,
)
from ..serializers import UserInfoSerializer
from .token import create_token, get_request_user
from greenmates.models import Moim, Mate


User = get_user_model()


@api_view(['POST'])
def login_signup(request):
    '''
    POST: token 발급
          DB에 없는 사용자일 경우, DB에 저장 (signup)
    '''
    kakao_user_api = 'https://kapi.kakao.com/v2/user/me'
    kakao_token = request.data['access_token']

    # user Info
    user_info = requests.get(
        kakao_user_api, 
        headers={"Authorization": f'Bearer ${kakao_token}'}
        ).json()
    
    email = user_info['kakao_account']['email']
    nickname = user_info['kakao_account']['profile']['nickname']

    # SignUp (DB)
    if not User.objects.filter(kakao_email=email).exists():
        User.objects.create(
            username = email,
            kakao_email = email,
            nickname = nickname
            )

    # Login
    user = get_object_or_404(User, kakao_email=email)

    user.refresh_token = create_token({'email': email}, 'refresh')
    user.save()

    serializer = UserInfoSerializer(user)

    return Response(serializer.data, status=HTTP_200_OK)


@api_view(['DELETE'])
def signout(request):
    '''
    DELETE: 사용자 정보를 DB에서 삭제
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    # 진행 중인 모임 확인
    host = Moim.objects.filter(author=user.pk, status=0).exists()
    guest = Mate.objects.filter(user=user.pk, mate_status=4).exists()

    if host or guest:
        return Response(data='진행 중인 모임이 있습니다.', status=HTTP_412_PRECONDITION_FAILED)
    
    user.delete()
    return Response(data=f'{user.pk}번 사용자가 정상적으로 삭제되었습니다.', status=HTTP_204_NO_CONTENT)

    

