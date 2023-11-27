// index.js

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const home = document.getElementById('home');
    const login = document.getElementById('login');
    const hola = document.getElementById('hola');
    const app = document.getElementById('app'); // Get the app div
    const backend = document.getElementById('backend'); // Get the app div
    const logbutton = document.getElementById('logbutton'); // Get the app div
    const userDataDisplay = document.getElementById('userDataDisplay');
    const displayUsers = document.getElementById('displayUsers');

    const socket = new WebSocket('ws://localhost:8000/ws/game/');



    function updateUrl(path) {
        const newPath = baseurl + path;
        window.history.pushState({ path: newPath }, '', newPath);
    }



// GEMALOGIN

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



    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

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
                    setFormMessage(loginForm, "Congratulations", "you have nice memory");
                else
                    setFormMessage(loginForm, "error", "Invalid username/password combination");

                console.log('Response:', data.message);
            })
            .catch((error) => {
                console.error('Error:', error);
            });



        setFormMessage(loginForm, "error", "Invalid username/password combination");
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
                console.log('Response:', "ha funciunat");
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setFormMessage(createAccountForm, "success", "Account created successfully");

        // Simulación de redireccionamiento o cambio de vista después del registro
        createAccountForm.classList.add("form--hidden");
        loginForm.classList.remove("form--hidden");
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

    // DOS BOTONES PARA GUARDAR Y RECIBIR DATA DE DB

    logbutton.addEventListener('click', function () {
                const dataInputValue = document.getElementById('dataInput').value;
                const formData = {
                    dataInput: dataInputValue
                };

                fetch('http://localhost:8000/accounts/request1/', {
                    // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                .then(response => response.json())
                .then(data => {
                    heading.textContent = data.message;
                    console.log('Response:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });

    displayUsers.addEventListener('click', function() {
        userDataDisplay.innerHTML = '';

        fetch('http://localhost:8000/accounts/request1/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(jsonData => {
                userDataDisplay.innerHTML = '';

                jsonData.users.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.innerHTML = `<p>User ID: ${user.id}, Email: ${user.email}, Active: ${user.active}, Pass: ${user.password}</p>`;
                    userDataDisplay.appendChild(userDiv);
                });
                heading.textContent = 'here you have your stupid users';
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    });

    // END DOS BOTONES PARA GUARDAR Y RECIBIR DATA DE DB








    home.addEventListener('click', function () {
        heading.textContent = 'Loading...';
         // updateUrl('/home');
         
        fetch(baseurl + ':8000/api/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                if (data) {
                    // Update different parts of your HTML based on the data
                    app.innerHTML = data.content;
                } else {
                    heading.textContent = 'Error: Invalid response from backend';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                heading.textContent = 'Error: Failed to fetch data from the backend';
            });
    });




    // login.addEventListener('click', function () {
    //     heading.textContent = 'Loading...';
    //      // updateUrl('/login');

    //     fetch(baseurl + ':8000/api/login/')
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Response from backend:', data);

    //             if (data.title && data.content && data.additionalInfo) {
    //                 heading.textContent = data.title;
    //                 app.innerHTML = data.content + '<br>' + data.additionalInfo;
    //             } else {
    //                 heading.textContent = 'Error: Invalid response from backend';
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             heading.textContent = 'Error: Failed to fetch data from the backend';
    //         });
    // });



    // hola.addEventListener('click', function () {
    //     heading.textContent = 'dasdasdasda';
    //      // updateUrl('/template1');

    //     fetch(baseurl + ':8000/api/template1/')
    //         .then(response => response.text())
    //         .then(html => {
    //             app.innerHTML = html;
    //         })
    //         .catch(error => console.error('Error fetching HTML:', error));
    //         });


    // backend.addEventListener('click', function () {
    //          heading.textContent = 'noo';

    //         socket.onopen = (event) => {
    //             console.log('WebSocket connection opened:', event);
    //         };
            
    //         socket.onmessage = (event) => {
    //             heading.textContent = event.data;
    //             console.log('WebSocket message received:', event.data);
        
    //         };
            
    //         socket.onclose = (event) => {
    //             console.log('WebSocket connection closed:', event);
    //         };
            
    //         //const message = { message: 'buscar' };
    //         //socket.send(JSON.stringify(message));
    //         socket.send('buscar')
            
    //         });





    console.log('Hello, World! from JavaScript!');
});

