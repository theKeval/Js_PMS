(function() {
    'use strict'

    var loggedInUser = getLoggedInUser();
    if(loggedInUser == null || loggedInUser == "") {
      console.log("logging out");
      location.href = "../index.html";
    }
    else {
      insertNavBar('tasks');
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const projectId = urlSearchParams.get('id');
    const projectObj = getProject(projectId);
    document.getElementById('projectNameTasksLabel').innerText = `Project: ${projectObj.title}` ;
    if(projectObj.status === 'completed'){
      document.getElementById('createNewTask').style.display = 'none'
      document.getElementById('projectNameTasksLabel').innerHTML += ` <i class="fa fa-solid fa-check-circle completedLabel"></i>`
    }
    var tasks = getProjectTasks(projectId);    // getAllTasks();
    var projectUsers = getProjectUsers(projectId);
    
    
        let taskList = document.getElementById("taskList")
    
        // generate UI for showing all the tasks
        tasks.forEach(task => {
            let taskItem = document.createElement('li');
            taskItem.classList.add('taskItem');
            taskItem.classList.add(task.status);
            
            let title = document.createElement('span');
            title.classList.add('title');
            title.innerText = task.title;
    
            let itemContent = document.createElement('div');
            itemContent.classList.add('itemContent');
    
            let p1 = document.createElement('p');
            p1.innerHTML = "<p><b>Task description: </b><span>"+ task.description+"</span></p>";
            itemContent.appendChild(p1);

            let memberAsgnd = document.createElement('p');
            memberAsgnd.innerHTML = `<p><b>Member Asigned: </b>${task.memberName[0].toUpperCase() + task.memberName.slice(1)}</p>`;
            itemContent.appendChild(memberAsgnd);

            let preRequLine = document.createElement('p');
            if(task.preReq && task.preReq !== ''){
              preRequLine.innerHTML = "<p><b>Pre-Requisite Task: </b>"+getTask(parseInt(task.preReq)).title+"</p>";
            }else{
              preRequLine.innerHTML = "<p><b>No Pre-Requisite</b></p>";
            }
            itemContent.appendChild(preRequLine);

            let deadLine = document.createElement('p');
            deadLine.innerHTML = task.status !== 'completed' ? 
            "<p><b> Start date and deadline: </b><br>"+task.startDate + "<b> to </b>" +task.endDate+"</p>" : 
            "<p><b> Start date and completion date: </b><br>"+task.startDate + "<b> to </b>" +task.completionDate+"</p>";
            itemContent.appendChild(deadLine);

            let p3 = document.createElement('p');
            p3.classList = "endBtn"

            if(task.status !== 'completed' && parseInt(task.member) === parseInt(getCurrentUser().id)){
              let editTaskBtn = document.createElement('button');
              editTaskBtn.className = "btn-action editTaskBtn";
              editTaskBtn.title = "Edit task";
              editTaskBtn.innerHTML = '<i class="fa fa-pen fa-lg"></i>';
              editTaskBtn.addEventListener('click', ()=> {showTaskDialog(task);})
              console.log(task.preReq ? getTaskCompleted(task.preReq) : '')
              if(!task.preReq || task.preReq === '' || getTaskCompleted(task.preReq)){
                let completeTaskBtn = document.createElement('button');
                completeTaskBtn.className = "btn-action completeTaskBtn";
                completeTaskBtn.title = "Mark Complete";
                completeTaskBtn.innerHTML = '<i class="fa fa-solid fa-check fa-lg"></i>' // fa-circle-check 
                completeTaskBtn.addEventListener('click', ()=> {showHoursDialog(task);})
                p3.appendChild(completeTaskBtn);
              }
              p3.appendChild(editTaskBtn);
            }else if(task.status !== 'completed'){
              let pendingLabel = document.createElement('div');
              pendingLabel.classList.add('endLabel')
              pendingLabel.innerHTML = '<b>Pending Task <i class="fa-solid fa-clock"></i></b>'
              p3.appendChild(pendingLabel);
            }else{
              let finishedLabel = document.createElement('div');
              finishedLabel.classList = 'endLabel completedLabel';
              finishedLabel.innerHTML = `<b>Finished Task in ${task.hours} hours <i class="fa-solid fa-circle-check"></i></b>`
              p3.appendChild(finishedLabel);
            }
        
            itemContent.appendChild(p3);    
            taskItem.appendChild(title);
            taskItem.appendChild(itemContent);
            taskList.appendChild(taskItem);
     
            
        });

        function validateTaskForm(){
          let validForm = true;
          const tasksTitle = document.getElementById('tasksTitle');
          const tasksDescription = document.getElementById('tasksDescription');
          const tasksStartDate = document.getElementById('tasksStartDate');
          const tasksEndDate = document.getElementById('tasksEndDate');
          const tasksUser = document.getElementById('tasksUser');
          if(tasksTitle.value == ''){
            setInputError(tasksTitle,"Please enter a title");
            validForm = false;
          }else{
            clearInputError(tasksTitle);
            setInputSuccess(tasksTitle);
          }

          if(tasksDescription.value == ''){
            setInputError(tasksDescription,"Please enter a description");
            validForm = false;
          }else{
            clearInputError(tasksDescription);
            setInputSuccess(tasksDescription);
          }

          if(tasksStartDate.value == ''){
            setInputError(tasksStartDate,"Please enter a start date");
            validForm = false;
          }else{
            clearInputError(tasksStartDate);
            setInputSuccess(tasksStartDate);
          }
          
          if(tasksEndDate.value == ''){
            setInputError(tasksEndDate,"Please enter an end date");
            validForm = false;
          }else{
            clearInputError(tasksEndDate);
            setInputSuccess(tasksEndDate);
          }

          if(tasksStartDate.value !== '' && tasksEndDate.value !== '' && new Date(tasksStartDate.value) > new Date(tasksEndDate.value)){
            setInputError(tasksStartDate,"Please enter a start date before the end date");
            validForm = false;
          }else{
            clearInputError(tasksStartDate);
            setInputSuccess(tasksStartDate);
          }
          if(tasksUser.value == ''){
            setInputError(tasksUser,"Please enter an user");
            validForm = false;
          }else{
            clearInputError(tasksUser);
            setInputSuccess(tasksUser);
          }
          return validForm;
        }

        function showTaskDialog(taskDataObject = null) {
          const title = taskDataObject ? 'Edit Task' : 'Create New Task';
          const buttons = [  
            { // SAVE BUTTON
              label: "Save Task",
              onClick: (modal) => {
                if(validateTaskForm()){
                  let taskObj = {
                    id: taskDataObject ? taskDataObject.id : generateUniqueId("taskId"),
                    projectId: projectId,
                    projectTitle: projectObj.title,
                    title: document.getElementById('tasksTitle').value,
                    description: document.getElementById('tasksDescription').value,
                    startDate: document.getElementById('tasksStartDate').value,
                    endDate: document.getElementById('tasksEndDate').value  || '',
                    member: document.getElementById('tasksUser').value,
                    memberName: getUser(document.getElementById('tasksUser').value).name,
                    preReq: document.getElementById('tasksPreReq').value  || '',
                    status: taskDataObject ? taskDataObject.status : 'inProgress',
                    hours: taskDataObject ? taskDataObject.hours : 0,
                    cost: taskDataObject ? taskDataObject.cost : 0,
                    completionDate:''
                  }
                  
                  taskDataObject ? editTask(taskObj) : addTask(taskObj);
                  
                  document.body.removeChild(modal); // CLOSE WINDOWS
                  location.reload();
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
          ];
          
          var dataUserListObject = '', dataTasksList = `<option value=""> --- None ---- </option>`;
          projectUsers.forEach(user => {
              dataUserListObject += ` <option value="${user.id}">${user.name}</option>`;
          });
          getProjectTasks(projectId).forEach(task => {
            dataTasksList += ` <option value="${task.id}">${task.title}</option>`;
          });
          let today = new Date().toISOString().split('T')[0]
          const divContainer = document.createElement("div");
          divContainer.innerHTML = `
              <form class ="form" id="formTask">
                  <div class="form__input-group">
                      <label for="tasksTitle">Task Title</label>
                      <input type="text" id="tasksTitle" class="form__input" autofocus >
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-group">
                      <label for="tasksDescription">Task Description</label>
                      <textarea id="tasksDescription" class="form__input" autofocus rows="3" cols="50"></textarea>  
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-group">
                      <label for="tasksStartDate">Task Start Date</label>
                       <input type="date" id="tasksStartDate" value="${today}" min="${today}" class="form__input" autofocus >
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-group">
                      <label for="tasksEndDate">Task End Date</label>
                       <input type="date" id="tasksEndDate" min="${today}" class="form__input" autofocus >
                      <div class="form__input-error-message"></div>
                  </div>
                  <input type="hidden" id="taskIdHidden">
                  <div class="form__input-group">
                      <label for="tasksUser">Task Assigned User</label>
                      <select class="form__input" id="tasksUser">${dataUserListObject}</select>
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-group">
                      <label for="tasksPreReq">Task Prerequisite</label>
                      <select class="form__input" id="tasksPreReq">${dataTasksList}</select>
                      <div class="form__input-error-message"></div>
                  </div>
              </form>
            `;
    
          showModal(title, divContainer.innerHTML, buttons);

          if(taskDataObject !== null){
            document.getElementById('tasksTitle').value = taskDataObject.title;
            document.getElementById('tasksDescription').value = taskDataObject.description;
            document.getElementById('tasksStartDate').value =taskDataObject.startDate;
            document.getElementById('tasksEndDate').value = taskDataObject.endDate;
            document.getElementById('tasksUser').value = taskDataObject.member;
            document.getElementById('taskIdHidden').value = taskDataObject.id;
            document.getElementById('tasksPreReq').value = taskDataObject.preReq || '';
          }

        }

        function validateHoursForm() {
          let validForm = true;
          const taskHours = document.getElementById('hoursWorked');

          if(taskHours.value == ''){
            setInputError(taskHours, "Please enter number of hours worked on this task!");
            validForm = false;
          }
          else{
            clearInputError(taskHours);
            setInputSuccess(taskHours);
          }

          return validForm;
        }

        // returns all remaining tasks
        function getRemainingTasks() {
          return tasks.filter((task, index, remainingTasks) => {
            if(task.status == 'inProgress') {
              remainingTasks.push(task);
              return remainingTasks;
            }
          });

          // return remainingTasks.length > 0 ? false : true;
        }

        function showHoursDialog(task) {
          const title = "Mark as Complete";

          const divContainer = document.createElement("div");
          divContainer.innerHTML = `
          <form class ="form" id="markDoneForm">
              
              <div class="form__input-group">
                  <label for="hoursWorked">How many hours have you worked on this task?</label>
                  <input type="number" id="hoursWorked" class="form__input" autofocus min="0" step="0.1">
                  <div class="form__input-error-message"></div>
              </div>
              
          </form>`;

          const buttons = [  
            { // SAVE BUTTON
              label: "Mark Complete",
              onClick: (modal) => {
                if(validateHoursForm()){
                  task.hours = parseFloat(document.getElementById('hoursWorked').value);
                  task.cost = task.hours * getUser(task.member).rate;
                  task.status = 'completed';
                  let today = new Date()
                  task.completionDate = today.toISOString().split('T')[0];
                  editTask(task);
                  
                  document.body.removeChild(modal); // CLOSE WINDOWS
                  document.getElementsByClassName('completeTaskBtn')[0].classList.add('completeTaskBtn-hidden');

                  // check whether all task of the current project is completed or not
                  var remainingTasks = getRemainingTasks();
                  if(remainingTasks.length == 0) {
                    // mark the project as complete and calculate the project cost
                    var totalProjectCost = 0;
                    var totalProjectHours = 0;
                    tasks.forEach(task => {
                      let hours = task.hours == '' ? 0 : parseFloat(task.hours);
                      let rate = parseFloat(getUser(task.member).rate);
                      totalProjectCost += (hours * rate);
                      totalProjectHours += hours;
                    })

                    var updatedProject = getProject(projectId);
                    updatedProject.cost = totalProjectCost;
                    updatedProject.hours = totalProjectHours;
                    updatedProject.status = 'completed';

                    editProject(updatedProject);
                  }

                  // reload the page for updated content
                  location.reload();
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
          ];

          showModal(title, divContainer.innerHTML, buttons);

        }
        

        document.addEventListener("DOMContentLoaded", () => {

          document.getElementById("createNewTask").addEventListener('click', () => {showTaskDialog()})
        })
}())


