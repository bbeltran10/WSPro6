// app.js

// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tagInput = document.getElementById('tag-input');
const errorMsg = document.getElementById('error-msg');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('task-counter');
const filterButtons = document.querySelectorAll('.filters button');
const tagButtons = document.querySelectorAll('.tag-filters button');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentTagFilter = '';

// Helpers
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active' && task.done) return false;
    if (currentFilter === 'completed' && !task.done) return false;
    if (currentTagFilter && task.tag !== currentTagFilter) return false;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.done ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}${task.tag ? ' [' + task.tag + ']' : ''}</span>
      <div>
        <button class="toggle-btn">${task.done ? 'Undo' : 'Done'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Toggle completion
    li.querySelector('.toggle-btn').addEventListener('click', () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  // Update counter
  const activeCount = tasks.filter(task => !task.done).length;
  counter.textContent = `${activeCount} active task${activeCount !== 1 ? 's' : ''}`;
}

// Event Listeners
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const tag = tagInput.value;

  if (!text) {
    errorMsg.textContent = 'Task name cannot be blank';
    return;
  }

  errorMsg.textContent = '';

  const newTask = {
    id: Date.now(),
    text,
    tag,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  tagInput.value = '';
});

// Filter by status
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Filter by tag
tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentTagFilter = btn.dataset.tag;
    renderTasks();
  });
});

// Initial render
renderTasks();// JavaScript Document