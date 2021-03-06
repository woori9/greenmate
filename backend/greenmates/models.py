import os
from django.conf import settings
from django.core.validators import (
    MinValueValidator, 
    MaxValueValidator
)
from django.utils import timezone
from django.db import models
from uuid import uuid4
from unicodedata import category

# def image_path(instance, filename):
#     username = instance.username
#     ymd = timezone.now().strftime('%Y/%m/%d')
#     uuid_name = uuid4().hex
#     extension = os.path.splitext(filename)[-1].lower()
#     return '/'.join([username, ymd, uuid_name[:2], uuid_name + extension])


class Restaurant(models.Model):
    category = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(9)])
    call = models.CharField(max_length=20)
    latitude = models.FloatField()
    longitude = models.FloatField()
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_restaurants')
    img_url = models.TextField()


class RestaurantInfo(models.Model):
    '''
    다국어 서비스 정보
    '''
    LAN_CHOICE = [(0, 0), (1, 1)]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    language = models.IntegerField(choices=LAN_CHOICE)
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
    content = models.TextField(max_length=100)
    content_trans = models.TextField()
    status = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(3)], default=0)
    time = models.DateTimeField()
    head_cnt = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(20)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}: {self.title}'


class Mate(models.Model):
    '''
    mate_status: 0(대기)/1(합류)/2(거절)/3(모임 취소)/4(모임 완료)
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    moim = models.ForeignKey(Moim, on_delete=models.CASCADE)
    mate_status = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(4)], default=0)


class UserReview(models.Model):
    '''
    score: 0(별로)/1(좋아요)/2(최고)
    '''
    me = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='you', on_delete=models.CASCADE) 
    mate = models.ForeignKey(Mate, on_delete=models.PROTECT)
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(2)])
    created_at = models.DateTimeField(auto_now_add=True)
    # me = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='evaluator')
    # you = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='target')


class UserEvaluation(models.Model):
    '''
    evaluation: 0/1/2/3
    '''
    user_review = models.ForeignKey(UserReview, on_delete=models.PROTECT)
    evaluation = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(3)])


class Feed(models.Model):
    '''
    category: 1(일상)/2식당)/3(제품)/4(레시피)
    '''
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True)
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], null=True)
    category = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(4)])
    content = models.CharField(max_length=100)
    content_trans = models.TextField()
    vege_type = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)], null=True)
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
    content = models.TextField(max_length=100)
    content_trans = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}: {self.content}'


class UserRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.TextField()
    content = models.TextField()