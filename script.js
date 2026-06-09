const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const themeBtn = document.getElementById("themeBtn");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

let tasks = JSON.parse(localStorage.getItem("studymateTasks")) || [];
let currentFilter = "all";
let searchQuery = "";

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show-menu");
  });
}

if (themeBtn) {
  const savedTheme = localStorage.getItem("studymateTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌙";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    themeBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("studymateTheme", isDark ? "dark" : "light");
  });
}

if (taskForm) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (!taskText) {
      alert("Please enter a task name.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      subject: subjectInput.value,
      deadline: dateInput.value,
      priority: priorityInput.value,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();

    subjectInput.value = "Web Development";
    priorityInput.value = "Low";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.toLowerCase();
    renderTasks();
  });
}

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
      button.classList.add("active-filter");

      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });
}

function saveTasks() {
  localStorage.setItem("studymateTasks", JSON.stringify(tasks));
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" && task.completed) ||
      (currentFilter === "pending" && !task.completed);

    const matchesSearch =
      task.text.toLowerCase().includes(searchQuery) ||
      task.subject.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (emptyMessage) {
    emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";
  }

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;

    taskItem.innerHTML = `
      <div class="task-info">
        <h3>${task.text}</h3>
        <p>Subject: ${task.subject}</p>
        <p>Deadline: ${task.deadline || "No deadline"}</p>
        <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>

      <div class="task-actions">
        <button class="small-btn done-btn" onclick="toggleTask(${task.id})">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button class="small-btn delete-btn" onclick="deleteTask(${task.id})">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  updateStats();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function updateStats() {
  if (!totalTasks || !completedTasks || !pendingTasks) return;

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;

  if (progressText) {
    progressText.textContent = `${progress}%`;
  }

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (successMessage) {
      successMessage.style.display = "block";
    }

    contactForm.reset();
  });
}

renderTasks();