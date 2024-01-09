def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        'text1': 'Crazy Pong is a tribute to the classic Atari Pong game. This version takes the original game and adds new modes such as tournaments or multiplayer. The user interface has also been updated to give it a more modern look. Whether you are a fan of the original Pong or are looking for a fun and challenging game, Crazy Pong will provide you with hours of entertainment. Try it now and see if you have what it takes to beat the high score. Register or login and start playing!',
        'text2': 'Register',
        'text3': 'Login',
    }
    return context

def get_lang_es():
    context = {
        'text1': 'Crazy Pong es un homenaje al clásico juego Pong de Atari. Esta versión toma el juego original y le añade nuevos modos como torneos o multijugador. También se ha actualizado la interfaz de usuario para darle un aspecto más moderno. Tanto si eres fan del Pong original como si buscas un juego divertido y desafiante, Crazy Pong te proporcionará horas de entretenimiento. Pruébalo ahora y comprueba si tienes lo que hay que tener para batir la puntuación más alta. ¡Regístrate o inicia sesión y empieza a jugar!',
        'text2': 'Regístrate',
        'text3': 'Iniciar sesión',
    }
    return context

def get_lang_pt():
    context = {
        'text1': 'Crazy Pong é uma homenagem ao clássico jogo Pong da Atari. Esta versão pega no jogo original e acrescenta novos modos, como torneios ou multijogadores. A interface do utilizador também foi actualizada para lhe dar um aspeto mais moderno. Quer seja um fã do Pong original ou esteja à procura de um jogo divertido e desafiante, o Crazy Pong irá proporcionar-lhe horas de entretenimento. Experimenta-o agora e vê se tens o que é preciso para bater a pontuação mais alta. Regista-te ou inicia sessão e começa a jogar!',
        'text2': 'Registo',
        'text3': 'Iniciar sessão',
    }
    return context

