import asyncio
import threading

# from .match import GameManager


class MatchManager:

    threads = {}
    matches = {}
    @classmethod
    def add_game(cls, game_name, consumer_instance, userid, username, points, mode):
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
            "mode": mode,
        }
        cls.threads[game_name] = {
            "thread": threading.Thread(target=MatchManager.before_thread, args=(consumer_instance, game_name,)),
            "paddle_one": False,
            "paddle_two": False,
            "player_one": None,
            "player_two": None,
            "mode": mode,
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
    def quitGame(cls, game, user):
        cls.matches.pop(game)
        cls.threads.pop(game)
    
    @classmethod
    def reconnect(cls, uid, name):
        for match in cls.threads:
            if (cls.matches[match]['player1']["id"] == uid and cls.threads[match]['mode'] == '1vs1'):
                return match, 3
            if cls.matches[match]['player1']["id"] == uid:
                    return match, 1
            if cls.matches[match]['player2']["id"] == uid:
                    return match, 2
        return False, 0
    
    @classmethod
    def before_thread(cls, consumer_instance, game_name):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(consumer_instance.propagate_state(cls.matches[game_name]))
        loop.close()

    @classmethod
    def canJoin(cls, user, id):
        if (not id in cls.threads):
            return False
        if (cls.threads[id]["paddle_one"] == True and cls.threads[id]["paddle_two"] == True):
            return False
        return True
    
    @classmethod
    def canView(cls, user, id):
        if (not id in cls.threads):
            return False
        if (cls.threads[id]["paddle_one"] == False or cls.threads[id]["paddle_two"] == False):
            return False
        return True
    
    @classmethod
    def popMatch(cls, id):
        cls.matches.pop(id)
        cls.threads.pop(id)