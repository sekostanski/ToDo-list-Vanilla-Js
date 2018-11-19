//-----Variables-----
let titleData,
    noteData,
    priorityGroup,
    checkAll,
    sortPriority,
    taskList,
    addTaskBttn,
    appTasks
            = null;

let countTask = 1;

//------Functions------//     
//Build task
function buildTask(title, note, priority, ID){
    //Main element div
    let currentItem = document.createElement("div");
    currentItem.classList.add("single-task");
    
    //Checkbox element
    let checkBox = document.createElement("div");
    checkBox.classList.add("single-task__checkbox");
    let checkBoxContent = document.createElement("div");
    checkBoxContent.classList.add("single-task__check-tasks-check");
    let inputCheckbox = document.createElement("input");
    inputCheckbox.classList.add("single-task__check-tasks-checkbox");
    inputCheckbox.setAttribute("id", "task-checkbox" + ID);
    //inputCheckbox.setAttribute("value", "value" + ID);
    inputCheckbox.setAttribute("type", "checkbox");
    let checkboxLabel = document.createElement("label");
    checkboxLabel.setAttribute("for", "task-checkbox" + ID );

    checkBoxContent.appendChild(inputCheckbox);
    checkBoxContent.appendChild(checkboxLabel);
    checkBox.appendChild(checkBoxContent);
    
    //Content
    let content = document.createElement("div");
    content.classList.add("single-task__content");
    let heading = document.createElement("h4");
    heading.classList.add("single-task__title");
    heading.textContent = title;
    let paragraph = document.createElement("p");
    paragraph.classList.add("single-task__note");
    paragraph.textContent = note;
    content.appendChild(heading);
    content.appendChild(paragraph);

    //Priority
    let priorityContent = document.createElement("div");
    priorityContent.classList.add("single-task__priority");
    let priorityContentGraphic = document.createElement("div");
    priorityContentGraphic.classList.add("single-task__graphic");
    priorityContentGraphic.classList.add(priority);
    let priorityContentText = document.createElement("div");
    priorityContentText.textContent = priority;
    priorityContent.appendChild(priorityContentGraphic);
    priorityContent.appendChild(priorityContentText);


    currentItem.appendChild(checkBox);
    currentItem.appendChild(content);
    currentItem.appendChild(priorityContent);
    taskList.appendChild(currentItem);
}

//Rebuild list
function rebuildList(){
    taskList.innerHTML = "";
    listTasks.task.forEach(el => {
        if(el.priority === 1){
                buildTask(el.title, el.note, "low" , el.ID);
            } else if(el.priority === 2){
                buildTask(el.title, el.note, "medium" , el.ID);
            } else if(el.priority === 3){
                buildTask(el.title, el.note, "high" , el.ID);
            }
        })
}
//Check Priority
function checkPriority(selector){
    let priorityLevel = Array.from(selector); 
    let wynik = null;
    for(let i = 0; i < priorityLevel.length; i++){
        if(priorityLevel[i].checked){
        wynik =  i + 1;
        break;
        }
    };
    switch(wynik) {
        case 1:
            return "low";
            break;
        case 2:
            return "medium"
            break;
        case 3:
            return "high"
            break
    }
}

//Set Priority
function getPrioritylevel(selector){
    let priorityLevel = Array.from(selector); 
    let wynik = null;
    for(let i = 0; i < priorityLevel.length; i++){
        if(priorityLevel[i].checked){
        wynik =  i + 1;
        break;
        }
    };
    return wynik;  
}

function highestId(selector){
    let highest = 0;

    selector.forEach(el => {
        if(el.ID > highest){
            highest = el.ID;
        }
    })
    return highest;
}

//ClearInputData
function clearInputs(selector){
    let checkboxes = Array.from(selector);
    checkboxes[0].checked = "checked";
    titleData.value = "";
    noteData.value = "";
}

//CheckIsEmpty
function isEmpty(){
    if(titleData.value === "" && noteData.value === ""){
        return true;
    } else {
        return false;
    }
}

//------Task constructor------//
//Main controller
function CreateTaskController(task){
    this.task = [] 
}
//Add item to main object
CreateTaskController.prototype.addItem = function(object){
    this.task.push(object);
}

//check all checkbox
CreateTaskController.prototype.checkAll = function(selector){

    listItemsCheckboxes = document.querySelectorAll(".task-list input");
    let selectedCheckbox = Array.from(listItemsCheckboxes);

    if(selector.checked){
        deleteBttn.disbaled = false;
        selector.checked = true;
        selectedCheckbox.map(el => {
            el.checked = true;
        })    
        } else {
            deleteBttn.disbaled = true;
            selector.checked = false;
            selectedCheckbox.map(el => {
                el.checked = false;
        })
        }
    
}

//Delete task
CreateTaskController.prototype.delete = function(selector){
    
    let elementsArray = Array.from(selector);
    elementsArray.map((el) => {

        if(el.checked){
            el.parentNode.parentNode.parentNode.remove();
            let elIndex = parseInt(el.getAttribute("id").slice(13));
            listTasks.task.forEach((el,i) => {
                if(el.ID === elIndex){
                    listTasks.task.splice(i,1);
                }
            });
        }
    })

}

//Low priority sort
CreateTaskController.prototype.sortLow = function(){
    
    return listTasks.task.sort(function(a,b){return a.priority - b.priority});
    
}

//High priority sort
CreateTaskController.prototype.sortHigh = function(){
    
    return listTasks.task.sort(function(a,b){return b.priority - a.priority});
    
}
//Task constructor
function Task(title, note, ID, priority){
    this.title = title,
    this.note = note,
    this.ID = ID,
    this.priority = priority
}



//------After DOM content load------//
document.addEventListener("DOMContentLoaded", (e) => {

    titleData = document.querySelector(".app-component__title");
    noteData = document.querySelector(".app-component__note");
    priorityGroup = document.querySelectorAll(".app-component__rating-stars input");
    addTaskBttn = document.querySelector(".app-component__submit");
    taskList = document.querySelector(".task-list");
    checkAll = document.querySelector(".app-component__check-tasks-checkbox");
    checkSingle = document.querySelector(".task-list" );
    deleteBttn = document.querySelector(".delete");
    selectPriority = document.querySelector(".app-component__select-options");
    
    
    //Initialize main controller
    listTasks = new CreateTaskController();

    
    //Add task actions
    addTaskBttn.addEventListener("click", (e) => {


        //Check is empty
        if(isEmpty()){
            alert("Prosze wypełnić przynajmniej jedno pole!");
        } else {

        //Upload data from inputs, create new object with new name variable
    
        let ID = countTask;
        currentTask = new Task(titleData.value, noteData.value, ID, getPrioritylevel(priorityGroup));
        listTasks.addItem(currentTask);
        let currentTitle = currentTask.title;
        let currentNote = currentTask.note;
        let currentID = currentTask.ID;
        let currentPriority = currentTask.priority;
            
        //Build single task and add it to markup
        buildTask(currentTitle, currentNote, checkPriority(priorityGroup), currentID );
            
        //Increment object name by variable
        countTask++;
            
        //Clear options
        clearInputs(priorityGroup);
        }
    });    

    //Change all checkbox to "check"
    checkAll.addEventListener("click", (e)=> {

        listTasks.checkAll(checkAll);

    });



    //Delete task
    deleteBttn.addEventListener("click", (e)=> {

        taskListInputs = document.querySelectorAll(".task-list input");
        listTasks.delete(taskListInputs);
        
    })


    //Sort by priority level
    selectPriority.addEventListener("change", ()=> {
        
        let priorityOptions = selectPriority.options[selectPriority.selectedIndex].text;

        if(priorityOptions === "Lowest priority") {
            listTasks.sortLow();
            taskList.innerHTML = "";
            listTasks.task.forEach(el => {

                rebuildList();
            })
        } else if(priorityOptions === "Highest priority") {
            listTasks.sortHigh();
            taskList.innerHTML = "";
            listTasks.task.forEach(el => {

                rebuildList();
            })
        }
        
    })

    
});
