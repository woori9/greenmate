from django.urls import path
# ★★★★엔터 금지★★★★
# 1
from .views import moim




# 2
from .views import community




# 3
from .views import restaurant




urlpatterns = [
    # 1
    path('mates/', moim.get_create_moim_list),
    path('mates/<int:moim_id>/', moim.get_update_moim_detail),
    path('mates/translate/<int:moim_id>/', moim.get_trans_moim),
    path('mates/wait/', moim.get_waiting_moim),
    path('mates/join/', moim.get_joined_moim),
    path('mates/myopen/', moim.get_opened_moim),
    path('mates/finished/', moim.get_finished_moim),









    














    # 2
    path('community/feeds/', community.get_create_feedlist),
    path('community/feed/<int:feed_id>/', community.update_delete_feed),
    path('community/comment/<int:feed_id>/', community.get_create_comment),
    path('community/comment/detail/<int:comment_id>/', community.update_delete_comment),
    path('community/feed/<int:feed_id>/like/', community.like_feed),
    path('community/comment/<int:comment_id>/like/', community.like_comment),
    path('community/feed/<int:feed_id>/trans/', community.get_trans_feed),
    path('community/comment/<int:comment_id>/trans/', community.get_trans_comment),





















    # 3
    path('restaurants/all/', restaurant.get_restaurant_list),
    path('restaurant/search/', restaurant.search),






























]
