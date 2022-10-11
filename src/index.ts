import {v4 as uuidV4} from "uuid";

type Task = {
    id: string
    title: string
    completed: boolean
    createdAt: Date
    date: Date
};

enum Task_Category {BEFORE,TODAY,UPCOMING};
  
const before_list = document.querySelector<HTMLUListElement>("#before_list");
const today_list = document.querySelector<HTMLUListElement>("#today_list");
const upcoming_list = document.querySelector<HTMLUListElement>("#upcoming_list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const xButton = document.querySelector<HTMLButtonElement>("#x-button");
const addButton = document.getElementById("addBtn") as HTMLButtonElement;
const formDiv = document.getElementById("formDiv") as HTMLDivElement;
let date_input = document.querySelector<HTMLInputElement>("#date")!;

const current_date = new Date();
date_input.value = getCurrentDate();

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

addButton?.addEventListener("click", (event) => {  //when click + button makes the form visible
    event.preventDefault();  // don't refresh the page
    addButton.style.visibility = "hidden";
    formDiv.style.visibility = "visible";
});

xButton?.addEventListener("click", (event) => { // when click x button makes the form invisible
    event.preventDefault();
    addButton.style.visibility = "visible";
    formDiv.style.visibility = "hidden";
});
const deleteBtns = document.getElementsByClassName("deleteBtn") as HTMLCollectionOf<HTMLButtonElement>;
if (deleteBtns != null){
    for(let i=0;i<deleteBtns.length;i++){   // adding event listeners to every delete buttton
        deleteBtns[i].addEventListener("click", () => {
            console.log(deleteTask(deleteBtns[i].id))
        });
    }
}

form?.addEventListener("submit", event => {   // event listener for adding new task
    if (input?.value.trim() == "" || input?.value == null) return;
    date_input = document.querySelector<HTMLInputElement>("#date")!;

    const newTask: Task = {
      id: uuidV4(),
      title: input.value,
      completed: false,
      createdAt: current_date,
      date: new Date(date_input.value)
    }

    tasks.push(newTask);
    sortTasks();
    saveTasks();
  
    addListItem(newTask);
    input.value = "";

    addButton.style.visibility = "visible";
    formDiv.style.visibility = "hidden";
  })

function addListItem(task: Task): void {     // adds new list item in the screen using vanilla js
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const span = document.createElement("span");
    const div = document.createElement("div");
    const button = document.createElement("button");
    const form = document.createElement("form");
    const i = document.createElement("i");
    i.classList.add('fa-solid','fa-trash-can');
    button.type = "submit";
    button.classList.add('deleteBtn');
    button.setAttribute('id', task.id);

    const task_date = new Date(task.date);

    checkbox.addEventListener("change", () => {   // event listener for change in the checkbox
        task.completed = checkbox.checked;
        if(task.completed){
            const taskCompletedSound = new Audio('./sounds/bell-ring.mp3');
            taskCompletedSound.play();
        }
        saveTasks();
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    span.textContent = `${task_date.getDate()}-${task_date.getMonth()+1}-${task_date.getFullYear()}`;
    button.appendChild(i);
    form.appendChild(button);
    label.append(checkbox, task.title);
    item.append(label);
    div.append(span);
    div.append(form);
    item.append(div);
    const category_result = compareTasks(current_date, task.date); 
    if(category_result == Task_Category.BEFORE){
        before_list?.append(item);
    }else if(category_result == Task_Category.TODAY){
        today_list?.append(item);
    }else{
        upcoming_list?.append(item);
    }
}

function saveTasks(): void {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}
  
function loadTasks(): Task[] {
    return sortTasks();
}

function getCurrentDate(): string{    // returns the current date
    const day = (new Date()).getDate();
    const stringDay = day >= 10 ? `${day}` : `0${day}`;
    const month = (new Date()).getMonth()+1;
    const stringMonth = month >= 10 ? `${month}` : `0${month}`;
    return `${(new Date()).getFullYear()}-${stringMonth}-${stringDay}`;
}

function sortTasks(): Task[]{        //sorts the tasks based on date
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];

    let tasks_array = JSON.parse(taskJSON);
    tasks_array.sort(function(a: Task, b: Task) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return tasks_array;
}

function compareTasks(date1: Date,date2: Date): Task_Category{   // compares two dates
    date1 = new Date(date1);
    date2 = new Date(date2);
    if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())return Task_Category.TODAY;
    if(date1.getTime() < date2.getTime()) return Task_Category.UPCOMING;
    return Task_Category.BEFORE;
}

function deleteTask(taskId : string): void{   //deleted a task from local storage
    let tasks = loadTasks();
    console.log(taskId)
    console.log(tasks);
    const newTasks = tasks.filter(task => task.id !== taskId);
    console.log(newTasks);
    localStorage.setItem("TASKS", JSON.stringify(newTasks));
}