
//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

function searchFriend(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input value
    var searchInput = document.getElementById('searchInput');
    var searchTerm = searchInput.value;

    // Now you can use the searchTerm in your JavaScript logic
    console.log('Search Term:', searchTerm);

    fetch(baseurl + ':8000/friends/addFriend/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(searchTerm),
    })
    .then(response => response.json())
    .then(data => {
		if (data.redirect)
		{
		    console.log('Redirect:', data.redirect);
			handleRedirect(data.redirect)
		}
        console.log('Response:', data);

    })
    .catch(error => {
        console.error('Error:', error);
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });


    // Add your logic here to process the searchTerm

    // Clear the input field if needed
    searchInput.value = '';
}