import { showAllTasks, showTodayTasks, showOverdueTasks, showProject } from './index.js';
import { selectProjectOption } from './form-task.js';
import { tasks, projects, updateTotalTasks, saveTasksToLocalStorage, saveProjectsToLocalStorage } from './add-task-project.js';
import { format, isToday } from 'date-fns';

export function mainFunctions(e) {

  const taskItem = e.target.closest('li.task-item');
  const removeBtn = e.target.matches('button.delete-item');
  const editBtn = e.target.closest('button.edit-task');
  const cancelBtn = e.target.closest('button.cancel-edit');
  const saveBtn = e.target.closest('.save-edit');
  const isProjectLocation = e.target.matches('.metadata .location button');

  let taskName;
  let taskInTasks;
  let taskInProjects;

  // Go to project page
  if (isProjectLocation && !taskItem.classList.contains('editing')) {
    const projectLocation = e.target.textContent;
    const projectsList = document.querySelectorAll('ul.projects-list button.project');
    
    projectsList.forEach(project => {
      const projectName = project.querySelector('.project-name').textContent.trim();

      if (projectName === projectLocation) {
        showProject(projectName);
        selectProjectOption();

        const buttons = document.querySelectorAll('.tasks button');
        buttons.forEach(button => button.classList.remove('current'));
    
        project.classList.add('current');
      }
    });
  }

  // Remove task
  if (removeBtn && !taskItem.classList.contains('editing')) {
    const taskName = taskItem.querySelector('.task-name').textContent;

    // Find/remove task by index in 'tasks'
    const tasksIndex = tasks.findIndex(task => task.taskName === taskName);
    tasks.splice(tasksIndex, 1);

    // Find/remove task by index in 'projects'
    projects.forEach(project => {
      const projectIndex = project.tasks.findIndex(task => task.taskName === taskName);
      if (projectIndex !== -1) {
        project.tasks.splice(projectIndex, 1);
      }
    });

    // Remove task from DOM
    taskItem.remove();

    // Show 'all clear' image if tasklist is empty
    const totalTasks = document.querySelectorAll('.task-item').length;
    if (totalTasks === 0) {
      const allClearImg = document.querySelector('.all-clear');
      allClearImg.style.display = 'block';
    }

    // Show current page after task removal
    const currentButtonClass = localStorage.getItem('currentButton');
    const currentButton = document.querySelector(currentButtonClass);
    currentButton.classList.add('current');
  
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

    saveTasksToLocalStorage(tasks);
    saveProjectsToLocalStorage(projects);
    updateTotalTasks();

    return;
  }

  // Edit task
  if (taskItem || editBtn || cancelBtn) {

    // Toggle editor
    if (!taskItem.classList.contains('editing')) {
      openEditor();
    } else {
      if (editBtn || cancelBtn) {
        closeEditor();
      }
    }

    // Close editor
    function closeEditor() {
          
      // Remove elements
      const inputsToRemove = taskItem.querySelectorAll('input, textarea, select, .priority-option, .cancel-edit, .save-edit');
      inputsToRemove.forEach(input => {
        input.remove();
      });

      // Re-add original elements
      const elementsToAdd = taskItem.querySelectorAll('.task-name, .task-notes, .due-date, .location, .delete-item');
      elementsToAdd.forEach(el => {
        if (el.style.display === 'none') {
          el.style.display = '';
        }
      });

      // Re-add pipe
      taskName = taskItem.querySelector('.task-name').innerText;
      taskInTasks = tasks.find(task => task.taskName === taskName);
      const locationDiv = taskItem.querySelector('span.location');

      if (taskInTasks.location !== 'Tasks' && !locationDiv.textContent === '') {
        const pipe = document.createTextNode('|');
        const dueDate = taskItem.querySelector('.due-date');
        dueDate.after(pipe);
      }

      // Remove 'editing' classes
      taskItem.classList.remove('editing');
    }

    // Open editor
    function openEditor() {

      const taskNameWrap = taskItem.querySelector('.task-name');
      const taskNotesWrap = taskItem.querySelector('.task-notes');
      const dueDateWrap = taskItem.querySelector('.due-date');
      const locationWrap = taskItem.querySelector('.location');
      const priorityWrap = taskItem.querySelector('.priority');
  
      // Cleanup
      const taskItems = document.querySelectorAll('.task-item');
      taskItems.forEach(item => {
  
        // Remove elements
        const inputsToRemove = item.querySelectorAll('input, textarea, select, .priority-option, .cancel-edit, .save-edit');
        inputsToRemove.forEach(input => {
          input.remove();
        });
  
        // Re-add original elements
        const elementsToAdd = item.querySelectorAll('.task-name, .task-notes, .due-date, .location, .delete-item');
        elementsToAdd.forEach(el => {
          if (el.style.display === 'none') {
            el.style.display = '';
          }
        });
  
        // Remove 'editing' classes
        item.classList.remove('editing');
      })
  
      // Add 'editing' class to target task
      taskItem.classList.add('editing');

      // Assign values to empty variables
      taskName = taskItem.querySelector('.task-name').innerText;
      taskInTasks = tasks.find(task => task.taskName === taskName);
      taskInProjects = projects.flatMap(project => project.tasks).find(task => task.taskName === taskName);
  
      // Create taskName input box
      const taskNameInput = document.createElement('input');
      taskNameInput.classList.add('task-name-input');
      taskNameInput.name = taskName;
      taskNameInput.value = taskName;
      taskNameInput.placeholder = 'Task name (required)';
      taskNameInput.maxLength = 30;
      taskNameInput.pattern = '^(?!.*\\s{2}).*$';
      taskNameInput.required = true;
  
      taskNameWrap.after(taskNameInput);
      taskNameWrap.style.display = 'none';
      taskNameInput.focus();
  
      // Create taskNotes input box
      const taskNotesInput = document.createElement('textarea');
      taskNotesInput.classList.add('task-notes-input');
      
      if (taskInTasks && taskInTasks.taskNotes !== '') {
        const taskNotes = taskItem.querySelector('.task-notes').innerText;
        taskNotesInput.name = taskNotes;
        taskNotesInput.value = taskNotes;
      } else {
        taskNotesInput.name = 'Add notes';
      }
  
      taskNotesInput.placeholder = 'Add notes (optional)';
      taskNotesInput.maxLength = 200;
      taskNotesInput.pattern = '^(?!.*\\s{2}).*$';
  
      taskNotesWrap.after(taskNotesInput);
      taskNotesWrap.style.display = 'none';
  
      // Create dueDate box
      const dueDateInput = document.createElement('input');
      dueDateInput.classList.add('due-date-input');
      dueDateInput.type = 'date';
      dueDateInput.name = 'due-date-input';
  
      // Set date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');
      dueDateInput.setAttribute('value', format(taskInTasks.dueDate, 'yyyy-LL-dd'));
      dueDateInput.setAttribute('min', `${year}-${month}-${day}`);
  
      dueDateWrap.after(dueDateInput);
      dueDateWrap.style.display = 'none';
  
      // Create task location box
      const taskLocation = document.createElement('select');
      taskLocation.classList.add('location');
      taskLocation.name = 'location';
      taskLocation.value = taskInTasks.location;
      const taskLocationOption = document.createElement('option');
      taskLocationOption.value = 'Tasks';
      taskLocationOption.textContent = 'Tasks';
      const taskLocationOptGroup = document.createElement('optgroup');
      taskLocationOptGroup.label = 'Projects';
  
      // Add projects to select box
      projects.forEach(project => {
        const projectLocationOption = document.createElement('option');
        projectLocationOption.value = project.projectName;
        projectLocationOption.textContent = project.projectName;
  
        // Select respective project for all tasks in a project
        if (!(taskInTasks.location === 'Tasks')) {
          const projectLocation = taskInTasks.location;
        
          if (project.projectName === projectLocation) {
            projectLocationOption.selected = true;
          }
        }
  
        taskLocationOptGroup.appendChild(projectLocationOption);
      });
  
      taskLocation.appendChild(taskLocationOption);
      taskLocation.appendChild(taskLocationOptGroup);
  
      if (!locationWrap) {
        const locationWrapNew = document.createElement('span');
        locationWrapNew.classList.add('location');
        const metadata = taskItem.querySelector('p.metadata');
        metadata.appendChild(locationWrapNew);
        locationWrapNew.after(taskLocation);
        locationWrapNew.style.display = 'none';
      } else {
        locationWrap.after(taskLocation);
        locationWrap.style.display = 'none';
      }
  
      // Remove pipe |
      if (taskItem.classList.contains('editing')) {
        const metadata = taskItem.querySelector('p.metadata');
        const pipeNode = Array.from(metadata.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '|');
        if (pipeNode) {
            pipeNode.remove();
        }
      }
  
      // Create priority buttons
      const selectedPriority = taskInTasks.priority;
  
      const nopriority = document.createElement('input');
      nopriority.type = 'radio';
      nopriority.classList.add('no-priority', 'priority-option');
      nopriority.value = 'No Priority';
      nopriority.title = 'No Priority';
      nopriority.name = 'priority-option';
      const priority1 = document.createElement('input');
      priority1.type = 'radio';
      priority1.classList.add('priority-1', 'priority-option');
      priority1.value = 'Priority 1';
      priority1.title = 'Priority 1';
      priority1.name = 'priority-option';
      const priority2 = document.createElement('input');
      priority2.type = 'radio';
      priority2.classList.add('priority-2', 'priority-option');
      priority2.value = 'Priority 2';
      priority2.title = 'Priority 2';
      priority2.name = 'priority-option';
      const priority3 = document.createElement('input');
      priority3.type = 'radio';
      priority3.classList.add('priority-3', 'priority-option');
      priority3.value = 'Priority 3';
      priority3.title = 'Priority 3';
      priority3.name = 'priority-option';
  
      switch (selectedPriority) {
        case 'No Priority':
          nopriority.checked = true;
          break;
        case 'Priority 1':
          priority1.checked = true;
          break;
        case 'Priority 2':
          priority2.checked = true;
          break;
        case 'Priority 3':
          priority3.checked = true;
          break;
      }
  
      priorityWrap.appendChild(nopriority);
      priorityWrap.appendChild(priority1);
      priorityWrap.appendChild(priority2);
      priorityWrap.appendChild(priority3);
  
      const selectedBtn = taskItem.querySelector('button.delete-item');
      selectedBtn.style.display = 'none';
  
      // Create cancel/save buttons
      const metadata = taskItem.querySelector('p.metadata');
  
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('cancel-edit');
      cancelBtn.textContent = 'Cancel';
  
      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-edit');
      saveBtn.textContent = 'Save';
  
      metadata.appendChild(cancelBtn);
      metadata.appendChild(saveBtn);
    }
  }

  // Save task
  if (saveBtn) {
    
    // Get new values
    const newTaskName = taskItem.querySelector('.task-name-input').value;
    const newTaskNotes = taskItem.querySelector('.task-notes-input').value;
    const date = new Date(taskItem.querySelector('.due-date-input').value);
    
    let newDueDate = format(date, 'MM/dd/yyyy');
    const newLocation = taskItem.querySelector('select.location').value;

    let newPriority;
    const priorityOptions = taskItem.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
      if (option.checked) {
        newPriority = option.value;
      }
    });

    // Assign values to empty variables
    taskName = taskItem.querySelector('.task-name').innerText;
    taskInTasks = tasks.find(task => task.taskName === taskName);
    taskInProjects = projects.flatMap(project => project.tasks).find(task => task.taskName === taskName);
    
    // Grab old location of tasks that aren't in projects for later
    const oldLocation = taskInTasks.location;

    // Update task in 'tasks' array
    taskInTasks.taskName = newTaskName;
    taskInTasks.taskNotes = newTaskNotes;
    taskInTasks.dueDate = newDueDate;
    taskInTasks.location = newLocation;
    taskInTasks.priority = newPriority;

    // Push task from no project to 'projects'
    if (oldLocation === 'Tasks' && newLocation !== 'Tasks') {
      const newProjectIndex = projects.findIndex(project => project.projectName === newLocation);
      
      if (newProjectIndex !== -1) {
        projects[newProjectIndex].tasks.push(taskInTasks);
      }
    }

    // Update task in 'projects' array
    if (taskInProjects !== undefined) {
      taskInProjects.taskName = newTaskName;
      taskInProjects.taskNotes = newTaskNotes;
      taskInProjects.dueDate = newDueDate;
      taskInProjects.location = newLocation;
      taskInProjects.priority = newPriority;

      // Find/remove task by index in 'projects'
      projects.forEach(project => {
        const projectIndex = project.tasks.findIndex(task => task.taskName === taskName);
        if (projectIndex !== -1) {
          project.tasks.splice(projectIndex, 1);
        }
      });

      // Push task into new project location
      if (newLocation !== 'Tasks') {
        const newProjectIndex = projects.findIndex(project => project.projectName === newLocation);
        
        if (newProjectIndex !== -1) {
          projects[newProjectIndex].tasks.push(taskInProjects);
        }
      }
    }

    // Remove existing 'metadata' element and recreate it with new values
    taskItem.querySelector('p.metadata').remove();
    const metadataWrap = document.createElement('p');
    metadataWrap.classList.add('metadata');

    // Update task in DOM
    taskItem.querySelector('.task-name').textContent = newTaskName;
    taskItem.querySelector('.task-notes').textContent = newTaskNotes;

    // Due date
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
    dueDateWrap.appendChild(document.createTextNode(newDueDate));
    metadataWrap.appendChild(dueDateWrap);

    // Project location
    const onProjectPage = document.querySelector('.tasks-container > ul').classList.contains('project-list');

    if (!onProjectPage) {
      if (newLocation !== 'Tasks') {
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
        const projectName = newLocation;
        projectNameWrap.appendChild(projectSVG);
        projectBtn.appendChild(document.createTextNode(projectName));
        projectNameWrap.appendChild(projectBtn);
        metadataWrap.appendChild(projectNameWrap);
      }
    }

    // Append to div
    const taskItemData = taskItem.querySelector('.task-item-data');
    taskItemData.appendChild(metadataWrap);

    // Priority
    const delBtn = taskItem.querySelector('.delete-item');
    delBtn.value = newPriority
    delBtn.className = '';
    delBtn.classList.add('delete-item', newPriority.toLowerCase().replace(/ /g, "-"));

    // Remove elements
    const inputsToRemove = taskItem.querySelectorAll('input, textarea, select, .priority-option, .cancel-edit, .save-edit');
    inputsToRemove.forEach(input => {
      input.remove();
    });

    // Re-add original elements
    const elementsToAdd = taskItem.querySelectorAll('.task-name, .task-notes, .due-date, .location, .delete-item');
    elementsToAdd.forEach(el => {
      if (el.style.display === 'none') {
        el.style.display = '';
      }
    });

    // Remove 'editing' classes
    taskItem.classList.remove('editing');

    saveTasksToLocalStorage(tasks);
    saveProjectsToLocalStorage(projects);
    updateTotalTasks();

    // Redirect to proper page
    if (newLocation !== 'Tasks') {
      showProject(newLocation);
      return;
    }

    if (newLocation === 'Tasks' && !isToday(date)) {
      showAllTasks();
      return;
    }
    
    if (newLocation === 'Tasks' && isToday(date)) {
      showTodayTasks();
      return;
    }
  }
}