import random
import string

class Match():

    def __init__(self, u1, u2, p1, p2):
        self.res = {
            'u1': u1,
            'u2': u2,
            'p1': p1,
            'p2': p2,
            'id': ''.join(random.choices(string.ascii_letters + string.digits, k=10)),
        }
        
    def get(self):
        return self.res
    
    def setu1(self, u1):
        self.res['p1'] = u1
    
    def setu2(self, u2):
        self.res['p2'] = u2
    
    def setp1(self, p1):
        self.res['p1'] = p1
    
    def setp2(self, p2):
        self.res['p2'] = p2

class Tournament:
    
    def __init__(self, name, n):
        self.name = name
        self.players = []
        self.bracket = []
        self.n = n
        self.start = False

    def getName(self):
        return self.name
    
    def addPlayer(self, user):
        self.players.append(user)
        if len(self.players) == self.n:
            self.start = True
            self.createBracket()

    def get(self):
        return self.bracket

    def update(self, u1, u2, p1, p2):
        for i in range(len(self.bracket())):
            match = self.bracket[i].get()
            if match['u1'] == u1 and match['u2'] == u2:
                self.bracket[i].setp1(p1)
                self.bracket[i].setp2(p2)
                if (p1 > p2):
                    if (i % 2 == 1):
                        self.bracket[(i-1) / 2 ].setu1(u1)
                    else:
                        self.bracket[(i-1) / 2 ].setu2(u1)
                
                if (p1 > p2):
                    if (i % 2 == 1):
                        self.bracket[(i-1) / 2 ].setu1(u2)
                    else:
                        self.bracket[(i-1) / 2 ].setu2(u2)
                
    def hasPlayer(self, user):
        if user in self.players:
            return True
        return False

    def createBracket(self):
        for i in range(self.n/2 -1):
            self.bracket.append(Match("undefined", "undefined", 0, 0))
        for i in range(self.n):
            if (i %2 == 0):
                self.bracket.append(Match(self.players[i], self.players[i+1], 0, 0))
        