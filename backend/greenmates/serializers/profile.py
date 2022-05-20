from dataclasses import field
from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import serializers
from ..models import (
    Mate,
    Feed,
    UserRequest
)
from accounts.serializers import UserSerializer


User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    moim_cnt = serializers.SerializerMethodField()
    follower_cnt = serializers.SerializerMethodField()
    following_cnt = serializers.SerializerMethodField()
    following_status = serializers.SerializerMethodField()
    feed_cnt = serializers.SerializerMethodField()
    review_cnt = serializers.SerializerMethodField()
    # followers = UserSerializer(many=True)
    # followings = UserSerializer(many=True)

    class Meta:
        model = User
        fields = (
            'id', 'nickname', 'vege_type', 'moim_cnt', 
            'follower_cnt', 'following_cnt', 'following_status',
            'feed_cnt', 'review_cnt',
        )

    def get_moim_cnt(self, obj):
        return Mate.objects.filter(user=obj.id, mate_status=4).count()

    def get_follower_cnt(self, obj):
        '''
        나를 팔로우 하는 사람 수 => 그 사람의 팔로잉 목록에 내가 있는지(to_user_id)
        '''
        # count_query = User.objects.values('followings').filter(followings=obj.id)
        return User.objects.values('followings').filter(followings=obj.id).aggregate(Count('id'))['id__count']

    def get_following_cnt(self, obj):
        '''
        내가 팔로우 하는 사람 수 => 팔로우 하는 사람이 나인지(from_user_id)
        '''
        return User.objects.values('followers').filter(followers=obj.id).aggregate(Count('id'))['id__count']

    def get_following_status(self, obj):
        '''
        팔로우 X: 0, 팔로우 O: 1, 본인: 2
        '''
        me, you = self.context['me'], obj
        if me == you:
            return 2
        if you.followers.filter(pk=me.id).exists():
            return 1
        return 0
        
    def get_feed_cnt(self, obj):
        return Feed.objects.filter(author=obj.id).exclude(category=2).count()

    def get_review_cnt(self, obj):
        return Feed.objects.filter(author=obj.id, category=2).count()


class RequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRequest
        fields = '__all__'
        read_only_fields = ('user',)

