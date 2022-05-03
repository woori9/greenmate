from rest_framework import serializers
from ..models import Mate
from accounts.serializers import UserSerializer

class MatePutPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mate
        fields = ('__all__')

# moim에 쓰일 mate 정보
class MateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mate
        fields = ('id', 'mate_status',)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        data = UserSerializer(instance.user).data
        response['user_id'] = data['id']
        response['nickname'] = data['nickname']
        response['vege_type'] = data['vege_type']
        return response