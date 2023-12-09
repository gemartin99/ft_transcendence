function	getQR() {

	console.log('Trying to print online users.');
	const QRimg = document.getElementById('QRimg');

    fetch("http://localhost:8000/twoFA/getQR/", {
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

function	checkAuthCode(event) {
	event.preventDefault();
    const textInput = document.getElementById('textInput');
	const textValue = textInput.value.trim();
	console.log('textValue:', textValue);
	const formData = new FormData();
	formData.append('totp_code', textValue);
	fetch("http://localhost:8000/twoFA/checkQR/", {
	    method: 'POST',
	    body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function	activateGoogle2FA(event) {
	fetch("http://localhost:8000/twoFA/enable_google2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}

function	activateMail2FA(event) {
	fetch("http://localhost:8000/twoFA/enable_mail2FA/", {
	    method: 'POST',
	    // body: formData,
	    credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	    if (data.message == 'activateGoogle2FA ok')
	    {
	    	
	    }
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}






