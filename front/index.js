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
    current_match = 0
    player = 0
    socket = null
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');


    function updateUrl(path) {
        const newPath = baseurl + path;
        window.history.pushState({ path: newPath }, '', newPath);
    }



    home.addEventListener('click', function () {
        heading.textContent = 'Loading...';
         updateUrl('/home');
         
        fetch(baseurl + ':8000/api/home/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                if (data.message) {
                    // Update different parts of your HTML based on the data
                    app.innerHTML = data.message;
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
         updateUrl('/login');

        fetch(baseurl + ':8000/api/login/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                if (data.title && data.content && data.additionalInfo) {
                    heading.textContent = data.title;
                    app.innerHTML = data.content + '<br>' + data.additionalInfo;
                } else {
                    heading.textContent = 'Error: Invalid response from backend';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                heading.textContent = 'Error: Failed to fetch data from the backend';
            });
    });



    hola.addEventListener('click', function () {
        heading.textContent = 'dasdasdasda';
         updateUrl('/template1');

        fetch(baseurl + ':8000/api/template1/')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
            })
            .catch(error => console.error('Error fetching HTML:', error));
            });


    backend.addEventListener('click', function () {
             heading.textContent = 'noo';

             socket = new WebSocket('ws://localhost:8000/ws/game/');

            socket.onopen = (event) => {
                console.log('WebSocket connection opened:', event);
            };
            
            socket.onmessage = (event) => {
                const jsonData = JSON.parse(event.data.toString());
                console.log(jsonData)
                if (jsonData['cmd'] == 'matchmaking') {
                    heading.textContent = jsonData['ball'];
                }
                if (jsonData['cmd'] == 'connection') {
                    current_match = jsonData['id']
                    player = jsonData['pl']
                }
                else if (jsonData['cmd'] == 'update') {
                    heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                    printMap(jsonData);
                }
                //console.log('WebSocket message received:', event.data);
        
            };
            
            socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event);
            };
            
            const message = { cmd: 'search' };
            socket.send(JSON.stringify(message));
            
            });

    document.addEventListener('keydown', function(event) {
        if (socket != null) {
        if (event.key === 'ArrowUp') {
            const message = { cmd: 'update',
                                id: current_match,
                                pl: player,
                                key: "up" };
            socket.send(JSON.stringify(message));
            console.log(JSON.stringify(message));
        } else if (event.key === 'ArrowDown') {
            if (event.key === 'ArrowUp' || event.key == 'ArrowDown') {
                const message = { cmd: 'update',
                                    id: current_match,
                                    pl: player,
                                    key: "down" };
                socket.send(JSON.stringify(message));
                console.log(JSON.stringify(message));
            }
        }}
        
        });
    
        document.addEventListener('keyup', function(event) {
            if (socket != null){
            const message = { cmd: 'update',
                                id: current_match,
                                pl: player,
                                key: "rest" };
            socket.send(JSON.stringify(message));}
        });
    
    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddles(paddle1, paddle2) {
        ctx.fillStyle = '#000';
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    }
    function printMap(jsonData) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall(jsonData.ball);
        drawPaddles(jsonData.paddle1, jsonData.paddle2);

    }
    console.log('Hello, World! from JavaScript!');
});