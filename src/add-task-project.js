import { sampleContent } from './stored-data.js';
import { createAllTasksContent } from './content-all-tasks.js';
import { createTodayContent } from './content-today.js';
import { createOverdueContent } from './content-overdue.js';
import { numberOfProjectTasks } from './content-project.js';

export const tasks = [];
export const projects = [];

class Task {
  constructor(taskName, taskNotes, dueDate, priority, location) {
    this.taskName = taskName;
    this.taskNotes = taskNotes;
    this.dueDate = dueDate;
    this.priority = priority;
    this.location = location;
  }
}

class Project {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
  }
}

// Add task
export function addTask(taskName, taskNotes, dueDate, priority, location) {
  const task = new Task(taskName, taskNotes, dueDate, priority, location);

  if (location === 'Tasks') {
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
  } else {
    const project = projects.find(project => project.projectName === location);
    if (project) {
      project.tasks.push(task);
      saveProjectsToLocalStorage(projects)
    }
  }
}

// Add project
export function addProject(projectName) {
  const project = new Project(projectName);
  projects.push(project);
  saveProjectsToLocalStorage(projects);
}

// Update total tasks function
export function updateTotalTasks() {
  const elementsToRemove = document.querySelectorAll('.total-tasks, .project-meta');
  elementsToRemove.forEach(element => {
    element.remove();
  });

  createAllTasksContent().numberOfTasks();
  createTodayContent().numberOfTodayTasks();
  createOverdueContent().numberOfOverdueTasks();
  numberOfProjectTasks();
}

// Save tasks array to localStorage
export function saveTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save projects array to localStorage
export function saveProjectsToLocalStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

sampleContent();