from django.urls import path
from .views import createTournament, addPlayer, getTournament, getTournaments, updateTournament

urlpatterns = [
    path('create/', createTournament, name='createTournament'),
    path('add/', addPlayer, name='addPlayer'),
    path('get/', getTournament, name='getTournament'),
    path('getAll/', getTournaments, name='getTournaments'),
    path('update/', updateTournament, name='updateTournament'),
]
