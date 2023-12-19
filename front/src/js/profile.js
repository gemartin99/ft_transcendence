// url = "crazy-pong.com"
url = "localhost"

//baseurl = "http://crazy-pong.com"
baseurl = "http://localhost";

function submitForm(e) {
    // Your custom JavaScript logic goes here
    // const form = document.getElementById('updateUserForm');
    // const formData = new FormData(form);
    const loginForm = document.querySelector("#updateUserForm");
    const formData = new FormData(e.target);

    // Convert form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    // You can now use the formData to send the data using fetch or another AJAX method
    // For example:
    fetch("baseurl +':8000/users/profile/editEvent/'", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data.message);

    })
    .catch((error) => {
        console.error('Error:', error);
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });
}






// function send_login_form(e)  {
//     e.preventDefault();
//     // Lógica para el inicio de sesión mediante AJAX/Fetch
//     const loginForm = document.querySelector("#login");
//     const formData = new FormData(e.target);

//     // Convert form data to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//         formDataObject[key] = value;
//     });
//     console.log('FormDataObject:', formDataObject);
//     fetch(baseurl +':8000/users/login/action/', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json',},
//         credentials: 'include',
//         body: JSON.stringify(formDataObject),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Response:', data.message);
//         console.log('jwttoken:', data.jwtToken)
//         const expirationDate = new Date();
//         expirationDate.setTime(expirationDate.getTime() + (23 * 60 * 60 * 1000));

//         if (data.jwtToken)
//             document.cookie = `jwttoken=${data.jwtToken}; Secure; expires=${expirationDate}; SameSite=None; path=/;`;
//         console.log('jwttoken:', data.jwtToken);


//         if (getCookie('jwttoken')) {
//             set_logged_in_view();
//             setFormMessage(loginForm, "success", "Congratulations you have nice memory");
//             history.pushState(null, null, '/');
//             handleNavLinkAction('/');
//             const socket = new WebSocket('ws://'+ url +':8000/ws/login/?user=' + data.user);
//         }
//         else {
//             set_logged_out_view();
//             setFormMessage(loginForm, "error", "Invalid username/password combination");
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         setFormMessage(loginForm, "error", "Invalid username/password combination");
//     });
// }