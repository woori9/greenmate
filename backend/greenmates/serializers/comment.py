from rest_framework import serializers
from ..models import Comment
from accounts.serializers import UserSerializer

# TODO: Comment => feed, like_users=>is_like, trans정보 X 작성자 닉네임까지
class CommentSerializer(serializers.ModelSerializer):
    is_like = serializers.SerializerMethodField()
    like_cnt = serializers.IntegerField(source='like_users.count', read_only=True)
    nickname = serializers.CharField(source='author.nickname', read_only=True)
    # like_users = UserSerializer(many=True)

    class Meta:
        model = Comment
        fields = (
            'id', 'is_like', 'like_cnt', 'author', 'nickname', 
            'content', 'parent', 'created_at', 'updated_at',
        )
    
    def get_is_like(self, obj):
        return Comment.objects.filter(pk=obj.id, like_users=self.context['user'].id).exists()



class CommentPostPutSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        exclude = ('like_users', )
        read_only_fields = ('author', 'feed', 'parent', 'content_trans', )


class CommentTransSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('content_trans', )