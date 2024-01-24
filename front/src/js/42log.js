var baseUrl = window.location.origin;
var url = window.location.hostname;
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function	checkURLCode(){
	var codeValue = getParameterByName('code');

	if (codeValue !== null) {
	    console.log('Code value:', codeValue);

	    var formDataObject = {
	        code: codeValue
	    };

	    fetch(baseUrl + ':8000/FT_OAuth/42/', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json',
	        },
	        credentials: 'include',
	        body: JSON.stringify(formDataObject),
	    })
	    .then(response => response.json())
	    .then(data => {
	        console.log('Response:', data.message);
	        console.log('jwttoken:', data.jwtToken)
	        const expirationDate = new Date();
	        expirationDate.setTime(expirationDate.getTime() + (23 * 60 * 60 * 1000));

	        if (data.jwtToken)
	            document.cookie = `jwttoken=${data.jwtToken}; Secure; expires=${expirationDate}; SameSite=None; path=/;`;
	        console.log('jwttoken:', data.jwtToken);
	        console.log('datalog42:', data);

	        if (getCookie('jwttoken')) {
	        	if (data.mail2FA == true)
	        	{
	        		handleRedirect('/twoFA/MailVerification/');
	        	}
	        	else if (data.google2FA == true)
	        	{
	        		handleRedirect('/twoFA/GoogleVerification/');
	        	}
	        	else
	        	{
		            set_logged_in_view();
		            history.pushState(null, null, '/');
		            handleNavLinkAction('/');
	        	}
	            const socket = new WebSocket('wss://'+ url +':8000/ws/login/?user=' + data.user);
	        }
	        else {
	        	console.log('pelada historica');
	            set_logged_out_view();
	        }

	    })
	    .catch((error) => {
	        console.error('Error:', error);
	    });
	} else {
	    console.log('No code parameter found in the URL.');
	}
}

checkURLCode();