from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_409_CONFLICT,
)
from ..serializers import (
    UserPutSerializer
)
from .token import get_request_user


User = get_user_model()


@api_view(['POST'])
def follow(request, user_id):
    '''
    POST: user_id 번 사용자를 (언)팔로우
    '''
    # me = get_object_or_404(User, pk=1)
    me = get_request_user(request)
    if not me:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif me == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    you = get_object_or_404(User, pk=user_id)
    if me.pk == you.pk:
        return Response(data='본인은 팔로우 할 수 없습니다.', status=HTTP_400_BAD_REQUEST)

    if you.followers.filter(id=me.pk).exists():
        you.followers.remove(me)    # unfollow
        return Response(data=f'{user_id} 사용자를 언팔로우 했습니다.', status=HTTP_204_NO_CONTENT)
    else:
        you.followers.add(me)       # follow
        return Response(data=f'{user_id} 사용자를 팔로우 했습니다.', status=HTTP_200_OK)


@api_view(['GET', 'PUT'])
def update_userinfo(request):
    '''
    GET: nickname 중복 검사
         { "new_nickname": 변경하려는 닉네임 }
    PUT: 회원 정보 수정 (nickname, vege_type, language)
    '''
    # user = get_object_or_404(User, pk=2)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        new_nick = request.GET.get('nickname')
        if not User.objects.filter(nickname=new_nick).exists():
            return Response(data='사용 가능', status=HTTP_200_OK)
        return Response(data='사용 불가능', status=HTTP_409_CONFLICT)

    elif request.method == 'PUT':
        try:
            new_nick = request.data['nickname']
            if not new_nick.strip():
                return Response(data='공백은 닉네임으로 등록할 수 없습니다.', status=HTTP_400_BAD_REQUEST)
        except:
            pass
        serializer = UserPutSerializer(user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)


@api_view(['PUT'])
def update_certified(request):
    '''
    PUT: 사용자 본인 인증 완료
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if user.is_certified:
        return Response(data='이미 인증된 사용자 입니다.', status=HTTP_400_BAD_REQUEST)
    
    serializer = UserPutSerializer(user, data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=HTTP_200_OK)