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




    login.addEventListener('click', function () {
        heading.textContent = 'Loading...';
         // updateUrl('/login');

       socket.onopen = (event) => {
           console.log('WebSocket connection opened:', event);
       };
       
       socket.onmessage = (event) => {
           const jsonData = JSON.parse(event.data.toString());
           if (jsonData['cmd'] == 'update') {
               heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
               printMap(jsonData);
           }
       };
       
       socket.onclose = (event) => {
           console.log('WebSocket connection closed:', event);
       };
       
       
       });



    hola.addEventListener('click', function () {
        heading.textContent = 'dasdasdasda';
         // updateUrl('/template1');

        fetch(baseurl + ':8000/api/template1/')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
            })
            .catch(error => console.error('Error fetching HTML:', error));
            });


    searchIA.addEventListener('click', function () {
             heading.textContent = 'noo';

             socket = new WebSocket('ws://localhost:8000/ws/game/?user=hola&mode=IA');

            socket.onopen = (event) => {
                console.log('WebSocket connection opened:', event);
            };
            
            socket.onmessage = (event) => {
                const jsonData = JSON.parse(event.data.toString());
                if (jsonData['cmd'] == 'update') {
                    heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                    printMap(jsonData);
                }
            };
            
            socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event);
            };
            
            
            });


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



    console.log('Hello, World! from JavaScript!');
});