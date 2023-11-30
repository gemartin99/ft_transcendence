//const domain = "crazy-pong.com";
const domain = "http://localhost";

current_match = 0
player = 0
socket = null



document.addEventListener('DOMContentLoaded', function () {
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
});

function join_match() {
    const heading = document.getElementById('helloHeading');
    heading.textContent = 'noo';

    socket = new WebSocket('ws://'+ 'localhost' +':8000/ws/game/?user=hola&mode=IA');

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
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
    };
    const message = { cmd: 'search' };
    socket.send(JSON.stringify(message));           
}

function drawBall(ball) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
}

function drawPaddles(paddle1, paddle2) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function printMap(jsonData) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(jsonData.ball);
    drawPaddles(jsonData.paddle1, jsonData.paddle2);

}

// Function to be called from the HTML button onclick event
function join_match_from_html() {
    join_match();
}