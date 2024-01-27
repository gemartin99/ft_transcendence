var baseurl = window.location.origin;

function searchFriend(event) {
    event.preventDefault();
    var lang = getLang();
    var searchInput = document.getElementById('searchInput');
    var searchTerm = searchInput.value;
    const friendsForm = document.getElementById("message");


    fetch(baseurl + ':8000/friends/addFriend/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        'language': lang,},
        credentials: 'include',
        body: JSON.stringify(searchTerm),
    })
    .then(response => response.json())
    .then(data => {
		if (data.redirect)
		{
			handleRedirect(data.redirect)
		}
        message.textContent = data.message;

    })
    .catch(error => {
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });


    searchInput.value = '';
}