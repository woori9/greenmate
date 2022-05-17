from django.db.models import Avg
from rest_framework import serializers
from ..models import Feed, Restaurant, RestaurantInfo


class RestaurantInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = RestaurantInfo
        fields = ('name', 'address', 'menus', 'vege_types',)
        read_only_fields = ('id', 'language', 'restaurant',)


class RestaurantSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()
    is_like = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        # fields = ('id', 'category', 'call', 'img_url', 'score', 'is_like', 'latitude', 'longitude')
        exclude = ('like_users',)
        
    def to_representation(self, instance):
        response = super().to_representation(instance)   
        res_info = RestaurantInfo.objects.filter(restaurant=instance.id, language=self.context['user'].language)
        response['res_info'] = RestaurantInfoSerializer(res_info, many=True).data[0]
        return response

    def get_score(self, obj):
        try:
            score = obj.feed_set.aggregate(Avg('score'))['score__avg']
            return '{:.1f}'.format(score)
        except:
            return 0

    def get_is_like(self, obj):
        return Restaurant.objects.filter(pk=obj.id, like_users=self.context['user'].id).exists()
    

class RestaurantSimpleSerializer(RestaurantSerializer):

    class Meta:
        model = Restaurant
        exclude = ('call', 'like_users')

class RestaurantDetailSerializer(RestaurantSerializer):

    class Meta:
        model = Restaurant
        exclude = ('like_users',)

    def to_representation(self, instance):
        from .feed import FeedReviewSerializer

        response = super().to_representation(instance)   
        feed_list = Feed.objects.filter(restaurant=instance.id)
        response['review'] = FeedReviewSerializer(feed_list, many=True).data
        return response


class RestaurantMapSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ('id', 'name', 'latitude', 'longitude')

    def get_name(self, obj):
        try:
            data = obj.restaurantinfo_set.filter(language=self.context['user'].language).values('name')[0]['name']
        except:
            data = '준비중입니다.'
        return data


class RestaurantLikeSerializer(serializers.ModelSerializer):
    img_url = serializers.SerializerMethodField()

    class Meta:
        model = RestaurantInfo
        fields = ('restaurant', 'name', 'vege_types', 'img_url')

    def get_img_url(self, obj):
        return Restaurant.objects.filter(pk=obj.restaurant.pk).values('img_url')[0]['img_url']


class RestaurantNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = RestaurantInfo
        fields = ('restaurant', 'name',)