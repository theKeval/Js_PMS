// variable declaration
var login_inputEmail = document.getElementById("loginUnameEmail");
var login_inputPassword = document.getElementById("loginPassword");
var signup_inputUname = document.getElementById("signupUsername");
var signup_inputEmail = document.getElementById("signupEmail");
var signup_inputPassword = document.getElementById("signupPassword");
var signup_inputConfirmPassword = document.getElementById("signupConfirmPassword");
var signup_inputHourlyRate = document.getElementById("signupHourlyRate");


// functions
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--succes", "form__message--error")
    messageElement.classList.add(`form__message--${type}`);
}

function clearFormMessage(formElement) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = "";
    messageElement.classList.remove("form__message--succes", "form__message--error")
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input-error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

function login(loginForm) {
    var succes = false;
    if(login_inputEmail.value == "" || login_inputPassword.value == "") {
        succes = false;
        setFormMessage(loginForm, "error", "Enter email address and password!");
    }

    var loggedInUser = loginUser(login_inputEmail.value, login_inputPassword.value);
    console.log(loggedInUser);
    if(loggedInUser == null) {
        succes = false;
        setFormMessage(loginForm, "error", "Invalid username or password");
    }
    else {
        succes = true;
        saveCurrentUser(loggedInUser);
    }

    return succes;
}

function validateResetPass(loginForm) {
    let success = false;
    if(login_inputEmail.value == "") {
        success = false;
        setFormMessage(loginForm, "error", "Enter email address or username!");
    }else{        
        if(userExists(login_inputEmail.value)) {
            success = true;
            clearFormMessage(loginForm)
        }else{
            success = false;
            setFormMessage(loginForm, "error", "Invalid username or email");
        }

    }

    return success
}
function validateSignupInfo(signupForm) {
    if(signup_inputUname.value == "" || signup_inputEmail.value == "" ||
        signup_inputPassword.value == "" || signup_inputConfirmPassword.value == "" ||
        signup_inputHourlyRate.value == "") {

        setFormMessage(signupForm, "error", "Enter all the data!");
        return false;
    }

    if(!validateEmail(signup_inputEmail.value)) {
        setFormMessage(signupForm, "error", "Enter valid email address!");
        return false;
    }

    if(!signup_inputPassword.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)) {
        setFormMessage(signupForm, "error", "Password must have at least 8 characters, one capital letter,lower case letter, a number and a special character (@, $, !, %, *, ?, &, #, _)");
        return false;
    }
    if(!signup_inputConfirmPassword.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)) {
        setFormMessage(signupForm, "error", "Confirm password must have at least 8 characters, one capital letter,lower case letter, a number and a special character (@, $, !, %, *, ?, &, #, _)");
        return false;
    }

    if(signup_inputPassword.value != signup_inputConfirmPassword.value) {
        setFormMessage(signupForm, "error", "Passwords doesn't match!");
        return false;
    }
    if(!validateEmail(signup_inputEmail.value)) {
        setFormMessage(signupForm, "error", "Enter valid email address!");
        return false;
    }
    if(signup_inputHourlyRate.value == "" || signup_inputEmail.value == "" ||
        signup_inputPassword == "" || signup_inputConfirmPassword == "" ||
        signup_inputHourlyRate == "") {

        setFormMessage(signupForm, "error", "Enter all the data!");
        return false;
    }

    return true;
}

// execution starts when content loaded
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });
    document.querySelector("#forgotPasswordLink").addEventListener("click", e => {
        e.preventDefault();
        if(validateResetPass(loginForm)){
            const title = 'Reset password';
            let userFound  = getUserByNameOrEmail(login_inputEmail.value)
            var randomstring = Math.random().toString(36).slice(-8);
            userFound.password = randomstring;
            updateUser(userFound);
            // MODAL BUTTONS
            const buttons = [
                { // CLOSE WINDOWS
                    label: "OK!",
                    type: 'close',
                    onClick: (modal) => {},
                    triggerClose: true
                }
            ]
            const divContainer = document.createElement("div");
            divContainer.innerHTML = `
                Your new password is <b> ${randomstring} </b>
            `;
            
            showModal(title, divContainer.innerHTML, buttons);
        }

    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        if(login(loginForm)) {
            location.href = "/home/home.html";
        }

    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        if(validateSignupInfo(createAccountForm)) {
            var user = {
                id: generateUniqueId("userId"),
                name: signup_inputUname.value,
                email: signup_inputEmail.value,
                password: signup_inputPassword.value,
                rate: signup_inputHourlyRate.value
            };
            
            addUser(user);
            saveCurrentUser(user);

            // clearing the input fields
            signup_inputUname.value = "";
            signup_inputEmail.value = "";
            signup_inputPassword.value = "";
            signup_inputConfirmPassword.value = "";
            signup_inputHourlyRate.value = "";
    
            // location.replace("/home/home.html");
            location.href = "/home/home.html";
        }
        
    })

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id == "signupUsername" && e.target.value.lenght > 0 && e.target.value.lenght < 10){
                setInputError(inputElement, "Username must have a least 10 characters");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});