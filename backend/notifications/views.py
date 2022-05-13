from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from firebase_admin import messaging
from firebase_admin.exceptions import InvalidArgumentError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, 
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN
)
from .models import FirebaseToken
from .serializers import FirebaseTokenSerializer
from accounts.views.token import get_request_user
from greenmates.models import Moim

User = get_user_model()


@api_view(['POST'])
def create_update_token(request):
    '''
    POST: 유저, 토큰이 일치하는 값이 DB에 없을 경우 저장, 있을 경우 updated_at 수정
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    token = request.data['registration_token']
    try:
        token = FirebaseToken.objects.get(user=user, registration_token=token)
        token.save()
        serializer = FirebaseTokenSerializer(token)
        return Response(serializer.data, status=HTTP_200_OK)

    except FirebaseToken.DoesNotExist:
        serializer = FirebaseTokenSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=user)
        return Response(serializer.data, status=HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_token(request, token_id):
    '''
    DELETE: 유저, 토큰이 일치하면 DB에서 삭제
    '''
    registration_token = get_object_or_404(FirebaseToken, pk=token_id)
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    if registration_token.user == user:
        registration_token.delete()
        return Response(data='알람 설정이 취소되었습니다.', status=HTTP_204_NO_CONTENT)
    return Response(data='잘못된 요청입니다.', status=HTTP_403_FORBIDDEN)


@api_view(['POST'])
def send_moim_chat_alarm(request, moim_id):
    '''
    POST: 작성자를 제외한 모임 참여자들에게 알림 발송
    '''
    moim = get_object_or_404(Moim, pk=moim_id)
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    tokens = FirebaseToken.objects.filter(user__mate__moim_id=moim_id).values_list('registration_token', flat=True).exclude(user=user)

    if not tokens:
        return Response(data='메세지 보낼 사람이 없습니다.', status=HTTP_204_NO_CONTENT)
    
    moim_title = moim.title[:6]
    token_list = list(tokens)
    body = f'[{moim_title}…] {user.nickname}님이 메시지를 보냈습니다.'

    if send_message(token_list, body):
        return Response(status=HTTP_200_OK)
    return Response(status=HTTP_403_FORBIDDEN)


@api_view(['POST'])
def send_personal_chat_alarm(request, user_id):
    '''
    POST: {user_id}에게 채팅 알림을 발송
    '''
    you = get_object_or_404(User, pk=user_id)
    # me = get_object_or_404(User, pk=1)
    me = get_request_user(request)

    if not me:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif me == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if me == you:
        return Response(data='나와의 채팅은 지원하지 않습니다.',status=HTTP_400_BAD_REQUEST)
    
    tokens = FirebaseToken.objects.filter(user=you).values_list('registration_token', flat=True)
    if not tokens:
        return Response(data='메세지 알림을 허용하지 않은 사용자 입니다.', status=HTTP_204_NO_CONTENT)

    token_list = list(tokens)
    body = f'{me.nickname}님이 메시지를 보냈습니다.'

    if send_message(token_list, body):
        return Response(status=HTTP_200_OK)
    return Response(status=HTTP_403_FORBIDDEN)

    
def send_message(tokens, body, title='Green Mate'):
    # multi messages
    if type(tokens) == list:
        message = messaging.MulticastMessage(
            data={ 'title': title, 'body': body },
            tokens=tokens,
        )
        messaging.send_multicast(message)
        return True

    # message
    elif type(tokens) == str:
        message = messaging.Message(
            data={ 'title': title, 'body': body },
            token=tokens,
        )
        try:
            messaging.send(message)
            return True
        except InvalidArgumentError:
            return False

    # Invalid token type
    return False

