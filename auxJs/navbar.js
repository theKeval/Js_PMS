
let currentUser = getCurrentUser();

function insertNavBar(module = 'none'){
    const div = document.createElement("div");
    div.classList.add("topnav");

    const modules = {
        'projects' :  `<button id="createNewProject" class="menu-actions"  title="Create new project" ><i class="fa fa-folder-plus fa-xl"></i></button>
                       <button id="checkCurrentUsers" class="menu-actions"  title="Check current users" ><i class="fa fa-users fa-xl"></i></button>
                       <button id="checkCurrentTasks" class="menu-actions"  title="My Pending tasks" ><i class="fa fa-list-check fa-lg"></i></button>`,
        'tasks': `<button id="createNewTask" class="menu-actions"  title="Create new task" ><i class="fa-solid fa-calendar-plus fa-xl"></i></i></button>`,
        'none': '',
    }
    const homeHref = {
        'projects' :  `./home.html`,
        'tasks': '../home/home.html',
        'none': '#',
    }

    div.innerHTML = `
        <div class="actions">
            <a class="home-title"  href="${homeHref[module] }">PJ Manager Pro</a>
            ${modules[module] }
        </div>
        
        <div class="actions">
            <p class='user-name'> <span class="user-name">${currentUser.name[0].toUpperCase() + currentUser.name.slice(1)}</span></p>
            <button class="btn-action" id="profileBtn" title="My Profile"><i class="fa fa-user fa-lg user-icon"></i></button>
            <button class="btn-action" id="logOutBtn" title="Log out"><i class="fa-solid fa-right-from-bracket fa-lg"></i></button>
        </div>
    `

    document.body.insertBefore(div, document.body.firstChild);
    
    document.getElementById("profileBtn").addEventListener('click', showProfileDialog)
    document.getElementById("logOutBtn").addEventListener('click', e => {
        console.log("logout called");
        logoutCurrentUser();
        location.href = "../index.html";
    })

}

function validateProfileDialog(){
    let validForm = true;
    const profileUsernameEl = document.getElementById('profileUsername');
    const profileEmailEl = document.getElementById('profileEmail');
    const profileHourlyRateEl = document.getElementById('profileHourlyRate');
    const profilePassCheck = document.getElementById("profilePassCheck");
    const profilePassword = document.getElementById("profilePassword");
    const profileConfirmPassword = document.getElementById("profileConfirmPassword");
    if (profileUsernameEl.value == "" ) {
        setInputError(profileUsernameEl,"Please enter a title")
        validForm = false;
    }else{
        clearInputError(profileUsernameEl);
        setInputSuccess(profileUsernameEl);
    } 
    if (profileEmailEl.value == "" ) {
        setInputError(profileEmailEl,"Please select at least one member")
        validForm = false;
    }else {
        clearInputError(profileEmailEl);
        setInputSuccess(profileEmailEl);
    }
    if (profileHourlyRateEl.value == "" ) {
        setInputError(profileHourlyRateEl,"Please enter a description")
        validForm = false;
    }else{
        clearInputError(profileHourlyRateEl);
        setInputSuccess(profileHourlyRateEl);
    }
    if(profilePassCheck.checked){
        
        if (!profilePassword.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/) ) {
            setInputError(profilePassword,"Password must have at least 8 characters, one capital letter,lower case letter, a number and a special character (@, $, !, %, *, ?, &, #, _)")
            validForm = false;
        }else{
            clearInputError(profilePassword);
            setInputSuccess(profilePassword);
        }
        if (!profileConfirmPassword.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/) ) {
            setInputError(profileConfirmPassword,"Password must have at least 8 characters, one capital letter,lower case letter, a number and a special character (@, $, !, %, *, ?, &, #, _)")
            validForm = false;
        }else{
            clearInputError(profileConfirmPassword);
            setInputSuccess(profileConfirmPassword);
        }
        if(profilePassword.value !== profileConfirmPassword.value){
            validForm = false;
        }
    }
    return validForm;
}

function showProfileDialog(){
    const title = 'Edit Profile'
    const divContainer = document.createElement("div");
    divContainer.innerHTML = `
    <form class ="form id="editAccount">
        <div class="form__input-group">
            <label for="profileUsername">Username</label>
            <input type="text" id="profileUsername" class="form__input" autofocus value="${currentUser.name}">
            <div class="form__input-error-message"></div>
        </div>
        <div class="form__input-group">
            <label for="profileEmail">Email Address</label>
            <input type="email" id="profileEmail" class="form__input" autofocus  value="${currentUser.email}">
            <div class="form__input-error-message"></div>
        </div>
        <div class="form__input-group">
            <label for="profileHourlyRate">Hourly Rate</label>
            <input type="number" id="profileHourlyRate" class="form__input" autofocus  value="${currentUser.rate}">
            <div class="form__input-error-message"></div>
        </div>
        <div class="form__input-group">
            <input type="checkbox" id="profilePassCheck" name="profilePassCheck">
            <label for="profilePassCheck"> Change password ?</label><br>
        </div>
        <div class="form__input-group passGroup form__input-group_hidden">
            <label for="profilePassword">Password</label>
            <input type="password" id="profilePassword" class="form__input" autofocus value="">
            <div class="form__input-error-message"></div>
        </div>
        <div class="form__input-group passGroup form__input-group_hidden">
            <label for="profileConfirmPassword">Confirm Password</label>
            <input type="password" id="profileConfirmPassword" class="form__input" autofocus value="">
            <div class="form__input-error-message"></div>
        </div>
    </form>`;

    const buttons = [  
        { // SAVE BUTTON
          label: "Save Profile",
          onClick: (modal) => {
            // SAVE Profile DATA
            const profileUsernameEl = document.getElementById('profileUsername');
            const profileEmailEl = document.getElementById('profileEmail');
            const profileHourlyRateEl = document.getElementById('profileHourlyRate');
            const profilePassCheck = document.getElementById("profilePassCheck");
            const profilePassword = document.getElementById("profilePassword");
            // SAVE THE FORM
            if(validateProfileDialog()){
                if(profilePassCheck.checked ){
                    currentUser.password = profilePassword.value;
                }
                currentUser.name = profileUsernameEl.value;
                currentUser.email = profileEmailEl.value;
                currentUser.rate = profileHourlyRateEl.value;
                saveCurrentUser(currentUser);
                document.body.removeChild(modal); // CLOSE WINDOWS
            }

          },
          triggerClose: false
        },
        { // CLOSE WINDOWS
          label: "Close",
          type: 'close',
          onClick: (modal) => {},
          triggerClose: true
        }
      ]
    showModal(title, divContainer.innerHTML, buttons);
    document.getElementById("profilePassCheck").addEventListener('click', function(ev){
        if(ev.target.checked){
            document.querySelectorAll('.passGroup').forEach(element=> {element.classList.remove('form__input-group_hidden')});
        }else{
            document.querySelectorAll('.passGroup').forEach(element=> {element.classList.add('form__input-group_hidden')});
        }
    })
}
