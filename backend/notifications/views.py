from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from firebase_admin import firestore, messaging
from firebase_admin.exceptions import InvalidArgumentError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, 
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_405_METHOD_NOT_ALLOWED
)
from .models import Alirm, FirebaseToken
from .serializers import AlirmSerializer, FirebaseTokenSerializer
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
def send_moim_chat_alirm(request, moim_id):
    '''
    POST: 작성자를 제외한 모임 참여자들에게 알림 발송
    '''
    moim = get_object_or_404(Moim, pk=moim_id)
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    # Check Request User 
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    # Check Activated Users
    activated_users = get_activate_users(chatroom_id=request.data['chatroom_id'])
    excluded_user_list = list(map(int, activated_users))
    if user.pk not in excluded_user_list:
        excluded_user_list.append(user.pk)

    # Check Token
    tokens = FirebaseToken.objects.filter(user__mate__moim_id=moim_id).values_list('registration_token', flat=True).exclude(user__in=excluded_user_list)
    if not tokens:
        return Response(data='메시지 보낼 사람이 없습니다.', status=HTTP_204_NO_CONTENT)
    
    # Send Message & Create Alirm
    moim_title = moim.title
    body = f'[{moim_title[:6]}…] {user.nickname}님이 메시지를 보냈습니다.'

    if send_message(list(tokens), body):
        users = FirebaseToken.objects.filter(user__mate__moim_id=moim_id).values_list('user', flat=True).exclude(user=user).distinct()
        create_multiple_alirm(list(users), 1, moim_title, body, user.pk)
        return Response(status=HTTP_200_OK)
    return Response(status=HTTP_403_FORBIDDEN)


@api_view(['POST'])
def send_personal_chat_alirm(request, user_id):
    '''
    POST: {user_id}에게 채팅 알림을 발송
    '''
    you = get_object_or_404(User, pk=user_id)
    # me = get_object_or_404(User, pk=1)
    me = get_request_user(request)

    # Check Request User 
    if not me:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif me == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    # Check User
    if me == you:
        return Response(data='나와의 채팅은 지원하지 않습니다.',status=HTTP_400_BAD_REQUEST)

    # Check token
    tokens = FirebaseToken.objects.filter(user=you).values_list('registration_token', flat=True)
    if not tokens:
        return Response(data='메시지 알림을 허용하지 않은 사용자 입니다.', status=HTTP_204_NO_CONTENT)

    # Check 'you' Activated
    activated_users = get_activate_users(chatroom_id=request.data['chatroom_id'])
    if str(you.pk) in activated_users:
        return Response(data='활성화 상태의 사용자 입니다.', status=HTTP_204_NO_CONTENT)

    # Send Message & Create Alirm
    body = f'{me.nickname}님이 메시지를 보냈습니다.'
    if send_message(list(tokens), body):
        create_single_alirm(you.pk, 0, me.nickname, body, me.pk)
        return Response(status=HTTP_200_OK)

    return Response(status=HTTP_403_FORBIDDEN)


@api_view(['GET', 'DELETE'])
def get_delete_all_alirm(request):
    '''
    GET: user가 받은 전체 알림 조회
    DELETE: user의 알림 전체 삭제
    '''
    # user = get_object_or_404(User, pk=2)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        alirms = Alirm.objects.filter(user=user).order_by('-pk')
        serializer = AlirmSerializer(alirms, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'DELETE':
        alirms = Alirm.objects.filter(user=user).delete()
        return Response(data=f'{user.pk}번 사용자의 알림이 모두 삭제되었습니다.', status=HTTP_204_NO_CONTENT)
    else:
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['DELETE'])
def delete_alirm(request, alirm_id):
    '''
    DELETE: {alirm_id}번 알림 삭제
    '''
    alirm = get_object_or_404(Alirm, pk=alirm_id)
    # user = get_object_or_404(User, pk=4)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if alirm.user != user:
        return Response(data='접근 권한이 없습니다.', status=HTTP_403_FORBIDDEN)

    alirm.delete()
    return Response(data=f'{alirm_id}번 알림이 삭제되었습니다.', status=HTTP_204_NO_CONTENT)


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


def get_activate_users(chatroom_id):
    '''
    채팅방이 활성화 된 사용자 목록 가져오기
    '''
    firebase = firestore.client()

    doc_ref = firebase.collection(u'rooms').document(u'{0}'.format(chatroom_id))
    doc = doc_ref.get() # rooms collection에서 chatroom_id key를 가진 문서 가져오기
    room_info = doc.to_dict()

    return room_info['activatedUsers']


def create_single_alirm(user, category, title, body, sent_by):
    '''
    알림 1개 생성
    '''
    Alirm.objects.create(user_id=user, category=category, title=title, body=body, sent_by=sent_by)
    return True


def create_multiple_alirm(user_list, category, title, body, sent_by):
    '''
    알림 여러개 생성
    '''
    alirm_list = []
    for user in user_list:
        alirm_list.append(Alirm(user_id=user, category=category, title=title, body=body, sent_by=sent_by))
    Alirm.objects.bulk_create(alirm_list)
    return True
    
