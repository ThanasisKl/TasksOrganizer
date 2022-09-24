import {stringify, v4 as uuidV4} from "uuid";

type Task = {
    id: string
    title: string
    completed: boolean
    createdAt: Date
    date: Date
};
  
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
let date_input = document.querySelector<HTMLInputElement>("#date")!;

const date = new Date();
date_input.value = getCurrentDate();
console.log("lol")

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener("submit", e => {
    e.preventDefault();
  
    if (input?.value.trim() == "" || input?.value == null) return;
    date_input = document.querySelector<HTMLInputElement>("#date")!;
    console.log(date_input.value)

    const newTask: Task = {
      id: uuidV4(),
      title: input.value,
      completed: false,
      createdAt: new Date(),
      date: new Date(date_input.value)
    }

    tasks.push(newTask);
    saveTasks();
  
    addListItem(newTask);
    input.value = "";
  })

function addListItem(task: Task): void {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const p = document.createElement("p");

    const task_date = new Date(task.date);

    checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
        saveTasks();
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    p.textContent = `${task_date.getDate()}-${task_date.getMonth()+1}-${task_date.getFullYear()}`;
    label.append(checkbox, task.title);
    item.append(label);
    item.append(p);
    list?.append(item);
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks))
}
  
function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS")
    if (taskJSON == null) return []
    return JSON.parse(taskJSON)
}

function getCurrentDate(): string{
    const currentDate = new Date();
    const day = new Date().getDate();
    const stringDay = day >= 10 ? `${day}` : `0${day}`;
    const month = new Date().getMonth()+1;
    const stringMonth = month >= 10 ? `${month}` : `0${month}`;
    return `${currentDate.getFullYear()}-${stringMonth}-${stringDay}`;
}