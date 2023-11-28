# Create your views here.
# views.py

from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from .tournament_manager import TournamentManager
from django.views.decorators.csrf import csrf_exempt
import json

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