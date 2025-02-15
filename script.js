function addTask() {
    let taskText = document.getElementById("new-task").value;
    let taskDate = document.getElementById("task-date").value;
    let taskStart = document.getElementById("task-start").value;
    let taskEnd = document.getElementById("task-end").value;

    if (taskText.trim() === "" || taskDate === "" || taskStart === "" || taskEnd === "") return;

    let task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.dataset.id = Date.now(); // Einzigartige ID für Speicherung
    task.innerHTML = `<strong>${taskText}</strong><br>📅 ${taskDate} 🕒 ${taskStart} - ${taskEnd} 
                      <button onclick="deleteTask(this)">❌</button>`;
    task.addEventListener("dragstart", drag);
    task.addEventListener("dragend", dragEnd);

    document.getElementById("offen").appendChild(task);
    saveTasks();
    document.getElementById("new-task").value = "";
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    event.target.classList.add("dragging");
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text/plain");
    let task = document.querySelector(`.task[data-id='${taskId}']`);

    if (task && event.target.classList.contains("task-list")) {
        event.target.appendChild(task);
        saveTasks();
    }
}

function saveTasks() {
    let tasks = {
        offen: document.getElementById("offen").innerHTML,
        warten: document.getElementById("warten").innerHTML,
        erledigt: document.getElementById("erledigt").innerHTML
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        document.getElementById("offen").innerHTML = tasks.offen;
        document.getElementById("warten").innerHTML = tasks.warten;
        document.getElementById("erledigt").innerHTML = tasks.erledigt;

        document.querySelectorAll(".task").forEach(task => {
            task.draggable = true;
            task.dataset.id = task.dataset.id || Date.now();
            task.addEventListener("dragstart", drag);
            task.addEventListener("dragend", dragEnd);
        });
    }
}

// 🔹 Aufgaben speichern als Datei (JSON-Export)
function saveToFile() {
    let tasks = {
        offen: document.getElementById("offen").innerHTML,
        warten: document.getElementById("warten").innerHTML,
        erledigt: document.getElementById("erledigt").innerHTML
    };

    let blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.json";
    a.click();
}

// 🔹 Aufgaben aus Datei laden
function loadFromFile(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let tasks = JSON.parse(e.target.result);
        document.getElementById("offen").innerHTML = tasks.offen;
        document.getElementById("warten").innerHTML = tasks.warten;
        document.getElementById("erledigt").innerHTML = tasks.erledigt;
        addDragEvents();
        saveTasks();
    };
    reader.readAsText(file);
}

function loadFromFileButton() {
    document.getElementById("file-input").click();
}

// 🔹 Event-Listener für Drag & Drop neu setzen nach Laden der Daten
function addDragEvents() {
    document.querySelectorAll(".task").forEach(task => {
        task.draggable = true;
        task.addEventListener("dragstart", drag);
        task.addEventListener("dragend", dragEnd);
    });
}

// 🔹 Lade Aufgaben aus `localStorage` beim Start
document.addEventListener("DOMContentLoaded", loadTasks);
