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
from accounts.views.token import get_request_user


User = get_user_model()


@api_view(['POST'])
def create_update_token(request):
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
        return Response(status=HTTP_200_OK)

    except FirebaseToken.DoesNotExist:
        FirebaseToken.objects.create(
            user = user,
            registration_token=token,
            )
        return Response(data='알람 설정이 완료되었습니다.', status=HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_token(request):
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    token = request.data['registration_token']
    
    registration_token = get_object_or_404(FirebaseToken, user=user, registration_token=token)
    registration_token.delete()

    return Response(data='알람 설정이 취소되었습니다.', status=HTTP_204_NO_CONTENT)


@api_view(['POST'])
def send_chat_alarm(request, moim_id):
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    tokens = FirebaseToken.objects.filter(user__mate__moim_id=moim_id).values('registration_token').exclude(user=user)
    if not tokens:
        return Response(data='메세지 보낼 사람이 없습니다.', status=HTTP_204_NO_CONTENT)

    token_list = [token['registration_token'] for token in tokens]
    body = f'{user.nickname}님이 메세지를 보냈습니다.'

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

