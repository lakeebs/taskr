import { selectProjectOption } from './form-task.js';
import { showProject, showTodayTasks } from './index.js';
import { tasks, projects, updateTotalTasks, saveTasksToLocalStorage, saveProjectsToLocalStorage } from './add-task-project.js';

// Event listener on ul.projects-list
export function projectFunctions(e) {
  const projectItem = e.target.closest('li.project');
  const projectBtn = projectItem.querySelector('button.project');
  let projectName = projectBtn.querySelector('.project-name').textContent.trim();
  const projectNameWrap = projectBtn.querySelector('.project-name');
  const projectIndex = projects.findIndex(project => project.projectName === projectName);

  // Project options box
  if (e.target.matches('img')) {
    const existingDiv = document.querySelector('li.project div.project-options');
    if (existingDiv) {
      existingDiv.remove();
      return;
    }

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('project-options');

    const itemRename = document.createElement('button');
    itemRename.classList.add('project-rename');
    itemRename.textContent = 'Rename';
    optionsDiv.appendChild(itemRename);

    const itemDelete = document.createElement('button');
    itemDelete.classList.add('project-delete');
    itemDelete.textContent = 'Delete';
    optionsDiv.appendChild(itemDelete);

    const projectSettings = e.target.closest('li.project');
    projectSettings.appendChild(optionsDiv);

    return;
  }

  // Rename project
  if (e.target.matches('.project-rename')) {

    // Prevent multiple input boxes
    if (document.querySelector('.rename-input')) return;

    // Create input box
    const renameInput = document.createElement('input');
    renameInput.classList.add('rename-input');
    renameInput.name = projectName;
    renameInput.value = projectName;
    renameInput.maxLength = 20;
    renameInput.pattern = '^(?!.*\\s{2}).*$';

    projectNameWrap.after(renameInput);
    projectNameWrap.style.display = 'none';
    renameInput.focus();

    const updateProjectName = () => {
      const newProjectName = renameInput.value.trim();

      // Rename in dialog box optgroups and 'projects' array
      const projectsMatch = projects.find(project => project.projectName === projectName);
      const optGroups = document.querySelectorAll('.tasks .dialog-box optgroup, main .dialog-box optgroup');
      
      if (projectsMatch) {

        // Rename in optgroups
        optGroups.forEach(optgroup => {
          const options = optgroup.querySelectorAll('option');

          options.forEach(option => {
            if (option.value === projectName) {
              option.value = newProjectName;
              option.textContent = newProjectName;
            }
          });
        });

        // Remove blur event listener
        renameInput.removeEventListener('blur', handleBlur);

        projectsMatch.projectName = newProjectName;
        projectNameWrap.textContent = newProjectName;
        projectName = newProjectName;

        renameInput.remove();
        projectNameWrap.style.display = '';
        showProject(projectName);
      }

      saveTasksToLocalStorage(tasks);
      saveProjectsToLocalStorage(projects);
    }

    // Keydown event handler
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        renameInput.remove();
        projectNameWrap.style.display = '';
      }

      if (e.key === 'Enter') {
        updateProjectName();
      }
    };

    // Blur event handler
    const handleBlur = () => {
      updateProjectName();
    };

    // Add event listeners
    renameInput.addEventListener('blur', handleBlur);
    renameInput.addEventListener('keydown', handleKeydown);
  }

  // Delete project
  if (e.target.matches('.project-delete')) {
    const projectTasks = projects[projectIndex].tasks;
    const todayBtn = document.querySelector('button.today-tasks');

    // Delete project tasks from tasks array
    projectTasks.forEach(projectTask => {

      const taskName = projectTask.taskName;

      // Find the matching task name in the 'tasks' array
      const existingTaskIndex = tasks.findIndex(task => task.taskName === taskName);

      if (existingTaskIndex !== -1) {
        // Remove the task from the 'tasks' array
        tasks.splice(existingTaskIndex, 1);
      }
    });

    // Delete project tasks
    projectTasks.length = 0;

    // Delete project from array and remove from DOM
    if (projectIndex !== -1) {
      projects.splice(projectIndex, 1);
      projectItem.remove();
    }

    // Delete project from optgroups
    const optGroups = document.querySelectorAll('.tasks .dialog-box optgroup, main .dialog-box optgroup');

    optGroups.forEach(optgroup => {
      const options = optgroup.querySelectorAll('option');

      options.forEach(option => {
        if (option.value === projectName) {
          option.remove();
        }
      });
    });

    saveTasksToLocalStorage(tasks);
    saveProjectsToLocalStorage(projects);
    showTodayTasks();
    updateTotalTasks();
    
    const buttons = document.querySelectorAll('.tasks button');
    buttons.forEach(button => button.classList.remove('current')); 
    todayBtn.classList.add('current');

    return;
  }

  // Show project
  if (projectBtn) {
    showProject(projectName);
    selectProjectOption();

    const buttons = document.querySelectorAll('.tasks button');
    buttons.forEach(button => button.classList.remove('current'));

    updateTotalTasks();
    projectBtn.classList.add('current');
  }
}