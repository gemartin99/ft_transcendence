from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt

import accounts.langs
from authentification.authentification import Authentification

from .accounts import Accounts
from .models import Usermine


def get_login_page(request):
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
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
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
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
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
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
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
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
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
    res, msg = Accounts.process_new_account_request(request)
    if res == True:
        return JsonResponse({'message': msg}, status=200)
    else:
        return JsonResponse({'error': msg}, status=200)

@csrf_exempt
def do_login(request):
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True) or (loggued == False and redirect != '/users/login/'):
        return JsonResponse({'redirect': redirect})
    data, msg = Accounts.process_new_login_request(request)
    if data:
        return JsonResponse(data, status=200)

@csrf_exempt
def logout(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    try:
        user = Usermine.objects.get(id=user_id)
        user.save()
        response = JsonResponse({'redirect': '/'})
    except Usermine.DoesNotExist as e:
        response = JsonResponse({'redirect': '/'})
    response.delete_cookie('jwttoken')
    return response

@csrf_exempt
def is_online(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    try:
        user = Usermine.objects.get(id=user_id)
        return JsonResponse({'Session': 'True', 'user': user.id})
    except Usermine.DoesNotExist as e:
        response = JsonResponse({'Session': 'False'})
        response.delete_cookie('jwttoken')
        return response


@csrf_exempt
def is_playing(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if user.playing:
        return JsonResponse({'playing': '200'})
    else:
        return JsonResponse({'playing': '400'})


##debug functions
@csrf_exempt
def show_playing(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    all_users = Usermine.objects.all()
    for user in all_users:
    #     last_5_matches = user.get_last_5_matches()
    #     for match in last_5_matches:
        user.playing = False
        user.gameId = ""
        user.save()
    return JsonResponse({'content': 'users printed'})

##debug functions
@csrf_exempt
def show_online(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    all_users = Usermine.objects.all()
    for user in all_users:
    #     last_5_matches = user.get_last_5_matches()
        user.inTournament = 0
        user.tournament_id = ""
        user.save()

    return JsonResponse({'content': 'users printed'})
