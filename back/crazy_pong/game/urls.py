from django.urls import path, include
from .views import get_game_page, get_play_page, get_view_page

urlpatterns = [
    path('', get_game_page, name='get_game_page'),
    path('play/', get_play_page, name='get_play_page'),
    path('view/', get_view_page, name='get_view_page'),
]
