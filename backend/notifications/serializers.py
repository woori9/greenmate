from rest_framework import serializers
from .models import FirebaseToken


class FirebaseTokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = FirebaseToken
        fields = ('id', 'registration_token',)
        read_only_fields = ('user',)