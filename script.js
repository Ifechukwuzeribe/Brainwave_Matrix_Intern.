// Define an object to create new HTML elements
var Element = {
  createNew: function(elemName, parentName, parentIndex, elemText) {
    // Check if all necessary arguments are provided
    if (elemName !== undefined && parentName !== undefined && parentIndex !== undefined) {
      // Check the types of the arguments
      if (typeof elemName === "string" && typeof parentName === "string" && typeof parentIndex === "number") {
          var elem = document.createElement(elemName);
          var parent = document.getElementsByClassName(parentName)[parentIndex];
          parent.appendChild(elem);
          if(elemText !== undefined && typeof elemText == "string"){
            elem.innerHTML = elemText;
          }
      }  else {
          throw new Error("Argument type check failed");
       }
     } else {
        throw new Error("One or more arguments are missing");
    }
  }
};

// Object to store task statistics
var taskStats = {
     totalTasks : 0,
     completedTasks : 0,
     remainingTasks : 0
};

// Object to store references to HTML elements
var htmlElement = {
  taskName : document.getElementById('taskName')
};

// Function to add a new task to the list
function addNew(){
  // Get input and current time
  var taskName = document.getElementById('task-name');
  var today = new Date().toLocaleTimeString();
  var errorBox = document.getElementsByClassName('modal-parent')[1];
  var alertText = document.getElementById('error-text');
  var fullText = taskName.value + '<br/><time>Created : '+today+'</time><button class = "btn-success">Mark as completed</button><button class = "btn-primary">Edit</button><button class = "btn-danger">Remove</button>';

  // Show error if input field is empty
  if(taskName.value == '' || taskName.value == null){
    errorBox.className = 'modal-parent show';
    alertText.innerHTML = 'Input field is empty';
  } else {
    // Add new task
    Element.createNew('li','tasks',0,fullText);     // create new li element with innerHTML equals fullText var
          document.getElementById('total-tasks').innerHTML = count(); // invoke count function to update the value of total tasks
          taskName.value = '';    // make the input blank to avoid re submission
  }
  document.getElementById('tasks-remaining').innerHTML = countRemaining();
}

// Function to remove a task from the list
function addListener(e){
  e.parentNode.parentNode.removeChild(e.parentNode); // remove the parent node of child element
     document.getElementById('total-tasks').innerHTML = count(); // update the total task counter
     document.getElementById('tasks-remaining').innerHTML = countRemaining(); // update the remaining tasks counter
}

// Function to reset the list
function resetList(){
  // Confirm before resetting
  var parent = document.getElementsByClassName('tasks')[0];
  var cancelBtn = document.getElementById('cancel');
  var proceedBtn = document.getElementById('proceed');
  var modalBox = document.getElementsByClassName('modal-parent');
  var listLength = taskStats.totalTasks;
  var alertText = document.getElementById('error-text');

  // Show alert if list is already empty
  if(listLength === 0){
    alertText.innerHTML = 'List is already empty'; // tell user that the list is already empty
    modalBox[1].className = 'modal-parent show'; 
    alertText.innerHTML = 'List is already empty';
  } else {
    // Show confirm box to proceed with reset
    modalBox[2].className = 'modal-parent show';
  }

  // Cancel reset,if user press the cancel button, revert back to previous stage, no deletion will be attempted
  cancelBtn.onclick = function(){
    modalBox[2].className = 'modal-parent hide';
  }

  // Proceed with reset, if user press the proceed button, delete every list item previously added by the user
  proceedBtn.onclick = function(){
    // while loop to remove every child element of parent
    while(parent.firstChild){
      parent.removeChild(parent.firstChild);
    }

    // update the values of counter
    document.getElementById('total-tasks').innerHTML = count();
    document.getElementById('completed-tasks').innerHTML = countCompleted();
    document.getElementById('tasks-remaining').innerHTML = countRemaining();
    modalBox[2].className = 'modal-parent hide'; // hide the confirm box
  }
}

// Function to open edit modal
function openModal(e){
  // Initialize variables
  var that = e;
  var modalBox = document.getElementsByClassName('modal-parent');
  var changeBtn = document.getElementById('edit-btn');
  var errorBox = document.getElementsByClassName('error-box');
  var alertText = document.getElementById('error-text');
  var taskName = document.getElementById('edit-value');
  var previousTask = e.parentNode.innerHTML.split('<')[0];
  var today = new Date().toLocaleTimeString();
  var preserved = taskName.value;

  modalBox[0].className = 'modal-parent show';
  taskName.value = previousTask;

  changeBtn.onclick = function (that){
    if(taskName.value == '' || taskName.value == null){
      modalBox[1].className = 'modal-parent show';
      alertText.innerHTML = 'Please add value in input field';
    } else {
      e.parentNode.innerHTML = taskName.value + '<br/><time>Edited : '+today+'</time><button class = "btn-success" >Mark as completed</button><button class = "btn-primary" >Edit</button><button class = "btn-danger" >Remove</button>';
      modalBox[1].className = 'modal-parent show';
      modalBox[0].className = 'modal-parent hide';
      alertText.innerHTML = 'Value has been changed from ' + previousTask + ' to ' + taskName.value;
      taskName.value = '';
    }
  }
}
// Functions to close modal boxes for editing, errors, and confirmation
function closeModal(){
  var editBox = document.getElementsByClassName('modal-parent')[0];
  editBox.className = 'modal-parent hide';
}
function closeAlert(){
  var errorBox = document.getElementsByClassName('modal-parent')[1];
  errorBox.className = 'modal-parent hide';
}
function closeConfirm(){
  var confirmBox = document.getElementsByClassName('modal-parent')[2];
  confirmBox.className = 'modal-parent hide';
}
// --- edit, error and confirm box close function end --- //

// Function to mark a task as completed
function completed(e){
  e.parentNode.style.cssText += 'pointer-events: none; opacity: 0.9;'; // make the task look inactive
  e.innerHTML = 'completed'; // change button text to 'completed'
  e.parentNode.className = 'has-completed'; // add class to completed task
  e.parentNode.innerHTML = '<del>'+e.parentNode.innerHTML+'</del>'; // strike through the task text
  document.getElementById('completed-tasks').innerHTML = countCompleted(); // update completed tasks counter
  document.getElementById('tasks-remaining').innerHTML = countRemaining(); // update remaining tasks counter
}

// Function to count total tasks
function count(){
  taskStats.totalTasks =  document.getElementsByClassName('tasks')[0].children.length;
  return taskStats.totalTasks;
}

// Function to count completed tasks
function countCompleted(){
  taskStats.completedTasks = document.getElementsByClassName('has-completed').length;
  return taskStats.completedTasks;
}

// Function to count remaining tasks
function countRemaining(){
  taskStats.remainingTasks = taskStats.totalTasks - taskStats.completedTasks;
  return taskStats.remainingTasks;
}

// Function to attach events to elements
function bindEvent(elem, eventName, eventHandler){
  if(elem.addEventListener){
      elem.addEventListener(eventName, eventHandler, true);
  } else if (elem.attachEvent){
      elem.attachEvent('on'+eventName, eventHandler);
  }
}

// Function to get the target element of an event
function getEventTarget(e){
  var event = e || window.event;
  return event.target || event.srcElement;
}

// Function to check if an element has a specific class
function hasClass(selector, match){
  return selector.className.split(" ").indexOf(match) > -1;
}

// Attach event listener to tasks container for click events
bindEvent(document.getElementsByClassName('tasks')[0], 'click', function(e){
  var evt = getEventTarget(e);
  if(evt && hasClass(evt, 'btn-danger')){
    addListener(evt);
  }
  if(evt && hasClass(evt, 'btn-primary')){
    openModal(evt);
  }
  if(evt && hasClass(evt, 'btn-success')){
    completed(evt);
  }
});

// Attach event listener to "Add" button
bindEvent(document.getElementsByClassName('theme-button')[0], 'click', addNew);

// Attach event listener to "Reset" button
bindEvent(document.getElementsByClassName('reset-btn')[0], 'click', resetList);

// Attach event listener to close edit modal
bindEvent(document.getElementsByClassName('modal-close')[0], 'click', closeModal);

// Attach event listener to close error alert
bindEvent(document.getElementsByClassName('error-close')[0], 'click', closeAlert);

// Attach event listener to close error alert with "OKAY" button
bindEvent(document.getElementsByClassName('theme-button-close')[0], 'click', closeAlert);

// Attach event listener to close confirm modal
bindEvent(document.getElementsByClassName('confirm-close')[0], 'click', closeConfirm);

// Attach keypress event listener to input box for adding tasks with Enter key
bindEvent(document.getElementById('task-name'), 'keypress', function(e){
  var x = e.keyCode;
  if(x == 13){ // if Enter key is pressed
    addNew();  // add new task
  }
});

// Attach keydown event listener to body for closing modals with Escape key
bindEvent(document.body, 'keydown', function(e){
  var evt =  e || window.event; // support for older IE versions
  var y = evt.which || evt.keyCode || 0;
  if(y == 27){ // if Escape key is pressed
    closeAlert();
    closeConfirm();
    closeModal();
  }
});