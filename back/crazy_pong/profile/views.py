from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Usermine
import base64
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import bcrypt
# from security.security import Security
from django.contrib.auth.decorators import login_required
from authentification.authentification import Authentification
from accounts.accounts import Accounts
from security.security import Security


def get_profile_page(request):
    user, redirect = Authentification.get_auth_user(request)
    print("estoy aqui holaaa")
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        'user': user,
    }
    content_html = render_to_string('profile/profile.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_edit_profile_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        'user': user,
    }
    content_html = render_to_string('profile/edit-profile.html', context)
    print("estoy aqui holaaaaaaaaaaaaa")
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_twofactor_profile_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        'user': user,
    }
    content_html = render_to_string('profile/edit-twofactor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


@csrf_exempt
def UpdateInfo(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    json_data = json.loads(request.body.decode('utf-8'))
    username = json_data.get('name').lower()
    email = json_data.get('email').lower()
    password = json_data.get('password')
    confirm_password = json_data.get('confirm_password')

    #debug
    # Access uploaded files
    avatar = request.FILES.get('avatar')
    print('avatar:',avatar)
    print(username)
    print(email)
    print('|',username,'|', user.name,'|')
    print(username == user.name)
    print('|',email,'|', user.email,'|')
    print(email == user.email)
    #debug


    response_messages = ''

    if username is not None:
        if username != user.name:
            res, msg = Accounts.username_is_in_use(username)
            if res:
                response_messages += msg + ' '

        elif username != user.name and not Security.is_valid_username(username):
            response_messages += 'Introduce a valid username.' + ' '
        else:
            user.name = username

    if email is not None:
        if email != user.email:
            res, msg = Accounts.email_is_in_use(email)
            if res:
                response_messages += msg + ' '
        elif not Security.is_valid_email(email):
            response_messages += 'Introduce a valid email.' + ' '
        else:
            user.email = email

    if password is not None:
        if password == confirm_password:
            res, msg = check_pwd_security(password)
            if res:
                user.password = password
            else:
                response_messages += msg + ' '

    user.save()

    print(response_messages)
    if response_messages:
        return JsonResponse({'message': response_messages})
    else:
        return JsonResponse({'message': 'boooo'})

