from django.urls import path
from .views import createTournament, joinPlayer, getTournament, getTournaments, updateTournament, get_tournament_page, get_create_tournament_page, get_lobby_page, get_join_tournament_page, startTournament, get_bracket_page

urlpatterns = [
    path('create/', createTournament, name='createTournament'),
    path('join/', joinPlayer, name='joinPlayer'),
    path('start/', startTournament, name='startTournament'),
    path('get/', getTournament, name='getTournament'),
    path('getAll/', getTournaments, name='getTournaments'),
    path('update/', updateTournament, name='updateTournament'),

    path('', get_tournament_page, name='get_tournament_page'),
    path('createPage/', get_create_tournament_page, name='get_create_tournament_page'),
    path('joinPage/', get_join_tournament_page, name='get_join_tournament_page'),
    path('lobbyPage/', get_lobby_page, name='get_lobby_page'),
    path('bracketPage/', get_bracket_page, name='get_bracket_page'),
]