from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from ..models import Restaurant, RestaurantInfo
from accounts.views.token import get_request_user


# TODO: user 변경
User = get_user_model()
user = get_object_or_404(User, pk=1)


class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)    
        response['res_info'] = RestaurantInfo.objects.filter(restaurant=instance.id, language=user.language)
        return response


class RestaurantMapSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ('id', 'name', 'latitude', 'longitude')

    def get_name(self, obj):
        try:
            data = obj.restaurantinfo_set.filter(language=user.language).values('name')[0]['name']
        except:
            data = '준비중입니다.'
        return data
