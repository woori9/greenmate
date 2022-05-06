import jwt
import datetime
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
)


User = get_user_model()


def create_token(payload, type):

    iat = datetime.datetime.now()

    if type == 'access':
        exp = iat + datetime.timedelta(hours=12)

    elif type == 'refresh':
        exp = iat + datetime.timedelta(weeks=2)

    else:
        raise Exception("INVALID TOKENTYPE")
        
    payload['iat'] = iat
    payload['exp'] = exp
    encoded = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded


def get_request_user(request):
    if 'Authorization' not in request.headers:
        return False

    access_token = request.headers['Authorization'].split(' ')[1]

    try:
        data_access = jwt.decode(str(access_token), settings.SECRET_KEY, algorithms=settings.ALGORITHM) 
        user = User.objects.get(kakao_email=data_access['email'])
        return user
    
    except jwt.ExpiredSignatureError:
        return 'EXPIRED_TOKEN'

    except jwt.DecodeError:
        return False

    except User.DoesNotExist:
        return False



@api_view(['GET'])
def verify_token(request):
    '''
    GET: 토큰 유효성 검사
    '''
    if 'Authorization' not in request.headers:
        return Response(data='UNAUTHORIZED', status=HTTP_401_UNAUTHORIZED)

    access_token = request.headers['Authorization'].split(' ')[1]
    # TODO: refresh_token 확인
    refresh_token = ''
    
    
    try:
        data_access = jwt.decode(str(access_token), settings.SECRET_KEY, algorithms=settings.ALGORITHM) 
        user = User.objects.get(kakao_email=data_access['email'])

        if refresh_token == user.refresh_token:
            try:
                data_refresh = jwt.decode(str(refresh_token), settings.SECRET_KEY, algorithms=settings.ALGORITHM)

                payload = {'email': user.kakao_email}
                token = { 
                    'access_token': create_token(payload, 'access'),
                    'refresh_token': create_token(payload, 'refresh'),
                }

                user.refresh_token = token['refresh_token']
                user.save()

                return JsonResponse(token, status=HTTP_201_CREATED)

            except jwt.ExpiredSignatureError:
                return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

        return Response(data='INVALID_TOKEN', status=HTTP_400_BAD_REQUEST)

    except jwt.DecodeError:
        return Response(data='INVALID_TOKEN', status=HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response(data='INVALID_USER', status=HTTP_404_NOT_FOUND)
