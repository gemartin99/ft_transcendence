import json
import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer

matchmaking = []




class match():
    match_data = {
        "cmd": "update",
        "idMatch": 0,
        "type": 1,
        "player1": {
            "id": 'nouse',
            "name": 'nouse',
            "input": 0,
        },
        "player2": {
            "id": 'nouse2',
            "name": 'nouse2',
            "input": 0,
        },
        "ball": {
            "x": 0,
            "y": 0,
            "vx": 5,
            "vy": 3,
            "radius": 6,
        },
        "paddle1": {
            "x": 10,
            "y": 300,
            "width": 10,
            "height": 100,
            "vy": 0,
        },
        "paddle2": {
            "x": 1180,
            "y": 300,
            "width": 10,
            "height": 100,
            "vy": 0,
        },
        "score1": 0,
        "score2": 0,
        "speed": 5.83,
        "isPaused": True,
        "isGameOver": False,
        "winner": 0,
    }
    
    p1 = None
    p2 = None

    def __init__(self, p1, p2):
        self.p1 = p1
        self.p2 = p2

    async def start(self):
        print("match")
        i = 0
        while (i < 500):
            await self.updateBall()
            #updatePaddle()
            await self.p1.send(json.dumps(self.match_data))
            await self.p2.send(json.dumps(self.match_data))
            await asyncio.sleep(1 / 30)
            i += 1

    async def updateBall(self):
        ball = self.match_data['ball']
        
        ball['x'] += ball['vx']
        ball['y'] += ball['vy']

        if (ball['y'] - ball['radius'] < 0):
            ball['y'] = ball['radius']
            ball['vy'] = -ball['vy']
        
        elif (ball['y'] + ball['radius'] > 750):
            ball['y'] = 750 - ball['radius']
            ball['vy'] = -ball['vy']
        

        if (ball['x'] - ball['radius'] < 0):
            ball['x'] = ball['radius']
            ball['vx'] = -ball['vx']
    
        elif (ball['x'] + ball['radius'] > 1200):
            ball['x'] = 750 - ball['radius']
            ball['vx'] = -ball['vx']
        self.match_data['ball'] = ball



class gameConnection(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        print("Connected to client")


    async def disconnect(self, code):
        print("disconnected") 
    


    async def receive(self, text_data):
        data = json.loads(text_data)
        if (data['cmd'] == "search"):
            if (len(matchmaking) == 0):
                matchmaking.append(self)
                data_to_send = {
                    'cmd': 'connection',
                    'ball': 'first client',
                }
                await self.send(json.dumps(data_to_send))
                while (self in matchmaking):
                    await asyncio.sleep(0.01)

            else:
                data_to_send = {
                    'cmd': 'connection',
                    'ball': 'second client',
                }
                await self.send(json.dumps(data_to_send))
                client2 = matchmaking.pop()
                await asyncio.sleep(2)
                data_to_send = {
                    'cmd': 'connection',
                    'ball': 'starting',
                }
                await self.send(json.dumps(data_to_send))
                await client2.send(json.dumps(data_to_send))
                print("starting")
                m = match(self, client2)
                await m.start()
                print("finished")
                
        elif data['cmd'] == "update":
            print("updating")
        else:
            self.send("Unknown command")
