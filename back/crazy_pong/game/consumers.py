import asyncio
import json
import os
import random
import string
import time

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from accounts.models import Usermine
from authentification.authentification import Authentification

from .match import GameManager, PlayerManager
from .match_manager import MatchManager

# from channels.layers import get_channel_layer



# from authentification.authentification import Authentification
# from accounts.models import Usermine
# from channels.db import database_sync_to_async
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from asgiref.sync import sync_to_async




@sync_to_async
def setplaying(user, game):
    user.playing = True
    user.gameId = game
    user.save()

@sync_to_async
def setnoplaying(user):
    user.playing = False
    user.gameId = ""
    user.save()

class gameConnection(AsyncWebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        self.thread = None
        self.game_ctrl = None
        super().__init__(*args, **kwargs)
        self.time = time.time()
        self.paddle_controller = None
        self.fr = int(os.getenv("FRAMERATE"))

    async def connect(self):

        # self.user = self.scope['query_string'].decode('UTF-8').split('&')[0].split('=')[1]
        self.mode = self.scope['query_string'].decode('UTF-8').split('&')[1].split('=')[1]

        #jareste
        self.user_id = Authentification.decode_jwt_token(self.scope['query_string'].decode('UTF-8').split('&')[0].split('=')[1])
        self.user = await self.get_user(self.user_id)
        

        self.user_name = self.user.name
        await setplaying(self.user, "0")


        if (self.mode == 'obs'):
             self.game = self.scope['query_string'].decode('UTF-8').split('&')[2].split('=')[1]
             await self.channel_layer.group_add(self.game, self.channel_name)
             await self.accept()
             return 
        
        if (self.mode == 'reconnect'):
            self.game, paddle = MatchManager.reconnect(self.user_id, self.user_name)
            if (self.game != False):
                await self.channel_layer.group_add(self.game, self.channel_name)
                if paddle == 1:
                    self.paddle_controller = PlayerManager("player1", "paddle1", MatchManager.matches[self.game])
                elif paddle == 2:
                    self.paddle_controller = PlayerManager("player2", "paddle2", MatchManager.matches[self.game])
                else:
                    self.mode = '1vs1'
                    self.p1 = PlayerManager("player1", "paddle1", MatchManager.matches[self.game])
                    self.p2 = PlayerManager("player2", "paddle2", MatchManager.matches[self.game])
                await self.accept()
                return
            else:
                await setnoplaying(self.user)
                await self.close()
                return
        
        if (self.mode == '1vs1'):

            p1 = self.scope['query_string'].decode('UTF-8').split('&')[3].split('=')[1]
            p2 = self.scope['query_string'].decode('UTF-8').split('&')[4].split('=')[1]
            self.points = self.scope['query_string'].decode('UTF-8').split('&')[2].split('=')[1]


            self.game = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            self.game = MatchManager.looking_for_match(self.user_id, p1, self.game)
            MatchManager.add_game(self.game, self, self.user_id, p1, self.points, self.mode)
            self.game = MatchManager.looking_for_match(self.user_id, p2, self.game)
            self.game_ctrl = GameManager(MatchManager.matches[self.game])
            self.thread =MatchManager.threads[self.game]

            await self.channel_layer.group_add(self.game, self.channel_name)

            self.p1 = PlayerManager("player1", "paddle1", MatchManager.matches[self.game])
            self.p2 = PlayerManager("player2", "paddle2", MatchManager.matches[self.game])

            self.thread['active'] = True
            self.thread['paddle_two'] = True
            self.thread['paddle_one'] = True
            await self.accept()
            return 


        if self.mode == 'sala' or self.mode == 'salaIA':
            self.game = self.scope['query_string'].decode('UTF-8').split('&')[3].split('=')[1]
        else:
            self.game = None

        self.game = MatchManager.looking_for_match(self.user_id, self.user_name, self.game)
        if (self.game == False):
                self.game = ''.join(random.choices(string.ascii_letters + string.digits, k=7))

        await setplaying(self.user, self.game)


        if self.game not in MatchManager.threads:
            self.points = self.scope['query_string'].decode('UTF-8').split('&')[2].split('=')[1]
            MatchManager.add_game(self.game, self, self.user_id, self.user_name, self.points, self.mode)
            self.game_ctrl = GameManager(MatchManager.matches[self.game])

        self.thread =MatchManager.threads[self.game]

        await self.channel_layer.group_add(self.game, self.channel_name)

        
        if not self.thread["paddle_one"]:
            self.paddle_controller = PlayerManager("player1", "paddle1", MatchManager.matches[self.game])
            self.thread["paddle_one"] = True

            if (self.mode == 'IA' or self.mode == 'salaIA'):
                self.game_ctrl.setIA()
                self.thread['active'] = True
                self.thread['paddle_two'] = True

        elif not self.thread["paddle_two"]:
            self.paddle_controller = PlayerManager("player2", "paddle2", MatchManager.matches[self.game])
            self.thread["paddle_two"] = True

        if self.thread["paddle_one"] and self.thread["paddle_two"]:
            self.thread["active"] = True

        await self.accept()


    async def disconnect(self, code):
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data['cmd'] == "update" and self.mode == '1vs1':
            if data['pl'] == "p1":
                self.p1.move(data['key'])
            else:
                self.p2.move(data['key'])
        elif data['cmd'] == "update":
            if self.paddle_controller:
                self.paddle_controller.move(data['key'])
        elif data['cmd'] == "quit":
            MatchManager.quitGame(self.game, self.user)
            await setnoplaying(self.user)
        else:
            await self.send("Unknown command")

    async def propagate_state(self, state):
        time_act = time.time()
        first = True
        while True:
            time_act = time.time()
            if self.thread:
                if self.thread["active"]:
                    if first:
                        first = False
                        await self.startConnection(state)
                        await asyncio.sleep(0.2)
                        await self.startConnection(state)
                        await asyncio.sleep(0.2)
                        await self.startConnection(state)
                        await asyncio.sleep(0.2)
                        await self.startConnection(state)
                        await asyncio.sleep(0.2)
                        await self.startConnection(state)
                        await asyncio.sleep(0.2)
                    self.game_ctrl.updateGame()
                    if self.game_ctrl.ended():
                        if (self.mode != '1vs1'):
                            await self.game_ctrl.saveMatch()
                        else:
                            await setnoplaying(self.user) 
                        await self.endConnection(state)
                        self.thread["active"] = False
                        return
                    await self.channel_layer.group_send(
                        self.game,
                        {"type": "stream_state", "state": state},
                    )
                elif self.thread["active"] == "disconnect":
                    if (self.mode != '1vs1'):
                        await self.game_ctrl.saveMatch()
                    else:
                        await setnoplaying(self.user) 
                    await self.endConnection(state)
            await asyncio.sleep(1/self.fr - (time.time() - time_act))

    #jareste
    @database_sync_to_async
    def get_user(self, user_id):
        return Usermine.objects.get(id=user_id)

    async def stream_state(self, event):
        # time2 =  time.time()
        state = event["state"]
        
        await self.send(text_data=json.dumps(state))

    async def endConnection(self, state):
        MatchManager.popMatch(self.game)
        state['cmd'] = 'finish'
        await self.channel_layer.group_send(
            self.game,
            {"type": "stream_state", "state": state},
        )
    
    async def startConnection(self, state):
        state['cmd'] = 'start'
        await self.channel_layer.group_send(
            self.game,
            {"type": "stream_state", "state": state},
        )
        state['cmd'] = 'update'

