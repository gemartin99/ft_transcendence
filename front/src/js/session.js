// This function have to check for the cookie, and ask to the backend if session is valid one
// It will respond true or false, dependly if we have valid ot not valid session.
function have_valid_session()
{
    fetch(baseUrl + ':8000/users/checkSession//', {
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
    	if (data.Session == 'True')
    		return true;
    	return false;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function set_logged_in_view()
{
	// Hide elements only visible for logged out users
	var elements = document.getElementsByClassName("lo");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].style.setProperty('display', 'none', 'important');
	}
	// Show elements visible for logged in users
	elements = document.getElementsByClassName("li");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].style.display = 'block';
	}
}

function set_logged_out_view()
{
	// Hide elements only visible for logged out users
	var elements = document.getElementsByClassName("li");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].style.setProperty('display', 'none', 'important');
	}
	// Show elements visible for logged in users
	elements = document.getElementsByClassName("lo");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].style.display = 'block';
	}
}

document.addEventListener('DOMContentLoaded', function () {
   if (have_valid_session() == true){
   	set_logged_in_view()
   }
   else{
   	set_logged_out_view()
   }
});