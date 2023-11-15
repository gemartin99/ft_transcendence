# routing.py
from django.urls import re_path

from .consumers import pongClients

websocket_urlpatterns = [
    re_path(r'ws/some_path/$', pongClients.as_asgi()),
]