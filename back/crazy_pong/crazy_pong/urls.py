from django.urls import path, include

urlpatterns = [
    path('users/', include('accounts.urls')),
    path('game/', include('game.urls')),
    path('twoFA/', include('twoFA.urls')),
    path('FT_OAuth/', include('FT_OAuth.urls')),
]
