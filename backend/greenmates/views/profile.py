from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
)

from accounts.views.token import get_request_user
from ..models import Feed, RestaurantInfo
from ..serializers.feed import FeedCommentSerializer
from ..serializers.restaurant import RestaurantLikeSerializer
from ..serializers.profile import (
    ProfileSerializer,
    RequestSerializer
)


User = get_user_model()


@api_view(['GET'])
def get_profile(request, user_id):
    '''
    GET: {user_id}번 사용자의 프로필 조회
    '''
    # me = get_object_or_404(User, pk=1)
    me = get_request_user(request)
    
    if not me:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif me == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    you = get_object_or_404(User, pk=user_id)
    serializer = ProfileSerializer(you, context={'me': me})
    return Response(serializer.data)


@api_view(['GET'])
def get_evaluation_list(request, user_id):
    '''
    GET: {user_id}번 사용자가 받은 평가 조회
    user_id = request.user : 모든 평가 // 아닐경우 score 1, 2만
    group by score, evaluation, count 
    '''

    pass


@api_view(['GET'])
def get_feed_list(request, type, user_id):
    '''
    GET: {user_id}번 사용자가 작성한 피드/리뷰 조회
    TODO: user 변경
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if type == 'f':
        feed_list = Feed.objects.filter(author=user_id).exclude(category=1)
    elif type == 'r':
        feed_list = Feed.objects.filter(author=user_id, category=1)

    serializer = FeedCommentSerializer(feed_list, context={'user': user}, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_like_restaurant(request):
    '''
    GET: 좋아요 누른 식당 조회
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    restaurant_list = RestaurantInfo.objects.filter(restaurant__like_users=user.id, language=user.language)
    serializer = RestaurantLikeSerializer(restaurant_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_like_feed(request, type):
    '''
    GET: 좋아요 누른 피드/식당 리뷰 조회
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if type == 'f':
        feed_list = Feed.objects.filter(like_users=user.id).exclude(category=1)
    elif type == 'r':
        feed_list = Feed.objects.filter(like_users=user.id, category=1)

    serializer = FeedCommentSerializer(feed_list, context={'user': user}, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_user_request(request):
    '''
    POST: 유저의 식당 등록 요청을 DB에 저장
    '''
    user = get_object_or_404(User, pk=1)
    # user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    serializer = RequestSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save(user=user)
        return Response(data='작성 완료', status=HTTP_201_CREATED)
