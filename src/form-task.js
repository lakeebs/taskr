import { tasks, projects, addTask, updateTotalTasks, saveTasksToLocalStorage, saveProjectsToLocalStorage } from './add-task-project.js';
import { showAllTasks, showTodayTasks, showProject } from './index.js';
import { isToday } from 'date-fns';

// Set date to current
export function setDateToCurrent() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  const dueDates = document.querySelectorAll('.due-date input');
  dueDates.forEach(dueDate => {
    dueDate.setAttribute('value', `${year}-${month}-${day}`);
    dueDate.setAttribute('min', `${year}-${month}-${day}`);
  });
}

// Set 'Tasks' as selected location
export function selectTasksOption() {
  const tasksOptions = document.querySelectorAll('.tasks select.location > option, main select.location > option');

  tasksOptions.forEach(option => {
    option.selected = true;
  });
}

// Set current project as selected location
export function selectProjectOption() {
  const title = document.querySelector('.title-bar h2');
  const projectOptGroups = document.querySelectorAll('.tasks select.location optgroup, main select.location optgroup');

  projectOptGroups.forEach(optGroup => {
    const projectOptions = optGroup.querySelectorAll('option');
  
    projectOptions.forEach(option => {
      if (option.value === title.firstChild.nodeValue.trim()) {
        option.selected = true;
  
        return;
      }
  
    });
  })
}

// Event listener for form functions
const container = document.querySelector('#container');
container.addEventListener('click', (e) => {

  // Toggle dialog
  if (e.target.matches('.tasks .add-task-sidebar') || e.target.matches('main .add-task-main')) {

    let form, dialog;

    if (e.target.matches('.tasks .add-task-sidebar')) {
      form = document.querySelector('.tasks form');
      dialog = document.querySelector('.tasks dialog');
    }

    if (e.target.matches('main .add-task-main')) {
      form = document.querySelector('main form');
      dialog = document.querySelector('main dialog');
    }

    if (form && dialog) {
      document.querySelectorAll('input.error').forEach(input => {
        input.classList.remove('error');
      });
    }

    if (dialog.open) {
      dialog.close();
      form.reset();
    } else {
      dialog.show();
      setDateToCurrent();
      selectProjectOption();
    }
  }

  // Declared again, separately, because .closest only traverses 'up' the DOM
  const form = e.target.closest('form');
  const dialog = e.target.closest('dialog');

  // Close function
  if (e.target.matches('.tasks form button.close') || e.target.matches('main form button.close')) {
    e.preventDefault();

    if (form && dialog) {
      dialog.close();
      form.reset();
    }
  }

  // Form submission
  if (e.target.matches('.tasks form button.add') || e.target.matches('main form button.add')) {
    e.preventDefault();

    if (!form) return;

    const taskName = form.querySelector('input.task-name').value;
    const taskNotes = form.querySelector('textarea.task-notes').value;
    const dueDate = form.querySelector('input.due-date').value;
    const priority = form.querySelector('select.priority').value;
    const location = form.querySelector('select.location').value;

    // Highlight invalid fields
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('invalid', () => {
        input.classList.add('error');
      }, false);
    
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.classList.remove('error');
        }
      });
    });

    // If all fields are valid, proceed
    if (form.checkValidity()) {
      addTask(taskName, taskNotes, dueDate, priority, location);

      const buttons = document.querySelectorAll('.tasks button');
      buttons.forEach(button => button.classList.remove('current'));

      if (!(location === 'Tasks')) {
        const project = projects.find(project => project.projectName === location);
        showProject(project.projectName);

        let projectBtn;

        const projectsList = document.querySelector('ul.projects-list');
        const projectBtns = projectsList.querySelectorAll('button.project');
        projectBtns.forEach(button => {
          if (button.querySelector('.project-name').textContent.trim() === project.projectName) {
            projectBtn = button;
          }
        });
        
        projectBtn.classList.add('current');

      } else if (isToday(dueDate)) {
        showTodayTasks();
        const todayBtn = document.querySelector('button.today-tasks');
        todayBtn.classList.add('current');

      } else {
        showAllTasks();
        const allTasksBtn = document.querySelector('button.all-tasks');
        allTasksBtn.classList.add('current');
      }

      // Close sidebar after submitting task for mobile view
      if (window.innerWidth < 700) {
        const sidebar = document.querySelector('#sidebar');
        sidebar.classList.remove('open');
      }

      saveTasksToLocalStorage(tasks);
      saveProjectsToLocalStorage(projects);

      updateTotalTasks();
      dialog.close();
      form.reset();
    }
  }
});