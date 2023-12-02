from django.urls import path
from django.contrib.auth import views as auth_views
from .views import mail, send_sms_view

app_name = 'twoFA'
urlpatterns = [
	# path('', get_home_page, name='get_home_page'),
    # # path('request1/', request_login, name='request_login'),
    # path('register/', create_account, name='create_account'),
    path('mail/', mail, name='mail'),
    
    path('sms/', send_sms_view, name='send_sms_view'),
]