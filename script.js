const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addTaskBtn.addEventListener("click", addTask);
filterButtons.forEach(btn => btn.addEventListener("click", changeFilter));

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return alert("Please enter a task");

    tasks.push({
        id: Date.now(),
        text: taskText,
        priority: prioritySelect.value,
        completed: false
    });

    saveAndRender();
    taskInput.value = "";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks
        .filter(task => {
            if (currentFilter === "completed") return task.completed;
            if (currentFilter === "pending") return !task.completed;
            return true;
        })
        .forEach(task => {
            const li = document.createElement("li");
            li.className = `task ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <div class="info">
                    <strong>${task.text}</strong>
                    <div class="priority">Priority: ${task.priority}</div>
                </div>
                <div>
                    <button onclick="toggleTask(${task.id})">✔</button>
                    <button onclick="deleteTask(${task.id})">🗑</button>
                </div>
            `;

            taskList.appendChild(li);
        });
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function changeFilter(e) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    renderTasks();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

renderTasks();
