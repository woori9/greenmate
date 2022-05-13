from django.urls import path
from .views import (
    create_update_token,
    delete_token,
    send_moim_chat_alarm,
    send_personal_chat_alarm,
)


urlpatterns = [
    path('set/', create_update_token),
    path('cancel/<int:token_id>/', delete_token),
    path('moim-chat/<int:moim_id>/', send_moim_chat_alarm),
    path('personal-chat/<int:user_id>/', send_personal_chat_alarm)
]
