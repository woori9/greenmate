from django.urls import path
from .views import login, token, update, login_test


urlpatterns = [
    path('kakao/login/',login.login_signup),
    path('signout/', login.signout),
    path('userinfo/', update.update_userinfo),
    path('userinfo/certified/', update.update_certified),
    path('follow/<int:user_id>/', update.follow),
    path('token/', token.verify_token),
    # path('logintest/', login_test.login_test),
    # path('logintest/callback/', login_test.callback),
]
