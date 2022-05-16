from rest_framework import serializers
from ..models import UserReview, UserEvaluation
  
class UserReviewPostSerializer(serializers.ModelSerializer):
    evaluation = serializers.ListField(
        child = serializers.IntegerField(min_value=0, max_value=3)
    )

    def __init__(self, *args, **kwargs):
        many = kwargs.pop('many', True)
        super(UserReviewPostSerializer, self).__init__(many=many, *args, **kwargs)
    
    class Meta:
        model = UserReview
        fields = ('mate', 'score', 'evaluation')
        read_only_fields = ('me',)

    def create(self, validated_data):
        evaluations = validated_data.pop('evaluation')
        validated_data['me'] = self.context['user']
        user_review = UserReview.objects.create(**validated_data)
        for evaluation in evaluations:
            UserEvaluation.objects.create(
                user_review = user_review,
                evaluation=evaluation
            )
        return user_review