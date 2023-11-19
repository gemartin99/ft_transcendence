baseurl = "http://crazy-pong.com"
//baseurl = "http://localhost";

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.getElementById('helloHeading');
    const test_sockets = document.getElementById('test_sockets'); // Get the app div

    const socket = new WebSocket('ws://crazy-pong.com:8000/ws/game/');


    test_sockets.addEventListener('click', function () {
             heading.textContent = 'noo';

            socket.onopen = (event) => {
                console.log('WebSocket connection opened:', event);
            };
            
            socket.onmessage = (event) => {
                heading.textContent = event.data;
                console.log('WebSocket message received:', event.data);
        
            };
            
            socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event);
            };
            
            //const message = { message: 'buscar' };
            //socket.send(JSON.stringify(message));
            socket.send('buscar')
            
            });


    console.log('Hello, World! from JavaScript!');
});
