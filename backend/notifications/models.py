from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator, 
    MaxValueValidator
)

class FirebaseToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    registration_token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Alirm(models.Model):
    '''
    category: 0(개인채팅)/1(모임채팅)/2(모임관련)
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(2)])
    title = models.CharField(max_length=30, null=True)
    body = models.CharField(max_length=30)
    sent_by = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
