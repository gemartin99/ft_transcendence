import json
import random
import string
import time

from .match import PlayerManager, GameManager
from .match_manager import MatchManager

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class gameConnection(WebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        self.thread = None
        self.game_ctrl = None
        super().__init__(*args, **kwargs)
        self.time = time.time()

    def connect(self):
        print(self.scope['query_string'])

        self.user = self.scope['query_string'].decode('UTF-8').split('&')[0].split('=')[1]
        self.mode = self.scope['query_string'].decode('UTF-8').split('&')[1].split('=')[1]

        self.game = MatchManager.looking_for_match()
        if (self.game == False):
            self.game = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        print(self.game)

        if self.game not in MatchManager.threads:
            MatchManager.add_game(self.game, self)
            self.game_ctrl = GameManager(MatchManager.matches[self.game])

        self.thread = MatchManager.threads[self.game]

        async_to_sync(self.channel_layer.group_add)(self.game, self.channel_name)

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

        self.accept()


    def disconnect(self, code):
        #self.thread["paddle_one"] = False
        self.thread["active"] = False

        async_to_sync(self.channel_layer.group_discard)(self.game, self.channel_name)
        print("disconnected") 
    


    def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
                
        if data['cmd'] == "update":
                self.paddle_controller.move(data['key'])
        else:
            self.send("Unknown command")

    def propagate_state(self, state):
        while True:
            if self.thread:
                if self.thread["active"]:
                    self.time = time.time()
                    self.game_ctrl.updateGame()
                    print("Update game" + str(time.time() - self.time))
                    self.time = time.time()
                    async_to_sync(self.channel_layer.group_send)(
                        self.game,
                        {"type": "stream_state", "state": state},
                    )
                    print("Send msg" + str(time.time() - self.time))
            #time.sleep(1/100)

    def stream_state(self, event):
        time2 = time.time()
        state = event["state"]
        
        self.send(text_data=json.dumps(state))
        print("Send one msg" + str(time.time() - time2))
