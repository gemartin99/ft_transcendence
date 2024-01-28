import json
import game.langs
from authentification.authentification import Authentification
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from .match_manager import MatchManager

# Create your views here.

def get_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if user.playing:
        return JsonResponse({'redirect': '/game/play/'})
    language = user.language
    context = game.langs.get_langs(language)
    #if user.playing:
    content_html = render_to_string('game/game.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_play_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = user.language
    context = game.langs.get_langs(language)
    print(user.gameId + " holaaaaa " + str(len(user.gameId)))
    if (len(user.gameId) == 5):
        context['idMatch'] = user.gameId
    content_html = render_to_string('game/play.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_view_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = user.language
    context = game.langs.get_langs(language)
    content_html = render_to_string('game/view_game.html', context)
    data = {
        'title': 'View Game',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_create_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('game/create_game.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_join_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = user.language
    context = game.langs.get_langs(language)
    content_html = render_to_string('game/join_game.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_private_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = user.language
    context = game.langs.get_langs(language)
    content_html = render_to_string('game/private_game.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_1vs1_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = user.language
    context = game.langs.get_langs(language)
    content_html = render_to_string('game/1vs1_game.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt
def canJoin(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if (len(data['idMatch']) == 5 and MatchManager.canJoin(user, data['idMatch'])):
                return JsonResponse({'code': '200'})
            else:
                return JsonResponse({'code': '400'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
def canView(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if (MatchManager.canView(user, data['idMatch'])):
                return JsonResponse({'code': '200'})
            else:
                return JsonResponse({'code': '400'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
def quitQueue(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user.playing = False
            user.gameId = ""
            user.save()
            return JsonResponse({'code': '200'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)