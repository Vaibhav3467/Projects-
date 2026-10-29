const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    mainNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}
