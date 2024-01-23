
var baseUrl = window.location.origin;

in_tournament = 0;



function createTournament(e) {
    console.log("creant torneig");
    e.preventDefault();
    if (document.getElementById("nameTournament").value != ""){
        const message = { name: document.getElementById("nameTournament").value,
                                    n: document.getElementById("players").value,
                                    points: document.getElementById("points").value,
                                    ia: document.getElementById('fillAI').checked
                                };
        console.log(message);
        fetch(baseUrl + ':8000/tournament/create/', {
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
            console.log('EIEIEISIUSPLAU:', data.code);
            in_tournament = data.code;
            if (data.redirect)
                handleRedirect(data.redirect);
        })
        .catch((error) => {
            console.error('Error:', error);
        });}
    else{
        alert("You must enter a name");
    }
}

function updateLobby() {
        
    const message = { id: in_tournament,
                            };
    fetch(baseUrl + ':8000/tournament/update/', {
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
        //var code = document.getElementById("lobbyCode");
        //code.textContent = "Lobby code: " + data.code;
        if (data.info.started == true){
            handleRedirect("/tournament/bracketPage/");
        }
        else{
            var players = [];
            i = 0;
            for (key in data){
                if (key != "info"){
                    if (data[key].u1 != "IA" && data[key].u1.substring(0, 4) != "Bot "  && data[key].u1 != "undefined")
                        players[i++] = data[key].u1;
                        if (data[key].u2 != "IA" && data[key].u2.substring(0, 4) != "Bot "  && data[key].u2 != "undefined")
                        players[i++] = data[key].u2;
                }
            }

            document.getElementById("p1").textContent = players[0];
            document.getElementById("p2").textContent = players[1];
            document.getElementById("p3").textContent = players[2];
            document.getElementById("p4").textContent = players[3];
            document.getElementById("p5").textContent = players[4];
            document.getElementById("p6").textContent = players[5];
            document.getElementById("p7").textContent = players[6];
            document.getElementById("p8").textContent = players[7];

            
            var tournament_id = document.getElementById("lobbyCode");
            tournament_id.textContent = "LOBBY CODE: " + data.info.idTournament;
            console.log('id:', data.id);
            console.log('Response:', data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function updateTournament() {
        
    const message = { id: in_tournament,
                            };
    fetch(baseUrl + ':8000/tournament/update/', {
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
        //var code = document.getElementById("lobbyCode");
        //code.textContent = "Lobby code: " + data.code;
        var m = document.getElementById("s1_1");
        m.textContent = data[1].u1 + " - " + data[1].p1;
        var m = document.getElementById("s1_2");
        m.textContent = data[1].u2 + " - " + data[1].p2;
        var m = document.getElementById("s2_1");
        m.textContent = data[2].u1 + " - " + data[2].p1;
        var m = document.getElementById("s2_2");
        m.textContent = data[2].u2 + " - " + data[2].p2;
        
        var m = document.getElementById("f_1");
        m.textContent = data[0].u1 + " - " + data[0].p1;
        var m = document.getElementById("f_2");
        m.textContent = data[0].u2 + " - " + data[0].p2;

        console.log('id:', data.id);
        console.log('Response:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function joinTournament(e) {
    console.log("unintse torneig");
    e.preventDefault();
    const message = {id: document.getElementById("lobbyCode").value,
                            };
    fetch(baseUrl + ':8000/tournament/join/', {
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
        console.log('Response:', data.code);
        if (data.code == 200){
            in_tournament = document.getElementById("lobbyCode").value;
            handleRedirect("/tournament/lobbyPage/");
        }
        else
            alert("Invalid lobby code or tournament already started");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function handleSwitchClick() {
    const switchElement = document.getElementById('fillAI');
    const isChecked = switchElement.checked;

    console.log('switch:',document.getElementById('fillAI').checked);
    // Call your custom function with the switch state
    // yourCustomFunction(isChecked);
}


function startTournament(){
    console.log("start torneig");
    const message = {id: in_tournament,
                            };
    fetch(baseUrl + ':8000/tournament/start/', {
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
        console.log('Response:', data.code);
        if (data.redirect == "/tournament/bracketPage/")
            getTournament();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getTournament(){
    console.log("get torneig");
    const message = {id: in_tournament};
    // updateUrl(redirect_url);
    var lang = getLang()
    fetch(baseUrl + ':8000/tournament/bracketPage/', {
        // HAY QUE ESPECIFICAR QUE ES METODO POST PARA RECIBIR DATA
        method: 'POST',
        headers: {
            'language': lang,
        },
        credentials: 'include',
        body: JSON.stringify(message),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data.code);
        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect);
            return ;
            console.log('Invalid response from backend 1', data.redirect);
        } else {
            console.log('Invalid response from backend 1', data);
        }
        // handleNavLinks()
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function playTournament(){
        
    const message = { id: in_tournament,
    };
    fetch(baseUrl + ':8000/tournament/update/', {
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
        //var code = document.getElementById("lobbyCode");
        //code.textContent = "Lobby code: " + data.code;
        for (key in data){
            if (key != "info"){
                if (data[key].u1 == data["info"].user){
                    console.log(data);
                    handleRedirect("/game/play/");
                    if (data[key].u2.substring(0, 4) == "Bot " || data[key].u2 == "IA")
                        gameTournamentIA(data[key].match_id, data['info'].points);
                    else
                        gameTournament(data[key].match_id, data['info'].points);
                }
                
                if (data[key].u2 == data["info"].user){
                    handleRedirect("/game/play/");
                    if (data[key].u1.substring(0, 4) == "Bot "|| data[key].u1 == "IA")
                        gameTournamentIA(data[key].match_id, data['info'].points);
                    else
                        gameTournament(data[key].match_id, data['info'].points);   
                }
                    
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function quitTournament() {
    console.log("unintse torneig");

    const message = {id: 1,
                            };
    fetch(baseUrl + ':8000/tournament/quit/', {
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
        console.log('Response:', data.code);
        in_tournament = 0;
        if (data.redirect)
            handleRedirect(data.redirect);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function myFunction() {
    // Get the text field
    var copyText = document.getElementById("lobbyCode");

    console.log(copyText.textContent);
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.textContent.substring(12, copyText.textContent.length -3));
  
    // Alert the copied text
  }