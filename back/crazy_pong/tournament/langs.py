def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #tournament.html
        'text1': 'TOURNAMENT',
        'text2': 'CREATE',
        'text3': 'JOIN',
        #create_tournament.html
        'text4': 'CREATE TOURNAMENT',
        'text5': 'Name of the tournament',
        'text6': 'Points per game',
        'text7': 'Players',
        'text8': 'Fill with AI',
        'text9': 'Save',
        #join_tournament.html
        'text10': 'JOIN TOURNAMENT',
        'text11': 'Lobby code',
        'text12': 'Enter Lobby code',
        'text13': 'Ready',
        #wait_lobby.html
        'text14': 'TOURNAMENT',
        'text15': 'LOBBY CODE',
        'text16': 'Waiting Players',
        'text17': 'READY',
        'text18': 'REFRESH',


    }
    return context

def get_lang_es():
    context = {
        #tournament.html
        'text1': 'TORNEO',
        'text2': 'CREAR',
        'text3': 'UNIRME',
        #create_tournament.html
        'text4': 'CREATE TORNEO',
        'text5': 'Nombre del torneo',
        'text6': 'Puntos por partida',
        'text7': 'Jugadores',
        'text8': 'Rellenar con IA',
        'text9': 'Guardar',
        #join_tournament.html
        'text10': 'UNIRME A TORNEO',
        'text11': 'Código de sala',
        'text12': 'Introducir código de sala',
        'text13': 'Listo',
        #wait_lobby.html
        'text14': 'TORNEO',
        'text15': 'CÓDIGO DE SALA',
        'text16': 'Esperando jugadores',
        'text17': 'LISTO',
        'text18': 'RECARGAR',
    }
    return context

def get_lang_pt():
    context = {
        #tournament.html
        'text1': 'TORNEIO',
        'text2': 'CRIAR',
        'text3': 'JUNTAR',
        #create_tournament.html
        'text4': 'CRIAR TORNEIO',
        'text5': 'Nome do torneio',
        'text6': 'Pontos por jogo',
        'text7': 'Jogadores',
        'text8': 'Preencher com IA',
        'text9': 'Guardar',
        #join_tournament.html
        'text10': 'PARTICIPAR NO TORNEIO',
        'text11': 'Código do lobby',
        'text12': 'Introduzir o código do Lobby',
        'text13': 'Pronto',
        #wait_lobby.html
        'text14': 'TORNEIO',
        'text15': 'Código do lobby',
        'text16': 'À espera de jogadores',
        'text17': 'PRONTO',
        'text18': 'RECARREGAR',
    }
    return context