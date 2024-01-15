import asyncio
import random
import string
import threading

from .tournament import Tournament


class TournamentManager:

    tournaments = {}
    @classmethod
    def add_tournament(cls, tournament_name, n, user, IA):
        id = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        cls.tournaments[id] = Tournament(tournament_name, n, id, IA)
        cls.tournaments[id].addPlayer(user)
        return id

    @classmethod
    def add_player(cls, id, user):
        cls.tournaments[id].addPlayer(user)

        return 
    @classmethod
    def get(cls, id):
        return cls.tournaments[id].get()
    
    @classmethod
    def update(cls, id):
        return cls.tournaments[id].get()

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