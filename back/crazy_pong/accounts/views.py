from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
# import json
from django.shortcuts import render
from .models import Usermine
# import base64
# from django.db import IntegrityError
# from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError
# import bcrypt
# from security.security import Security
from .accounts import Accounts
# from django.contrib.auth.decorators import login_required
from authentification.authentification import Authentification
# from twoFA.twoFA import TwoFA
import accounts.langs

def get_login_page(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = accounts.langs.get_langs(language)
    content_html = render_to_string('login/select_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_login_form_page(request):
    #añadir las traducciones y añadir lo del new ese
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = accounts.langs.get_langs(language)
    context['new'] = request.GET.get('s', False)
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
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = accounts.langs.get_langs(language)
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
    response = JsonResponse({'redirect': '/'})
    response.delete_cookie('jwttoken')
    return response


@csrf_exempt
def is_playing(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if user.playing:
        return JsonResponse({'playing': True})
    else:
        return JsonResponse({'playing': False})


##debug functions
@csrf_exempt
def show_online(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    print('onlinejwt:',jwt_token)
    print('uid:', user_id)
    all_users = Usermine.objects.all()
    for user in all_users:
    #     last_5_matches = user.get_last_5_matches()
    #     for match in last_5_matches:
    #         print(f"Match ID: {match.match_id}")
    #         print(f"you: {match.player1}")
    #         print(f"Opponent: {match.player2}")
    #         print(f"Result1: {match.player1_score}")
    #         print(f"Result2: {match.player2_score}")
    #         print(f"Timestamp: {match.timestamp}")
    #         print("\n")
        # print(f"User: {user.name}, Online: {user.online}, valid2fa: {user.validated2FA}, google: {user.google2FA}, mail: {user.mail2FA}, id: {user.id}")
        print(f"User: {user.name}, Playing: {user.playing}, id: {user.id}")
        user.playing = False
        user.inTournament = 0
        user.save()
        # print(user.get_last_5_matches())
    return JsonResponse({'content': 'users printed'})


