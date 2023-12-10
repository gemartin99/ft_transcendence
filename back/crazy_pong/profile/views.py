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



def get_profile_page(request):
    user = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
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
    user = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        'user': user,
    }
    content_html = render_to_string('profile/edit-profile.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_twofactor_profile_page(request):
    user = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
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