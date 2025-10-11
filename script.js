const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = [...document.querySelectorAll('.nav-list a')];
const sections = [...document.querySelectorAll('main .section')];

if (navToggle) {
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') ?? '';
    const isHashLink = href.startsWith('#');

    if (isHashLink) {
      event.preventDefault();
      const targetSection = document.querySelector(href);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    navList.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

sections.forEach((section) => section.classList.add('fade-in'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = navLinks.find((anchor) => anchor.getAttribute('href') === `#${id}`);

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (link) {
            navLinks.forEach((anchor) => anchor.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add('is-visible'));
}

let audioContext;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const now = ctx.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

  oscillator.connect(gainNode).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 1.2);
}

const trackCards = document.querySelectorAll('.track-card');

trackCards.forEach((card) => {
  card.addEventListener('click', () => {
    const frequency = parseFloat(card.dataset.frequency);
    if (!Number.isFinite(frequency)) return;

    playTone(frequency);
    card.classList.add('is-playing');
    setTimeout(() => card.classList.remove('is-playing'), 1200);
  });
});

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');

if (lightbox && lightboxImage && lightboxCaption) {
  const galleryTriggers = document.querySelectorAll('[data-lightbox-trigger]');
  let lastFocusedTrigger = null;

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src');
      const caption = trigger.getAttribute('data-lightbox-text') ?? '';
      const alt = trigger.getAttribute('data-lightbox-alt') ?? caption;

      if (!src) return;

      lastFocusedTrigger = trigger;
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightboxCaption.textContent = caption;
      lightbox.removeAttribute('hidden');
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      lightboxClose?.focus();
    });
  });

  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
});
