# import asyncio
import random
import string

from .tournament import Tournament

# import threading



class TournamentManager:

    tournaments = {}
    @classmethod
    def add_tournament(cls, tournament_name, n, user, IA, points):
        id = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        cls.tournaments[id] = Tournament(tournament_name, n, id, IA, points, user.name)
        cls.tournaments[id].addPlayer(user)
        return id

    @classmethod
    def add_player(cls, id, user):
        if not id in cls.tournaments.keys():
            return False
        return cls.tournaments[id].addPlayer(user)

        return 
    @classmethod
    def get(cls, id, player):
        return cls.tournaments[id].get(player)
    
    @classmethod
    def update(cls, id, player):
        return cls.tournaments[id].get(player)

    @classmethod
    def getTournaments(cls, user):
        ret = {}
        for t in cls.tournaments:
            if cls.tournaments[t].hasPlayer(user):
                ret[id] = cls.tournaments[t].name()
        return ret
    
    @classmethod
    def startTournament(cls, id):
        if (cls.tournaments[id].canStart()):
            return True
        return False
    
    @classmethod
    def quitTournament(cls, id, user):
        cls.tournaments[id].quit(user)
        return