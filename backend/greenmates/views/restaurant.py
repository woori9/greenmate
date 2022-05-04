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
from ..models import Restaurant
from ..serializers.restaurant import (
    RestaurantMapSerializer,
    RestaurantSimpleSerializer,
    RestaurantDetailSerializer,
)


User = get_user_model()


@api_view(['GET'])
def get_restaurant_list(request):
    '''
    GET: 지도에 표시될 식당 정보를 조회
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    restaurant_list = get_list_or_404(Restaurant)
    serializer = RestaurantMapSerializer(restaurant_list, context={'user':user}, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search(request):
    '''
    GET: 식당 검색
        { "word": "검색어" }
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    word = request.GET.get('word')
    restaurant_list = Restaurant.objects.filter(
        Q(restaurantinfo__language=0) &
        Q(restaurantinfo__name__icontains=word) | 
        Q(restaurantinfo__address__icontains=word) | 
        Q(restaurantinfo__menus__icontains=word) |
        Q(restaurantinfo__vege_types__icontains=word)
    ).distinct()

    serializer = RestaurantSimpleSerializer(restaurant_list, context={'user':user}, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_simple_info(request, restaurant_id):
    '''
    GET: {restaurant_id}번 식당 기본 정보 조회
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    serializer = RestaurantSimpleSerializer(restaurant, context={'user':user})
    return Response(serializer.data)


@api_view(['GET'])
def get_detail_info(request, restaurant_id):
    '''
    GET: {restaurant_id}번 식당 상세 정보 조회
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    serializer = RestaurantDetailSerializer(restaurant, context={'user':user})
    return Response(serializer.data)


@api_view(['POST'])
def like_restaurant(request, restaurant_id):
    '''
    POST: {restaurant_id}번 식당에 좋아요/좋아요 취소
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)
    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)
    
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

    if restaurant.like_users.filter(pk=user.id).exists():
        restaurant.like_users.remove(user)
        return Response(data=f'{restaurant_id}번 식당 좋아요 취소', status=HTTP_204_NO_CONTENT)
    else:
        restaurant.like_users.add(user)
        return Response(data=f'{restaurant_id}번 식당 좋아요', status=HTTP_201_CREATED)