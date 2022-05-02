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
from .community import detectLangs
from ..models import Restaurant, RestaurantInfo
from ..serializers.restaurant import (
    RestaurantSerializer,
    RestaurantMapSerializer
)


User = get_user_model()


@api_view(['GET'])
def get_restaurant_list(request):
    '''
    GET: 지도에 표시될 식당 정보를 조회
    '''
    restaurant_list = get_list_or_404(Restaurant)
    serializer = RestaurantMapSerializer(restaurant_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search(request):
    '''
    수정예정 (모델 수정 전 코드)
    GET: 식당 검색
        { "word": "검색어" }
    '''
    vege_type_en = {
        'vegan': '비건', 'lacto': '락토', 'ovo': '오보',
        'lacto-ovo': '락토 오보', 'pesco': '페스코', 'pollo': '폴로'
    }

    word = request.GET.get('word')
    lan = detectLangs(word)
    if lan == 'ko':
        restaurant_list = Restaurant.objects.filter(
            Q(name_kr__contailns=word) | 
            Q(address_kr__contains=word) | 
            Q(menus_kr__contains=word) |
            Q(vege_types__contains=word) 
            )
    elif lan == 'en':
        try:
            vege = vege_type_en[word.lower()]
        except:
            vege = word
        restaurant_list = Restaurant.objects.filter(
            Q(name_en__icontailns=word) | 
            Q(address_en__icontains=word) | 
            Q(menus_en__icontains=word) |
            Q(vege_type__contains=vege)
            )
    else:
        return Response(data='지원하지 않는 언어입니다.', status=HTTP_400_BAD_REQUEST)
    
    serializer = RestaurantSerializer(restaurant_list, many=True)
    return Response(serializer.data)


