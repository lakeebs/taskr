const main = document.querySelector('main');
const sidebar = document.querySelector('#sidebar');
const dockBtn = document.querySelector('main .header .dock-sidebar');
const mobileWidth = 700;
const mobile = window.innerWidth < mobileWidth;

// Event listener on #container
export function sidebarDock(e) {
  const closeDockBtn = e.target.closest('#sidebar button.dock-sidebar');
  const openDockBtn = e.target.closest('main button.dock-sidebar');
  const isClickInsideSidebar = sidebar.contains(e.target);
  let sidebarEventListenerAdded = false;

  // Remove any instance of project option popup
  if (e.target.matches('button') || e.target.matches('.project-name')) {
    const existingDiv = document.querySelector('li.project div.project-options');
    if (existingDiv) {
      existingDiv.remove();
      return;
    }
  }

  if (window.innerWidth < mobileWidth) {
    if (e.target.matches('.project-settings img')) {
      return;
    }

    if (closeDockBtn || !isClickInsideSidebar) {
      sidebar.classList.remove('open-mobile');
      closeSidebar();
    }

    if (openDockBtn) {
      sidebar.classList.add('open-mobile');

      // Use a flag to prevent multiple event listeners attaching to the sidebar over time
      if (!sidebarEventListenerAdded) {
        sidebar.addEventListener('click', (e) => {
          sidebarEventListenerAdded = true;

          // Submit task/project buttons also closes the sidebar in mobile view. Code is in their respective files (form-task, form-project)
          if (e.target.matches('button.all-tasks') || e.target.matches('button.today-tasks') || e.target.matches('button.overdue-tasks') || e.target.matches('.project-name')) {
            sidebar.classList.remove('open-mobile');
          }
        });
      }
    }
  }

  if (closeDockBtn) {
    closeSidebar();
  }

  if (openDockBtn) {
    openSidebar();
  }
}

function closeSidebar() {
  main.style.padding = '.75rem 3.25rem';
  dockBtn.style.visibility = 'visible';
  sidebar.style.display = 'none';
}

function openSidebar() {
  main.style.padding = '';
  dockBtn.style.visibility = 'hidden';
  sidebar.style.display = '';
}

// Remove 'open' class if window is resized past mobile width
window.addEventListener('resize', () => {
  if (!mobile && sidebar.classList.contains('open-mobile')) {
    sidebar.classList.remove('open-mobile');
  }
});