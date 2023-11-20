from django.urls import path
from django.contrib.auth import views as auth_views

# from .views import signup_page, login_page, home, logout_view, activate_account_page

from .views import request_login, get_home_page


app_name = 'accounts'
urlpatterns = [
	path('', get_home_page, name='get_home_page'),
    path('request1/', request_login, name='request_login'),
    
]


# To update password reset functionality