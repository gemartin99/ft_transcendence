import random
import time
import math

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
        
        self.IA = False

        self.reset_ball()

        self.time = time.time()


    def updateGame(self):
        #if time.time() - self.time > 1/60:
            ball = self.ball
            paddle1 = self.paddle_one
            paddle2 = self.paddle_two
            
            paddle1['y'] += paddle1['vy'] * self.player_one['input']
            if (self.IA == False):
                paddle2['y'] += paddle2['vy'] * self.player_two['input']
            else:
                paddle2['y'] += paddle2['vy'] * self.segfaultThink()

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
        self.ball["vy"] = random.uniform(-2, 2)
        self.paddle_one['y'] = 300
        self.paddle_two['y'] = 300

    def setIA(self):
        self.IA = True

    def segfaultThink(self):
        if (self.ball['y'] > self.paddle_two['y'] + self.paddle_two['height'] /4 and self.ball['y'] < self.paddle_two['y'] + 3*self.paddle_two['height'] /4 ):
            return 0
        if (self.ball['y'] > self.paddle_two['y'] + self.paddle_two['height'] /2 ):
            return 1
        return -1