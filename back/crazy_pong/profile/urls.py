# from django.contrib.auth import views as auth_views
from django.urls import path

from .views import (UpdateInfo, get_edit_profile_page, get_profile_page,
                    get_twofactor_profile_page)

urlpatterns = [
     path('', get_profile_page, name='get_profile_page'),
     path('edit/', get_edit_profile_page, name='get_edit_profile_page'),
     path('twofactor/', get_twofactor_profile_page, name='get_twofactor_profile_page'),
     path('UpdateInfo/', UpdateInfo, name='UpdateInfo'),
]
