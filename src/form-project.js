import { showProject } from './index.js';
import { projects, addProject, updateTotalTasks } from './add-task-project.js';
import { selectProjectOption } from './form-task.js';

const addProjectDiv = document.querySelector('.add-project-container');

// Add project function
export function addProjectInput() {

  // Prevent multiple input boxes
  if (document.querySelector('.new-project')) return;

  // Create input box
  const projectInput = document.createElement('input');
  projectInput.type = 'text';
  projectInput.name = 'new-project';
  projectInput.placeholder = 'Project name + [Enter]';
  projectInput.maxLength = 20;
  projectInput.classList.add('new-project');
  projectInput.pattern = '^(?!.*\\s{2}).*$';
  projectInput.required = true;

  addProjectDiv.style.display = 'grid';
  addProjectDiv.appendChild(projectInput);
  projectInput.focus();
}

// Cancel project function
export function cancelProject() {
  document.querySelector('.new-project').remove();
  addProjectDiv.style.display = 'none';
}

// Submit project function
export function submitProject(e) {
  if (e.target.classList.contains('new-project')) {
    if (e.key === 'Enter') {

      // Highlight invalid fields after submit
      const input = document.querySelector('.new-project');

      input.addEventListener('invalid', () => {
        input.classList.add('error');
      }, false);
    
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.classList.remove('error');
        }
      });

      // If all fields are valid, proceed
      if (input.checkValidity()) {
        const projectName = document.querySelector('.new-project').value;

        // Prevent duplicate project names
        const projectExists = projects.find(project => project.projectName === projectName);
        if (projectExists && document.querySelector('.project-error')) {
          return;
        } else if (projectExists) {
          const projectError = document.createElement('p');
          projectError.classList.add('project-error');
          projectError.textContent = 'This project already exists!';
          addProjectDiv.after(projectError);
          return;
        } else {
          const projectError = document.querySelector('.project-error');
          if (projectError) {
            projectError.remove();
          }
        }

        // Add project to array
        addProject(projectName);

        const projectsList = document.querySelector('ul.projects-list');
        projectsList.innerHTML = '';

        // Add sidebar project button
        projects.forEach((project, index) => {
          const projectItem = document.createElement('li');
          projectItem.classList.add('project');

          const projectBtn = document.createElement('button');
          const projectSlug = projectName.toLowerCase().replace(/\s/g, "-");
          projectBtn.classList.add('project', 'project-' + projectSlug);

          // Project icon
          const projectIcon = document.createElement('span');
          projectIcon.classList.add('project-icon');
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
          projectNameWrap.appendChild(document.createTextNode(project.projectName));

          const buttons = document.querySelectorAll('.tasks button');
          buttons.forEach(button => button.classList.remove('current')); 
          projectBtn.classList.add('current');

          projectBtn.appendChild(projectIcon);
          projectBtn.appendChild(projectNameWrap);
          projectItem.appendChild(projectBtn);
          projectsList.appendChild(projectItem);
        });

        // Close sidebar after submitting project for mobile view
        if (window.innerWidth < 700) {
          const sidebar = document.querySelector('#sidebar');
          sidebar.classList.remove('open');
        }

        showProject(projectName);
        selectProjectOption();
        updateTotalTasks();
        cancelProject();
      }
      
      return false;
    }
  }
}