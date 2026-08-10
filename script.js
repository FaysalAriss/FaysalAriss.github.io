// ---------------------------------------------------------
// Theme toggle (initial theme is set inline in <head>, before
// first paint, to avoid a flash — this just wires up the button)
// ---------------------------------------------------------
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  function updateLabel(theme) {
    toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }

  updateLabel(root.getAttribute('data-theme'));

  toggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateLabel(next);
  });
})();

// ---------------------------------------------------------
// Highlight the active nav link while scrolling (index only)
// ---------------------------------------------------------
(function () {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const map = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    map.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.style.color = '');
          link.style.color = 'var(--ink)';
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();
