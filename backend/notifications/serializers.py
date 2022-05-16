from rest_framework import serializers
from .models import Alirm, FirebaseToken


class FirebaseTokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = FirebaseToken
        fields = ('id', 'registration_token',)
        read_only_fields = ('user',)


class AlirmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alirm
        exclude = ('created_at', 'user',)