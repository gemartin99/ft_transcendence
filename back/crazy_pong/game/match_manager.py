import threading


class MatchManager:

    threads = {}

    @classmethod
    def add_game(cls, game_name, consumer_instance):
        cls.threads[game_name] = {
            "thread": threading.Thread(target=consumer_instance.propagate_state),
            "paddle_one": False,
            "paddle_two": False,
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