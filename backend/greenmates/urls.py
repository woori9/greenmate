from django.urls import path
# ★★★★엔터 금지★★★★
# 1
from .views import moim
from .views import mate



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
    path('mates/apply/<int:moim_id>/', mate.apply_mate),
    path('mates/cancle/<int:mate_id>/', mate.cancle_mate),
    path('mates/accept/<int:mate_id>/', mate.accept_mate),
    path('mates/decline/<int:mate_id>/', mate.decline_mate),
    path('mates/out/<int:mate_id>/', mate.out_mate),
    path('mates/evaluate/', mate.evaluate_mate),
    path('mates/search/', moim.search_moim),
    path('mates/filter/', moim.filter_moim),



    












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
    path('restaurant/all/', restaurant.get_restaurant_list),
    path('restaurant/search/', restaurant.search),
    path('restaurant/<int:restaurant_id>/', restaurant.get_simple_info),
    path('restaurant/detail/<int:restaurant_id>/', restaurant.get_detail_info),
    path('restaurant/like/<int:restaurant_id>/', restaurant.like_restaurant),



























]
