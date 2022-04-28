from django.urls import path
from .views import login, token, update, login_test


urlpatterns = [
    # path('logintest/', login_test.login_test),
    # path('logintest/callback/', login_test.callback),
    path('kakao/login/',login.login_signup),
    path('signout/', login.signout),
    path('token/', token.verify_token),
]
