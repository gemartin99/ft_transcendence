from django.urls import path

from .views import (change_view, create_account, do_login,
                    get_login42_form_page, get_login_form_page, get_login_page,
                    get_register_new_account_page, is_playing, logout,
                    show_online, is_online, change_lang)

urlpatterns = [
     path('', change_view, name='change_view'),
     path('login/', get_login_page, name='get_login_page'),
     path('login/action/', do_login, name='login'),
     path('login/identify/', get_login_form_page, name='get_login_form_page'),
     path('login/42identify/', get_login42_form_page, name='get_login42_form_page'),
     path('register/', get_register_new_account_page, name='get_register_new_account_page'),
     path('register/new/', create_account, name='create_account'),
     path('logout/', logout, name='logout'),
     path('showonline/', show_online, name='show_online'),#debug
     path('playing/', is_playing, name='is_playing'),
     path('checkSession/', is_online, name='is_online'),
     path('changeLang/', change_lang, name='change_lang')
]
