from django.urls import path
from django.contrib.auth import views as auth_views
from .views import get_home_page, get_login_page, get_login_form_page, get_login42_form_page, change_view, get_register_new_account_page, create_account, do_login, show_online, logout

urlpatterns = [
     path('', change_view, name='change_view'),
     path('login/', get_login_page, name='get_login_page'),
     path('login/action/', do_login, name='login'),
     path('login/identify/', get_login_form_page, name='get_login_form_page'),
     path('login/42identify/', get_login42_form_page, name='get_login42_form_page'),
     path('register/', get_register_new_account_page, name='get_register_new_account_page'),
     path('register/new/', create_account, name='create_account'),
     path('logout/', logout, name='logout'),
     path('showonline/', show_online, name='show_online'),

]
