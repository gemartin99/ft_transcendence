import threading
from .match import GameManager
import asyncio

class MatchManager:

    threads = {}
    matches = {}
    @classmethod
    def add_game(cls, game_name, consumer_instance, userid, username, points):
        cls.matches[game_name] = {
            "cmd": "update",
            "idMatch": 0,
            "type": 1,
            "player1": {
                "id": userid,
                "name": username,
                "input": 0,
            },
            "player2": {
                "id": -42,
                "name": 'IA',
                "input": 0,
            },
            "ball": {
                "x": 0,
                "y": 0,
                "vx": 5,
                "vy": 3,
                "radius": 20,
            },
            "paddle1": {
                "x": 30,
                "y": 300,
                "width": 20,
                "height": 150,
                "vy": 7,
            },
            "paddle2": {
                "x": 1150,
                "y": 300,
                "width": 20,
                "height": 150,
                "vy": 7,
            },
            "score1": 0,
            "score2": 0,
            "speed": 15,
            "isPaused": True,
            "isGameOver": False,
            "winner": 0,
            "points": points,
        }
        cls.threads[game_name] = {
            "thread": threading.Thread(target=MatchManager.before_thread, args=(consumer_instance, game_name,)),
            "paddle_one": False,
            "paddle_two": False,
            "player_one": None,
            "player_two": None,
            "active": False,
        }
        cls.matches[game_name]["idMatch"] = game_name
        thread = cls.threads[game_name]["thread"]
        thread.daemon = True
        thread.start()

    @classmethod
    def looking_for_match(cls, uid, name, game):
        if (game == None):
            for match in cls.threads:
                if cls.threads[match]['paddle_two'] == False:
                    cls.matches[match]["player2"]["id"] = uid
                    cls.matches[match]["player2"]["name"] = name
                    return match
            return False
        else:
            if (game in cls.threads):
                cls.matches[game]["player2"]["id"] = uid
                cls.matches[game]["player2"]["name"] = name
            return game
    
    @classmethod
    def reconnect(cls, uid, name):
        for match in cls.threads:
            if cls.matches[match]['player1']["id"] == uid:
                if cls.threads[match]["active"] == True:
                    return match, 1
            if cls.matches[match]['player2']["id"] == uid:
                if cls.threads[match]["active"] == True:
                    return match, 2
        return False, 0
    
    @classmethod
    def before_thread(cls, consumer_instance, game_name):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(consumer_instance.propagate_state(cls.matches[game_name]))
        loop.close()