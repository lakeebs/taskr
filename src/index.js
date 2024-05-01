import './style.css';
import { createAllTasksContent } from './content-all-tasks.js';
import { updateTotalTasks } from './add-task-project.js';
import { createTodayContent } from './content-today.js';
import { createOverdueContent } from './content-overdue.js';
import { createProjectContent } from './content-project.js';
import { addProjectInput, cancelProject, submitProject } from './form-project.js';
import { sidebarDock } from './functions-sidebar-dock.js';
import { projectFunctions } from './functions-sidebar.js';
import { mainFunctions } from './functions-main.js';
import { selectTasksOption } from './form-task.js';
import { sampleContent, resetDemo } from './stored-data.js';
import './form-task.js';

/*
- Slide animation for dock
- 2s highlight to newly added tasks and scroll window down to added location
- Undo delete function
*/

const tasksContainer = document.querySelector('.tasks-container');
const title = document.querySelector('.title-bar h2');
const allClearImg = document.querySelector('.all-clear');

// Theme toggle
const savedTheme = localStorage.getItem('theme');
const themeToggle = document.querySelector('#switch-checkbox');

// Apply saved theme or default theme when page loads
if (savedTheme) {
  if (savedTheme === 'theme-light') {
    themeToggle.checked = false;
  } else {
    themeToggle.checked = true;
  }

  setTheme(savedTheme);
} else {
  setTheme('theme-dark');
  themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    setTheme('theme-dark');
  } else {
    setTheme('theme-light');
  }
});

function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
}

// All Tasks button
const allTasksBtn = document.querySelector('button.all-tasks');
export function showAllTasks() {
  const { tasksList, tasks } = createAllTasksContent();

  // Create All Tasks title
  title.innerHTML = 'All tasks' + '<span>(' + tasks.length + ')</span>';

  // If empty, show 'all clear' image
  allClearImg.style.display = tasks.length ? 'none' : 'block';

  // Add 'current' class to button
  const buttons = document.querySelectorAll('.tasks button');
  buttons.forEach(button => button.classList.remove('current'));

  allTasksBtn.classList.add('current');
  localStorage.setItem('currentButton', '.all-tasks');

  updateTotalTasks();
  tasksContainer.innerHTML = '';
  tasksContainer.appendChild(tasksList);
}

// All tasks button click event
allTasksBtn.addEventListener('click', () => {
  showAllTasks();
  selectTasksOption();
});

// Today button
const todayBtn = document.querySelector('button.today-tasks');
export function showTodayTasks() {
  const { tasksList, todayTasks } = createTodayContent();

  // Create Today title
  title.innerHTML = 'Today' + '<span>(' + todayTasks.length + ')</span>';

  // If empty, show 'all clear' image
  allClearImg.style.display = todayTasks.length ? 'none' : 'block';

  // Add 'current' class to button
  const buttons = document.querySelectorAll('.tasks button');
  buttons.forEach(button => button.classList.remove('current'));

  todayBtn.classList.add('current');
  localStorage.setItem('currentButton', '.today-tasks');

  updateTotalTasks();
  tasksContainer.innerHTML = '';
  tasksContainer.appendChild(tasksList);
}

// Today button click event
todayBtn.addEventListener('click', () => {
  showTodayTasks();
  selectTasksOption();
});

// Overdue Tasks button
const overdueBtn = document.querySelector('button.overdue-tasks');
export function showOverdueTasks() {
  const { tasksList, overdueTasks } = createOverdueContent();

  // Create Overdue title
  title.innerHTML = 'Overdue Tasks' + '<span>(' + overdueTasks.length + ')</span>';

  // If empty, show 'all clear' image
  allClearImg.style.display = overdueTasks.length ? 'none' : 'block';

  // Add 'current' class to button
  const buttons = document.querySelectorAll('.tasks button');
  buttons.forEach(button => button.classList.remove('current'));

  overdueBtn.classList.add('current');
  localStorage.setItem('currentButton', '.overdue-tasks');

  updateTotalTasks();
  tasksContainer.innerHTML = '';
  tasksContainer.appendChild(tasksList);
}

// Overdue button click event
overdueBtn.addEventListener('click', () => {
  showOverdueTasks();
  selectTasksOption();
});

// Project button
export function showProject(projectName) {
  const { tasksList, project } = createProjectContent(projectName);

  // Create Project title
  title.innerHTML = projectName + '<span>(' + project.tasks.length + ')</span>';

  // If empty, show 'all clear' image
  allClearImg.style.display = project.tasks.length ? 'none' : 'block';

  // Add 'current' class to button
  const buttons = document.querySelectorAll('.tasks button');
  buttons.forEach(button => button.classList.remove('current'));

  const projectBtnNames = document.querySelectorAll('button.project .project-name');
  let projectBtn;

  projectBtnNames.forEach(name => {
    if (name.textContent === projectName) {
      projectBtn = name.closest('button.project');
    }
  });

  projectBtn.classList.add('current');
  const projectSlug = projectName.toLowerCase().replace(/\s/g, "-");
  localStorage.setItem('currentButton', '.project-' + projectSlug);

  updateTotalTasks();
  tasksContainer.innerHTML = '';
  tasksContainer.appendChild(tasksList);
}

// Projects list functions
const projectList = document.querySelector('ul.projects-list');
projectList.addEventListener('click', projectFunctions);

// Add project input box
const addProjectBtn = document.querySelector('button.add-project');
addProjectBtn.addEventListener('click', addProjectInput);

// Cancel project
const cancelProjectBtn = document.querySelector('button.cancel-project');
cancelProjectBtn.addEventListener('click', cancelProject);

// Submit project
const projectContainer = document.querySelector('.add-project-container');
projectContainer.addEventListener('keydown', (e) => submitProject(e));

// Sidebar Dock
const container = document.querySelector('#container');
container.addEventListener('click', (e) => sidebarDock(e));

// Main
const main = document.querySelector('main');
main.addEventListener('click', (e) => mainFunctions(e));

// Reset demo
const resetDemoBtn = document.querySelector('.reset-demo');
resetDemoBtn.addEventListener('click', resetDemo);

// DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const containerDiv = document.querySelector('#container');
  containerDiv.style.display = 'block';

  // Set the current button before reload back to 'current'
  const currentButtonClass = localStorage.getItem('currentButton');
  const currentButton = document.querySelector(currentButtonClass);
  
  if (currentButton) {
    currentButton.classList.add('current');
  }

  if (currentButtonClass) {
    if (currentButtonClass === '.all-tasks') {
      showAllTasks();
    } else if (currentButtonClass === '.today-tasks') {
      showTodayTasks();
    } else if  (currentButtonClass === '.overdue-tasks') {
      showOverdueTasks();
    } else if (currentButtonClass.startsWith('.project-')) {
      const projectName = currentButton.querySelector('.project-name').textContent;
      showProject(projectName);
    }
  }

  // Fill main container on initial load
  const tasksContainer = document.querySelector('.tasks-container');
  if (tasksContainer.innerHTML === '') {
    showTodayTasks();
  }

  updateTotalTasks();
});