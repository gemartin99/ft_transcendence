from django.urls import path
from .views import createTournament, addPlayer, getTournament, getTournaments, updateTournament, get_tournament_page

urlpatterns = [
    path('create/', createTournament, name='createTournament'),
    path('add/', addPlayer, name='addPlayer'),
    path('get/', getTournament, name='getTournament'),
    path('getAll/', getTournaments, name='getTournaments'),
    path('update/', updateTournament, name='updateTournament'),
    path('', get_tournament_page, name='get_tournament_page'),

]
