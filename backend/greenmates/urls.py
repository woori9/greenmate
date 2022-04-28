from django.urls import path
# ★★★★엔터 금지★★★★
# 1





# 2
from .views import community




# 3





urlpatterns = [
    # 1














    
















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
































]
