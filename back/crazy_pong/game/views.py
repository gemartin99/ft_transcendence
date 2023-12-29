from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from authentification.authentification import Authentification

# Create your views here.
def get_game_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
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
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
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
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('game/view_game.html', context)
    data = {
        'title': 'View Game',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)