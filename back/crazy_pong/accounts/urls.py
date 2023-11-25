from django.urls import path
from django.contrib.auth import views as auth_views

from .views import signup_page, login_page, home, logout_view, activate_account_page

app_name = 'accounts'
urlpatterns = [

]


# To update password reset functionality