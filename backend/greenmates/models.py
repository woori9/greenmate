import os
from unicodedata import category
from django.db import models
from django.conf import settings
from uuid import uuid4
from django.utils import timezone


# def image_path(instance, filename):
#     username = instance.username
#     ymd = timezone.now().strftime('%Y/%m/%d')
#     uuid_name = uuid4().hex
#     extension = os.path.splitext(filename)[-1].lower()
#     return '/'.join([username, ymd, uuid_name[:2], uuid_name + extension])


class Restaurant(models.Model):
    category = models.IntegerField()
    call = models.CharField(max_length=20)
    latitude = models.FloatField()
    longitude = models.FloatField()
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_restaurants')


class RestaurantInfo(models.Model):
    '''
    다국어 서비스 정보
    '''
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    language = models.IntegerField()
    name = models.CharField(max_length=255)
    address = models.TextField()
    menus = models.TextField()
    vege_types = models.CharField(max_length=50)


class Moim(models.Model):
    '''
    status: 0(모집중)/1(모집완료)/2(모집취소)/3(모임종료)
    '''
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    content = models.TextField()
    content_trans = models.TextField()
    status = models.IntegerField(default=0)
    time = models.DateTimeField()
    head_cnt = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}: {self.title}'


class Mate(models.Model):
    '''
    is_joined: 0(대기)/1(합류)/2(거절)
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    moim = models.ForeignKey(Moim, on_delete=models.CASCADE)
    mate_status = models.IntegerField(default=0)


class UserReview(models.Model):
    '''
    score: 0(별로)/1(좋아요)/2(최고)
    '''
    me = models.ManyToManyField(settings.AUTH_USER_MODEL, symmetrical=False, related_name='you') 
    moim = models.ForeignKey(Moim, on_delete=models.PROTECT)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    # me = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='evaluator')
    # you = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='target')


class UserEvaluation(models.Model):
    user_review = models.ForeignKey(UserReview, on_delete=models.PROTECT)
    evaluation = models.IntegerField()


class Feed(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True)
    score = models.IntegerField(null=True)
    category = models.IntegerField()
    content = models.CharField(max_length=100)
    content_trans = models.TextField()
    vege_type = models.IntegerField(null=True)
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_feeds')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.pk}: {self.content}'


class FeedImage(models.Model):
    '''
    TODO:
        image upload 경로 image_path 함수로 변경하기 (현재-DEBUG용)
    '''
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    img_path = models.ImageField(blank=True, upload_to='%Y/%m/%d')


class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_comments')
    content = models.TextField()
    content_trans = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}: {self.content}'