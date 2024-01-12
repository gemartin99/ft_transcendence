def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #index.html
        'text1': 'Crazy Pong is a tribute to the classic Atari Pong game. This version takes the original game and adds new modes such as tournaments or multiplayer. The user interface has also been updated to give it a more modern look. Whether you are a fan of the original Pong or are looking for a fun and challenging game, Crazy Pong will provide you with hours of entertainment. Try it now and see if you have what it takes to beat the high score. Register or login and start playing!',
        'text2': 'Register',
        'text3': 'Login',
        #information.html
        'text4': 'INFORMATION',
        'text5': 'Objective of the game',
        'text6': 'The objective is to score points by making the ball pass through the opposite side of the screen without the opponent returning it.',
        'text7': 'Game elements',
        'text8': 'The game consists of two paddles located on opposite sides of the screen and a ball that bounces between them. The paddles are used to hit the ball and send it towards the opponent.',
        'text9': 'Scoring',
        'text10': 'When a player fails to return the ball and it passes his paddle, the opponent scores a point. The first player to reach 11 points wins the game.',
        'text11': 'Controls',
        'text12': 'To raise the paddles',
        'text13': 'To lower the blades',
    }
    return context

def get_lang_es():
    context = {
        #index.html
        'text1': 'Crazy Pong es un homenaje al clásico juego Pong de Atari. Esta versión toma el juego original y le añade nuevos modos como torneos o multijugador. También se ha actualizado la interfaz de usuario para darle un aspecto más moderno. Tanto si eres fan del Pong original como si buscas un juego divertido y desafiante, Crazy Pong te proporcionará horas de entretenimiento. Pruébalo ahora y comprueba si tienes lo que hay que tener para batir la puntuación más alta. ¡Regístrate o inicia sesión y empieza a jugar!',
        'text2': 'Regístrate',
        'text3': 'Iniciar sesión',
        #information.html
        'text4': 'INFORMACIÓN',
        'text5': 'Objetivo del juego',
        'text6': 'El objetivo es sumar puntos haciendo pasar la pelota por el lado opuesto de la pantalla sin que el adversario la devuelva.',
        'text7': 'Elementos del juego',
        'text8': 'El juego consiste en dos palas situadas en lados opuestos de la pantalla y una pelota que rebota entre ellas. Las palas se utilizan para golpear la pelota y enviarla hacia el adversario.',
        'text9': 'Puntuación',
        'text10': 'Cuando un jugador no devuelve la pelota y ésta pasa por su paleta, el adversario se anota un punto. El primer jugador que llegue a 11 puntos gana el partido.',
        'text11': 'Controles',
        'text12': 'Para subir las palas',
        'text13': 'Para bajar las palas',
    }
    return context

def get_lang_pt():
    context = {
        #index.html
        'text1': 'Crazy Pong é uma homenagem ao clássico jogo Pong da Atari. Esta versão pega no jogo original e acrescenta novos modos, como torneios ou multijogadores. A interface do utilizador também foi actualizada para lhe dar um aspeto mais moderno. Quer seja um fã do Pong original ou esteja à procura de um jogo divertido e desafiante, o Crazy Pong irá proporcionar-lhe horas de entretenimento. Experimenta-o agora e vê se tens o que é preciso para bater a pontuação mais alta. Regista-te ou inicia sessão e começa a jogar!',
        'text2': 'Registo',
        'text3': 'Iniciar sessão',
        #information.html
        'text4': 'INFORMAÇÕES',
        'text5': 'Objetivo do jogo',
        'text6': 'O objetivo é marcar pontos fazendo com que a bola passe pelo lado oposto do ecrã sem que o adversário a devolva.',
        'text7': 'Elementos do jogo',
        'text8': 'O jogo consiste em duas pás situadas em lados opostos do ecrã e uma bola que salta entre elas. As pás são utilizadas para bater a bola e enviá-la para o adversário.',
        'text9': 'Pontuação',
        'text10': 'Quando um jogador não consegue devolver a bola e esta passa pela sua raquete, o adversário marca um ponto. O primeiro jogador a atingir 11 pontos ganha o jogo.',
        'text11': 'Controlos',
        'text12': 'Para levantar as lâminas',
        'text13': 'Para baixar as lâminas',
    }
    return context

