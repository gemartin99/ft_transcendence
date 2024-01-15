from django.contrib.auth import views as auth_views
from django.urls import path

from .views import (activateGoogle2FA, activateMail2FA, disableTwoFactor,
                    enable_totp, get_set_google2FA_page, get_set_mail2FA_page,
                    getGoogleVerificationPage, getMailVerificationPage,
                    verify_totp, verifyMailCode)

app_name = 'twoFA'
urlpatterns = [
	# path('', get_home_page, name='get_home_page'),
    # # path('request1/', request_login, name='request_login'),
    # path('register/', create_account, name='create_account'),
    # path('mail/', mail, name='mail'),

    path('set-mail2FA/', get_set_mail2FA_page, name='get_set_mail2FA_page'),
    path('set-google2FA/', get_set_google2FA_page, name='get_set_google2FA_page'),
    path('google2FA/', activateGoogle2FA, name='activateGoogle2FA'),    
    path('mail2FA/', activateMail2FA, name='activateMail2FA'),
    path('verifyMailCode/', verifyMailCode, name='verifyMailCode'),
    path('MailVerification/', getMailVerificationPage, name='getMailVerificationPage'),
    path('verifyGoogleCode/', verify_totp, name='verify_totp'),
    path('GoogleVerification/', getGoogleVerificationPage, name='getGoogleVerificationPage'),
    # path('QRverification/')
    path('disable/', disableTwoFactor, name='disableTwoFactor'),
    path('getQR/', enable_totp, name='enable_totp'),
]