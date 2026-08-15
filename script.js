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

// ---------------------------------------------------------
// Click a project/case-study image to view it enlarged
// ---------------------------------------------------------
(function () {
  const images = document.querySelectorAll('.project__image img, .case-body img');
  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">Close ✕</button><img alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  images.forEach((img) => {
    img.addEventListener('click', () => open(img.src, img.alt));
  });

  lightbox.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
