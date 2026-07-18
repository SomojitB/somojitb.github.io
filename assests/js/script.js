document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasAnime = typeof anime !== 'undefined';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function buildDots() {
  const board = $('.dot-board');
  if (!board) return;
  board.innerHTML = Array.from({ length: 63 }, (_, index) => `<span class="dot" style="--index:${index}"></span>`).join('');
}

function markAnimatedElements() {
  $$('.hero-copy > *, .profile-card, .code-card, .stats article, .tool-grid article, .skill-strip span, .timeline article, .project-grid article, .credential-card, .contact').forEach((item) => {
    item.classList.add('will-animate');
  });
}

function setupNavigation() {
  const menu = $('#menu');
  const nav = $('.navbar');
  menu?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.navbar a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu?.setAttribute('aria-expanded', 'false');
    });
  });
}

function animateCounters() {
  $$('.count').forEach((counter) => {
    const target = Number(counter.dataset.count || counter.textContent.replace(/,/g, ''));
    if (!hasAnime || prefersReducedMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }
    const state = { value: 0 };
    anime({
      targets: state,
      value: target,
      round: 1,
      duration: 1400,
      easing: 'easeOutExpo',
      update: () => {
        counter.textContent = state.value.toLocaleString();
      }
    });
  });
}

function revealOnScroll() {
  const items = $$('.stats article, .tool-grid article, .skill-strip span, .timeline article, .project-grid article, .credential-card, .contact');
  if (!hasAnime || prefersReducedMotion) {
    items.forEach((item) => item.classList.remove('will-animate'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        translateY: [24, 0],
        scale: [.98, 1],
        duration: 650,
        easing: 'easeOutCubic'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  items.forEach((item) => observer.observe(item));
}

function runMotion() {
  if (runMotion.started) return;
  runMotion.started = true;

  if (!hasAnime || prefersReducedMotion) {
    animateCounters();
    return;
  }

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.hero-copy > *',
      translateY: [28, 0],
      scale: [.985, 1],
      delay: anime.stagger(80),
      duration: 720
    })
    .add({
      targets: '.dot',
      scale: anime.stagger([.45, 1.05], { grid: [9, 7], from: 'center' }),
      backgroundColor: anime.stagger(['#7ee081', '#f6d743', '#ff6b5f', '#5f7cff'], { grid: [9, 7], from: 'center' }),
      delay: anime.stagger(14, { grid: [9, 7], from: 'center' }),
      duration: 780
    }, '-=600')
    .add({
      targets: '.profile-card, .code-card',
      translateY: [24, 0],
      scale: [.98, 1],
      delay: anime.stagger(120),
      duration: 720
    }, '-=520')
    .finished.then(animateCounters);

  anime({
    targets: '.dot',
    scale: [
      { value: 1.08, duration: 900 },
      { value: .72, duration: 900 }
    ],
    delay: anime.stagger(28, { grid: [9, 7], from: 'center' }),
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}

function bindHoverMotion() {
  if (!hasAnime || prefersReducedMotion) return;
  $$('.button, .tool-grid article, .project-grid article, .contact-list a').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      anime.remove(item);
      anime({ targets: item, translateY: -4, duration: 220, easing: 'easeOutQuad' });
    });
    item.addEventListener('mouseleave', () => {
      anime.remove(item);
      anime({ targets: item, translateY: 0, duration: 260, easing: 'easeOutQuad' });
    });
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    document.title = 'Somojit Banerjee | Cloud Security Architect';
    $('#favicon')?.setAttribute('href', './assests/images/favicon.jpg');
  } else {
    document.title = 'Come Back To Portfolio';
    $('#favicon')?.setAttribute('href', './assests/images/favhand.png');
  }
});

buildDots();
markAnimatedElements();
setupNavigation();
revealOnScroll();
bindHoverMotion();
window.addEventListener('load', runMotion);
requestAnimationFrame(runMotion);
