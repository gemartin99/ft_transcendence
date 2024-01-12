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
        #edit_profile.html
        'text13': 'Edit Profile Information',
        'text14': 'Username',
        'text15': 'Enter your username',
        'text16': 'Email',
        'text17': 'Enter your email',
        'text18': 'Password',
        'text19': 'Enter your password',
        'text20': 'Confirm password',
        'text21': 'Confirm your password',
        'text22': 'Avatar (optional)',
        'text23': 'Save Changes',
        #edit-twofactor.html
        'text24': 'Security Settings',
        'text25': 'Two factor desactivated',
        'text26': 'Set Google 2Factor',
        'text27': 'Set Email 2Factor',
        'text28': 'Disable Two Factor Auth',
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
        #edit_profile.html
        'text13': 'Editar información del perfil',
        'text14': 'Nombre de usuario',
        'text15': 'Introduce tu nombre de usuario',
        'text16': 'Correo eléctronico',
        'text17': 'Introduce tu correo eléctronico',
        'text18': 'Contraseña',
        'text19': 'Introduce tu contraseña',
        'text20': 'Confirmar contraseña',
        'text21': 'Confirma tu contraseña',
        'text22': 'Avatar (opcional)',
        'text23': 'Guardas cambios',
        #edit-twofactor.html
        'text24': 'Ajustes de seguridad',
        'text25': 'Autenticacion en dos factores desactivada',
        'text26': 'Establecer Google 2Factor',
        'text27': 'Establecer Email 2Factor',
        'text28': 'Desactivar la autenticación de dos factores',
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
        #edit_profile.html
        'text13': 'Editar informações do perfil',
        'text14': 'Nome de utilizador',
        'text15': 'Introduza o seu nome de utilizador',
        'text16': 'Correio eletrónico',
        'text17': 'Introduza o seu e-mail',
        'text18': 'Palavra-passe',
        'text19': 'Introduza a sua palavra-passe',
        'text20': 'Confirmar a palavra-passe',
        'text21': 'Confirmar a sua palavra-passe',
        'text22': 'Avatar (opcional)',
        'text23': 'Guardar alteração',
        #edit-twofactor.html
        'text24': 'Definições de segurança',
        'text25': 'Autenticação de dois factores desactivada',
        'text26': 'Definir o Google 2Factor',
        'text27': 'Definir o Mail 2Factor',
        'text28': 'Desativar a autenticação de dois factores',
    }
    return context

