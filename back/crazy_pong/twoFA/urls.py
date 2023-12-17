from django.urls import path
from django.contrib.auth import views as auth_views
from .views import activateGoogle2FA, activateMail2FA, verifyMailCode, disableTwoFactor, get_set_mail2FA_page, get_verification_page

app_name = 'twoFA'
urlpatterns = [
	# path('', get_home_page, name='get_home_page'),
    # # path('request1/', request_login, name='request_login'),
    # path('register/', create_account, name='create_account'),
    # path('mail/', mail, name='mail'),

    path('set-mail2FA/', get_set_mail2FA_page, name='get_set_mail2FA_page'),
    path('google2FA/', activateGoogle2FA, name='activateGoogle2FA'),    
    path('mail2FA/', activateMail2FA, name='activateMail2FA'),
    path('verifyMailCode/', verifyMailCode, name='verifyMailCode'),
    path('MailVerification/', get_verification_page, name='get_verification_page'),
    path('disable/', disableTwoFactor, name='disableTwoFactor'),
    # path('sms/', send_sms_view, name='send_sms_view'),
    # path('getQR/', enable_totp, name='enable_totp'),
    # path('checkQR/', verify_totp, name='verify_totp'),

]