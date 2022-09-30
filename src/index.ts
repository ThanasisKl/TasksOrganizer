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
const addButton = document.getElementById("addBtn") as HTMLButtonElement;
const formDiv = document.getElementById("formDiv") as HTMLDivElement;
let date_input = document.querySelector<HTMLInputElement>("#date")!;

const current_date = new Date();
date_input.value = getCurrentDate();

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

addButton?.addEventListener("click", () => {
    addButton.style.visibility = "hidden";
    formDiv.style.visibility = "visible";
});

form?.addEventListener("submit", event => {
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

function addListItem(task: Task): void {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const span = document.createElement("span");
    const div = document.createElement("div");

    const task_date = new Date(task.date);

    checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
        saveTasks();
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    span.textContent = `${task_date.getDate()}-${task_date.getMonth()+1}-${task_date.getFullYear()}`;
    label.append(checkbox, task.title);
    item.append(label);
    div.append(span);
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

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}
  
function loadTasks(): Task[] {
    return sortTasks();
}

function getCurrentDate(): string{
    const day = (new Date()).getDate();
    const stringDay = day >= 10 ? `${day}` : `0${day}`;
    const month = (new Date()).getMonth()+1;
    const stringMonth = month >= 10 ? `${month}` : `0${month}`;
    return `${(new Date()).getFullYear()}-${stringMonth}-${stringDay}`;
}

function sortTasks(): Task[]{
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];

    let tasks_array = JSON.parse(taskJSON);
    tasks_array.sort(function(a: Task, b: Task) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return tasks_array;
}

function compareTasks(date1: Date,date2: Date): Task_Category{
    date1 = new Date(date1);
    date2 = new Date(date2);
    if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())return Task_Category.TODAY;
    if(date1.getTime() < date2.getTime()) return Task_Category.UPCOMING;
    return Task_Category.BEFORE;
}