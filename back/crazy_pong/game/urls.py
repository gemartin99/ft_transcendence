from django.urls import path, include
from .views import get_game_page

urlpatterns = [
    path('', get_game_page, name='get_game_page'),
]
