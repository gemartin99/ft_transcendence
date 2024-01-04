
in_tournament = 0;
function createTournament(e) {
    console.log("creant torneig");
    e.preventDefault();
    const message = { name: document.getElementById("nameTournament").value,
                                n: document.getElementById("players").value,
                                points: document.getElementById("points").value,
                                ia: document.getElementById('fillAI').checked
                            };
    console.log(message);
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
        if (data.redirect)
            handleRedirect(data.redirect);
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
        var bracketContent = document.getElementById("bracket-content");
        bracketContent.innerHTML = data.content;
        var tournament_id = document.getElementById("lobbyCode");
        tournament_id.textContent = "LOBBY CODE: " + data.id;
        console.log('id:', data.id);
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

function handleSwitchClick() {
    const switchElement = document.getElementById('fillAI');
    const isChecked = switchElement.checked;

    console.log('switch:',document.getElementById('fillAI').checked);
    // Call your custom function with the switch state
    // yourCustomFunction(isChecked);
}
