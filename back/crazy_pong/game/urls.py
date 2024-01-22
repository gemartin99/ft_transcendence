from django.urls import path

from .views import (get_create_game_page, get_game_page, get_join_game_page,
                    get_play_page, get_private_game_page, get_view_page, get_1vs1_game_page)

urlpatterns = [
    path('', get_game_page, name='get_game_page'),
    path('play/', get_play_page, name='get_play_page'),
    path('view/', get_view_page, name='get_view_page'),
    path('join_game/', get_join_game_page, name='get_join_game_page'),
    path('create_game/', get_create_game_page, name='get_create_game_page'),
    path('private_game/', get_private_game_page, name='get_private_game_page'),
    path('1vs1_game/', get_1vs1_game_page, name='get_1vs1_game_page')
]
