from django.http import QueryDict
from rest_framework import serializers
from ..models import Feed, FeedImage
from .restaurant import RestaurantSerializer
from accounts.serializers import UserSerializer


class FeedSerializer(serializers.ModelSerializer):
    like_users = UserSerializer(many=True)
    like_users_count = serializers.IntegerField(source='like_users.count', read_only=True)
    img_paths = serializers.SerializerMethodField()

    def get_img_paths(self, obj):
        img = obj.feedimage_set.all()
        return FeedImageSerializer(instance=img, many=True).data

    class Meta:
        model = Feed
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantSerializer(instance.restaurant).data
        response['author'] = UserSerializer(instance.author).data
        return response


class FeedImageSerializer(serializers.ModelSerializer):
    img_path = serializers.ImageField(use_url=True)

    class Meta:
        model = FeedImage
        fields = ('img_path', )


class FeedPostPutSerializer(serializers.ModelSerializer):
    img_paths = FeedImageSerializer(many=True, read_only=True)

    class Meta:
        model = Feed
        # fields = '__all__'
        exclude = ('like_users', )
        read_only_fields = ('author', 'restaurant', 'content_trans', )

    def create(self, validated_data):
        instance = Feed.objects.create(**validated_data)
        img_set = self.context['request'].FILES
        for data in img_set.getlist('img_path'):
            FeedImage.objects.create(feed=instance, img_path=data)
        return instance


class FeedTransSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feed
        fields = ('content_trans', )