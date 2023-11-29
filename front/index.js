// index.js

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {

    const socket = new WebSocket('ws://localhost:8000/ws/game/');



    // function updateUrl(path) {
    //     const newPath = baseurl + path;
    //     window.history.pushState({ path: newPath }, '', newPath);
    // }



// GEMALOGIN
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");



    HTMLFormElement.prototype.clearForm = function() {
      // Get all input elements within the form
      const formInputs = this.querySelectorAll('input');

      // Iterate over the input elements and set their values to an empty string
      formInputs.forEach(input => {
        input.value = '';
      });
    };

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

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        // Lógica para el inicio de sesión mediante AJAX/Fetch
        const formData = new FormData(e.target);

        // Convert form data to a JSON object
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log('FormDataObject:', formDataObject);
            fetch('http://localhost:8000/accounts/login/', {
                // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message == 'logueao pum')
                    setFormMessage(loginForm, "success", "Congratulations you have nice memory");
                else
                    setFormMessage(loginForm, "error", "Invalid username/password combination");

                console.log('Response:', data.message);
            })
            .catch((error) => {
                console.error('Error:', error);
                setFormMessage(loginForm, "error", "Invalid username/password combination");
            });
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        // Lógica para el registro de la cuenta (simulada)
        // Por ejemplo, validar campos y enviar datos al servidor (no implementado aquí)
        const formData = new FormData(e.target);

        // Convert form data to a JSON object
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log('FormDataObject:', formDataObject);
        fetch('http://localhost:8000/accounts/register/', {
            // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message == "User saved successfully") {
                setFormMessage(createAccountForm, "success", "Account created successfully");
            // Simulación de redireccionamiento o cambio de vista después del registro
                createAccountForm.classList.add("form--hidden");
                loginForm.classList.remove("form--hidden");
                console.log('Response:', "ha funciunat");
                createAccountForm.clearForm();
            }
            else {
                error_message = data.errors;
                console.error('Error:', error_message);
                setFormMessage(createAccountForm, "error", error_message);
                createAccountForm.querySelector('[name="password"]').value = '';
                createAccountForm.querySelector('[name="confirm_password"]').value = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 6) {
                setInputError(inputElement, "Username must be at least 6 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });

// GEMALOGIN


    console.log('Hello, World! from JavaScript!');
});

