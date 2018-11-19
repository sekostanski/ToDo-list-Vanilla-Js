//-----Variables-----
var titleData = void 0,
    noteData = void 0,
    priorityGroup = void 0,
    checkAll = void 0,
    sortPriority = void 0,
    taskList = void 0,
    addTaskBttn = void 0,
    appTasks = null;

var countTask = 1;

//------Functions------//     
//Build task
function buildTask(title, note, priority, ID) {
    //Main element div
    var currentItem = document.createElement("div");
    currentItem.classList.add("single-task");

    //Checkbox element
    var checkBox = document.createElement("div");
    checkBox.classList.add("single-task__checkbox");
    var checkBoxContent = document.createElement("div");
    checkBoxContent.classList.add("single-task__check-tasks-check");
    var inputCheckbox = document.createElement("input");
    inputCheckbox.classList.add("single-task__check-tasks-checkbox");
    inputCheckbox.setAttribute("id", "task-checkbox" + ID);
    //inputCheckbox.setAttribute("value", "value" + ID);
    inputCheckbox.setAttribute("type", "checkbox");
    var checkboxLabel = document.createElement("label");
    checkboxLabel.setAttribute("for", "task-checkbox" + ID);

    checkBoxContent.appendChild(inputCheckbox);
    checkBoxContent.appendChild(checkboxLabel);
    checkBox.appendChild(checkBoxContent);

    //Content
    var content = document.createElement("div");
    content.classList.add("single-task__content");
    var heading = document.createElement("h4");
    heading.classList.add("single-task__title");
    heading.textContent = title;
    var paragraph = document.createElement("p");
    paragraph.classList.add("single-task__note");
    paragraph.textContent = note;
    content.appendChild(heading);
    content.appendChild(paragraph);

    //Priority
    var priorityContent = document.createElement("div");
    priorityContent.classList.add("single-task__priority");
    var priorityContentGraphic = document.createElement("div");
    priorityContentGraphic.classList.add("single-task__graphic");
    priorityContentGraphic.classList.add(priority);
    var priorityContentText = document.createElement("div");
    priorityContentText.textContent = priority;
    priorityContent.appendChild(priorityContentGraphic);
    priorityContent.appendChild(priorityContentText);

    currentItem.appendChild(checkBox);
    currentItem.appendChild(content);
    currentItem.appendChild(priorityContent);
    taskList.appendChild(currentItem);
}

//Rebuild list
function rebuildList() {
    taskList.innerHTML = "";
    listTasks.task.forEach(function (el) {
        if (el.priority === 1) {
            buildTask(el.title, el.note, "low", el.ID);
        } else if (el.priority === 2) {
            buildTask(el.title, el.note, "medium", el.ID);
        } else if (el.priority === 3) {
            buildTask(el.title, el.note, "high", el.ID);
        }
    });
}
//Check Priority
function checkPriority(selector) {
    var priorityLevel = Array.from(selector);
    var wynik = null;
    for (var i = 0; i < priorityLevel.length; i++) {
        if (priorityLevel[i].checked) {
            wynik = i + 1;
            break;
        }
    };
    switch (wynik) {
        case 1:
            return "low";
            break;
        case 2:
            return "medium";
            break;
        case 3:
            return "high";
            break;
    }
}

//Set Priority
function getPrioritylevel(selector) {
    var priorityLevel = Array.from(selector);
    var wynik = null;
    for (var i = 0; i < priorityLevel.length; i++) {
        if (priorityLevel[i].checked) {
            wynik = i + 1;
            break;
        }
    };
    return wynik;
}

function highestId(selector) {
    var highest = 0;

    selector.forEach(function (el) {
        if (el.ID > highest) {
            highest = el.ID;
        }
    });
    return highest;
}

//ClearInputData
function clearInputs(selector) {
    var checkboxes = Array.from(selector);
    checkboxes[0].checked = "checked";
    titleData.value = "";
    noteData.value = "";
}

//CheckIsEmpty
function isEmpty() {
    if (titleData.value === "" && noteData.value === "") {
        return true;
    } else {
        return false;
    }
}

//------Task constructor------//
//Main controller
function CreateTaskController(task) {
    this.task = [];
}
//Add item to main object
CreateTaskController.prototype.addItem = function (object) {
    this.task.push(object);
};

//check all checkbox
CreateTaskController.prototype.checkAll = function (selector) {

    listItemsCheckboxes = document.querySelectorAll(".task-list input");
    var selectedCheckbox = Array.from(listItemsCheckboxes);

    if (selector.checked) {
        deleteBttn.disbaled = false;
        selector.checked = true;
        selectedCheckbox.map(function (el) {
            el.checked = true;
        });
    } else {
        deleteBttn.disbaled = true;
        selector.checked = false;
        selectedCheckbox.map(function (el) {
            el.checked = false;
        });
    }
};

//Delete task
CreateTaskController.prototype.delete = function (selector) {

    var elementsArray = Array.from(selector);
    elementsArray.map(function (el) {

        if (el.checked) {
            el.parentNode.parentNode.parentNode.remove();
            var elIndex = parseInt(el.getAttribute("id").slice(13));
            listTasks.task.forEach(function (el, i) {
                if (el.ID === elIndex) {
                    listTasks.task.splice(i, 1);
                }
            });
        }
    });
};

//Low priority sort
CreateTaskController.prototype.sortLow = function () {

    return listTasks.task.sort(function (a, b) {
        return a.priority - b.priority;
    });
};

//High priority sort
CreateTaskController.prototype.sortHigh = function () {

    return listTasks.task.sort(function (a, b) {
        return b.priority - a.priority;
    });
};
//Task constructor
function Task(title, note, ID, priority) {
    this.title = title, this.note = note, this.ID = ID, this.priority = priority;
}

//------After DOM content load------//
document.addEventListener("DOMContentLoaded", function (e) {

    titleData = document.querySelector(".app-component__title");
    noteData = document.querySelector(".app-component__note");
    priorityGroup = document.querySelectorAll(".app-component__rating-stars input");
    addTaskBttn = document.querySelector(".app-component__submit");
    taskList = document.querySelector(".task-list");
    checkAll = document.querySelector(".app-component__check-tasks-checkbox");
    checkSingle = document.querySelector(".task-list");
    deleteBttn = document.querySelector(".delete");
    selectPriority = document.querySelector(".app-component__select-options");

    //Initialize main controller
    listTasks = new CreateTaskController();

    //Add task actions
    addTaskBttn.addEventListener("click", function (e) {

        //Check is empty
        if (isEmpty()) {
            alert("Prosze wypełnić przynajmniej jedno pole!");
        } else {

            //Upload data from inputs, create new object with new name variable

            var ID = countTask;
            currentTask = new Task(titleData.value, noteData.value, ID, getPrioritylevel(priorityGroup));
            listTasks.addItem(currentTask);
            var currentTitle = currentTask.title;
            var currentNote = currentTask.note;
            var currentID = currentTask.ID;
            var currentPriority = currentTask.priority;

            //Build single task and add it to markup
            buildTask(currentTitle, currentNote, checkPriority(priorityGroup), currentID);
            
            //Increment object name by variable
            countTask++;

            //Clear options
            clearInputs(priorityGroup);
        }
    });

    //Change all checkbox to "check"
    checkAll.addEventListener("click", function (e) {

        listTasks.checkAll(checkAll);
    });

    //Delete task
    deleteBttn.addEventListener("click", function (e) {

        taskListInputs = document.querySelectorAll(".task-list input");
        listTasks.delete(taskListInputs);
    });

    //Sort by priority level
    selectPriority.addEventListener("change", function () {

        var priorityOptions = selectPriority.options[selectPriority.selectedIndex].text;

        if (priorityOptions === "Lowest priority") {
            listTasks.sortLow();
            taskList.innerHTML = "";
            listTasks.task.forEach(function (el) {
                rebuildList();
            });
        } else if (priorityOptions === "Highest priority") {
            listTasks.sortHigh();
            taskList.innerHTML = "";
            listTasks.task.forEach(function (el) {
                rebuildList();
            });
        }
    });
});