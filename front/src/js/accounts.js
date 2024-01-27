var url = window.location.hostname;
var sessionSocket;
var baseUrl = window.location.origin;

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

function logoutTest(){
    document.cookie = "jwttoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function do_logout(){
    var lang = getLang()
    fetch(baseUrl + ':8000/users/logout/', {
        credentials: 'include',
           headers: {
            'language': lang,
        },
    })
    .then(response => response.json())
    .then(data => {
        sessionSocket.close();
        if (data.redirect) {
            handleRedirect(data.redirect);
            return ;
        }
        handleNavLinks()
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// function handle_ws(){}

function send_login_form(e)  {
    e.preventDefault();
    var lang = getLang()

    // Lógica para el inicio de sesión mediante AJAX/Fetch
    const loginForm = document.querySelector("#login");
    const formData = new FormData(e.target);

    // Convert form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    fetch(baseurl +':8000/users/login/action/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        'language': lang,},
        credentials: 'include',
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (23 * 60 * 60 * 1000));

        if (data.jwtToken)
            document.cookie = `jwttoken=${data.jwtToken}; Secure; expires=${expirationDate}; SameSite=None; path=/;`;

        if (getCookie('jwttoken')) {
            if (data.mail2FA == true)
            {
                handleRedirect('/twoFA/MailVerification/');
            }
            else if (data.google2FA == true)
            {
                handleRedirect('/twoFA/GoogleVerification/');
            }
            else
            {
                set_logged_in_view();
                history.pushState(null, null, '/');
                handleNavLinkAction('/');
            }
            sessionSocket = new WebSocket('wss://'+ url +':8000/ws/login/?user=' + data.user);
        }
        else {
            set_logged_out_view();
            if (lang == 'es')
                setFormMessage(loginForm, "error", "Combinación de nombre de usuario/contraseña no válida");
            else if (lang == 'en')
                setFormMessage(loginForm, "error", "Invalid username/password combination");
            else
                setFormMessage(loginForm, "error", "Combinação de nome de utilizador/palavra-passe inválida");
        }
    })
    .catch((error) => {
        if (lang == 'es')
            setFormMessage(loginForm, "error", "Combinación de nombre de usuario/contraseña no válida");
        else if (lang == 'en')
            setFormMessage(loginForm, "error", "Invalid username/password combination");
        else
            setFormMessage(loginForm, "error", "Combinação de nome de utilizador/palavra-passe inválida");
    });
}

function send_form_new_account(e) {
    e.preventDefault();
    var lang = getLang();
    const formData = new FormData(e.target);
    const createAccountForm = document.querySelector("#createAccount");

    // Convert form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    const check_inputs = Object.values(formDataObject).every((value) => check_form_inputs(value));

    if (!check_inputs) {
        if (lang == 'es')
            setFormMessage(crateAccountForm, "error", "Hay caracteres especiales en los campos.");
        else if (lang == 'en')
            setFormMessage(createAccountForm, "error", "There are special characters in the fields.");
        else
            setFormMessage(createAccountForm, "error", "Há caracteres especiais nos campos.");
        return;
    }

    const equalPasswords = comparePass(formDataObject['password'], formDataObject['confirm_password']);

    if (!equalPasswords) {
        if (lang == 'es')
            setFormMessage(createAccountForm, "error", "Las contraseñas no coinciden.");
        else if (lang == 'en') 
            setFormMessage(createAccountForm, "error", "Passwords do not match.");
        else
            setFormMessage(createAccountForm, "error", "As palavras-passe não coincidem.");
        return;
    }

    fetch(baseurl + ':8000/users/register/new/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        'language': lang,},
        credentials: 'include',
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            setFormMessage(createAccountForm, "success", "Account created successfully");
            handleNavLinkAction('/users/login/identify/?s=new')
        }
        else{
            error_message = data.error;
            setFormMessage(createAccountForm, "error", error_message);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}
