from rest_framework import serializers
from ..models import Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')


class CommentSerializer(serializers.ModelSerializer):
    like_users = UserSerializer(many=True)
    like_users_count = serializers.IntegerField(source='like_users.count', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentPostPutSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        exclude = ('like_users', )
        read_only_fields = ('author', 'feed', 'parent', 'content_trans', )


class CommentTransSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('content_trans', )