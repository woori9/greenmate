from django.urls import path
from .views import (
    create_update_token,
    delete_token,
    send_chat_alarm
)


urlpatterns = [
    path('set/', create_update_token),
    path('cancel/<int:token_id>/', delete_token),
    path('chat/<int:moim_id>/', send_chat_alarm),
]
