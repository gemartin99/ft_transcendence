import threading
import asyncio
from .tournament import Tournament
import random
import string

class TournamentManager:

    tournaments = {}
    @classmethod
    def add_tournament(cls, tournament_name, n, user):
        id = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        cls.tournaments[id] = Tournament(tournament_name, n)
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
    def update(cls, u1, u2, p1, p2):
        cls.tournaments[id].update(u1, u2, p1 , p2)

    @classmethod
    def getTournaments(cls, user):
        ret = {}
        for t in cls.tournaments:
            if cls.tournaments[t].hasPlayer(user):
                ret[id] = cls.tournaments[t].name()
        return ret