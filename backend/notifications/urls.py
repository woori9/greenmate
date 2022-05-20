from django.urls import path
from .views import (
    create_update_token,
    delete_token,
    send_moim_chat_alirm,
    send_personal_chat_alirm,
    get_delete_all_alirm,
    delete_alirm
)


urlpatterns = [
    path('set/', create_update_token),
    path('cancel/<int:token_id>/', delete_token),
    path('moim-chat/<int:moim_id>/', send_moim_chat_alirm),
    path('personal-chat/<int:user_id>/', send_personal_chat_alirm),
    path('alirm/', get_delete_all_alirm),
    path('alirm/<int:alirm_id>/', delete_alirm),
]
