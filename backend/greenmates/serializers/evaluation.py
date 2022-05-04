from rest_framework import serializers
from ..models import UserReview, UserEvaluation

class UserReviewPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReview
        fields = '__all__'
        read_only_fields = ('me',)
    
    def create(self, validated_data):
        validated_data['me'] = self.context['user']
        user_review = UserReview.objects.create(**validated_data)
        for evaluation in range(1, 5):
            if self.context['evaluation'][evaluation - 1]:
                UserEvaluation.objects.create(
                    user_review = user_review,
                    evaluation=evaluation
                )
        return user_review
