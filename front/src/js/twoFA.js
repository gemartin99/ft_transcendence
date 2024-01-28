var baseUrl = window.location.origin;

function	checkGoogleAuthCode(event) {
    var concatenatedValue = "";
    var inputs = document.getElementsByClassName('code-input');
    for (var i = 0; i < inputs.length; i++) {
        concatenatedValue += inputs[i].value;
    }
    const formData = new FormData();
	formData.append('totp_code', concatenatedValue);
    var lang = getLang()
	fetch(baseUrl + ":8000/twoFA/verifyGoogleCode/", {
	    method: 'POST',
	    body: formData,
	    credentials: 'include',
		headers: {
            'language': lang,
        },
	})
	.then(response => response.json())
	.then(data => {
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
        console.error("Error:", error);
	});
}

function	activateGoogle2FA(event) {
    var lang = getLang()
	fetch(baseUrl + ":8000/twoFA/google2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
		headers: {
            'language': lang,
        },
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
	})
	.catch(error => {
        console.error("Error:", error);
	});
}

function	activateMail2FA() {
    var lang = getLang()
	fetch(baseUrl + ":8000/twoFA/mail2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
		headers: {
            'language': lang,
        },
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
	})
	.catch(error => {
        console.error("Error:", error);
	});
}

function	getQR() {

	const QRimg = document.getElementById('QRimg');

    var lang = getLang()
    fetch(baseUrl + ":8000/twoFA/getQR/", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
		headers: {
            'language': lang,
        },
    })
	.then(response => response.json())
	.then(data => {
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
		    }
		}
	})
	.catch(error => {
        console.error("Error:", error);
	});
}

function	checkMailCode(event) {
    var lang = getLang()
    var concatenatedValue = "";
    var inputs = document.getElementsByClassName('code-input');
    for (var i = 0; i < inputs.length; i++) {
        concatenatedValue += inputs[i].value;
    }
    const formData = new FormData();
	formData.append('concatenatedValue', concatenatedValue);
	fetch(baseUrl + ":8000/twoFA/verifyMailCode/", {
	    method: 'POST',
	    body: formData,
	    credentials: 'include',
		headers: {
            'language': lang,
        },
	})
	.then(response => response.json())
	.then(data => {
		if (data.redirect)
		{
			handleRedirect(data.redirect)
		}
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
        console.error("Error:", error);
	});
}

function	unsetTwoFactor(event) {
    var lang = getLang()
	fetch(baseUrl + ":8000/twoFA/disable/", {
	    method: 'POST',
	    credentials: 'include',
		headers: {
            'language': lang,
        },
	})
	.then(response => response.json())
	.then(data => {
		if (data.redirect)
		{
			handleRedirect(data.redirect)
		}
		if (data.error)
	    {
	    	 document.getElementById('error-message').innerHTML = data.error;
	    }
	})
	.catch(error => {
        console.error("Error:", error);
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

function autoFill(firstInput) {
    // Get the pasted value
    const pastedValue = (event.clipboardData || window.clipboardData).getData('text');

    // Split the pasted value into individual digits
    const digits = pastedValue.split('');

    // Set the values for each input element
    for (let i = 0; i < digits.length && i < 6; i++) {
        const input = document.querySelector(`[name="digit${i + 1}"]`);
        if (input) {
            input.value = digits[i];
        }
    }
    event.preventDefault();
}