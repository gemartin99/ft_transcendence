from django.urls import path
from django.contrib.auth import views as auth_views
from .views import get_home_page, create_account, login, bieltest


app_name = 'accounts'
urlpatterns = [
	path('', get_home_page, name='get_home_page'),
    # path('request1/', request_login, name='request_login'),
    path('register/', create_account, name='create_account'),
    path('login/', login, name='login'),
]


# To update password reset functionality