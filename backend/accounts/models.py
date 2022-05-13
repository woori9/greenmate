from calendar import c
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import (
    MinValueValidator, 
    MaxValueValidator
)

class User(AbstractUser):
    '''
    language: 0(kr)/1(en)
    '''
    LAN_CHOICE = [(0, 0), (1, 1)]
    kakao_email = models.CharField(max_length=30, null=True)
    nickname = models.CharField(max_length=30, null=True)
    refresh_token = models.TextField(null=True)
    language = models.IntegerField(choices=LAN_CHOICE, default=0)
    vege_type = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(6)],null=True)
    is_certified = models.BooleanField(default=False)
    followings = models.ManyToManyField('self', symmetrical=False, related_name='followers') 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.pk}: {self.nickname}'
