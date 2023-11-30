from django.urls import path, include

urlpatterns = [
    path('users/', include('accounts.urls')),
    path('game/', include('game.urls')),
    path('api/', include('api.urls')),
    path('tournament/', include('tournament.urls'))
]
