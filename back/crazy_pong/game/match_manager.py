import threading
from .match import GameManager
import asyncio

class MatchManager:

    threads = {}
    matches = {}
    @classmethod
    def add_game(cls, game_name, consumer_instance):
        cls.matches[game_name] = {
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
        }
        cls.threads[game_name] = {
            "thread": threading.Thread(target=MatchManager.before_thread, args=(consumer_instance, game_name,)),
            "paddle_one": False,
            "paddle_two": False,
            "player_one": None,
            "player_two": None,
            "active": False,
        }
        thread = cls.threads[game_name]["thread"]
        thread.daemon = True
        thread.start()

    @classmethod
    def looking_for_match(cls):
        for match in cls.threads:
            if cls.threads[match]['paddle_two'] == False:
                return match
        return False
    
    @classmethod
    def before_thread(cls, consumer_instance, game_name):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(consumer_instance.propagate_state(cls.matches[game_name]))
        loop.close()