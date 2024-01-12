def get_langs(lang):
    print(lang)
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #game.html
        'text1': 'GAME',
        'text2': 'PUBLIC GAME',
        'text3': 'PRIVATE GAME',
        'text4': 'VIEW GAME',
        'text5': 'PLAY VS IA',
        #private_game.html
        'text6': 'PRIVATE GAME',
        'text7': 'CREATE',
        'text8': 'JOIN',
        #view_game.html
        'text9': 'VIEW GAME',
        'text10': 'Lobby code:',
        'text11': 'Enter Lobby code',
        'text12': 'View',
        #join_game.html
        'text13': 'JOIN GAME',
        'text14': 'Lobby code:',
        'text15': 'Enter Lobby code',
        'text16': 'Ready',

    }
    return context

def get_lang_es():
    context = {
        #game.html
        'text1': 'JUEGO',
        'text2': 'PARTIDA PÚBLICA',
        'text3': 'PARTIDA PRIVADA',
        'text4': 'VER PARTIDA',
        'text5': 'JUGAR VS IA',
        #private_game.html
        'text6': 'PARTIDA PRIVADA',
        'text7': 'CREAR',
        'text8': 'UNIRME',
        #view_game.html
        'text9': 'VER PARTIDA',
        'text10': 'Código de sala:',
        'text11': 'Introduce el código de sala',
        'text12': 'Ver',
        #join_game.html
        'text13': 'UNIRME A PARTIDA',
        'text14': 'Código de sala:',
        'text15': 'Introduce el código de sala',
        'text16': 'Listo',
    }
    return context

def get_lang_pt():
    context = {
        #game.html
        'text1': 'JOGO',
        'text2': 'JOGO PÚBLICO',
        'text3': 'JOGO PRIVADO',
        'text4': 'VER JOGO',
        'text5': 'JOGAR VS IA',
        #private_game.html
        'text6': 'JOGO PRIVADO',
        'text7': 'CRIAR',
        'text8': 'JUNTAR',
        #view_game.html
        'text9': 'VER JOGO',
        'text10': 'Código do lobby:',
        'text11': 'Introduzir o código do Lobby',
        'text12': 'Ver',
        #join_game.html
        'text13': 'JUNTAR JOGO',
        'text14': 'Código do lobby:',
        'text15': 'Introduzir o código do Lobby',
        'text16': 'Pronto',
    }
    return context

