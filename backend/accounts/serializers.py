from rest_framework import serializers
from django.contrib.auth import get_user_model
from .views.token import create_token


User = get_user_model()


class UserInfoSerializer(serializers.ModelSerializer):

    access_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'nickname', 'is_certified', 'language', 'vege_type', 'access_token', 'refresh_token',)
        read_only_fields = ('jwt_access_token',)
    
    def get_access_token(self, obj):
        return create_token({'email': obj.kakao_email}, 'access')

    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'nickname', 'vege_type',)
