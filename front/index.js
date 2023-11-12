// index.js
baseurl = "http://crazy-pong.com"

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const changeColorButton = document.getElementById('changeColorButton');

    function getRandomColor() {
        // ... (as before)
    }

    changeColorButton.addEventListener('click', function () {
        heading.textContent = 'Loading...';

        fetch(baseurl + ':8000/api/hello/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                // Assuming the backend sends a message field in the response
                if (data.message) {
                    heading.textContent = data.message;
                } else {
                    heading.textContent = 'Error: Invalid response from backend';
                }

                // ... (rest of the code)
            })
            .catch(error => {
                console.error('Error:', error);
                heading.textContent = 'Error: Failed to fetch data from the backend';
            });
    });

    console.log('Hello, World! from JavaScript');
});