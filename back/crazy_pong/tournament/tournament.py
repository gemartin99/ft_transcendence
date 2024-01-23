# import json
import random
import string

from game.models import Match as MatchModel

bot_names = ["Baltes", "Marza", "Jareste", "Jaime", "Gemartin", "Trunscendence", "Pingu", "Okto", "ChatGPT"]

class Match():

    def __init__(self, u1, u2, p1, p2):
        self.res = {
            'u1': u1,
            'u2': u2,
            'p1': p1,
            'p2': p2,
            'match_id': ''.join(random.choices(string.ascii_letters + string.digits, k=10)),
            'played': False
        }
        
    def get(self):
        return self.res
    
    def getId(self):
        return self.res['match_id']
    
    def getu1(self):
        return self.res['u1']
    
    def getu2(self):
        return self.res['u2']
    
    def setu1(self, u1):
        self.res['u1'] = u1
    
    def setu2(self, u2):
        self.res['u2'] = u2
    
    def setp1(self, p1):
        self.res['p1'] = p1
    
    def setp2(self, p2):
        self.res['p2'] = p2

class Tournament:
    
    def __init__(self, name, n, id, IA, points, creator):
        self.name = name
        self.id = id
        self.players = []
        self.bracket = []
        self.n = int(n)
        self.start = False
        self.end = False
        self.IA = IA
        self.points = points
        self.creator = creator
        self.createBracket()

    def getName(self):
        return self.name
    
    def addPlayer(self, user):
        if (self.start or len(self.players) == self.n):
            return False
        if (len(self.players) % 2 == 0):
            self.bracket[int(self.n/2 -1) + int(len(self.players)/2)].setu1(user.name)
        else:
            self.bracket[int(self.n/2 -1) + int(len(self.players)/2)].setu2(user.name)
        self.players.append(user)

        user.inTournament = 1
        user.tournament_id = self.id
        user.save()
        return True
            

    def get(self, player):
        if not self.end:
            self.autoUpdate()
        ret = {}
        i = 0
        ret['info'] = {'idTournament': self.id, 'tournamentName': self.name, 'started': self.start, "user": player.name, "points": self.points, "players": self.n, "creator": self.creator}
        if (self.start):
            player.inTournament = 2
            player.save()
        for match in self.bracket:
            ret[str(i)] = match.get()
            i += 1
        return ret
            

    def autoUpdate(self):
        if (self.start):
            for i in range(len(self.bracket)):
                match = self.bracket[i].get()
                if MatchModel.objects.filter(match_id=match['match_id']).exists():
                    if i == 0:
                        self.end = True
                    m = MatchModel.objects.get(match_id=match['match_id'])
                    match['played'] = True
                    self.bracket[i].setp1(m.player1_score)
                    self.bracket[i].setp2(m.player2_score)
                    if (m.player1_score > m.player2_score):
                        if (i % 2 == 1):
                            self.bracket[int((i-1) / 2) ].setu1(match['u1'])
                        else:
                            self.bracket[int((i-2) / 2) ].setu2(match['u1'])
                    else:
                        if (i % 2 == 1):
                            self.bracket[int((i-1) / 2) ].setu1(match['u2'])
                        else:
                            self.bracket[int((i-2) / 2) ].setu2(match['u2'])
                if (match['u1'][0:4] == "Bot " and match['u2'][0:4] == "Bot " and not match['played']):
                    match['played'] = True
                    if (random.randint(0,1) == 0):
                        match['p1'] = int(self.points)
                        match['p2'] = random.randint(0,int(self.points)-1)
                    else:
                        match['p1'] = random.randint(0,int(self.points)-1)
                        match['p2'] = int(self.points)
                    if (match['p1'] > match['p2']):
                        if (i % 2 == 1): 
                            self.bracket[int((i-1) / 2) ].setu1(match['u1'])
                        else:
                            self.bracket[int((i-2) / 2) ].setu2(match['u1'])
                    else:
                        if (i % 2 == 1):
                            self.bracket[int((i-1) / 2) ].setu1(match['u2'])
                        else:
                            self.bracket[int((i-2) / 2) ].setu2(match['u2'])

    def hasPlayer(self, user):
        if user in self.players:
            return True
        return False

    def createBracket(self):
        for i in range(int(self.n/2) -1):
            self.bracket.append(Match("undefined", "undefined", 0, 0))
        for i in range(self.n):
            if (i %2 == 0):
                self.bracket.append(Match("Bot " + bot_names[i], "Bot " + bot_names[i + 1], 0, 0))        

    def canStart(self):
        self.start = self.IA or (len(self.players) == self.n)
        return self.start
    
    def quit(self, name):
        for i in range(len(self.bracket)):
            match = self.bracket[i].get()
            if not match['played'] and (match['u1'] == name):
                self.bracket[i].setu1("IA")
            if not match['played'] and (match['u2'] == name):
                self.bracket[i].setu2("IA")
                