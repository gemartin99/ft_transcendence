from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from .views import get_aboutus_page, get_information_page, get_home_page

urlpatterns = [
    path('users/', include('accounts.urls')),
    path('game/', include('game.urls')),
    path('twoFA/', include('twoFA.urls')),
    path('FT_OAuth/', include('FT_OAuth.urls')),
    path('api/', include('api.urls')),
    path('tournament/', include('tournament.urls')),
    path('friends/', include('friends.urls')),
    path('profile/', include('profile.urls')),
    path('', get_home_page, name='get_home_page'),
    path('about-us/', get_aboutus_page, name='get_aboutus_page'),
    path('information/', get_information_page, name='get_information_page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)