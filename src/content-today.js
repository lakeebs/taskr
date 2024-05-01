import { tasks, projects } from './add-task-project.js';
import { isToday } from 'date-fns';

export function createTodayContent() {

  // Add 'project' tasks to 'tasks'
  projects.forEach(project => {
    project.tasks.forEach(task => {
      const taskExists = tasks.find(existingTask => existingTask.taskName === task.taskName);

      if (!taskExists) {
        tasks.push(task);
      }
    });
  });

  // Sort the array by date
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  // Filter only today's tasks
  const todayTasks = tasks.filter(task => {
    const date = new Date(task.dueDate);
    return isToday(date) && task;
  });

  // Get number of tasks
  function numberOfTodayTasks() {
    const todayTasksBtn = document.querySelector('button.today-tasks')
    const todayTasksNumber = createTodayContent().todayTasks.length;
    const todayTasksNumberNode = document.createTextNode(todayTasksNumber);
    const todayTasksNumberWrap = document.createElement('span');
    todayTasksNumberWrap.classList.add('total-tasks');
    todayTasksNumberWrap.appendChild(todayTasksNumberNode);
    todayTasksBtn.appendChild(todayTasksNumberWrap);

    return;
  }

  // Create the list and list items
  const tasksList = document.createElement('ul');
  tasksList.classList.add('tasks-list', 'today-tasks');

  // Loop through each task
  todayTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const priorityWrap = document.createElement('div');
    priorityWrap.classList.add('priority');
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('role', 'checkbox');
    deleteBtn.setAttribute('aria-checked', 'false');
    deleteBtn.setAttribute('name', 'delete-item');
    deleteBtn.classList.add('delete-item');
    if (task.priority == 'No Priority') {
      deleteBtn.classList.add('no-priority');
    }
    if (task.priority == 'Priority 1') {
      deleteBtn.classList.add('priority-1');
    }
    if (task.priority == 'Priority 2') {
      deleteBtn.classList.add('priority-2');
    }
    if (task.priority == 'Priority 3') {
      deleteBtn.classList.add('priority-3');
    }
    priorityWrap.appendChild(deleteBtn);

    const taskNameWrap = document.createElement('h3');
    taskNameWrap.classList.add('task-name');
    const taskName = document.createTextNode(task.taskName);
    taskNameWrap.appendChild(taskName);

    const taskNotesWrap = document.createElement('p');
    taskNotesWrap.classList.add('task-notes');
    const taskNotes = document.createTextNode(task.taskNotes);
    taskNotesWrap.appendChild(taskNotes);

    const metadataWrap = document.createElement('p');
    metadataWrap.classList.add('metadata', 'today');
    const dueDate = 'Today';

    // Date image
    const dateSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    dateSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    dateSVG.setAttribute('viewBox', '0 -960 960 960');
    dateSVG.setAttribute('fill', '#fff');
    dateSVG.setAttribute('width', '16');
    const datePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    datePath.setAttribute('d', 'M232-132q-26 0-43-17t-17-43v-496q0-26 17-43t43-17h80v-92h32v92h276v-92h28v92h80q26 0 43 17t17 43v496q0 26-17 43t-43 17H232Zm0-28h496q12 0 22-10t10-22v-336H200v336q0 12 10 22t22 10Zm-32-396h560v-132q0-12-10-22t-22-10H232q-12 0-22 10t-10 22v132Zm0 0v-164 164Z');
    dateSVG.appendChild(datePath);

    const dueDateWrap = document.createElement('span');
    dueDateWrap.classList.add('due-date');
    dueDateWrap.appendChild(dateSVG);
    dueDateWrap.appendChild(document.createTextNode(dueDate));
    metadataWrap.appendChild(dueDateWrap);

    // Task location
    if (!(task.location === 'Tasks')) {
      const pipe = document.createTextNode('|');
      metadataWrap.appendChild(pipe);

      // Project image
      const projectSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      projectSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      projectSVG.setAttribute('viewBox', '0 -960 960 960');
      projectSVG.setAttribute('fill', '#fff');
      projectSVG.setAttribute('width', '16');
      const projectPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      projectPath.setAttribute('d', 'm560-140.001-42.768-42.769 147.846-147.231H220.001v-449.998H280v390h385.078L517.232-537.846l42.153-42.768L779.999-360 560-140.001Z');
      projectSVG.appendChild(projectPath);

      const projectNameWrap = document.createElement('span');
      projectNameWrap.classList.add('location');
      const projectBtn = document.createElement('button');
      const projectName = task.location;
      projectNameWrap.appendChild(projectSVG);
      projectBtn.appendChild(document.createTextNode(projectName));
      projectNameWrap.appendChild(projectBtn);
      metadataWrap.appendChild(projectNameWrap);
    }

    // Task Options
    const taskOptions = document.createElement('div');
    taskOptions.classList.add('task-options');

    // Edit image
    const editTaskSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    editTaskSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    editTaskSVG.setAttribute('viewBox', '0 -960 960 960');
    editTaskSVG.setAttribute('fill', '#fff');
    editTaskSVG.setAttribute('width', '22');
    const editPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    editPath.setAttribute('d', 'M180.001-400v-59.999h280V-400h-280Zm0-160v-59.999h440V-560h-440Zm0-160v-59.999h440V-720h-440Zm344.615 539.999v-105.692l217.153-216.153q7.462-7.461 16.111-10.5 8.65-3.038 17.299-3.038 9.436 0 18.252 3.538 8.816 3.539 16.029 10.615l37 37.385q6.462 7.461 10 16.153 3.539 8.693 3.539 17.385 0 8.692-3.231 17.692t-10.308 16.461L630.307-180.001H524.616Zm287.691-250.307-37-37.385 37 37.385Zm-240 202.615h38l129.847-130.462-18.385-19-18.615-18.769-130.847 130.231v38Zm149.462-149.462-18.615-18.769 37 37.769-18.385-19Z');
    editTaskSVG.appendChild(editPath);

    const taskImgWrap = document.createElement('button');
    taskImgWrap.classList.add('edit-task');
    taskImgWrap.setAttribute('title', 'Edit');
    taskImgWrap.appendChild(editTaskSVG);
    taskOptions.appendChild(taskImgWrap);

    // Assemble
    const taskItemData = document.createElement('div');
    taskItemData.classList.add('task-item-data');
    taskItemData.appendChild(taskNameWrap);
    taskItemData.appendChild(taskNotesWrap);
    taskItemData.appendChild(metadataWrap);

    taskItem.appendChild(priorityWrap);
    taskItem.appendChild(taskItemData);
    taskItem.appendChild(taskOptions);
    
    tasksList.appendChild(taskItem);
  });

  return { tasksList, todayTasks, numberOfTodayTasks };
}