//const domain = "crazy-pong.com";
// const domain = "localhost";
var domain = window.location.hostname;

current_match = 0
player = 0
socket = null
in_match = false
in_1vs1 = false

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', function(event) {
        if (in_match == true && !in_1vs1) {
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
        if (in_1vs1 == true) {
            if (event.key === 'w') {
                const message = { cmd: 'update',
                                    id: current_match,
                                    pl: "p1",
                                    key: "up" };
                socket.send(JSON.stringify(message));
                console.log(JSON.stringify(message));
            } else if (event.key === 's') {
                if (event.key === 'w' || event.key == 's') {
                    const message = { cmd: 'update',
                                        id: current_match,
                                        pl: "p1",
                                        key: "down" };
                    socket.send(JSON.stringify(message));
                    console.log(JSON.stringify(message));
                }
            } else if (event.key === 'ArrowUp') {
                const message = { cmd: 'update',
                                    id: current_match,
                                    pl: "p2",
                                    key: "up" };
                socket.send(JSON.stringify(message));
                console.log(JSON.stringify(message));
            } else if (event.key === 'ArrowDown') {
                if (event.key === 'ArrowUp' || event.key == 'ArrowDown') {
                    const message = { cmd: 'update',
                                        id: current_match,
                                        pl: "p2",
                                        key: "down" };
                    socket.send(JSON.stringify(message));
                    console.log(JSON.stringify(message));
                }
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (in_match == true){
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown'){
            const message = { cmd: 'update',
                                id: current_match,
                                pl: "p2",
                                key: "rest" };
            socket.send(JSON.stringify(message));}
        else if (event.key == 'w' || event.key == 's'){
            const message = { cmd: 'update',
                                id: current_match,
                                pl: "p1",
                                key: "rest" };
            socket.send(JSON.stringify(message));}}
    });
});

function handleGame(){
    console.log('handleGame');
    if (in_match == true) {
        handleRedirect('/game/play/');
    }
}


function open_socket(target, mode)
{
    var htmlloaded = 0;
    socket = new WebSocket(target);
    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
        //document.getElementById('waiting').style.display = 'block';
    };
    socket.onmessage = (event) => {
        try{
            document.getElementById('waiting').style.display = 'none';
        } catch (error) {
        }
        in_match = true
        if (mode == '1vs1') {
            in_1vs1 = true
        }
        const jsonData = JSON.parse(event.data.toString());
        if (jsonData['cmd'] == 'start') {
            if (window.location.href != baseUrl + "/game/play/"){
                handleRedirect('/game/play/');
            }
            if(htmlloaded == 0 && document.getElementById('gameContainer'))
            {
                htmlloaded = 1
                document.getElementById('gameContainer').style.display = 'flex';
                redrawCanvas(jsonData);
            }
            window.addEventListener('resize', resizeCanvas);
        }
        if (jsonData['cmd'] == 'update') {
            if (htmlloaded == 0 && document.getElementById('gameContainer')) {
                console.log('Inside if: Condition met');
                htmlloaded = 1;
                document.getElementById('gameContainer').style.display = 'flex';
            }
            in_match = true
            if (htmlloaded == 1) {
                redrawCanvas(jsonData);
            }
            window.addEventListener('resize', resizeCanvas);
        }
        if (jsonData['cmd'] == 'finish') {

            drawMatchResult(jsonData);
        }
    };
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        in_match = false
        in_1vs1 = false
    }; 
}

function join_match() {
    open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=search&points=5', "search");        
}

function create_match() {
    
    code = generateRandomString(5)
    open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=5&sala=' + code, "sala");
}


function join_match_sala(e) {
    e.preventDefault();
    const message = {idMatch: document.getElementById("lobbyCode").value,
            };
    fetch(baseUrl + ':8000/game/canJoin/', {
        // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        credentials: 'include',
        body: JSON.stringify(message),
    })
    .then(response => response.json())
    .then(data => {
        console.log("eieieieiei" + data.code);
        if (data.code == 200){
            handleRedirect('/game/play/');    
            open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=5&sala=' + document.getElementById("lobbyCode").value, "sala");   
        }
        else {
            lang = getLang();
            if (lang == 'en') {
                alert("Wrong code");
            }
            else if (lang == 'es') {
                alert("Código incorrecto");
            }
            else if (lang == 'pt') {
                alert("Código errado");
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });


    
}

function join_IA() {
    open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=IA&points=5');
}

async function reconnect() {
    await new Promise(r => setTimeout(r, 300));
    console.log("ei aixo1: " + window.location.href + " sck: " + socket);
    if (socket == null && window.location.href == "https://crazy-pong.com/game/play/"){
        fetch(baseUrl + ':8000/users/playing/', {
            headers: {
                'Content-Type': 'application/json',
                },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log("eieieieiei" + data.code);
            if (data.code == 200){
                open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=reconnect&points=5');
            }   
            else {
                handleRedirect('/game/');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }          
}

function obs_match(e) {
    console.log("joining match")
    e.preventDefault();
    const message = {idMatch: document.getElementById("lobbYCode").value,
            };
    fetch(baseUrl + ':8000/game/canView/', {
        // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        credentials: 'include',
        body: JSON.stringify(message),
    })
    .then(response => response.json())
    .then(data => {
        console.log("eieieieiei" + data.code);
        if (data.code == 200){
            handleRedirect('/game/play/');
            open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=obs&sala=' + document.getElementById("lobbYCode").value, "obs");
        }   
        else {
            lang = getLang();
            if (lang == 'en') {
                alert("Wrong code");
            }
            else if (lang == 'es') {
                alert("Código incorrecto");
            }
            else if (lang == 'pt') {
                alert("Código errado");
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function one_vs_one_without_shirt(e) {
        e.preventDefault();

        var p1 = document.getElementById("p1").value;
        var p2 = document.getElementById("p2").value;
        var points = document.getElementById("points").value;
        handleRedirect('/game/play/');
        await new Promise(r => setTimeout(r, 300));

        open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=1vs1&points=' + points + '&p1=' + p1 + '&p2=' + p2, "1vs1");
    }


function quitQueue() {
    const message = {quit: "quitting",
            };
    fetch(baseUrl + ':8000/game/quitQueue/', {
        // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        credentials: 'include',
        body: JSON.stringify(message),
    })
    .then(response => response.json())
    .then(data => {
        if (socket != null) {
            const message = { cmd: 'quit',
                        };
            socket.send(JSON.stringify(message));
            socket.close();
        }
        handleRedirect('/game/');
        socket = null;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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
    open_socket*('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=sala&points=' + points + '&sala=' + id);
}

function gameTournamentIA(id, points) { 
    open_socket('wss://'+ domain +':8000/ws/game/?user='+ getCookie('jwttoken') +'&mode=salaIA&points=' + points + '&sala=' + id);
}