// index.js

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const obs = document.getElementById('obs');
    const search = document.getElementById('search');
    const sala = document.getElementById('sala');
    const searchIA = document.getElementById('searchIA'); // Get the app div
    current_match = 0
    player = 0
    socket = null
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');


    function updateUrl(path) {
        const newPath = baseurl + path;
        window.history.pushState({ path: newPath }, '', newPath);
    }



    obs.addEventListener('click', function () {
        heading.textContent = 'noo';

        socket = new WebSocket('ws://localhost:8000/ws/game/?user=hola&mode=obs&sala=1');

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




    search.addEventListener('click', function () {
        heading.textContent = 'noo';

        socket = new WebSocket('ws://localhost:8000/ws/game/?user=hola&mode=search');

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



    sala.addEventListener('click', function () {
        heading.textContent = 'noo';

        socket = new WebSocket('ws://localhost:8000/ws/game/?user=hola&mode=sala&sala=1');

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