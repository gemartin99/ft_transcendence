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
        #create_account.html
        'text10': 'Create Account',
        'text11': 'Username',
        'text12': 'Email Address',
        'text13': 'Password',
        'text14': 'Confirm password',
        'text15': 'Continue',
        'text16': 'Already have an account? Sign in',

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
        #create_account.html
        'text10': 'Crear Cuenta',
        'text11': 'Nombre de usuario',
        'text12': 'Correo eléctronico',
        'text13': 'Contraseña',
        'text14': 'Confirmar contraseña',
        'text15': 'Continuar',
        'text16': '¿Ya tiene una cuenta? Iniciar sesión',
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
        #create_account.html
        'text10': 'Criar conta',
        'text11': 'Nome de utilizador',
        'text12': 'Endereço de correio eletrónico',
        'text13': 'Palavra-passe',
        'text14': 'Confirmar a palavra-passe',
        'text15': 'Continuar',
        'text16': 'Já tem uma conta? Iniciar sessão',
    }
    return context

