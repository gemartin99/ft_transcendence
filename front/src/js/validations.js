    // document.querySelectorAll(".form__input").forEach(inputElement => {
    //     inputElement.addEventListener("blur", e => {
    //         if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 6) {
    //             setInputError(inputElement, "Username must be at least 6 characters in length");
    //         }
    //     });
    // });

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

// function validateJWTCookie() {
//     const jwtToken = getCookie('jwttoken');

//     // Check if the cookie exists and is not empty
//     if (jwtToken) {
//         // Check if the 'Secure' attribute is set
//         const isSecure = document.cookie.includes('Secure');

//         // Check if the expiration time is lower than 23 hours
//         const expirationDate = new Date(getCookieExpiration('jwttoken'));
//         const hoursUntilExpiration = (expirationDate - Date.now()) / (1000 * 60 * 60);
//         console.log('isSecure: ', isSecure);
//         console.log('hours: ', hoursUntilExpiration);
//         return isSecure && hoursUntilExpiration < 23;
//     }

//     return false;
// }

// function getCookieExpiration(cookieName) {
//     const cookieString = document.cookie;
//     const cookies = cookieString.split('; ');

//     for (const cookie of cookies) {
//         const [currentCookieName, currentCookieValue] = cookie.split('=');
//         if (currentCookieName === cookieName) {
//             // Parse the cookie value as a Date
//             return new Date(currentCookieValue);
//         }
//     }

//     return null;
// }