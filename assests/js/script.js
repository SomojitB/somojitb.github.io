document.documentElement.classList.add('js');

const supportsMatchMedia = typeof window.matchMedia === 'function';
const prefersReducedMotion = supportsMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = supportsMatchMedia && window.matchMedia('(pointer: fine)').matches;
const hasAnime = typeof window.anime === 'function';
let motionAllowed = hasAnime && !prefersReducedMotion;
let smoothScrollActive = false;
document.documentElement.dataset.motion = motionAllowed ? 'enabled' : 'static';
document.documentElement.classList.toggle('motion-enabled', motionAllowed);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function buildSignalGrid() {
  const grid = $('.signal-grid');
  if (!grid || grid.children.length) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 42; index += 1) {
    fragment.appendChild(document.createElement('span'));
  }
  grid.appendChild(fragment);
}

function showStaticFallback() {
  motionAllowed = false;
  document.documentElement.dataset.motion = 'static';
  document.documentElement.classList.remove('motion-enabled');
  if (hasAnime) window.anime.running.slice().forEach((animation) => animation.pause());

  const animatedElements = $$([
    '.site-header > *', '.hero-kicker', '.title-line > span', '.hero-intro',
    '.portrait-frame', '.hero-portrait figcaption', '.proof-strip > div',
    '.signal-grid span', '.marquee-track', '.availability-dot', '[data-reveal]',
    '.count', '.click-pulse', '.contact-signal i', '[data-language-current]',
    '[data-language-code]', '[data-magnetic]', '[data-tilt]', '[data-project-card]',
    '.project-image img', '.project-info b'
  ].join(','));
  animatedElements.forEach((element) => {
    element.style.removeProperty('transform');
    element.style.removeProperty('opacity');
  });

  $$('[data-reveal]').forEach((element) => {
    element.style.opacity = '1';
  });
  $$('.count').forEach((counter) => {
    counter.textContent = Number(counter.dataset.count).toLocaleString();
  });
}

function setupNavigation() {
  const menu = $('#menu');
  const nav = $('.navbar');
  if (!menu || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  menu.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    menu.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('nav-open', willOpen);

    if (motionAllowed && willOpen) {
      anime({
        targets: $$('.navbar a'),
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(55),
        duration: 480,
        easing: 'easeOutCubic'
      });
    }
  });

  $$('.navbar a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

function setupSmoothAnchors() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      const target = hash ? $(hash) : null;
      if (!target || !motionAllowed) return;

      event.preventDefault();
      const headerOffset = target.matches('[data-section]') ? 0 : 82;
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
      const distance = Math.abs(destination - window.scrollY);
      const duration = Math.min(720, Math.max(420, 360 + distance * 0.08));
      const headerElements = $$('.site-header > *');
      anime.remove(headerElements);
      anime.set(headerElements, { translateY: 0, opacity: 1 });
      anime.remove(document.scrollingElement);
      smoothScrollActive = true;
      anime({
        targets: document.scrollingElement,
        scrollTop: destination,
        duration,
        easing: 'easeInOutQuart',
        complete: () => {
          smoothScrollActive = false;
          history.replaceState(null, '', hash);
          if (link.classList.contains('skip-link')) target.focus({ preventScroll: true });
        }
      });
    });
  });
}

function setupInitialHashAlignment() {
  const navigationEntry = typeof window.performance?.getEntriesByType === 'function'
    ? window.performance.getEntriesByType('navigation')[0]
    : null;
  const isReload = navigationEntry
    ? navigationEntry.type === 'reload'
    : window.performance?.navigation?.type === 1;

  if (isReload) {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.history.replaceState(null, '', '#home');
    window.scrollTo(0, 0);
  }

  if (!window.location.hash) return;
  const initialHash = window.location.hash;

  let visitorHasInteracted = false;
  const cancelAlignment = () => { visitorHasInteracted = true; };
  ['keydown', 'pointerdown', 'touchstart', 'wheel'].forEach((eventName) => {
    window.addEventListener(eventName, cancelAlignment, { once: true, passive: true });
  });

  const align = () => {
    if (visitorHasInteracted || window.location.hash !== initialHash) return;
    const target = $(initialHash);
    if (!target) return;
    const headerOffset = target.matches('[data-section]') ? 0 : 82;
    const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
    window.scrollTo(0, destination);
  };

  window.addEventListener('load', () => {
    align();
    window.setTimeout(align, 350);
    window.setTimeout(align, 1100);
  });
}

function runHeroSequence() {
  if (!motionAllowed) return;

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.site-header > *',
      translateY: [-22, 0],
      opacity: [0, 1],
      delay: anime.stagger(50),
      duration: 760
    })
    .add({
      targets: '.hero-kicker',
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 560
    }, '-=430')
    .add({
      targets: '.title-line > span',
      translateY: ['108%', '0%'],
      delay: anime.stagger(90),
      duration: 900
    }, '-=370')
    .add({
      targets: '.hero-intro',
      translateY: [26, 0],
      opacity: [0, 1],
      duration: 620
    }, '-=520')
    .add({
      targets: '.portrait-frame, .hero-portrait figcaption',
      translateY: [42, 0],
      opacity: [0, 1],
      delay: anime.stagger(90),
      duration: 800
    }, '-=760')
    .add({
      targets: '.proof-strip > div',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(70),
      duration: 580
    }, '-=560')
    .add({
      targets: '.signal-grid span',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(14, { grid: [7, 6], from: 'center' }),
      duration: 420
    }, '-=590');

  anime({
    targets: '.availability-dot',
    scale: [1, 1.35],
    opacity: [1, 0.58],
    direction: 'alternate',
    loop: true,
    duration: 850,
    easing: 'easeInOutSine'
  });
}

function setupMarquee() {
  const track = $('.marquee-track');
  const firstGroup = track ? $('.marquee-group', track) : null;
  if (!track || !firstGroup || !motionAllowed) return;

  const run = () => {
    if (!motionAllowed) return;
    anime.remove(track);
    anime.set(track, { translateX: 0 });
    anime({
      targets: track,
      translateX: -firstGroup.getBoundingClientRect().width,
      duration: 24000,
      easing: 'linear',
      loop: true
    });
  };

  run();
  window.addEventListener('resize', run);
}

function setupRevealAnimations() {
  const elements = $$('[data-reveal]');
  if (!motionAllowed || !('IntersectionObserver' in window)) {
    showStaticFallback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!motionAllowed) {
      observer.disconnect();
      return;
    }
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      anime.remove(entry.target);
      anime({
        targets: entry.target,
        translateY: [32, 0],
        opacity: [0, 1],
        duration: 720,
        easing: 'easeOutCubic'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

  elements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = $$('.count');
  const proofStrip = $('.proof-strip');
  if (!proofStrip || counters.length === 0) return;

  const setFinalValues = () => counters.forEach((counter) => {
    counter.textContent = Number(counter.dataset.count).toLocaleString();
  });

  if (!motionAllowed || !('IntersectionObserver' in window)) {
    setFinalValues();
    return;
  }

  setFinalValues();
  const observer = new IntersectionObserver((entries) => {
    if (!motionAllowed) {
      observer.disconnect();
      return;
    }
    if (!entries.some((entry) => entry.isIntersecting)) return;
    counters.forEach((counter) => {
      anime.remove(counter);
    });
    anime({
      targets: counters,
      scale: [0.72, 1],
      opacity: [0, 1],
      delay: anime.stagger(90),
      duration: 760,
      easing: 'easeOutElastic(1, .72)'
    });
    observer.disconnect();
  }, { threshold: 0.45 });
  observer.observe(proofStrip);
}

function setupPointerMotion() {
  if (!motionAllowed || !hasFinePointer) return;

  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  let pointerX = -80;
  let pointerY = -80;
  let ringX = -80;
  let ringY = -80;

  const renderCursor = () => {
    if (!motionAllowed) return;
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    if (ring) {
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  };

  window.addEventListener('pointermove', (event) => {
    if (!motionAllowed) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (dot) {
      dot.style.left = `${pointerX}px`;
      dot.style.top = `${pointerY}px`;
    }
  }, { passive: true });
  renderCursor();

  const interactiveSelector = 'a, button, summary, [data-project-card], [data-spotlight]';
  $$(interactiveSelector).forEach((element) => {
    element.addEventListener('pointerenter', () => ring?.classList.add('is-active'));
    element.addEventListener('pointerleave', () => ring?.classList.remove('is-active'));
  });

  $$('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      if (!motionAllowed) return;
      const rect = element.getBoundingClientRect();
      anime.remove(element);
      anime({
        targets: element,
        translateX: (event.clientX - rect.left - rect.width / 2) * 0.14,
        translateY: (event.clientY - rect.top - rect.height / 2) * 0.14,
        duration: 230,
        easing: 'easeOutQuad'
      });
    });
    element.addEventListener('pointerleave', () => {
      if (!motionAllowed) return;
      anime.remove(element);
      anime({ targets: element, translateX: 0, translateY: 0, duration: 520, easing: 'easeOutElastic(1, .55)' });
    });
  });

  const portrait = $('[data-tilt]');
  portrait?.addEventListener('pointermove', (event) => {
    if (!motionAllowed) return;
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    anime.remove(portrait);
    anime({ targets: portrait, rotateY: x * 7, rotateX: y * -7, duration: 360, easing: 'easeOutCubic' });
  });
  portrait?.addEventListener('pointerleave', () => {
    if (!motionAllowed) return;
    anime.remove(portrait);
    anime({ targets: portrait, rotateX: 0, rotateY: 0, duration: 650, easing: 'easeOutElastic(1, .6)' });
  });

  $$('[data-project-card]').forEach((card) => {
    const image = $('.project-image img', card);
    const arrow = $('.project-info b', card);
    card.addEventListener('pointerenter', () => {
      if (!motionAllowed) return;
      anime.remove([card, image, arrow]);
      anime({ targets: card, translateY: -7, duration: 260, easing: 'easeOutCubic' });
      anime({ targets: image, scale: 1.035, duration: 650, easing: 'easeOutCubic' });
      anime({ targets: arrow, translateX: 5, translateY: -5, duration: 280, easing: 'easeOutCubic' });
    });
    card.addEventListener('pointerleave', () => {
      if (!motionAllowed) return;
      anime.remove([card, image, arrow]);
      anime({ targets: card, translateY: 0, duration: 360, easing: 'easeOutCubic' });
      anime({ targets: image, scale: 1, duration: 520, easing: 'easeOutCubic' });
      anime({ targets: arrow, translateX: 0, translateY: 0, duration: 300, easing: 'easeOutCubic' });
    });
  });

  $$('[data-spotlight]').forEach((entry) => {
    entry.addEventListener('pointermove', (event) => {
      const rect = entry.getBoundingClientRect();
      entry.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      entry.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  });
}

function setupClickFeedback() {
  const pulse = $('.click-pulse');
  if (!pulse || !motionAllowed) return;

  document.addEventListener('pointerdown', (event) => {
    if (!motionAllowed) return;
    if (event.button !== 0) return;
    anime.remove(pulse);
    pulse.style.left = `${event.clientX}px`;
    pulse.style.top = `${event.clientY}px`;
    anime({
      targets: pulse,
      translateX: '-50%',
      translateY: '-50%',
      scale: [0.2, 4.5],
      opacity: [0.9, 0],
      duration: 520,
      easing: 'easeOutCubic'
    });
  }, { passive: true });

  $$('a, button, summary').forEach((element) => {
    element.addEventListener('pointerdown', () => {
      if (!motionAllowed) return;
      anime.remove(element);
      anime({ targets: element, scale: [0.97, 1], duration: 300, easing: 'easeOutElastic(1, .7)' });
    });
  });
}

function setupLanguageMotion() {
  const panel = $('[data-language-card]');
  const current = panel ? $('[data-language-current]', panel) : null;
  const codes = panel ? $$('[data-language-code]', panel) : [];
  if (!panel || !current || codes.length === 0 || !motionAllowed) return;

  const languages = ['English', 'Hindi', 'Bengali', 'Spanish'];
  let index = 0;
  let visible = !('IntersectionObserver' in window);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.25 });
    observer.observe(panel);
  }

  window.setInterval(() => {
    if (!motionAllowed || !visible || document.hidden) return;
    index = (index + 1) % languages.length;
    anime.remove(current);
    anime({
      targets: current,
      translateY: [0, -20],
      opacity: [1, 0],
      duration: 240,
      easing: 'easeInCubic',
      complete: () => {
        current.textContent = languages[index];
        codes.forEach((code, codeIndex) => code.classList.toggle('active', codeIndex === index));
        anime({ targets: current, translateY: [20, 0], opacity: [0, 1], duration: 390, easing: 'easeOutExpo' });
        anime({ targets: codes[index], scale: [0.72, 1], duration: 430, easing: 'easeOutElastic(1, .65)' });
      }
    });
  }, 1800);
}

function setupContactMotion() {
  const routes = $$('[data-contact-route]');
  if (!routes.length) return;

  if (motionAllowed && hasFinePointer) {
    routes.forEach((route) => {
      const details = $$(':scope > span:not(.contact-signal), :scope > strong, :scope > small, :scope > b', route);
      route.addEventListener('pointerenter', () => {
        if (!motionAllowed) return;
        anime.remove(details);
        anime({ targets: details, translateX: [0, 7], delay: anime.stagger(28), duration: 260, easing: 'easeOutCubic' });
      });
      route.addEventListener('pointerleave', () => {
        if (!motionAllowed) return;
        anime.remove(details);
        anime({ targets: details, translateX: 0, duration: 240, easing: 'easeOutCubic' });
      });
    });
  }

  const disclosure = $('.phone-disclosure');
  disclosure?.addEventListener('toggle', () => {
    if (!motionAllowed || !disclosure.open) return;
    anime({
      targets: $$('.phone-options a', disclosure),
      translateY: [14, 0],
      opacity: [0, 1],
      delay: anime.stagger(65),
      duration: 420,
      easing: 'easeOutCubic'
    });
  });

  if (motionAllowed) {
    anime({
      targets: '.contact-signal i',
      scaleY: [0.28, 1],
      opacity: [0.45, 1],
      delay: anime.stagger(105),
      duration: 700,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }
}

function setupScrollMotion() {
  const progress = $('.scroll-progress span');
  const header = $('[data-header]');
  const images = $$('[data-scroll-image]');
  const sections = $$('[data-section][id]');
  const navLinks = $$('.navbar a');
  let ticking = false;

  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
    header?.classList.toggle('compact', window.scrollY > 40);

    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.34) currentSection = section;
    });
    const currentHref = currentSection ? `#${currentSection.id}` : '#home';
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === currentHref));

    if (motionAllowed && !smoothScrollActive && window.innerWidth > 920) {
      images.forEach((image) => {
        const frame = image.parentElement;
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        image.style.transform = `translateY(${(-7 - offset * 7).toFixed(2)}%)`;
      });
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

function setupSignalMotion() {
  if (!motionAllowed) return;
  anime({
    targets: '.signal-grid span',
    translateY: () => anime.random(-6, 6),
    scale: () => anime.random(72, 118) / 100,
    opacity: () => anime.random(36, 100) / 100,
    delay: anime.stagger(48, { grid: [7, 6], from: 'center' }),
    duration: 1700,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}

function setupPageDetails() {
  const favicon = $('#favicon');
  document.addEventListener('visibilitychange', () => {
    const visible = document.visibilityState === 'visible';
    document.title = visible ? 'Somojit Banerjee | Cloud Security Architect' : 'Come Back To Portfolio';
    favicon?.setAttribute('href', visible ? './assests/images/favicon.jpg' : './assests/images/favhand.png');
  });
  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
}

try {
  buildSignalGrid();
  setupNavigation();
  setupSmoothAnchors();
  setupInitialHashAlignment();
  setupRevealAnimations();
  setupCounters();
  setupPointerMotion();
  setupClickFeedback();
  setupLanguageMotion();
  setupContactMotion();
  setupScrollMotion();
  setupPageDetails();

  if (motionAllowed) {
    runHeroSequence();
    setupMarquee();
    setupSignalMotion();
  } else {
    showStaticFallback();
  }
} catch (error) {
  showStaticFallback();
  console.error('Portfolio interaction layer could not initialize.', error);
}
