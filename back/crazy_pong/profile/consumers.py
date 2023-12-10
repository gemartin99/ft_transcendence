import json
import random
import string
import time
from .models import Usermine

import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import WebsocketConsumer

class loginConnection(WebsocketConsumer):
    
    def connect(self):
        print("hola estem aqui")
        self.user = self.scope['query_string'].decode('UTF-8').split('&')[0].split('=')[1]

        self.accept()


    def disconnect(self, code):

        userBD = Usermine.objects.get(name= self.user);

        userBD.online = False
        userBD.save()
                
    
    def receive(self, text_data):
        return
        
