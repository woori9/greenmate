"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.permissions import AllowAny 
from drf_yasg.views import get_schema_view 
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="GreenMate",
      default_version='v1',
      description="SSAFY 자율PJT B105",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email=""),
    #   license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[AllowAny],
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/greenmates/', include('greenmates.urls')),
    path('swagger/', schema_view.with_ui('swagger')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
