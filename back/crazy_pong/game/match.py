import math
import os
import random
import time

from asgiref.sync import sync_to_async

from accounts.models import Usermine

from .models import Match


class PlayerManager():
    def __init__(self, player, paddle, state):

        self.state = state
        self.paddle = self.state[paddle]
        self.player = self.state[player]

    def move(self, direction):
        if direction == "down":
            if(self.paddle["y"]):
                self.player["input"] = 1
            else:
                self.player["input"] = 0

        elif direction == "up":
            if(self.paddle["y"]):
                self.player["input"] = -1
            else:
                self.player["input"] = 0
        
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
        print("player_one", self.player_one)
        print("player_two", self.player_two)
        self.fr = int(os.getenv("FRAMERATE"))

        self.IA = False
        self.IAcount = self.fr
        self.saved = False
        self.colision = 375
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
            
            if (paddle1['y'] < 0):
                paddle1['y'] += paddle1['vy']
            elif (paddle1['y'] + paddle1['height'] > 750):
                paddle1['y'] -= paddle1['vy']
            if (paddle2['y'] < 0):
                paddle2['y'] += paddle1['vy']
            elif (paddle2['y'] + paddle2['height'] > 750):
                paddle2['y'] -= paddle2['vy']
            
                

            ball['x'] += ball['vx']
            ball['y'] += ball['vy']

            if (ball['y'] - ball['radius'] < 0):
                ball['y'] = ball['radius']
                ball['vy'] = -ball['vy']
            
            elif (ball['y'] + ball['radius'] > 750):
                ball['y'] = 750 - ball['radius']
                ball['vy'] = -ball['vy']
            

            if (ball['x'] - ball['radius'] < 0):
                self.state['score2'] += 1
                self.reset_ball()
        
            elif (ball['x'] + ball['radius'] > 1200):
                print("Colision final: " + str(ball['y']))
                self.state['score1'] += 1
                self.reset_ball()
                

            if (ball['x'] - ball['radius'] <= paddle1['x'] + paddle1['width'] and
                ball['y'] + ball['radius'] >= paddle1['y'] and
                ball['y'] - ball['radius'] <= paddle1['y'] + paddle1['height'] and
                ball['vx'] < 0
                ):

                self.state['speed'] += 1
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

                self.state['speed'] += 1
                relativeIntersectY = (paddle2['y'] + paddle2['height'] / 2) - ball['y']
                normalizedRelativeIntersectionY = relativeIntersectY / (paddle2['height'] / 2)
                bounceAngle = normalizedRelativeIntersectionY * math.pi / 4

                ball['vx'] = -self.state['speed'] * math.cos(bounceAngle)
                ball['vy'] = -self.state['speed'] * math.sin(bounceAngle)

                ball['x'] = paddle2['x'] - ball['radius']

    def reset_ball(self):
        self.ball['x'] = 600
        self.ball['y'] = 375
        self.ball["vx"] =  random.choice([-10, 10])
        self.ball["vy"] = random.uniform(-5, 5)
        self.paddle_one['y'] = 300
        self.paddle_two['y'] = 300
        self.IAcount = int(os.getenv("FRAMERATE"))
        self.state['speed'] = 15

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

                if ((self.colision/750)%2 == 1):
                    self.colision = self.colision % 750
                else:
                    self.colision = 750 - (self.colision % 750)

            if (self.colision > self.paddle_two['y'] + self.paddle_two['height'] /4 and self.colision < self.paddle_two['y'] + 3*self.paddle_two['height'] /4 ):
                return 0
            if (self.colision > self.paddle_two['y'] + self.paddle_two['height'] /2 ):
                return 1
            return -1
    
    def ended(self):
        if (self.state['score1'] >= int(self.state['points']) or self.state['score2'] >= int(self.state['points'])):
            
            return True
        return False

    @sync_to_async
    def saveMatch(self):
        if (not self.saved):
            self.saved = True
            player1 = self.player_one['id']
            print(self.player_one['id'])
            if (self.IA):
                player2 = -42
            else:
                player2 = self.player_two['id']

            
            if self.state['score1'] > self.state['score2']:
                match_winner = player1
            else:
                match_winner = player2


            match = Match.objects.create(
                player1=player1,
                player2=player2,
                player1_score=self.state['score1'],
                player2_score=self.state['score2'],
                match_id=self.state['idMatch'],
                match_winner=match_winner,
            )
            
            if player1 > 0:
                user = Usermine.objects.get(id=player1)
                if match.match_winner == player1:
                    user.wins += 1
                else:
                    user.losses += 1
                user.matches_played.add(match)
                user.playing = False
                user.save()

            if player2 > 0:
                user2 = Usermine.objects.get(id=player2)
                if match.match_winner == player2:
                    user2.wins += 1
                else:
                    user2.losses += 1
                user2.matches_played.add(match)
                user2.playing = False
                user2.save()
            
            #debug
            all_matches = Match.objects.all()
            for m in all_matches:
                print(f"Player1: {m.player1} - Player2: {m.player2} - Score1: {m.player1_score} - Score2: {m.player2_score} - Winner: {m.match_winner} - MatchID: {m.match_id}")