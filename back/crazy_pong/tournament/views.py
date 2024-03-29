# Create your views here.
# views.py

import json

from django.http import JsonResponse
# from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt

import tournament.langs
# from accounts.models import Usermine
from authentification.authentification import Authentification

from .tournament_manager import TournamentManager


def get_tournament_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if (user.inTournament == 1):
        return JsonResponse({'redirect': '/tournament/lobbyPage/'})
    elif (user.inTournament == 2):
        return JsonResponse({'redirect': '/tournament/bracketPage/'})
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = tournament.langs.get_langs(language)
    content_html = render_to_string('tournament/tournament.html', context)
    data = {
        'title': 'Home',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_create_tournament_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = tournament.langs.get_langs(language)
    content_html = render_to_string('tournament/create_tournament.html', context)
    data = {
        'title': 'Create Tournament',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_join_tournament_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = tournament.langs.get_langs(language)
    content_html = render_to_string('tournament/join_tournament.html', context)
    data = {
        'title': 'Join Tournament',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_lobby_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = tournament.langs.get_langs(language)
    ret = TournamentManager.update(user.tournament_id, user)
    context['ret'] = ret
    content_html = render_to_string('tournament/wait_lobby.html', context)
    data = {
        'title': 'Tournament lobby',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt 
def get_bracket_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    ret = TournamentManager.update(user.tournament_id, user)
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = tournament.langs.get_langs(language)
    context['ret'] =ret
    content_html = render_to_string('tournament/tournament_table.html', context)
    data = {
        'title': 'Tournament bracket',
        'content': content_html,
        'id': ret['info']['idTournament'],
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt 
def createTournament(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            #falta parsing del name
            data = json.loads(request.body)
            tournament_code = TournamentManager.add_tournament(data['name'], data['n'], user, data['ia'], data['points'])
            return JsonResponse({'code': tournament_code,
                                    'redirect': '/tournament/lobbyPage/'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt 
def joinPlayer(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # jwt_token = request.COOKIES.get('jwttoken', None)
            # user_id = Authentification.decode_jwt_token(jwt_token)
            # user = Usermine.objects.get(id=user_id)

            if TournamentManager.add_player(data['id'], user):
                return JsonResponse({'code': '200'})
            else:
                return JsonResponse({'code': '400'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
   
    
@csrf_exempt 
def getTournament(request): #ESTO DA ERROR QUE LO FLIIIIPAS
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            
            status = TournamentManager.get(user.tournament_id, user)
            
            return JsonResponse({'code': status})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt  
def updateTournament(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            ret = TournamentManager.update(user.tournament_id, user)
            return JsonResponse(ret)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt 
def getTournaments(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            status = TournamentManager.get_all(data['user'])
            
            return JsonResponse({'code': status})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def startTournament(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            start = TournamentManager.startTournament(user.tournament_id)
            if start:
                user.inTournament = 2
                user.save()
                return JsonResponse({'redirect': '/tournament/bracketPage/'})
            else:
                return JsonResponse({'redirect': 'false'})
            
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
def quitTournament(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    if request.method == 'POST':
        try:
            TournamentManager.quitTournament(user.tournament_id, user.name)
            user.inTournament = 0
            user.tournament_id = ""
            user.save()
            return JsonResponse({'redirect': '/tournament/'})
            
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)