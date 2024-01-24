// index.js

// url = "crazy-pong.com"
var url = window.location.hostname;
var socket;

//baseurl = "http://crazy-pong.com"
// baseurl = "http://localhost";
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

// logout cookie remove (works):
function logoutTest(){
    console.log('he entrado');
    document.cookie = "jwttoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// function do_logout(){
//  socket.close();
// }

// function handle_ws(){}

function send_login_form(e)  {
    e.preventDefault();
    // Lógica para el inicio de sesión mediante AJAX/Fetch
    const loginForm = document.querySelector("#login");
    const formData = new FormData(e.target);

    // Convert form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    console.log('FormDataObject:', formDataObject);
    fetch(baseurl +':8000/users/login/action/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data.message);
        console.log('jwttoken:', data.jwtToken)
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (23 * 60 * 60 * 1000));

        if (data.jwtToken)
            document.cookie = `jwttoken=${data.jwtToken}; Secure; expires=${expirationDate}; SameSite=None; path=/;`;
        console.log('jwttoken:', data.jwtToken);

        console.log('data', data);
        if (getCookie('jwttoken')) {
            set_logged_in_view();
            setFormMessage(loginForm, "success", "Congratulations you have nice memory");
            history.pushState(null, null, '/');
            handleNavLinkAction('/');
            console.log("my user id:" + data.user)
            socket = new WebSocket('wss://'+ url +':8000/ws/login/?user=' + data.user);
        }
        else {
            set_logged_out_view();
            setFormMessage(loginForm, "error", "Invalid username/password combination");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });
}

function send_form_new_account(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const createAccountForm = document.querySelector("#createAccount");

    // Convert form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    const check_inputs = Object.values(formDataObject).every((value) => check_form_inputs(value));

    if (!check_inputs) {
        setFormMessage(createAccountForm, "error", "Hay caracteres especiales en los campos.");
        return;
    }

    const equalPasswords = comparePass(formDataObject['password'], formDataObject['confirm_password']);

    if (!equalPasswords) {
        setFormMessage(createAccountForm, "error", "Las contraseñas no coinciden.");
        return;
    }

    console.log('FormDataObject:', formDataObject);
    fetch(baseurl + ':8000/users/register/new/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == "User saved successfully") {
            setFormMessage(createAccountForm, "success", "Account created successfully");
            //history.pushState(null, null, '/users/login/identify')
            handleNavLinkAction('/users/login/identify/?s=new')
            console.log('Response:', "ha funciunat");
        }
        else{
            error_message = data.error;
            setFormMessage(createAccountForm, "error", error_message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
