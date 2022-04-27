from rest_framework import serializers
from ..models import Feed
from .restaurant import RestaurantSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')


class FeedSerializer(serializers.ModelSerializer):
    like_users = UserSerializer(many=True)
    like_users_count = serializers.IntegerField(source='like_users.count', read_only=True)

    class Meta:
        model = Feed
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantSerializer(instance.restaurant).data
        return response


class FeedPostPutSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feed
        fields = '__all__'
        # exclude = ('like_users', )
        read_only_fields = ('author', 'restaurant', 'content_trans', )


class FeedTransSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feed
        fields = ('content_trans', )