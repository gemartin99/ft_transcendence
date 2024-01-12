// url = "crazy-pong.com"
// url = "localhost"
var url = window.location.hostname;

//baseurl = "http://crazy-pong.com"
// baseurl = "http://localhost";
var baseurl = window.location.origin;

// function submitForm(e) {
//     e.preventDefault();
//     const loginForm = document.querySelector("#updateUserForm");
//     const formData = new FormData(e.target);

//     // Convert form data to a JSON object
//     const formDataObject = {};
//     for (const [key, value] of formData.entries()) {
//         // If the value is empty, set it to null
//         formDataObject[key] = value || null;
//     }

//     console.log('formDataObject:', formDataObject);

//     // You can now use the formDataObject to send the data using fetch or another AJAX method
//     fetch(baseurl + ':8000/profile/UpdateInfo/', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         credentials: 'include',
//         body: JSON.stringify(formDataObject),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Response:', data.message);
//         setFormMessage(loginForm, "error", data.message);

//     })
//     .catch(error => {
//         console.error('Error:', error);
//         setFormMessage(loginForm, "error", "Invalid username/password combination");
//     });
// }

function submitForm(e) {
    e.preventDefault();
    const loginForm = document.querySelector("#updateUserForm");
    const formData = new FormData(loginForm);
    const avatarInput = document.getElementById('avatar');
    
    if (avatarInput.files.length > 0) {
        const avatarFile = avatarInput.files[0];
        formData.append('avatar', avatarFile);
    }

    // You can now use the formData object to send the data using fetch or another AJAX method
    var lang = getLang()
    fetch(baseurl + ':8000/profile/UpdateInfo/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'language': lang,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirect) {
            handleRedirect(data.redirect);
            return ;
        }
        else{
        console.log('Response:', data.message);
        setFormMessage(loginForm, "error", data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });
}
