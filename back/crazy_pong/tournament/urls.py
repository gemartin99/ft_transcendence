from django.urls import path
from .views import createTournament, addPlayer, getTournament, getTournaments, updateTournament, get_tournament_page, get_create_tournament_page, get_lobby_page, get_join_tournament_page

urlpatterns = [
    path('create2/', createTournament, name='createTournament'),
    path('add/', addPlayer, name='addPlayer'),
    path('get/', getTournament, name='getTournament'),
    path('getAll/', getTournaments, name='getTournaments'),
    path('update/', updateTournament, name='updateTournament'),
    path('', get_tournament_page, name='get_tournament_page'),
    path('create/', get_create_tournament_page, name='get_create_tournament_page'),
    path('join/', get_join_tournament_page, name='get_join_tournament_page'),
    path('lobby/', get_lobby_page, name='get_lobby_page'),

]