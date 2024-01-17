//const domain = "crazy-pong.com";
// const domain = "localhost";
var domain = window.location.hostname;

current_match = 0
player = 0
socket = null
in_match = false


document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', function(event) {
        if (in_match == true) {
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
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (in_match == true){
        const message = { cmd: 'update',
                            id: current_match,
                            pl: player,
                            key: "rest" };
        socket.send(JSON.stringify(message));}
    });
});

function handleGame(){
    console.log('handleGame');
    if (in_match == true) {
        handleRedirect('/game/play/');
    }
}

function join_match() {
    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=search&points=11');

    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        
    };
    socket.onmessage = (event) => {
        in_match = true
        const jsonData = JSON.parse(event.data.toString());
        //console.log(jsonData)
        if (jsonData['cmd'] == 'update') {
            
            //console.log(jsonData);
            var idMatch = document.getElementById("idMatch");
            idMatch.textContent =  "Match ID: " + jsonData.idMatch;
            printMap(jsonData);
        }
        if (jsonData['cmd'] == 'finish') {
            printWinner(jsonData);
            socket.close();
        }

        //console.log('WebSocket message received:', event.data);

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    };        
}

function create_match() {
    handleRedirect('/game/play/');
    code = generateRandomString(4)
    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=5&sala=' + code);
    //AQUEST CODE S'HA DIMPRIR A LA PANTALLA
    console.log(code)
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
    };
    socket.onmessage = (event) => {
        in_match = true
        const jsonData = JSON.parse(event.data.toString());
        if (jsonData['cmd'] == 'update') {
            //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
            //console.log(jsonData);
            //var idMatch = document.getElementById("idMatch");
            //idMatch.textContent =  "Match ID: " + jsonData.idMatch;
            printMap(jsonData);
        }
        if (jsonData['cmd'] == 'finish') {
            //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
            //var idMatch = document.getElementById("idMatch");
            //idMatch.textContent = jsonData.idMatch;
            printWinner(jsonData);
        }
        //console.log('WebSocket message received:', event.data);

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    };         
}


function join_match_sala() {

    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=5&sala=' + document.getElementById("lobbyCode").value);
    
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        
    };
    socket.onmessage = (event) => {
        in_match = true
        const jsonData = JSON.parse(event.data.toString());
        if (jsonData['cmd'] == 'update') {
            //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
            //console.log(jsonData);
            //var idMatch = document.getElementById("idMatch");
            //idMatch.textContent =  "Match ID: " + jsonData.idMatch;
            printMap(jsonData);
        }
        if (jsonData['cmd'] == 'finish') {
            //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
            //var idMatch = document.getElementById("idMatch");
            //idMatch.textContent = jsonData.idMatch;
            printWinner(jsonData);
        }
        //console.log('WebSocket message received:', event.data);

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    };         
}

function join_IA() {
    console.log("ei aixo: " + window.location.href);
    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=IA&points=5');
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        
    };
    socket.onmessage = (event) => {
        
        if (window.location.href == "http://localhost/game/play/") {
            in_match = true
            const jsonData = JSON.parse(event.data.toString());
            if (jsonData['cmd'] == 'update') {
                //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                //console.log(jsonData);
                //var idMatch = document.getElementById("idMatch");
                //idMatch.textContent =  "Match ID: " + jsonData.idMatch;
                printMap(jsonData);
            }
            if (jsonData['cmd'] == 'finish') {
                //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                //var idMatch = document.getElementById("idMatch");
                //idMatch.textContent = jsonData.idMatch;
                printWinner(jsonData);
            }
            //console.log('WebSocket message received:', event.data);
        }

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    }; 
}

async function reconnect() {
    await new Promise(r => setTimeout(r, 400));
    console.log("ei aixo1: " + window.location.href + " sck: " + socket);
    if (socket == null && window.location.href == "http://localhost/game/play/"){
        console.log("ei aixo: " + window.location.href);
        socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=reconnect&points=5');
        socket.onopen = (event) => {
            console.log('WebSocket connection opened:', event);
            
        };
        socket.onmessage = (event) => {
            
            if (window.location.href == "http://localhost/game/play/") {
                in_match = true
                const jsonData = JSON.parse(event.data.toString());
                if (jsonData['cmd'] == 'update') {
                    //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                    //console.log(jsonData);
                    //var idMatch = document.getElementById("idMatch");
                    //idMatch.textContent =  "Match ID: " + jsonData.idMatch;
                    printMap(jsonData);
                }
                if (jsonData['cmd'] == 'finish') {
                    //heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
                    //var idMatch = document.getElementById("idMatch");
                    //idMatch.textContent = jsonData.idMatch;
                    printWinner(jsonData);
                }
                //console.log('WebSocket message received:', event.data);
            }

        };
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            in_match = false
        };
    }
}

function obs_match() {

    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=obs&sala=' + document.getElementById("lobbYCode").value);

    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
    };
    socket.onmessage = (event) => {
        const jsonData = JSON.parse(event.data.toString());
        console.log(jsonData)
        if (jsonData['cmd'] == 'update') {
            //#endregio//heading.textContent =  "Jugador 1: " + jsonData.score1 + "Jugador 2: " + jsonData.score2;
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

function printResult(jsonData) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "60px monospace";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(jsonData.score1 + "-" + jsonData.score2, canvas.width/2, canvas.height/2);

}

function printMap(jsonData) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(jsonData.ball);
    drawPaddles(jsonData.paddle1, jsonData.paddle2);
    printResult(jsonData);
}

function printWinner(jsonData) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px monospace";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    if (jsonData.score1 > jsonData.score2) {
        ctx.fillText(jsonData.player1.name + " wins!", canvas.width/2, canvas.height/2);
    }
    else {
        ctx.fillText(jsonData.player2.name + " wins!", canvas.width/2, canvas.height/2);
    }
    ctx.fillText(jsonData.score1 + "-" + jsonData.score2, canvas.width/2, canvas.height/2 + 60);
}



// Function to be called from the HTML button onclick event
function join_match_from_html() {
    join_match();
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

//TOURNAMENT FUNCTIONS
function gameTournament(id, points) {

    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=' + points + '&sala=' + id);
    
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        
    };
    socket.onmessage = (event) => {
        in_match = true
        const jsonData = JSON.parse(event.data.toString());
        if (jsonData['cmd'] == 'update') {
            printMap(jsonData);
        }
        if (jsonData['cmd'] == 'finish') {
            printWinner(jsonData);
        }

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    };         
}

function gameTournamentIA(id, points) {

    socket = new WebSocket('ws://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=salaIA&points=' + points + '&sala=' + id);
    
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        
    };
    socket.onmessage = (event) => {
        in_match = true
        const jsonData = JSON.parse(event.data.toString());
        if (jsonData['cmd'] == 'update') {
            printMap(jsonData);
        }
        if (jsonData['cmd'] == 'finish') {
            printWinner(jsonData);
        }

    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
    };         
}