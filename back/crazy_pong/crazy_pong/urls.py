from django.urls import path, include
from .views import get_aboutus_page, get_information_page, get_home_page

urlpatterns = [
    path('users/', include('accounts.urls')),
    path('game/', include('game.urls')),
    path('api/', include('api.urls')),
    path('tournament/', include('tournament.urls')),
    path('about-us/', get_aboutus_page, name='get_aboutus_page'),
    path('information/', get_information_page, name='get_information_page'),
    path('', get_home_page, name='get_home_page'),
]
