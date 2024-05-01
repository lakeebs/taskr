import { addTask, addProject, updateTotalTasks } from './add-task-project.js';
import { format, addDays, subDays } from 'date-fns';
import { showTodayTasks } from './index.js';

const savedTasks = localStorage.getItem('tasks');
const savedProjects = localStorage.getItem('projects');

const parsedTasks = JSON.parse(savedTasks);
const parsedProjects = JSON.parse(savedProjects);

export function sampleContent() {

  if ((!parsedTasks || parsedTasks.length === 0) && (!parsedProjects || parsedProjects.length === 0)) {
    submitProject('Website');
    submitProject('Kitchen');
    submitProject('Japan trip');
    addTask('Finish Home page', 'Fix bugs', format(new Date(), 'MM/dd/yyyy'), 'Priority 1', 'Website');
    addTask('Create a light theme', '', format(subDays(new Date(), 1), 'MM/dd/yyyy'), 'Priority 1', 'Website');
    addTask('Buy new tiles', 'Home Depot?', format(subDays(new Date(), 10), 'MM/dd/yyyy'), 'Priority 2', 'Kitchen');
    addTask('Choose color scheme', 'Look through Pinterest', format(new Date(), 'MM/dd/yyyy'), 'Priority 3', 'Kitchen');
    addTask('Decide on cupboards', '', format(addDays(new Date(), 10), 'MM/dd/yyyy'), 'Priority 2', 'Kitchen');
    addTask('Buy tickets!', '', format(new Date(), 'MM/dd/yyyy'), 'Priority 1', 'Japan trip');
    addTask('Finish packing', '', format(addDays(new Date(), 3), 'MM/dd/yyyy'), 'Priority 2', 'Japan trip');
    addTask('Learn basic phrases', '', format(addDays(new Date(), 4), 'MM/dd/yyyy'), 'Priority 1', 'Japan trip');
    addTask('Plan itinerary', '', format(subDays(new Date(), 1), 'MM/dd/yyyy'), 'Priority 2', 'Japan trip');
    addTask('Do taxes', 'Use CreditKarma', format(addDays(new Date(), 2), 'MM/dd/yyyy'), 'Priority 1', 'Tasks');
    addTask('Fix phone screen', '$10 at corner shop', format(new Date(), 'MM/dd/yyyy'), 'No Priority', 'Tasks');
    addTask('Pay back Jim $50', '', format(addDays(new Date(), 7), 'MM/dd/yyyy'), 'Priority 2', 'Tasks');
    addTask('Practice piano', '', format(subDays(new Date(), 4), 'MM/dd/yyyy'), 'Priority 3', 'Tasks');
    addTask('Try new sandwich at Luigi\'s', '', format(new Date(), 'MM/dd/yyyy'), 'No Priority', 'Tasks');
    addTask('Buy some clothes', 'Sale this weekend', format(addDays(new Date(), 6), 'MM/dd/yyyy'), 'Priority 3', 'Tasks');
    addTask('Buy JavaScript books', 'Barnes or Amazon', format(new Date(), 'MM/dd/yyyy'), 'Priority 2', 'Tasks');
    addTask('Finish website', '', format(new Date(), 'MM/dd/yyyy'), 'Priority 1', 'Website');

    return;
  }
  
  parsedTasks.forEach(task => {
    addTask(task.taskName, task.taskNotes, task.dueDate, task.priority, task.location);
  });

  parsedProjects.forEach(project => {
    submitProject(project.projectName);

    project.tasks.forEach(task => {
      addTask(task.taskName, task.taskNotes, task.dueDate, task.priority, task.location);
    });
  });
}

function submitProject(projectName) {
  addProject(projectName);

  const projectsList = document.querySelector('ul.projects-list');

  // Add sidebar project button
  const projectItem = document.createElement('li');
  projectItem.classList.add('project');

  const projectBtn = document.createElement('button');
  const projectSlug = projectName.toLowerCase().replace(/\s/g, "-");
  projectBtn.classList.add('project', 'project-' + projectSlug);

  // Project icon
  const projectIcon = document.createElement('span');
  const projectSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  projectSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  projectSVG.setAttribute('viewBox', '0 -960 960 960');
  projectSVG.setAttribute('fill', '#777');
  projectSVG.setAttribute('width', '20');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M172.309-180.001q-30.308 0-51.308-21t-21-51.308v-455.382q0-30.308 21-51.308t51.308-21h219.613l80 80h315.769q30.308 0 51.308 21t21 51.308v375.382q0 30.308-21 51.308t-51.308 21H172.309Zm0-59.999h615.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-375.382q0-5.385-3.462-8.847-3.462-3.462-8.847-3.462H447.385l-80-80H172.309q-5.385 0-8.847 3.462-3.462 3.462-3.462 8.847v455.382q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462ZM160-240v-480 480Z');
  projectSVG.appendChild(path);
  projectIcon.appendChild(projectSVG);

  // Project name
  const projectNameWrap = document.createElement('span');
  projectNameWrap.classList.add('project-name');
  projectNameWrap.appendChild(document.createTextNode(projectName));

  projectBtn.appendChild(projectIcon);
  projectBtn.appendChild(projectNameWrap);
  projectItem.appendChild(projectBtn);
  projectsList.appendChild(projectItem);

  // Add projects list to dialog boxes
  const projectsOptGroup = document.querySelectorAll('.tasks select.location optgroup, main select.location optgroup')
  projectsOptGroup.forEach(optGroup => {
    const existingOption = optGroup.querySelector(`option[value="${projectName}"]`);

    if (!existingOption) {
      const locationOption = document.createElement('option');
      locationOption.value = projectName;
      locationOption.textContent = projectName;
      optGroup.appendChild(locationOption);
    }
  })

  updateTotalTasks();
}

export function resetDemo() {
  localStorage.clear();
  location.reload();
  showTodayTasks();
  localStorage.setItem('currentButton', '.today-tasks');
}