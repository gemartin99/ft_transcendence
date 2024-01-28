# from django.shortcuts import render, redirect
from datetime import datetime, timezone

import twoFA.langs
from accounts.models import Usermine
# import pyotp
from authentification.authentification import Authentification
# Create your views here.
# from django.core.mail import send_mail
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt

from .twoFA import TwoFA


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
        if language == 'es':
            return JsonResponse({'error': 'Código incorrecto'})
        elif language == 'en':
            return JsonResponse({'error': 'Wrong code'})
        elif language == 'pt':
            return JsonResponse({'error': 'Código errado'})

def getMailVerificationPage(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    if (jwt_token == None):
        return JsonResponse({'redirect': '/users/login/'})
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if not user.mail2FA:
        return JsonResponse({'redirect': '/users/login/'})
    if not user.is_mail2fa_code_valid():
        user.generate_mail2fa_code()
        user.save()    
        TwoFA.send_mailUser(user.name, user.email, user.mail2FACode)
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = twoFA.langs.get_langs(language)
    content_html = render_to_string('twofactor/check-email2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def getGoogleVerificationPage(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    try:
        user = Usermine.objects.get(id=user_id)
        language = request.META.get('HTTP_LANGUAGE', 'default_language')
        context = twoFA.langs.get_langs(language)
        content_html = render_to_string('twofactor/check-google2factor.html', context)
        data = {
            'title': 'Select Logging Mode',
            'content': content_html,
            'additionalInfo': 'Some additional information here',
        }
        return JsonResponse(data)
    except Usermine.DoesNotExist as e:
        return JsonResponse({'redirect': '/users/login/'})


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
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    if not user.is_mail2fa_code_valid():
        user.generate_mail2fa_code()
        user.save()
        if (TwoFA.send_mailUser(user.name, user.email, user.mail2FACode)):
            return JsonResponse({'message': 'ok'})
        else:
            if language == 'es':
                return JsonResponse({'error': 'Error al enviar el correo'})
            elif language == 'en':
                return JsonResponse({'error': 'Error sending mail'})
            elif language == 'pt':
                return JsonResponse({'error': 'Erro ao enviar o email'})
    return JsonResponse({'message': 'ok'})

@csrf_exempt
def verifyMailCode(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
    if user.is_mail2fa_code_valid():
        totp_code = request.POST.get('concatenatedValue')
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
    print(language)
    if language == 'es':
        return JsonResponse({'error': 'Código incorrecto'})
    elif language == 'en':
        return JsonResponse({'error': 'Wrong code'})
    elif language == 'pt':
        return JsonResponse({'error': 'Código errado'})
    return JsonResponse({'error': 'Wrong code'})

@csrf_exempt
def disableTwoFactor(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    res, error = TwoFA.disable_two_factor(user)
    if error:
        return JsonResponse({'error': error})
    else:
        return JsonResponse({'redirect': '/profile/'})

@csrf_exempt 
def enable_totp(request):
    return TwoFA.enable_totp(request)


@csrf_exempt 
def verify_totp(request):
    return TwoFA.verify_totp(request)