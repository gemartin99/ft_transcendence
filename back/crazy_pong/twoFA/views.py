# from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.template.loader import render_to_string
# Create your views here.
from django.core.mail import send_mail
from accounts.models import Usermine
# import pyotp
from authentification.authentification import Authentification
from django.views.decorators.csrf import csrf_exempt
from .twoFA import TwoFA
from datetime import datetime, timezone
import twoFA.langs

def activateGoogle2FA(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    user.google2FA = True
    user.save()
    return get_verification_page() 

def verifyGoogle2FA(request):
    if (TwoFA.verify_totp(request)):
        return JsonResponse({'message': 'ok'})
    else:
        return JsonResponse({'message': 'bad one'})

def getMailVerificationPage(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if not user.is_mail2fa_code_valid():
        user.generate_mail2fa_code()
        user.save()    
        TwoFA.send_mailUser(user.user, user.email, user.mail2FACode)
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('twofactor/check-email2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    print('getemailtufactor')
    print(data)
    return JsonResponse(data)

def getGoogleVerificationPage(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('twofactor/check-google2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_set_mail2FA_page(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = twoFA.langs.get_langs(language)
    content_html = render_to_string('twofactor/set-email2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_set_google2FA_page(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = twoFA.langs.get_langs(language)
    content_html = render_to_string('twofactor/set-google2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt
def activateMail2FA(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    if not user.is_mail2fa_code_valid():
        user.generate_mail2fa_code()
        user.save()
        print("numbers:", user.mail2FACode)
        if (TwoFA.send_mailUser(user.name, user.email, user.mail2FACode)):
            return JsonResponse({'message': 'ok'})
        else:
            return JsonResponse({'message': 'bad one'})
    return JsonResponse({'message': 'ok'})
    # return get_verification_page(None) 

@csrf_exempt
def verifyMailCode(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
    if user.is_mail2fa_code_valid():
        totp_code = request.POST.get('concatenatedValue')
        print('request:', request.POST)
        print(user.mail2FACode)
        print(totp_code)
        if totp_code == user.mail2FACode:
            user.mail2FA = True
            user.validated2FA = True
            user.mail2FACode_timestamp = datetime(1970, 1, 1, tzinfo=timezone.utc)
            user.save()
            return JsonResponse({'message': '2fa activated ok'})
    else:
        user.generate_mail2fa_code()
        user.save()    
        TwoFA.send_mailUser(user.name, user.email, user.mail2FACode)
    return JsonResponse({'message': 'notok new one sent'})

# @csrf_exempt
# def verifyMail2FA(request):
#     jwt_token = request.COOKIES.get('jwttoken', None)
#     user_id = decode_jwt_token(jwt_token)
#     user = Usermine.objects.get(id=user_id)
#     if (user.mail2FACode == -1):
#         TwoFA.send_mailUser(user.email, user.mail2FACode)
#         return JsonResponse({'message': 'mail sent'})
#     else:
#         if (TwoFA.verify_mail(user)):
#             return JsonResponse({'message': 'ok'})
#         else:
#             return JsonResponse({'message': 'bad one'})

# @csrf_exempt
# def verifyMailCode(request):
#     return JsonResponse({'error': 'bad one'})
#     return JsonResponse({'message': 'ok'})

@csrf_exempt
def disableTwoFactor(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    print('user:', user)
    res, error = TwoFA.disable_two_factor(user)
    if error:
        return JsonResponse({'error': error})
    else:
        return JsonResponse({'redirect': '/profile/'})

# def verifyMail2FA(request):
#     jwt_token = request.COOKIES.get('jwttoken', None)
#     user_id = decode_jwt_token(jwt_token)
#     user = Usermine.objects.get(id=user_id)
#     if (user.mail2FACode == -1):
#         TwoFA.send_mailUser(user.email, user.mail2FACode)
#         return JsonResponse({'message': 'mail sent'})
#     else:
#         if (TwoFA.verify_mail(user)):
#             return JsonResponse({'message': 'ok'})
#         else:
#             return JsonResponse({'message': 'bad one'})

# def mail(request):
#     try:
#         send_mail(
#             "Jaime a ver si curras un rato",
#             "Biel tontu",
#             "crazypongreal@hotmail.com",
#             ["jareste2000@gmail.com"],
#             fail_silently=False,
#         )
#         return JsonResponse({'message': 'messageSent'})
#     except Exception as e:
#         return JsonResponse({'message': f'Error: {str(e)}'})


#2FA con google funcional:::
# def generate_totp_secret():
#     return pyotp.random_base32()

@csrf_exempt 
def enable_totp(request):
    return TwoFA.enable_totp(request)


@csrf_exempt 
def verify_totp(request):
    return TwoFA.verify_totp(request)