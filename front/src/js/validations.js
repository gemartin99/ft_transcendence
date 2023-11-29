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