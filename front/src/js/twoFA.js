var baseUrl = window.location.origin;

function	checkGoogleAuthCode(event) {
    var concatenatedValue = "";
    var inputs = document.getElementsByClassName('code-input');
    for (var i = 0; i < inputs.length; i++) {
        concatenatedValue += inputs[i].value;
    }
    const formData = new FormData();
	formData.append('totp_code', concatenatedValue);
	fetch(baseUrl + ":8000/twoFA/verifyGoogleCode/", {
	    method: 'POST',
	    body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	    if (data.message == "2fa activated ok")
	    {
	    	set_logged_in_view();
	    	handleRedirect('/');
	    }
	    else if (data.message == "ok")   
	    {
	    	var element = document.getElementById('steep2');
	    	if (element != null){
	    		element.style.display = 'none';
	    		element = document.getElementById('steep3');	
	    		element.style.display = 'block';
	    	}
	    }
	    else if (data.error)
	    {
	    	 document.getElementById('error-message').innerHTML = data.error;
	    }
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function	activateGoogle2FA(event) {
	fetch(baseUrl + ":8000/twoFA/google2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (data.message == "ok")   
		{
			var element = document.getElementById('steep1');	
			element.style.display = 'none';
			element = document.getElementById('steep2');	
			element.style.display = 'block';
		}
	    console.log('Response from backend:', data);
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function	activateMail2FA() {
	fetch(baseUrl + ":8000/twoFA/mail2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	    if (data.message == "ok")   
	    {
	    	var element = document.getElementById('steep1');	
	    	element.style.display = 'none';
	    	element = document.getElementById('steep2');	
	    	element.style.display = 'block';
	    }
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

// function	checkAuthCode(event) { //esto en principio ya no es valido
// 	event.preventDefault();
// 	console.log('hola');
// 	const codeInputs = document.querySelectorAll('#twoFactorAuthForm .code-input');

// 	// Extract values from each input and concatenate them into a single string
// 	const textValue = Array.from(codeInputs)
// 		.map(input => input.value.trim())
// 		.join('');
// 	console.log('textValue:', textValue);
// 	const formData = new FormData();
// 	formData.append('totp_code', textValue);

function	getQR() {

	console.log('Trying to print online users.');
	const QRimg = document.getElementById('QRimg');

    fetch(baseUrl + ":8000/twoFA/getQR/", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
    })
	.then(response => response.json())
	.then(data => {
		console.log('Response from backend:', data);
		if (QRimg) {
		    const qr = new QRious({
		        element: QRimg,
		        value: data.provisioning_url,
		        size: 300,
		    });
		    if (data.provisioning_url) {
			  var element = document.getElementById('steep1');	
			  element.style.display = 'none';
			  element = document.getElementById('steep2');	
			  element.style.display = 'block';
		      console.log(data.provisioning_url);
		    } else {
		      console.log('Invalid response from backend');
		    }
		}
	})
	.catch(error => {
	console.error('Error:', error);
	});
}

function	checkMailCode(event) {
    var concatenatedValue = "";
    var inputs = document.getElementsByClassName('code-input');
    for (var i = 0; i < inputs.length; i++) {
        concatenatedValue += inputs[i].value;
    }
    const formData = new FormData();
    console.log('chekmailcodeuuuu');
	formData.append('concatenatedValue', concatenatedValue);
	fetch(baseUrl + ":8000/twoFA/verifyMailCode/", {
	    method: 'POST',
	    body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (data.redirect)
		{
		    console.log('Redirect:', data.redirect);
			handleRedirect(data.redirect)
		}
	    console.log('Response from backend:', data);
	   	if (data.message == "ok")   
	    {
	    	var element = document.getElementById('steep1');	
	    	element.style.display = 'none';
	    	element = document.getElementById('steep2');	
	    	element.style.display = 'none';
	    	element = document.getElementById('steep3');	
	    	element.style.display = 'block';
	    }
	   	else if (data.error)
	    {
	    	 document.getElementById('error-message').innerHTML = data.error;
	    }
	    if (data.message == '2fa activated ok')
	    {
	    	set_logged_in_view();
	    	handleRedirect('/');
	    }
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function	unsetTwoFactor(event) {
	fetch(baseUrl + ":8000/twoFA/disable/", {
	    method: 'POST',
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (data.redirect)
		{
		    console.log('Redirect:', data.redirect);
			handleRedirect(data.redirect)
		}
	    console.log('Response from backend:', data);
		if (data.error)
	    {
	    	 document.getElementById('error-message').innerHTML = data.error;
	    }
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function moveToNextInput(currentInput) {
    const maxLength = parseInt(currentInput.getAttribute('maxlength'), 10);
    const currentLength = currentInput.value.length;

    if (currentLength === maxLength) {
        const nextInput = currentInput.nextElementSibling;

        if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
            // Check if the next input is non-empty
            if (nextInput.value.trim() !== '') {
                // Clear the content of the next input
                nextInput.value = '';
            }

            // Focus on the next input
            nextInput.focus();
        }
    }
}
