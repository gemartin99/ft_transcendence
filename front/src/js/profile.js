var url = window.location.hostname;
var baseurl = window.location.origin;

function submitForm(e) {
    e.preventDefault();
    const loginForm = document.querySelector("#updateUserForm");
    const formData = new FormData(loginForm);
    const avatarInput = document.getElementById('avatar');
    
    if (avatarInput.files.length > 0) {
        const avatarFile = avatarInput.files[0];
        formData.append('avatar', avatarFile);
    }


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
        setFormMessage(loginForm, "error", data.message);
        }
    })
    .catch(error => {
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });
}
