document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasAnime = typeof window.anime === 'function';
const motionAllowed = hasAnime && !prefersReducedMotion;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function buildSignalGrid() {
  const grid = $('.signal-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 48; index += 1) {
    const dot = document.createElement('span');
    dot.dataset.index = String(index);
    fragment.appendChild(dot);
  }
  grid.appendChild(fragment);
}

function showStaticFallback() {
  $$('[data-reveal]').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
  $$('[data-timeline-item]').forEach((element) => {
    element.style.transform = 'none';
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
        targets: '.navbar a',
        translateY: [24, 0],
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
      const target = $(link.getAttribute('href'));
      if (!target || !motionAllowed) return;

      event.preventDefault();
      const headerOffset = 88;
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
      anime.remove(document.scrollingElement);
      anime({
        targets: document.scrollingElement,
        scrollTop: destination,
        duration: 900,
        easing: 'easeInOutQuart'
      });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });
}

function runHeroSequence() {
  if (!motionAllowed) return;

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.site-header > *',
      translateY: [-24, 0],
      opacity: [0, 1],
      delay: anime.stagger(55),
      duration: 850
    })
    .add({
      targets: '.hero-kicker',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 650
    }, '-=500')
    .add({
      targets: '.title-line > span',
      translateY: ['105%', '0%'],
      delay: anime.stagger(90),
      duration: 920
    }, '-=420')
    .add({
      targets: '.hero-bottom',
      translateY: [26, 0],
      opacity: [0, 1],
      duration: 680
    }, '-=530')
    .add({
      targets: '.portrait-frame',
      translateY: [48, 0],
      rotate: [2.5, 0],
      opacity: [0, 1],
      duration: 950
    }, '-=880')
    .add({
      targets: '.hero-portrait figcaption, .orbit-label',
      translateY: [18, 0],
      scale: [0.94, 1],
      opacity: [0, 1],
      delay: anime.stagger(75),
      duration: 600
    }, '-=560')
    .add({
      targets: '.signal-grid span',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(16, { grid: [6, 8], from: 'center' }),
      duration: 500
    }, '-=620');

  anime({
    targets: '.availability-dot',
    scale: [1, 1.38],
    opacity: [1, 0.62],
    direction: 'alternate',
    loop: true,
    duration: 900,
    easing: 'easeInOutSine'
  });
}

function setupMarquee() {
  const track = $('.marquee-track');
  const firstGroup = $('.marquee-group', track || document);
  if (!track || !firstGroup || !motionAllowed) return;

  const run = () => {
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
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      anime.remove(entry.target);
      anime({
        targets: entry.target,
        translateY: [34, 0],
        opacity: [0, 1],
        duration: 760,
        easing: 'easeOutCubic'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  elements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = $$('.count');
  const impact = $('#impact');
  if (!impact || counters.length === 0) return;

  const setFinalValues = () => {
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.count).toLocaleString();
    });
  };

  if (!motionAllowed || !('IntersectionObserver' in window)) {
    setFinalValues();
    return;
  }

  counters.forEach((counter) => { counter.textContent = '0'; });
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;

    counters.forEach((counter, index) => {
      const state = { value: 0 };
      const target = Number(counter.dataset.count);
      anime({
        targets: state,
        value: target,
        round: 1,
        delay: index * 85,
        duration: 1500,
        easing: 'easeOutExpo',
        update: () => { counter.textContent = state.value.toLocaleString(); },
        complete: () => { counter.textContent = target.toLocaleString(); }
      });
    });
    observer.disconnect();
  }, { threshold: 0.28 });
  observer.observe(impact);
}

function setupTimelineFocus() {
  const items = $$('[data-timeline-item]');
  if (items.length === 0) return;

  items[0].classList.add('active');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      items.forEach((item) => item.classList.toggle('active', item === entry.target));
      if (motionAllowed) {
        anime.timeline({ easing: 'easeOutCubic' })
          .add({ targets: entry.target, translateY: [22, 0], duration: 600 })
          .add({
            targets: $$('.role-details li', entry.target),
            translateX: [14, 0],
            opacity: [0.35, 1],
            delay: anime.stagger(55),
            duration: 420
          }, '-=360');
      } else {
        entry.target.style.transform = 'none';
      }
    });
  }, { threshold: 0.5, rootMargin: '-12% 0px -28% 0px' });

  items.forEach((item) => observer.observe(item));
}

function setupEducationFocus() {
  const chapters = $$('.education-chapter');
  if (chapters.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    chapters.forEach((chapter) => chapter.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapters.forEach((chapter) => chapter.classList.toggle('active', chapter === entry.target));
      if (motionAllowed) {
        anime({
          targets: $$('.chapter-meta, .education-copy h3, .education-copy > strong, .education-copy > p', entry.target),
          translateY: [18, 0],
          opacity: [0.35, 1],
          delay: anime.stagger(70),
          duration: 620,
          easing: 'easeOutCubic'
        });
      }
    });
  }, { threshold: 0.42, rootMargin: '-8% 0px -18% 0px' });

  chapters.forEach((chapter) => observer.observe(chapter));
}

function setupPointerInteractions() {
  if (!motionAllowed || !window.matchMedia('(pointer: fine)').matches) return;

  $$('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      anime.remove(element);
      anime({
        targets: element,
        translateX: (event.clientX - rect.left - rect.width / 2) * 0.14,
        translateY: (event.clientY - rect.top - rect.height / 2) * 0.14,
        duration: 260,
        easing: 'easeOutQuad'
      });
    });
    element.addEventListener('pointerleave', () => {
      anime.remove(element);
      anime({ targets: element, translateX: 0, translateY: 0, duration: 500, easing: 'easeOutElastic(1, .55)' });
    });
  });

  const portrait = $('[data-tilt]');
  portrait?.addEventListener('pointermove', (event) => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    anime.remove(portrait);
    anime({ targets: portrait, rotateY: x * 7, rotateX: y * -7, duration: 400, easing: 'easeOutCubic' });
  });
  portrait?.addEventListener('pointerleave', () => {
    anime.remove(portrait);
    anime({ targets: portrait, rotateX: 0, rotateY: 0, duration: 700, easing: 'easeOutElastic(1, .6)' });
  });

  $$('[data-project-card]').forEach((card) => {
    card.addEventListener('pointerenter', () => {
      anime.remove(card);
      anime({ targets: card, translateY: -7, duration: 280, easing: 'easeOutCubic' });
    });
    card.addEventListener('pointerleave', () => {
      anime.remove(card);
      anime({ targets: card, translateY: 0, duration: 360, easing: 'easeOutCubic' });
    });
  });

  $$('[data-spotlight]').forEach((row) => {
    row.addEventListener('pointermove', (event) => {
      const rect = row.getBoundingClientRect();
      row.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      row.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      row.style.setProperty('--spotlight-left', `${event.clientX - rect.left}px`);
      row.style.setProperty('--spotlight-top', `${event.clientY - rect.top}px`);
    });
  });
}

function setupClickFeedback() {
  const pulse = $('.click-pulse');
  if (!pulse || !motionAllowed) return;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    anime.remove(pulse);
    anime.set(pulse, { left: event.clientX, top: event.clientY });
    anime({
      targets: pulse,
      scale: [0, 5],
      opacity: [0.9, 0],
      duration: 520,
      easing: 'easeOutCubic'
    });
  }, { passive: true });
}

function setupContactMotion() {
  const cards = $$('[data-contact-card]');
  const channelGrid = $('.contact-channels');
  if (cards.length === 0 || !channelGrid) return;

  if (motionAllowed && 'IntersectionObserver' in window) {
    anime.set(cards, { translateY: 34, opacity: 0 });
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      anime({
        targets: cards,
        translateY: [34, 0],
        opacity: [0, 1],
        delay: anime.stagger(85),
        duration: 720,
        easing: 'easeOutExpo'
      });
      observer.disconnect();
    }, { threshold: 0.16 });
    observer.observe(channelGrid);
  }

  if (motionAllowed && window.matchMedia('(pointer: fine)').matches) {
    cards.forEach((card) => {
      const details = $$(':scope > span:not(.contact-signal), :scope > strong, :scope > small, .language-stage', card);
      card.addEventListener('pointerenter', () => {
        anime.remove([card, ...details]);
        anime({ targets: card, translateY: -6, scale: 1.012, duration: 280, easing: 'easeOutCubic' });
        anime({ targets: details, translateX: [0, 8], delay: anime.stagger(35), duration: 300, easing: 'easeOutCubic' });
      });
      card.addEventListener('pointerleave', () => {
        anime.remove([card, ...details]);
        anime({ targets: card, translateY: 0, scale: 1, duration: 420, easing: 'easeOutElastic(1, .7)' });
        anime({ targets: details, translateX: 0, duration: 260, easing: 'easeOutCubic' });
      });
    });
  }

  $$('a[data-contact-card]').forEach((card) => {
    card.addEventListener('pointerdown', () => {
      if (!motionAllowed) return;
      anime.remove(card);
      anime({ targets: card, scale: [0.975, 1], duration: 360, easing: 'easeOutElastic(1, .65)' });
    });
  });

  const phoneDisclosure = $('.contact-phone-disclosure');
  phoneDisclosure?.addEventListener('toggle', () => {
    if (!motionAllowed || !phoneDisclosure.open) return;
    anime({
      targets: $$('.contact-phone-options a', phoneDisclosure),
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(70),
      duration: 460,
      easing: 'easeOutCubic'
    });
  });

  if (!motionAllowed) return;

  anime({
    targets: '.contact-signal i',
    scaleY: [0.28, 1],
    opacity: [0.45, 1],
    delay: anime.stagger(110),
    duration: 720,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });

  const languageCard = $('[data-language-card]');
  const currentLanguage = $('[data-language-current]', languageCard || document);
  const languageCodes = $$('[data-language-code]', languageCard || document);
  if (!languageCard || !currentLanguage || languageCodes.length === 0) return;

  const languages = ['English', 'Hindi', 'Bengali', 'Spanish'];
  let languageIndex = 0;
  let languageVisible = false;

  if ('IntersectionObserver' in window) {
    const languageObserver = new IntersectionObserver((entries) => {
      languageVisible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.18 });
    languageObserver.observe(languageCard);
  } else {
    languageVisible = true;
  }

  window.setInterval(() => {
    if (!languageVisible || document.hidden) return;
    languageIndex = (languageIndex + 1) % languages.length;
    anime.remove(currentLanguage);
    anime({
      targets: currentLanguage,
      translateY: [0, -22],
      opacity: [1, 0],
      duration: 260,
      easing: 'easeInCubic',
      complete: () => {
        currentLanguage.textContent = languages[languageIndex];
        languageCodes.forEach((code, index) => code.classList.toggle('active', index === languageIndex));
        anime({
          targets: currentLanguage,
          translateY: [22, 0],
          opacity: [0, 1],
          duration: 420,
          easing: 'easeOutExpo'
        });
        anime({
          targets: languageCodes[languageIndex],
          scale: [0.72, 1],
          rotate: [-8, 0],
          duration: 460,
          easing: 'easeOutElastic(1, .65)'
        });
      }
    });
  }, 1800);
}

function setupScrollMotion() {
  const progress = $('.scroll-progress span');
  const header = $('[data-header]');
  const timelineSection = $('#experience');
  const timelineMeter = $('.timeline-meter span');
  const parallaxImages = $$('[data-scroll-image]');
  const sections = $$('[data-section][id]');
  const navLinks = $$('.navbar a');
  let ticking = false;

  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progressValue = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    if (progress) progress.style.transform = `scaleX(${progressValue})`;
    header?.classList.toggle('compact', window.scrollY > 40);

    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.34) {
        currentSection = section;
      }
    });
    const currentHref = currentSection ? `#${currentSection.id}` : '#home';
    const hasMatchingLink = navLinks.some((link) => link.getAttribute('href') === currentHref);
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === (hasMatchingLink ? currentHref : '#home'));
    });

    if (timelineSection && timelineMeter) {
      const rect = timelineSection.getBoundingClientRect();
      const travel = timelineSection.offsetHeight - window.innerHeight * 0.55;
      const amount = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / Math.max(1, travel)));
      timelineMeter.style.transform = `scaleX(${amount})`;
    }

    if (motionAllowed) {
      parallaxImages.forEach((image) => {
        const rect = image.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const centerDelta = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        image.style.transform = `translateY(${(-7 - centerDelta * 8).toFixed(2)}%)`;
      });
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function setupSignalMotion() {
  if (!motionAllowed) return;
  anime({
    targets: '.signal-grid span',
    translateY: () => anime.random(-6, 6),
    scale: () => anime.random(70, 120) / 100,
    opacity: () => anime.random(35, 100) / 100,
    delay: anime.stagger(55, { grid: [6, 8], from: 'center' }),
    duration: 1800,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}

function setupPageTitle() {
  const favicon = $('#favicon');
  document.addEventListener('visibilitychange', () => {
    const isVisible = document.visibilityState === 'visible';
    document.title = isVisible
      ? 'Somojit Banerjee | Cloud Security Architect'
      : 'Come Back To Portfolio';
    favicon?.setAttribute('href', isVisible ? './assests/images/favicon.jpg' : './assests/images/favhand.png');
  });
  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
}

buildSignalGrid();
setupNavigation();
setupSmoothAnchors();
setupRevealAnimations();
setupCounters();
setupTimelineFocus();
setupEducationFocus();
setupPointerInteractions();
setupClickFeedback();
setupContactMotion();
setupScrollMotion();
setupPageTitle();

if (motionAllowed) {
  runHeroSequence();
  setupMarquee();
  setupSignalMotion();
} else {
  showStaticFallback();
}
