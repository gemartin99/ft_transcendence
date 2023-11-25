from django.urls import path
from .views import get_home_page, get_login_page, get_login_form_page, get_login42_form_page, change_view

urlpatterns = [
    path('', get_home_page, name='get_home_page'),
    path('login/', get_login_page, name='get_login_page'),
    path('login/identify/', get_login_form_page, name='get_login_form_page'),
    path('login/42identify/', get_login42_form_page, name='get_login42_form_page'),
    path('users/', change_view, name='change_view'),
    # Add other URL patterns as needed
]
