var url = window.location.hostname;
var baseurl = window.location.origin;

function submitForm(e) {
    e.preventDefault();
    const loginForm = document.querySelector("#updateUserForm");
    const formData = new FormData(loginForm);
    var lang = getLang()
    const avatarInput = document.getElementById('avatar');

    if (avatarInput.files.length > 0) {
        const avatarFile = avatarInput.files[0];
        const fileType = avatarFile.type;

        if (fileType === 'image/png') {
            formData.append('avatar', avatarFile);
        } else {
            if (lang == 'en')
                alert('Please upload a .png file');
            else if (lang == 'es')
                alert('Por favor sube un archivo .png');
            else if (lang == 'pt')
                alert('Por favor, envie um arquivo .png');
        }
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
