from django.contrib import admin
from .models import (
    Restaurant,
    RestaurantInfo,
    Moim,
    Mate,
    UserReview,
    UserEvaluation,
    Feed,
    FeedImage,
    Comment
)


admin.site.register(Restaurant)
admin.site.register(RestaurantInfo)
admin.site.register(Moim)
admin.site.register(Mate)
admin.site.register(UserReview)
admin.site.register(UserEvaluation)
admin.site.register(Feed)
admin.site.register(FeedImage)
admin.site.register(Comment)
