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
from .accounts import Accounts
from django.contrib.auth.decorators import login_required
from authentification.authentification import Authentification
from twoFA.twoFA import TwoFA

def get_home_page(request):
    data = {
        'title': 'Login Page',
        'content': '<strong>Hello,holadsfa World!</strong>',
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_login_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/select_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_login_form_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        'new': request.GET.get('s', False)
    }
    content_html = render_to_string('login/normal_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_login42_form_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/42_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_register_new_account_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/register_account.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def change_view(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        # Add other variables as needed
    }
    return render(request, 'home/index.html', context)

@csrf_exempt 
def create_account(request): 
    res, msg = Accounts.process_new_account_request(request)
    if res == True:
        return JsonResponse({'message': msg}, status=200)
    else:
        return JsonResponse({'error': msg}, status=200)

@csrf_exempt
def do_login(request):
    data, msg = Accounts.process_new_login_request(request)
    if data:
        return JsonResponse(data, status=200)

def logout(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    user.online = False
    user.save()
    response = JsonResponse({'message': 'Hello, world!'})
    response.delete_cookie('jwttoken')
    return response

##debug functions
@csrf_exempt
def show_online(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    print('onlinejwt:',jwt_token)
    print('uid:', user_id)
    all_users = Usermine.objects.all()
    for user in all_users:
        print(f"User: {user.name}, Online: {user.online}, valid2fa: {user.validated2FA}, google: {user.google2FA}, mail: {user.mail2FA}")
    return JsonResponse({'content': 'users printed'})


