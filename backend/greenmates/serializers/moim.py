from rest_framework import serializers
from ..models import Moim, Mate
from accounts.serializers import UserSerializer
from .restaurant import (
    RestaurantMoimDataSerializer
    )
from .mate import MateSerializer

class MoimSerializer(serializers.ModelSerializer):
    now_cnt = serializers.SerializerMethodField() 
    class Meta:
        model = Moim
        fields = (
            'id', 'status', 'time', 'head_cnt', 'now_cnt',
            )
    def get_now_cnt(self, obj):
        now_cnt = obj.mate_set.filter(mate_status=1).count()
        return now_cnt

# 기본 모임 정보
class MoimBaseSerializer(serializers.ModelSerializer):
    now_cnt = serializers.SerializerMethodField() 

    class Meta:
        model = Moim

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['author'] = UserSerializer(instance.author).data
        return response

    # 합류 중인 인원수
    def get_now_cnt(self, obj):
        now_cnt = obj.mate_set.filter(mate_status=1).count()
        if obj.status == 3:
            now_cnt = obj.mate_set.filter(mate_status=4).count()
        return now_cnt
       
# 기본 모임 정보 + 식당정보 (모임 list) 
class MoimSimpleSerializer(MoimBaseSerializer):
    class Meta:
        model = Moim
        fields = (
            'id','author',
            'title', 'content', 'status', 'time', 'head_cnt', 'now_cnt',
            'restaurant',
            )
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantMoimDataSerializer(instance.restaurant, context=self.context).data
        return response

# 기본 모임 정보 + 식당정보 + mate_status 합류만 반환 + 로그인 한 유저 mate_status (모임 상세)
class MoimDetailSerializer(MoimSimpleSerializer):
    mates = serializers.SerializerMethodField()     
    
    class Meta:
        model = Moim
        fields = (
            'id','author',
            'title', 'content', 'status', 'time', 'head_cnt', 'now_cnt',
            'mates', 'restaurant', 
            )

    def get_mates(self, obj):
        queryset = obj.mate_set.filter(mate_status=1)
        serializer = MateSerializer(queryset, many=True) 
        return serializer.data

    def to_representation(self, instance):
        '''
        user_mate_status: 0(대기) 1(guest-참여) 2(거절) 3(취소) 4(완료) 5(host-진행) 6(신청 안함)
        '''
        response = super().to_representation(instance)
        logged_in_user_mate = instance.mate_set.filter(user=self.context['user'])
        if len(logged_in_user_mate):
            response['user_mate_id'] = logged_in_user_mate[0].id
            mate_status = logged_in_user_mate[0].mate_status
            if mate_status == 1:
                if self.context['user'] == instance.author:
                    mate_status = 5
            response['user_mate_status'] = mate_status
        else:
            response['user_mate_id'] = ''
            response['user_mate_status'] = 6
        return response

# 기본 모임 정보 + 식당정보 + mate_status 대기 / 합류 / 거절 / 취소 / 완료 반환 
class MoimAllSerializer(MoimSimpleSerializer):
    mates = serializers.SerializerMethodField() 
    
    class Meta:
        model = Moim
        fields = (
            'id','author',
            'title', 'content', 'status', 'time', 'head_cnt', 'now_cnt',
            'mates', 'restaurant', 
            )

    def get_mates(self, obj):
        return MateSerializer(obj.mate_set, many=True).data
   
# 번역된 글 
class MoimTransSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moim
        fields = ('content_trans',)

# 모임 글 작성 및 수정
class MoimPostPutSerializer(serializers.ModelSerializer):

    class Meta:
        model = Moim
        fields = ('__all__')
        read_only_fields = ('author', 'content_trans', 'status',)
    
    def create(self, validated_data):
        moim = Moim.objects.create(**validated_data)
        mate = Mate.objects.create(
            moim=moim, 
            user=self.context['user'],
            mate_status=1
        )
        return moim
