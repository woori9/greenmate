import requests
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
)
from .token import create_token
from ..serializers import UserInfoSerializer

# LOGIN TEST PAGE
User = get_user_model()


@api_view(['GET'])
def login_test(request):
    '''
    GET: kakao code 발급
    '''
    REST_API_KEY = '3963ce84a6636097049e97f540e9974c'
    redirect_uri = 'http://localhost:8000/api/accounts/logintest/callback/'
    kakao_auth_api = 'https://kauth.kakao.com/oauth/authorize?response_type=code'
    return redirect(f'{kakao_auth_api}&client_id={REST_API_KEY}&redirect_uri={redirect_uri}')


@api_view(['GET'])
def callback(request):
    '''
    GET: token 발급
         DB에 없는 사용자일 경우, DB에 저장 (signup)
    '''
    CODE = request.query_params['code']
    REST_API_KEY = '3963ce84a6636097049e97f540e9974c'
    redirect_uri = 'http://localhost:8000/api/accounts/logintest/callback/'
    kakao_token_url = 'https://kauth.kakao.com/oauth/token'

    data = {
        'grant_type': 'authorization_code',
        'client_id': REST_API_KEY,
        'redirect_uri': redirect_uri,
        'code': CODE
    }
    headers = {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    kakao_response = requests.post(
        kakao_token_url, data=data, headers=headers, 
    ).json()

    kakao_token = kakao_response['access_token']
    kakao_user_api = 'https://kapi.kakao.com/v2/user/me'

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
            username = nickname,
            kakao_email = email,
            nickname = nickname
            )

    # Login
    user = get_object_or_404(User, kakao_email=email)

    user.refresh_token = create_token({'email': email}, 'refresh')
    user.save()

    serializer = UserInfoSerializer(user)

    return Response(serializer.data, status=HTTP_200_OK)
