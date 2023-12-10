from django.urls import path
from django.contrib.auth import views as auth_views
from .views import get_profile_page

urlpatterns = [
     path('', get_profile_page, name='get_profile_page'),


]
