def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #set-google2factor.html
        'text1': 'Setup Google 2Factor Auth',
        'text2': 'To can use, the two factor auth, you need to have/download Google Authentificator App. Scan the QR, and sumbit in the form the Code that Google Authentificator App will generate.',
        'text3': 'Generate QR',
        'text4': 'Steep 2: Confirm the code',
        'text5': 'Scan this QR whit your googleAuth app, and insert the verification totp code.',
        'text6': 'Submit',
        'text7': 'Google Two Factor set Succesful',
        'text8': 'Sucesfuly seted up the Google two factor authentificator. Click button to return to profile.',
        'text9': 'Return to Profile',
        #set-email2factor.html
        'text10': 'Steep 1: Confirm your email',
        'text11': 'To set twofactor email method first you need to confirmate that your email is valid. Click the button, and we will sent you a confirmation code. One time you have the code you just have to place it to enable the method.',
        'text12': 'Send email',
        'text13': 'Steep 2: Enter the code you have received by email',
        'text14': 'Submit',
        'text15': 'Two Factor set Succesful',
        'text16': 'Sucesfuly seted up the two factor mail authentificator. Click button to return to profile.',
        'text17': 'Return to Profile',
        #check-email2factor.html
        'text18': 'Steep 2: Enter the code you have received by email',
        'text19': 'Submit',
        #check-google2factor.html
        'text20': 'Confirm the code',
        'text21': 'Insert the verification totp code.',
        'text22': 'Submit',
    
    }
    return context

def get_lang_es():
    context = {
        #set-google2factor.html
        'text1': 'Configurar Google 2Factor Auth',
        'text2': 'Para poder utilizar la autenticación de dos factores, necesita tener/descargar Google Authentificator App. Escanee el QR, y enviar en el formulario el Código que Google Authentificator App generará.',
        'text3': 'Generar QR',
        'text4': 'Paso 2: Confirmar el código',
        'text5': 'Escanea este QR con tu aplicación googleAuth e introduce el código totp de verificación.',
        'text6': 'Enviar',
        'text7': 'Google dos factores completado con éxito',
        'text8': 'Se configuró con éxito el autentificador de dos factores de Google. Haga clic en el botón para volver al perfil.',
        'text9': 'Volver al perfil',
        #set-email2factor.html
        'text10': 'Paso 1: Confirme su correo electrónico',
        'text11': 'Para configurar el método de correo electrónico de doble factor, primero debe confirmar que su correo electrónico es válido. Haz clic en el botón y te enviaremos un código de confirmación. Una vez que tenga el código sólo tiene que colocarlo para activar el método.',
        'text12': 'Envíame el correo electrónico',
        'text13': 'Paso 2: Introduzca el código que ha recibido por correo electrónico',
        'text14': 'Enviar',
        'text15': 'Correo de dos factores completado con éxito',
        'text16': 'Se ha configurado correctamente el autentificador de correo de dos factores. Haga clic en el botón para volver al perfil.',
        'text17': 'Volver al perfil',
        #check-email2factor.html
        'text18': 'Paso 2: Introduzca el código que ha recibido por correo electrónico',
        'text19': 'Enviar',
        #check-google2factor.html
        'text20': 'Confirmar el código',
        'text21': 'Introduzca el código totp de verificación.',
        'text22': 'Enviar',
        
    }
    return context

def get_lang_pt():
    context = {
        #set-google2factor.html
        'text1': 'Configurar a autenticação do Google 2Factor',
        'text2': 'Para poder usar a autenticação de dois fatores, você precisa ter/baixar o aplicativo Google Authentificator. Digitalize o QR e insira no formulário o código que o aplicativo Google Authentificator irá gerar.',
        'text3': 'Gerar QR',
        'text4': 'Etapa 2: confirme o código',
        'text5': 'Digitalize este QR com seu aplicativo googleAuth e insira o código de verificação.',
        'text6': 'Enviar',
        'text7': 'Conjunto de dois fatores do Google bem-sucedido',
        'text8': 'Configurei com sucesso o autenticador de dois fatores do Google. Clique no botão para retornar ao perfil.',
        'text9': 'Voltar ao perfil',
        #set-email2factor.html
        'text10': 'Etapa 1: Confirmar o seu correio eletrónico',
        'text11': 'Para definir o método de e-mail de dois factores, primeiro tem de confirmar que o seu e-mail é válido. Clique no botão e enviar-lhe-emos um código de confirmação. Assim que tiver o código, só tem de o colocar para ativar o método.',
        'text12': 'Enviou-me o e-mail',
        'text13': 'Etapa 2: Introduzir o código que recebeu por correio eletrónico',
        'text14': 'Enviar',
        'text15': 'Conjunto de dois fatores do Correio bem-sucedido',
        'text16': 'Configurou com êxito o autenticador de correio eletrónico de dois factores. Clique no botão para regressar ao perfil.',
        'text17': 'Voltar ao perfil',
        #check-email2factor.html
        'text18': 'Etapa 2: Introduzir o código que recebeu por correio eletrónico',
        'text19': 'Enviar',
        #check-google2factor.html
        'text20': 'Confirmar o código',
        'text21': 'Introduzir o código totp de verificação.',
        'text22': 'Enviar',
       
    }
    return context

