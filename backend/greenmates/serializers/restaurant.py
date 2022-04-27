from rest_framework import serializers
from ..models import Restaurant

# TODO : 어떤 레스토랑 정보를 식당리뷰에 실어서 보낼지 정하기
class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'