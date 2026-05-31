// Intersection Observer for fade-in and timeline
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry && entry.target) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .timeline-item').forEach(el => {
    if (el) observer.observe(el);
  });

  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    if (item) item.style.transitionDelay = `${i * 0.15}s`;
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      if (!section) return;
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (!link) return;
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Lightbox
  function openCert(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeCert(el) {
    const lb = el && el.closest ? el.closest('.cert-lightbox') : el;
    if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.cert-lightbox.open').forEach(lb => {
        if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
      });
    }
  });


  // Back to top button always visible

  // Animated counters
  const counters = document.querySelectorAll('.stat-number');
  const targets = {};
  counters.forEach((el, i) => {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/([^0-9]*)([0-9.]+)([^0-9]*)/);
    if (!numMatch) return;
    const prefix = numMatch[1] || '';
    const num = parseFloat(numMatch[2]);
    const suffix = numMatch[3] || '';
    targets[i] = { el, num, prefix, suffix, started: false };
  });

  function animateCounter(obj) {
    if (obj.started) return;
    obj.started = true;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * obj.num * 10) / 10;
      obj.el.textContent = obj.prefix + (Number.isInteger(obj.num) ? Math.round(current) : current) + obj.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry && entry.isIntersecting && entry.target) {
        const i = Array.from(counters).indexOf(entry.target);
        if (i >= 0 && targets[i]) animateCounter(targets[i]);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => { if (el) counterObserver.observe(el); });

  // Dark mode
  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const lbl = document.getElementById('theme-label'); if (lbl) lbl.textContent = isDark ? 'Dark' : 'Light';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }

  // Restore saved preference
  (function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const label = document.getElementById('theme-label');
      if (label) label.textContent = 'Light';
    }
  })();

  // Dynamic footer year
  (function() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  })();
