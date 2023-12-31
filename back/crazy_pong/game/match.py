import random
import time
import math
import os
from .models import Match
from accounts.models import Usermine
from asgiref.sync import sync_to_async


class PlayerManager():
    def __init__(self, player, state):

        self.state = state
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

    def __init__(self, state):
        self.state = state
        self.ball = self.state["ball"]
        self.paddle_one = self.state["paddle1"]
        self.paddle_two = self.state["paddle2"]
        self.player_one = self.state["player1"]
        self.player_two = self.state["player2"]
        
        self.fr = int(os.getenv("FRAMERATE"))

        self.IA = False
        self.IAcount = self.fr

        self.reset_ball()

        self.time = time.time()


    def updateGame(self):
            ball = self.ball
            paddle1 = self.paddle_one
            paddle2 = self.paddle_two
            
            paddle1['y'] += paddle1['vy'] * self.player_one['input']
            if (self.IA == False):
                paddle2['y'] += paddle2['vy'] * self.player_two['input']
            else:
                if self.IAcount == self.fr:
                    paddle2['y'] += paddle2['vy'] * self.segfaultThink_v2(True)
                    self.IAcount = 0
                else:
                    paddle2['y'] += paddle2['vy'] * self.segfaultThink_v2(False)
                self.IAcount += 1
                

            ball['x'] += ball['vx']
            ball['y'] += ball['vy']

            if (ball['y'] - ball['radius'] < 0):
                ball['y'] = ball['radius']
                ball['vy'] = -ball['vy']
            
            elif (ball['y'] + ball['radius'] > 750):
                ball['y'] = 750 - ball['radius']
                ball['vy'] = -ball['vy']
            

            if (ball['x'] - ball['radius'] < 0):
                self.state['score1'] += 1
                self.reset_ball()
        
            elif (ball['x'] + ball['radius'] > 1200):
                print("Colision final: " + str(ball['y']))
                self.state['score2'] += 1
                self.reset_ball()
                

            if (ball['x'] - ball['radius'] <= paddle1['x'] + paddle1['width'] and
                ball['y'] + ball['radius'] >= paddle1['y'] and
                ball['y'] - ball['radius'] <= paddle1['y'] + paddle1['height'] and
                ball['vx'] < 0
                ):

                self.state['speed'] += 0.01
                relativeIntersectY = (paddle1['y'] + paddle1['height'] / 2) - ball['y']
                normalizedRelativeIntersectionY = relativeIntersectY / (paddle1['height'] / 2)
                bounceAngle = normalizedRelativeIntersectionY * math.pi / 4

                ball['vx'] = (self.state['speed'] * math.copysign(1, ball['vx']) * math.cos(bounceAngle)) * -1
                ball['vy'] = -self.state['speed'] * math.sin(bounceAngle)

                ball['x'] = paddle1['x'] + paddle1['width'] + ball['radius']

            if (ball['x'] + ball['radius'] >= paddle2['x'] + paddle2['width'] and
                ball['y'] + ball['radius'] >= paddle2['y'] and
                ball['y'] - ball['radius'] <= paddle2['y'] + paddle2['height'] and
                ball['vx'] > 0
                ):

                self.state['speed'] += 0.01
                relativeIntersectY = (paddle2['y'] + paddle2['height'] / 2) - ball['y']
                normalizedRelativeIntersectionY = relativeIntersectY / (paddle2['height'] / 2)
                bounceAngle = normalizedRelativeIntersectionY * math.pi / 4

                ball['vx'] = -self.state['speed'] * math.cos(bounceAngle)
                ball['vy'] = -self.state['speed'] * math.sin(bounceAngle)

                ball['x'] = paddle2['x'] - ball['radius']

    def reset_ball(self):
        self.ball['x'] = 600
        self.ball['y'] = 375
        self.ball["vx"] = 10
        self.ball["vy"] = random.uniform(-4, 4)
        self.paddle_one['y'] = 300
        self.paddle_two['y'] = 300
        self.IAcount = int(os.getenv("FRAMERATE"))

    def setIA(self):
        self.IA = True

    def segfaultThink_v1(self):
        print("Updating movement")
        if (self.ball['y'] > self.paddle_two['y'] + self.paddle_two['height'] /4 and self.ball['y'] < self.paddle_two['y'] + 3*self.paddle_two['height'] /4 ):
            return 0
        if (self.ball['y'] > self.paddle_two['y'] + self.paddle_two['height'] /2 ):
            return 1
        return -1
    
    def segfaultThink_v2(self, update):
        
        if (self.ball['vx'] < 0):

            if (375 > self.paddle_two['y'] + self.paddle_two['height'] /4 and 375 < self.paddle_two['y'] + 3*self.paddle_two['height'] /4 ):
                return 0
            if (375 > self.paddle_two['y'] + self.paddle_two['height'] /2 ):
                return 1
            return -1

        else:
            if (update):
                timeToCollision  = (1200-self.ball['x']) /self.ball['vx']
                self.colision  = (self.ball['y'] + self.ball['vy'] * timeToCollision)

                if (self.colision > 0 and self.colision < 750):
                    self.colision = self.colision
                elif ((self.colision % 750)%2 == 0):
                    self.colision %= 750
                else:
                    self.colision = 750 - (self.colision % 750)

            if (self.colision > self.paddle_two['y'] + self.paddle_two['height'] /4 and self.colision < self.paddle_two['y'] + 3*self.paddle_two['height'] /4 ):
                return 0
            if (self.colision > self.paddle_two['y'] + self.paddle_two['height'] /2 ):
                return 1
            return -1
    
    def ended(self):
        if (self.state['score1'] >= 3 or self.state['score2'] >= 3):
            
            return True
        return False

    @sync_to_async
    def saveMatch(self):
        player1 = Usermine.objects.get(name='42@baltes-g')
        player2 = Usermine.objects.get(name='42@baltes-g')

        match = Match.objects.create(
            player1=player1,
            player2=player2,
            player1_score=self.state['score1'],
            player2_score=self.state['score2'],
            match_id=self.state['idMatch'],
        )
        all_matches = Match.objects.all()
        for m in all_matches:
            print(f"Player1: {m.player1.name} - Player2: {m.player2.name} - Score1: {m.player1_score} - Score2: {m.player2_score} - MatchID: {m.match_id}")