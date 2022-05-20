from rest_framework import serializers
from ..models import Feed, FeedImage, RestaurantInfo, Comment
from .restaurant import (
    RestaurantSerializer,
    RestaurantInfoSerializer,
    RestaurantNameSerializer
)
from .comment import CommentSerializer
from accounts.serializers import UserSerializer


class FeedSimpleSerializer(serializers.ModelSerializer):
    is_like = serializers.SerializerMethodField()
    like_cnt = serializers.IntegerField(source='like_users.count', read_only=True)
    img_paths = serializers.SerializerMethodField()
    comment_cnt = serializers.SerializerMethodField()
    # like_users = UserSerializer(many=True)

    class Meta:
        model = Feed
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['author'] = UserSerializer(instance.author).data
        return response

    def get_img_paths(self, obj):
        img = obj.feedimage_set.all()
        return FeedImageSerializer(instance=img, many=True).data

    def get_is_like(self, obj):
        return Feed.objects.filter(pk=obj.id, like_users=self.context['user'].id).exists()

    def get_comment_cnt(self, obj):
        return Comment.objects.filter(feed=obj).count()
        

class FeedSerializer(FeedSimpleSerializer):

    class Meta:
        model = Feed
        exclude = ('content_trans', 'like_users',)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantSerializer(instance.restaurant, context={'user': self.context['user']}).data
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


class FeedReviewSerializer(FeedSimpleSerializer):
    '''
    식당 상세정보 페이지에서 보일 식당 리뷰 정보
    '''
    class Meta:
        model = Feed
        fields = ('id', 'score', 'like_cnt', 'img_paths', 'content', 'created_at', 'updated_at')


class FeedCommentSerializer(FeedSimpleSerializer):
    comment_cnt = serializers.SerializerMethodField()

    class Meta:
        model = Feed
        exclude = ('author', 'restaurant', 'score', 'content_trans', 'like_users',)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.category == 2:
            response['score'] = instance.score
            res_info = RestaurantInfo.objects.filter(
                restaurant=instance.restaurant,
                language=self.context['user'].language
                )[0]
            response['res_info'] = RestaurantNameSerializer(res_info).data
        comment_list = Comment.objects.filter(feed=instance.id, parent__isnull=True)[:2]
        response['comments'] = CommentSerializer(comment_list, context={'user': self.context['user']}, many=True).data
        return response
    
    def get_comment_cnt(self, obj):
        return Comment.objects.filter(feed=obj.id).count()

