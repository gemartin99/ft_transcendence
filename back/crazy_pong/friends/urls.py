from django.urls import path, include
from .views import get_friends_page, addFriend

urlpatterns = [
    path('', get_friends_page, name='get_friends_page'),
    path('addFriend/', addFriend, name='addFriend'),
]