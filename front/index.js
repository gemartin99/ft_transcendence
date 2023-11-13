// index.js

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const home = document.getElementById('home');
    const login = document.getElementById('login');
    const app = document.getElementById('app'); // Get the app div


    function updateUrl(path) {
        const newPath = baseurl + path;
        window.history.pushState({ path: newPath }, '', newPath);
    }





    home.addEventListener('click', function () {
        heading.textContent = 'Loading...';
         updateUrl('/home');
         
        fetch(baseurl + ':8000/api/home/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                if (data.message) {
                    // Update different parts of your HTML based on the data
                    app.innerHTML = data.message;
                } else {
                    heading.textContent = 'Error: Invalid response from backend';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                heading.textContent = 'Error: Failed to fetch data from the backend';
            });
    });

    login.addEventListener('click', function () {
        heading.textContent = 'Loading...';
         updateUrl('/login');

        fetch(baseurl + ':8000/api/login/')
            .then(response => response.json())
            .then(data => {
                console.log('Response from backend:', data);

                if (data.title && data.content && data.additionalInfo) {
                    // Update different parts of your HTML based on the data
                    heading.textContent = data.title;
                    app.innerHTML = data.content + '<br>' + data.additionalInfo;
                } else {
                    heading.textContent = 'Error: Invalid response from backend';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                heading.textContent = 'Error: Failed to fetch data from the backend';
            });
    });

    console.log('Hello, World! from JavaScript');
});
