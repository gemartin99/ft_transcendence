from django.urls import path
from django.contrib.auth import views as auth_views

from .views import get_profile_page, get_edit_profile_page

urlpatterns = [
     path('', get_profile_page, name='get_profile_page'),
     path('edit/', get_edit_profile_page, name='get_edit_profile_page'),
]


# To update password reset functionality