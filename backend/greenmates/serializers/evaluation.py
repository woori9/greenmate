from rest_framework import serializers
from ..models import UserReview, UserEvaluation

class UserReviewPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReview
        fields = '__all__'
        read_only_fields = ('me',)
    
    def create(self, validated_data):
        user_review = UserReview.objects.create(**validated_data)
        user_review.me.add(self.context['user'])
        UserEvaluation.objects.create(
            user_review = user_review,
            evaluation=self.context['evaluation']
        )
        return user_review
