from django.urls import path, include
from .views import get_game_page, get_play_page

urlpatterns = [
    path('', get_game_page, name='get_game_page'),
    path('play/', get_play_page, name='get_play_page'),
    path('game/play/', get_play_page, name='get_play_page'),
]
