const addBtn = document.getElementById("add");
const input = document.getElementById("input");

const columns = [
  { id: "itemsBack", name: "Backlog" },
  { id: "itemsIP", name: "In Progress" },
  { id: "itemsTest", name: "Testing" },
  { id: "itemsFin", name: "Finished" },
];

// Save tasks to local storage
function saveTasks() {
  const tasks = columns.map(({ id }) => {
    const columnTasks = Array.from(document.getElementById(id).children).map(task => ({
      id: task.dataset.id,
      text: task.innerText,
      column: id,
      className: task.className,
    }));
    return { id, tasks: columnTasks };
  });
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  console.log("Tasks saved to Local Storage");
}

// Load tasks from local storage
function loadTasks() {
  const savedData = JSON.parse(localStorage.getItem("kanbanTasks"));
  if (!savedData) return;

  savedData.forEach(({ id, tasks }) => {
    const column = document.getElementById(id);
    tasks.forEach(({ id, text, className }) => {
      const task = createTaskElement(text, id, className);
      column.appendChild(task);
    });
  });
  console.log("Tasks loaded from Local Storage");
}

// Generate unique ID
function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create task element
function createTaskElement(text, id = generateId(), className = "paragraph-styling") {
  const task = document.createElement("p");
  task.className = className;
  task.innerText = text;
  task.dataset.id = id;

  // Add task events
  addTaskEvents(task);
  return task;
}

// Add task events
function addTaskEvents(task) {
  // Move to the next column
  task.addEventListener("click", function () {
    const parentColumnId = this.parentNode.id;
    const currentIndex = columns.findIndex(col => col.id === parentColumnId);
    if (currentIndex < columns.length - 1) {
      const nextColumnId = columns[currentIndex + 1].id;
      document.getElementById(nextColumnId).appendChild(this);
      saveTasks();
      console.log(`Task moved to ${columns[currentIndex + 1].name}`);
    }
  });

  // Delete task with confirmation
  task.addEventListener("dblclick", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      this.remove();
      saveTasks();
      console.log("Task deleted");
    }
  });
}

// Add new task
addBtn.addEventListener("click", function () {
  const text = input.value.trim();
  if (text === "") {
    alert("Task cannot be empty!");
    return;
  }
  const newTask = createTaskElement(text);
  document.getElementById("itemsBack").appendChild(newTask);
  input.value = "";
  saveTasks();
  console.log("Task added to Backlog");
});

// Load tasks when the page loads
loadTasks();