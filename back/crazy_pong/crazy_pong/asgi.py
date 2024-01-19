"""
ASGI config for crazy_pong project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crazy_pong.settings')

application = get_asgi_application()


import accounts.routing
import game.routing
##added
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

application = ProtocolTypeRouter({
     'http': get_asgi_application(), 
     'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns +
            accounts.routing.websocket_urlpatterns
        )
     )
 })
