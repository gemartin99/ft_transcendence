from django.urls import include, path

from .views import addFriend, get_friends_page

urlpatterns = [
    path('', get_friends_page, name='get_friends_page'),
    path('addFriend/', addFriend, name='addFriend'),
]