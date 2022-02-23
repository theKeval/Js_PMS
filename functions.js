//#region login, logout related functions

var generateUniqueId = (idOfWhat) => {

    // generate User Id
    if(idOfWhat == "userId") {
        var idArr = [];
        getAllUsers().forEach(element => {
            idArr.push(element.id);
        });

        if(idArr.length > 0) {
            return idArr.length + 1;
        }
        else {
            return 1;
        }
    }

    // generate Project Id
    else if(idOfWhat == "projectId") {
        var idArr = [];
        getAllProjects().forEach(element => {
            idArr.push(element.id);
        });

        if(idArr.length > 0) {
            return idArr.length + 1;
        }
        else {
            return 1;
        }
    }

    // generate Task Id
    else if(idOfWhat == "taskId") {
        var idArr = [];
        getAllTasks().forEach(element => {
            idArr.push(element.id);
        });

        if(idArr.length > 0) {
            return idArr.length + 1;
        }
        else {
            return 1;
        }
    }

}

var getAllUsers = () => {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

// todo: optimise this function
var getProjectUsers = (projectId) => {
    var users = [];
    var allUsers = getAllUsers();
    var project = null;
    getAllProjects().forEach(proj => {
        if(proj.id == projectId) {
            project = proj;
        }
    });

    var userIds = project.members;
    userIds.forEach(userId => {
        allUsers.forEach(_user => {
            if(userId === _user.id) {
                users.push(_user);
            }
        });
    });

    return users;
}

var saveCurrentUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    updateUser(user);
}

var getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser"));
}

var updateUser = (user) => {
    let users = getAllUsers();
    const userIndex = users.findIndex(x => x.id == user.id);
    users[userIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));
}

var addUser = (user) => {
    // fetching all users
    var users = getAllUsers();

    // logging the users
    console.log("# of users: " + users.length);
    users.forEach(function(user, index) {
        console.log("[" + index + "]: " + user.id);
    });

    users.push(user);
    console.log("Added user #" + user.id);

    // Saving
    localStorage.setItem("users", JSON.stringify(users));
};

var getUser = (userId) => {

    return getAllUsers().find((user) => userId == user.id)

}

var getUserByNameOrEmail = (unameOrEmail) => {

    return getAllUsers().find((user) => unameOrEmail.toLowerCase() == user.email.toLowerCase() || unameOrEmail.toLowerCase() == user.name.toLowerCase())

}

var validateEmail = (email) => {
    var regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}

var loginUser = (unameOrEmail, password) => {

    var foundUser = null;
    console.log("user: " + unameOrEmail + ", pass: " + password);
    
    if(validateEmail(unameOrEmail)) {
        // email login
        console.log("user entered email");
        // let email = unameOrEmail;

        getAllUsers().forEach( user => {
            console.log(user);
            if(unameOrEmail == user.email && password == user.password) {
                // return logged in user
                foundUser = user;
            }
        });
    }
    else {
        // username login
        console.log("user entered username");
        // let uname = unameOrEmail

        getAllUsers().forEach( user => {
            if(unameOrEmail.toLowerCase() == user.name.toLowerCase() && password == user.password) {
                // return logged in user
                console.log(user);
                foundUser = user;
            }
        })
    }

    return foundUser;
    
}

var logoutCurrentUser = () => {
    localStorage.removeItem("currentUser");
    console.log("User Logout!");
}

var isUserLoggedIn = () => {
    var user = localStorage.getItem("currentUser");
    console.log(user);

    if(user != null && user != "") {
        return true;
    }
    else {
        return false;
    }

}

var getLoggedInUser = () => {
    var user = localStorage.getItem("currentUser");
    console.log(user);

    return user;
}

var userExists = (unameOrEmail) => { 
    const user = getUserByNameOrEmail(unameOrEmail) ;
    return   user && user.name;
}

//#endregion

//#region Projects related functions

var addProject = (project) => {
    // fetching all projects
    var projects = getAllProjects();
    // console.log("# of projects: " + projects.length);

    projects.push(project);
    // console.log("Added project #" + project.id);

    // Saving
    localStorage.setItem("projects", JSON.stringify(projects));
};

var editProject = (project) => {
    let projects = getAllProjects();
    const projectIndex = projects.findIndex(x => x.id == project.id);
    projects[projectIndex] = project;
    localStorage.setItem("projects", JSON.stringify(projects));
}

var getAllProjects = () => {
    return JSON.parse(localStorage.getItem("projects") || "[]");
}

var getProject = (projectId) => {

    return getAllProjects().find((project) => projectId == project.id);

}


var getProjects = (userId) => {
    var userProjects = [];
    getAllProjects().forEach( project => {
        
        console.log("userId: " + userId+ ", members: " + project.members + ", includes: " + project.members.includes(userId));
        
        if(project.members.includes(userId)) {
            userProjects.push(project);
        }
        else if(project.leaderId == userId) {
            userProjects.push(project);
        }
    });

    console.log(userProjects);
    return userProjects;
}

//#endregion

//#region Tasks related functions

var addTask = (task) => {
    // fetching all projects
    var tasks = getAllTasks();
    // console.log("# of projects: " + projects.length);

    tasks.push(task);
    // console.log("Added project #" + project.id);

    // Saving
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
var editTask = (task) => {
    let tasks = getAllTasks();
    const taskIndex = tasks.findIndex(x => x.id == task.id);
    tasks[taskIndex] = task;
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
var getAllTasks = () => {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

var getProjectTasks = (projectId) => {
    var projectTasks = [];
    getAllTasks().forEach( task => {
        if(task.projectId === projectId) {
            projectTasks.push(task);
        }
    });

    console.log(projectTasks);
    return projectTasks;
}

var getTask = (taskId) => {

    return getAllTasks().find((task) => parseInt(taskId) ==  parseInt(task.id));

}

var getTaskCompleted =  (taskId) => {

    return getTask(taskId).status.toLowerCase() === 'completed';
}

//#endregion

