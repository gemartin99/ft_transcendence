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
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.http import HttpResponse

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

def generate_jwt_token(user_id):
    # Set the expiration time for the token
    expiration_time = datetime.utcnow() + timedelta(days=1)
    payload = {
        'user_id': user_id,
        'exp': expiration_time,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

@login_required
def generate_jwt_view(request):
    user_id = request.user.id
    jwt_token = generate_jwt_token(user_id)

    return JsonResponse({'token': jwt_token})

def decode_jwt_token(token):
    try:
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_payload['user_id']
        
        return user_id
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None

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
    user_id = decode_jwt_token(jwt_token)
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
    user_id = decode_jwt_token(jwt_token)
    print('onlinejwt:',jwt_token)
    print('uid:', user_id)
    all_users = Usermine.objects.all()
    for user in all_users:
        print(f"User: {user.name}, Online: {user.online}")
    return JsonResponse({'content': 'users printed'})


