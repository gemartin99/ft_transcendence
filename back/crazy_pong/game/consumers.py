import json


from .match import MatchInfo, PlayerManager, GameManager
from .match_manager import MatchManager

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class gameConnection(WebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        self.game_ctrl = GameManager()
        self.thread = None

        super().__init__(*args, **kwargs)

    def connect(self):
        self.game = "game1"

        if self.game not in MatchManager.threads:
            MatchManager.add_game(self.game, self)

        self.thread = MatchManager.threads[self.game]

        async_to_sync(self.channel_layer.group_add)(self.game, self.channel_name)

        if not self.thread["paddle_one"]:
            self.paddle_controller = PlayerManager("player1")
            self.thread["paddle_one"] = True

        elif not self.thread["paddle_two"]:
            self.paddle_controller = PlayerManager("player2")
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

    def propagate_state(self):
        while True:
            if self.thread:
                if self.thread["active"]:
                    self.game_ctrl.updateGame()

                    async_to_sync(self.channel_layer.group_send)(
                        self.game,
                        {"type": "stream_state", "state": MatchInfo.state,},
                    )

    def stream_state(self, event):
        state = event["state"]

        self.send(text_data=json.dumps(state))
