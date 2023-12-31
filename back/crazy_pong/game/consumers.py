import json
import random
import string
import time

from .match import PlayerManager, GameManager
from .match_manager import MatchManager

import random
import string
import time
import os

from .match import PlayerManager, GameManager
from .match_manager import MatchManager

import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class gameConnection(AsyncWebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        self.thread = None
        self.game_ctrl = None
        super().__init__(*args, **kwargs)
        self.time = time.time()
        self.paddle_controller = None
        self.fr = int(os.getenv("FRAMERATE"))

    async def connect(self):
        print(self.scope['query_string'])

        self.user = self.scope['query_string'].decode('UTF-8').split('&')[0].split('=')[1]
        self.mode = self.scope['query_string'].decode('UTF-8').split('&')[1].split('=')[1]


        if (self.mode == 'obs'):
             self.game = self.scope['query_string'].decode('UTF-8').split('&')[2].split('=')[1]
             await self.channel_layer.group_add(self.game, self.channel_name)
             await self.accept()
             return 

        if self.mode == 'sala':
                self.game = self.scope['query_string'].decode('UTF-8').split('&')[2].split('=')[1]
        else:
            self.game = MatchManager.looking_for_match()
            if (self.game == False):
                    self.game = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        if self.game not in MatchManager.threads:
            MatchManager.add_game(self.game, self)
            self.game_ctrl = GameManager(MatchManager.matches[self.game])

        self.thread =MatchManager.threads[self.game]

        await self.channel_layer.group_add(self.game, self.channel_name)

        
        if not self.thread["paddle_one"]:
            self.paddle_controller = PlayerManager("player1", MatchManager.matches[self.game])
            self.thread["paddle_one"] = True

            if (self.mode == 'IA'):
                self.game_ctrl.setIA()
                self.thread['active'] = True
                self.thread['paddle_two'] = True

        elif not self.thread["paddle_two"]:
            self.paddle_controller = PlayerManager("player2", MatchManager.matches[self.game])
            self.thread["paddle_two"] = True

        if self.thread["paddle_one"] and self.thread["paddle_two"]:
            self.thread["active"] = True

        await self.accept()


    async def disconnect(self, code):
        #self.thread["paddle_one"] = False
        self.thread["active"] = False

        await self.channel_layer.group_discard(self.game, self.channel_name)
        print("disconnected") 
    


    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
                
        if data['cmd'] == "update":
            if self.paddle_controller:
                self.paddle_controller.move(data['key'])
        else:
            await self.send("Unknown command")

    async def propagate_state(self, state):
        time_act = time.time()
        while True:
            time_act = time.time()
            if self.thread:
                if self.thread["active"]:
                    self.game_ctrl.updateGame()
                    if self.game_ctrl.ended():
                        await self.game_ctrl.saveMatch()
                        return
                    await self.channel_layer.group_send(
                        self.game,
                        {"type": "stream_state", "state": state},
                    )
            # print("Time: " + str(time.time() - time_act))
            await asyncio.sleep(1/self.fr - (time.time() - time_act))

    async def stream_state(self, event):
        time2 =  time.time()
        state = event["state"]
        
        await self.send(text_data=json.dumps(state))

    async def endConnection(self):

        await self.channel_layer.group_send(
            self.game,
            {"type": "end_match"},
        )
        await self.disconnect(1000)
