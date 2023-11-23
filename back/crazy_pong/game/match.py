import random
import time

class MatchInfo():
    state = {
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
            "vy": 5,
        },
        "paddle2": {
            "x": 1180,
            "y": 300,
            "width": 10,
            "height": 100,
            "vy": 5,
        },
        "score1": 0,
        "score2": 0,
        "speed": 5.83,
        "isPaused": True,
        "isGameOver": False,
        "winner": 0,
    }

class PlayerManager():
    def __init__(self, player):

        self.state = MatchInfo.state
        self.player = self.state[player]

    def move(self, direction):
        if direction == "down":
            self.player["input"] = 1

        elif direction == "up":
            self.player["input"] = -1
        
        elif direction == "rest":
            self.player["input"] = 0


class GameManager():
    
    p1 = None
    p2 = None

    def __init__(self):
        self.state = MatchInfo.state
        self.ball = self.state["ball"]
        self.paddle_one = self.state["paddle1"]
        self.paddle_two = self.state["paddle2"]
        self.player_one = self.state["player1"]
        self.player_two = self.state["player2"]

        self.reset_ball()

        self.time = time.time()

    def updateGame(self):
        if time.time() - self.time > 0.01:
            ball = self.ball

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
                ball['x'] = 1200 - ball['radius']
                ball['vx'] = -ball['vx']

            self.paddle_one['y'] += self.paddle_one['vy'] * self.player_one['input']
            self.paddle_two['y'] += self.paddle_two['vy'] * self.player_two['input']

    def reset_ball(self):
        self.ball['x'] = 600
        self.ball['y'] = 375
        self.ball["vx"] = random.choice([-5, 5])
        self.ball["vy"] = random.choice([-3, 3])
