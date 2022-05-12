from rest_framework import serializers
from ..models import UserReview, UserEvaluation

class UserReviewPostSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        many = kwargs.pop('many', True)
        super(UserReviewPostSerializer, self).__init__(many=many, *args, **kwargs)
    
    class Meta:
        model = UserReview
        fields = '__all__'
        read_only_fields = ('me',)

    def create(self, validated_data):
        validated_data['me'] = self.context['user']
        mate_id = validated_data['mate'].id
        evaluation_list = self.context['evaluations'][mate_id]
        user_review = UserReview.objects.create(**validated_data)
        for evaluation in evaluation_list:
            UserEvaluation.objects.create(
                user_review = user_review,
                evaluation=evaluation
            )
        return user_review