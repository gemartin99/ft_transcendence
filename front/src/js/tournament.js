
in_tournament = 0;
function createTournament() {
    console.log("creant torneig");

    const message = { name: document.getElementById("nameTournament").value,
                                n: 4,
                                user: "Usuari 1"
                            };
    fetch('http://localhost:8000/tournament/create/', {
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
        in_tournament = data.code;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateTournament() {
        
    const message = { id: in_tournament,
                            };
    fetch('http://localhost:8000/tournament/update/', {
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
        var body = document.getElementById("bracket");
        body.textContent = JSON.stringify(data);
        console.log('Response:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function joinTournament() {
    console.log("creant torneig");

    const message = {id: document.getElementById("lobbyCode").value,
                            };
    fetch('http://localhost:8000/tournament/join/', {
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
        in_tournament = document.getElementById("lobbyCode").value;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}