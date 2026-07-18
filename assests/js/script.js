const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasAnime = typeof anime !== 'undefined';

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function buildMotionGrid() {
  const grid = qs('.motion-grid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 117 }, (_, index) => `<span class="motion-dot" style="--i:${index}"></span>`).join('');
}

function splitHeroTitle() {
  const title = qs('.split-title');
  if (!title) return;

  const text = title.textContent.trim();
  title.setAttribute('aria-label', text);
  title.innerHTML = text
    .split('')
    .map((char) => char === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${char}</span>`)
    .join('');
}

function setActiveNav() {
  const sections = qsa('main section[id]');
  const navLinks = qsa('.navbar a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));
}

function animateCounters() {
  qsa('.count').forEach((counter) => {
    const target = Number(counter.dataset.count || 0);

    if (!hasAnime || prefersReducedMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }

    const value = { amount: 0 };
    anime({
      targets: value,
      amount: target,
      round: 1,
      duration: 1800,
      easing: 'easeOutExpo',
      update: () => {
        counter.textContent = value.amount.toLocaleString();
      }
    });
  });
}

function revealOnScroll() {
  const groups = [
    '.reveal-section',
    '.metric',
    '.focus-grid article',
    '.skill-cloud span',
    '.timeline article',
    '.project-grid article'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (!hasAnime || prefersReducedMotion) {
        entry.target.style.opacity = 1;
        return;
      }

      anime({
        targets: entry.target,
        opacity: [0, 1],
        translateY: [28, 0],
        rotate: [1.5, 0],
        duration: 760,
        easing: 'easeOutCubic'
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  groups.flatMap((selector) => qsa(selector)).forEach((item) => observer.observe(item));
}

function runHeroAnimation() {
  if (!hasAnime || prefersReducedMotion) {
    qsa('.reveal-section, .metric, .focus-grid article, .timeline article, .project-grid article, .skill-cloud span').forEach((item) => {
      item.style.opacity = 1;
    });
    qs('.loader-container')?.classList.add('fade-out');
    animateCounters();
    return;
  }

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.loader-mark span',
      translateY: [-18, 0],
      scale: [0.6, 1],
      opacity: [0, 1],
      delay: anime.stagger(120),
      duration: 600
    })
    .add({
      targets: '.loader-container',
      translateY: ['0%', '-100%'],
      opacity: [1, 0],
      duration: 700
    }, '+=250')
    .add({
      targets: '.site-header',
      translateY: [-24, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=350')
    .add({
      targets: '.eyebrow, .char, .hero-summary, .hero-actions .btn',
      translateY: [42, 0],
      rotate: [6, 0],
      opacity: [0, 1],
      delay: anime.stagger(22),
      duration: 900
    }, '-=400')
    .add({
      targets: '.motion-dot',
      scale: anime.stagger([0.45, 1.1], { grid: [13, 9], from: 'center' }),
      backgroundColor: anime.stagger(['#0e7c73', '#ec5b4f', '#ffb000', '#3157d5'], { grid: [13, 9], from: 'center' }),
      delay: anime.stagger(12, { grid: [13, 9], from: 'center' }),
      duration: 900
    }, '-=900')
    .add({
      targets: '.profile-panel, .signal-card, .pipeline-strip',
      translateY: [36, 0],
      scale: [0.94, 1],
      opacity: [0, 1],
      delay: anime.stagger(130),
      duration: 850
    }, '-=700')
    .finished.then(animateCounters);

  anime({
    targets: '.motion-dot',
    scale: [
      { value: 1.18, duration: 900 },
      { value: 0.62, duration: 900 }
    ],
    delay: anime.stagger(26, { grid: [13, 9], from: 'center' }),
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  });

  anime({
    targets: '.signal-card',
    translateY: [-8, 8],
    rotate: [-1, 1],
    duration: 2600,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    delay: anime.stagger(300)
  });
}

function bindInteractions() {
  const menu = qs('#menu');
  const navbar = qs('.navbar');

  menu?.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });

  qsa('.navbar a').forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
      menu?.setAttribute('aria-expanded', 'false');
    });
  });

  if (!hasAnime || prefersReducedMotion) return;

  qsa('.focus-grid article, .timeline article, .project-grid article, .contact-link, .btn').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      anime.remove(item);
      anime({ targets: item, translateY: -6, duration: 260, easing: 'easeOutQuad' });
    });

    item.addEventListener('mouseleave', () => {
      anime.remove(item);
      anime({ targets: item, translateY: 0, duration: 320, easing: 'easeOutQuad' });
    });
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    document.title = 'Somojit Banerjee | Cloud Security Architect';
    qs('#favicon')?.setAttribute('href', './assests/images/favicon.jpg');
  } else {
    document.title = 'Come Back To Portfolio';
    qs('#favicon')?.setAttribute('href', './assests/images/favhand.png');
  }
});

window.addEventListener('load', () => {
  buildMotionGrid();
  splitHeroTitle();
  bindInteractions();
  setActiveNav();
  revealOnScroll();
  runHeroAnimation();
});
