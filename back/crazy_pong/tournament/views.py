# Create your views here.
# views.py

from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from .tournament_manager import TournamentManager
from django.views.decorators.csrf import csrf_exempt
import json

def get_tournament_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('tournament/tournament.html', context)
    data = {
        'title': 'Home',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_create_tournament_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('tournament/create_tournament.html', context)
    data = {
        'title': 'Create Tournament',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_join_tournament_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('tournament/join_tournament.html', context)
    data = {
        'title': 'Join Tournament',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_lobby_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('tournament/wait_lobby.html', context)
    data = {
        'title': 'Tournament lobby',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt 
def createTournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            tournament_code = TournamentManager.add_tournament(data['name'], data['n'], data['user'])
            
            return JsonResponse({'code': tournament_code})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt 
def addPlayer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            TournamentManager.add_player(data['id'], data['user'])
            
            return JsonResponse({'code': '200'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
   
    
@csrf_exempt 
def getTournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            status = TournamentManager.get(data['id'])
            
            return JsonResponse({'code': status})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt  
def updateTournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            TournamentManager.update(data['player1'], data['player2'], data['points1'], data['points2'])
            
            return JsonResponse({'code': '200'})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt 
def getTournaments(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            status = TournamentManager.get_all(data['user'])
            
            return JsonResponse({'code': status})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)