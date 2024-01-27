import json
import os
import profile.langs
import imghdr
from accounts.accounts import Accounts
# from security.security import Security
from authentification.authentification import Authentification
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
from security.security import Security

# from django.shortcuts import render
# from accounts.models import Usermine
# import base64
# from django.db import IntegrityError
# from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError




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

def UpdateUser(username, user, response_messages, language):
    flag = False
    if username is not None:
        if username != user.name:
            res, msg = Accounts.username_is_in_use(username)
            if res:
                if language == 'es':
                    response_messages.append('Nombre de usuario ya en uso.')
                elif language == 'en':
                    response_messages.append('Username already in use.')
                elif language == 'pt':
                    response_messages.append('Nome de usuário já em uso.')
                flag = True
        if username != user.name and not Security.is_valid_username(username):
            if language == 'es':
                response_messages.append('Introduce un nombre de usuario válido.')
            elif language == 'en':
                response_messages.append('Introduce a valid username.')
            elif language == 'pt':
                response_messages.append('Introduza um nome de usuário válido.')
            flag = True
        if flag is False:
            user.name = username
    return response_messages

def UpdateEmail(email, user, response_messages):
    flag = False
    if email is not None:
        if not Security.is_valid_email(email):
            if language == 'es':
                response_messages.append('Introduce un email válido.')
            elif language == 'en':
                response_messages.append('Introduce a valid email.')
            elif language == 'pt':
                response_messages.append('Introduza um email válido.')
            flag = True
        if not flag:
            user.email = email
    return response_messages


def UpdatePwd(password, confirm_password, user, response_messages, language):
    if password != "":
        if password == confirm_password:
            res, msg = Security.check_pwd_security(password)
            if res:
                user.password = password
            else:
                response_messages.extend(msg)
        else:
            if language == 'es':
                response_messages.append('Las contraseñas no coinciden.')
            elif language == 'en':
                response_messages.append('Paswords missmatch.')
            elif language == 'pt':
                response_messages.append('As senhas não coincidem.')
    return response_messages


@csrf_exempt
def UpdateInfo(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
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
        if avatar:
            # Check if the file is a PNG image
            file_type = imghdr.what(avatar)
            if file_type != 'png':
                if language == 'es':
                    response_messages.append('El archivo subido no es una imagen PNG')
                elif language == 'en':
                    response_messages.append('Uploaded file is not a PNG image')
                elif language == 'pt':
                    response_messages.append('O arquivo carregado não é uma imagem PNG)
            else:
                folder_path = os.path.join('media', 'avatars')  
                file_path = default_storage.save(os.path.join(folder_path, avatar.name), ContentFile(avatar.read()))
                user.avatar = file_path
        user.save()
        if response_messages:
            return JsonResponse({'message': response_messages})
        else:
            return JsonResponse({'redirect': '/profile/'})
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON format', 'JSONDecodeError': e}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
