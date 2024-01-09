def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #select_login.html
        'text1': 'Select login',
        'text2': 'Login account',
        'text3': 'Login 42 account',
        'text4': 'Register account',
        #normal_login.html
        'text5': 'Login',
        'text6': 'Username',
        'text7': 'Password',
        'text8': 'Continue',
        'text9': "Don't have an account? Create account",
        'textsuccess': 'Account successfully created!',
    }
    return context

def get_lang_es():
    context = {
        #select_login.html
        'text1': 'Seleccionar inicio de sesión',
        'text2': 'Iniciar sesión',
        'text3': 'Iniciar sesión con 42',
        'text4': 'Registrar cuenta',
        #normal_login.html
        'text5': 'Iniciar sesión',
        'text6': 'Nombre de usuario',
        'text7': 'Contraseña',
        'text8': 'Continuar',
        'text9': '¿No tiene una cuenta? Crear cuenta',
        'textsuccess': 'Cuenta creada correctamente!',
    }
    return context

def get_lang_pt():
    context = {
        #select_login.html
        'text1': 'Selecionar início de sessão',
        'text2': 'Iniciar sessão',
        'text3': 'Iniciar sessão com 42',
        'text4': 'Registar conta',
        #normal_login.html
        'text5': 'Iniciar sessão',
        'text6': 'Nome de utilizador',
        'text7': 'Palavra-passe',
        'text8': 'Continuar',
        'text9': 'Não tem uma conta? Criar conta',
        'textsuccess': 'Conta criada com sucesso!',
    }
    return context

