

function create_tournament(e)  {
    e.preventDefault();
    console.log('creaopum');
    // Lógica para el inicio de sesión mediante AJAX/Fetch
    // const loginForm = document.querySelector("#login");
    // const formData = new FormData(e.target);

    // // Convert form data to a JSON object
    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //     formDataObject[key] = value;
    // });
    // console.log('FormDataObject:', formDataObject);
    // fetch(baseurl +':8000/users/login/action/', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json',},
    //     credentials: 'include',
    //     body: JSON.stringify(formDataObject),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Response:', data.message);
    //     console.log('jwttoken:', data.jwtToken)
    //     const expirationDate = new Date();
    //     expirationDate.setTime(expirationDate.getTime() + (23 * 60 * 60 * 1000));

    //     if (data.jwtToken)
    //         document.cookie = `jwttoken=${data.jwtToken}; Secure; expires=${expirationDate}; SameSite=None; path=/;`;
    //     console.log('jwttoken:', data.jwtToken);


    //     if (getCookie('jwttoken')) {
    //         set_logged_in_view();
    //         setFormMessage(loginForm, "success", "Congratulations you have nice memory");
    //         history.pushState(null, null, '/');
    //         handleNavLinkAction('/');
    //         const socket = new WebSocket('ws://'+ url +':8000/ws/login/?user=' + data.user);
    //     }
    //     else {
    //         set_logged_out_view();
    //         setFormMessage(loginForm, "error", "Invalid username/password combination");
    //     }
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    //     setFormMessage(loginForm, "error", "Invalid username/password combination");
    // });
}