def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #profile.html
        'text1': 'profile',
        'text2': 'Played games',
        'text3': 'Total wins',
        'text4': 'Total losses',
        'text5': 'Played matches history',
        'text6': 'Match',
        'text7': 'Player1',
        'text8': 'Player2',
        'text9': 'Score 1',
        'text10': 'Score 2',
        'text11': 'Winner',
        'text12': 'Status',
    }
    return context

def get_lang_es():
    context = {
        #profile.html
        'text1': 'perfil',
        'text2': 'Partidas jugadas',
        'text3': 'Victorias totales',
        'text4': 'Derrotas totales',
        'text5': 'Historial de partidas jugadas',
        'text6': 'Partida',
        'text7': 'Jugador 1',
        'text8': 'Jugador 2',
        'text9': 'Puntuación 1',
        'text10': 'Puntuación 2',
        'text11': 'Ganador',
        'text12': 'Estado',
    }
    return context

def get_lang_pt():
    context = {
        #profile.html
        'text1': 'perfil',
        'text2': 'Jogos jogados',
        'text3': 'Total de vitórias',
        'text4': 'Total de derrotas',
        'text5': 'História dos jogos realizados',
        'text6': 'Jogo',
        'text7': 'Jogador 1',
        'text8': 'Jogador 2',
        'text9': 'Pontuação 1',
        'text10': 'Pontuação 2',
        'text11': 'Ganhador',
        'text12': 'Estado',
    }
    return context

