function check_form_inputs(input) {
        
    const specialChars = /[<>\"'&]/;
  
    if (specialChars.test(input)) {
        return false;
    } else {
        return true;
    }
}

function comparePass(pass1, pass2) {
        return pass1 === pass2;
}

function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            if (cookieValue == undefined)
                return null;
            return cookieValue;
        }
    }

    return null;
}
