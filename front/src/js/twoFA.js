	        sendButton.addEventListener('click', function() {
	            // Get the text from the input
	            const textValue = textInput.value.trim();
	            console.log('textValue:', textValue);
	            // Make an AJAX request to the backend
	            const formData = new FormData();
				formData.append('totp_code', textValue);

	            fetch("http://localhost:8000/twoFA/checkQR/", {
				    method: 'POST',
				    body: formData,
	            })
	            .then(response => response.json())
	            .then(data => {
	                console.log('Response from backend:', data);

	                // Display the response message
	                responseMessage.textContent = data.message;

	                // If you want to update the QR code based on the response, you can add that logic here
	            })
	            .catch(error => {
	                console.error('Error:', error);
	            });
	        });



function	getQR() {

	console.log('Trying to print online users.');
	const QRimg = document.getElementById('QRimg');

    fetch("http://localhost:8000/twoFA/getQR/", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
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

function	checkAuthCode() {
    const textInput = document.getElementById('textInput');
    const responseMessage = document.getElementById('responseMessage');
	
	const textValue = textInput.value.trim();
	console.log('textValue:', textValue);
	const formData = new FormData();
	formData.append('totp_code', textValue);
	fetch("http://localhost:8000/twoFA/checkQR/", {
	    method: 'POST',
	    body: formData,
	})
	.then(response => response.json())
	.then(data => {
	    console.log('Response from backend:', data);
	    responseMessage.textContent = data.message;
	})
	.catch(error => {
	    console.error('Error:', error);
	});
}