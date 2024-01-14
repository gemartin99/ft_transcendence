from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
import json
# from django.shortcuts import render
# from accounts.models import Usermine
# import base64
# from django.db import IntegrityError
# from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError

# from security.security import Security
from authentification.authentification import Authentification
from accounts.accounts import Accounts
from security.security import Security

import profile.langs

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

def get_profile_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    last_5_matches = user.get_last_5_matches()
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = profile.langs.get_langs(language)
    context['user'] = user
    context['total_played_games'] =  user.wins + user.losses
    context['last_5_matches'] = last_5_matches
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
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = profile.langs.get_langs(language)
    context['user'] = user
    content_html = render_to_string('profile/edit-profile.html', context)
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
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = profile.langs.get_langs(language)
    context['user'] = user
    content_html = render_to_string('profile/edit-twofactor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def UpdateUser(username, user, response_messages):
    flag = False
    if username is not None:
        if username != user.name:
            res, msg = Accounts.username_is_in_use(username)
            if res:
                response_messages.append(msg)
                flag = True
        if username != user.name and not Security.is_valid_username(username):
            response_messages.append('Introduce a valid username.')
            flag = True
        if flag is False:
            user.name = username
    return response_messages

def UpdateEmail(email, user, response_messages):
    flag = False
    if email is not None:
        if email != user.email:
            res, msg = Accounts.email_is_in_use(email)
            if res:
                response_messages.append(msg)
                flag = True
        if not Security.is_valid_email(email):
            response_messages.append('Introduce a valid email.')
            flag = True
        if not flag:
            user.email = email
    return response_messages


def UpdatePwd(password, confirm_password, user, response_messages):
    if password != "":
        if password == confirm_password:
            res, msg = Security.check_pwd_security(password)
            if res:
                user.password = password
            else:
                response_messages.extend(msg)
        else:
            response_messages.append('Paswords missmatch.')
    return response_messages


@csrf_exempt
def UpdateInfo(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    try:
        username = request.POST.get('name').lower()
        email = request.POST.get('email').lower()
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        avatar = request.FILES.get('avatar')
        response_messages = []
        response_messages = UpdateUser(username, user, response_messages)
        response_messages = UpdateEmail(email, user, response_messages)
        response_messages = UpdatePwd(password, confirm_password, user, response_messages)
        if (avatar):
            folder_path = os.path.join('media', 'avatars')  
            file_path = default_storage.save(os.path.join(folder_path, avatar.name), ContentFile(avatar.read()))
            user.avatar = file_path;
            print(file_path)
        user.save()
        if response_messages:
            return JsonResponse({'message': response_messages})
        else:
            return JsonResponse({'redirect': '/profile/'})
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON format', 'JSONDecodeError': e}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
