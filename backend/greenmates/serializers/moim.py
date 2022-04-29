from rest_framework import serializers
from ..models import Moim, Mate
from accounts.serializers import UserSerializer
from .restaurant import (
    RestaurantMoimDataKrSerializer, RestaurantMoimDataEnSerializer
    )
# mate 정보
class MateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mate
        fields = ('mate_status',)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        data = UserSerializer(instance.user).data
        response['user_id'] = data['id']
        response['nickname'] = data['nickname']
        response['vege_type'] = data['vege_type']
        return response

# 기본 모임 정보
class MoimSimpleSerializer(serializers.ModelSerializer):
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
        return now_cnt
       
# 기본 모임 정보 + 식당정보 (모임 list - 한글) 
class MoimSimpleKrSerializer(MoimSimpleSerializer):
    class Meta:
        model = Moim
        fields = (
            'id','author',
            'title', 'content', 'status', 'time', 'head_cnt', 'now_cnt',
            'restaurant',
            )
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantMoimDataKrSerializer(instance.restaurant).data
        return response


# 기본 모임 정보 + 식당정보 (모임 list - 영어)  
class MoimSimpleEnSerializer(MoimSimpleSerializer):
    class Meta:
        model = Moim
        fields = (
            'id','author',
            'title', 'content', 'status', 'time', 'head_cnt', 'now_cnt',
            'restaurant', 
            )

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['restaurant'] = RestaurantMoimDataEnSerializer(instance.restaurant).data
        return response

# 기본 모임 정보 + 식당정보 + mate_status 합류만 반환 (모임 상세 - 한글)
class MoimDetailKrSerializer(MoimSimpleKrSerializer):
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


# 기본 모임 정보 + 식당정보 + mate_status 합류만 반환 (모임 상세 - 영어)
class MoimDetailEnSerializer(MoimSimpleEnSerializer):
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

# 기본 모임 정보 + 식당정보 + mate_status 대기 / 합류 / 거절 / 취소 / 완료 반환 (한글)
class MoimAllKrSerializer(MoimSimpleKrSerializer):
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

# 기본 모임 정보 + 식당정보 + mate_status 대기 / 합류 / 거절 / 취소 / 완료 반환 (영어)
class MoimAllEnSerializer(MoimSimpleEnSerializer):
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
        mate.save()
        return moim
