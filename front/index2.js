// index.js

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const ct = document.getElementById('ct');
    const join = document.getElementById('join');
    current_match = 0
    player = 0
    socket = null
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');


    function updateUrl(path) {
        const newPath = baseurl + path;
        window.history.pushState({ path: newPath }, '', newPath);
    }



    ct.addEventListener('click', function () {
        heading.textContent = 'noo';
        
        const message = { name: document.getElementById("textbox").value,
                                    n: 4,
                                    user: "Usuari 1"
                                };
        fetch('http://localhost:8000/tournament/create/', {
            // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
        .then(response => response.json())
        .then(data => {
            heading.textContent = document.getElementById("textbox").value + ' ' + data.id
            console.log('Response:', data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
       
       });

    join.addEventListener('click', function () {
        heading.textContent = 'noo';
        
        var sala = document.getElementById("textbox").value;
        socket = new WebSocket('ws://localhost:8000/ws/tournament/?user=hola&sala=' + sala);

       socket.onopen = (event) => {
           console.log('WebSocket connection opened:', event);
       };
       
       socket.onmessage = (event) => {
           const jsonData = JSON.parse(event.data.toString());
           console.log(jsonData);
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