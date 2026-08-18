/* =========================================
   RALUCA PĂDURARU — main.js
   ========================================= */

/* ============================
   0. ANNOUNCEMENT BAR
   ----------------------------
   Bara e HTML static in fiecare pagina (primul copil din <body>, plus
   clasa has-announce-bar pe <body>). Nu se mai injecteaza din JS: asa
   evitam shift-ul de layout la incarcare si ramane crawlabila.
   ============================ */
(function initAnnounceMarquee() {
  const bar  = document.querySelector('.announce-bar');
  const link = bar && bar.querySelector('a');
  if (!bar || !link) return;

  // Cine cere miscare redusa ramane pe comportamentul static existent
  // (prefix ascuns sub 480px + ellipsis): nu construim deloc marquee-ul.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Mutam link-ul intr-un track si adaugam o clona, ca bucla sa fie continua.
  // Clona e ascunsa pentru screen readere si scoasa din ordinea de tab.
  const track = document.createElement('div');
  track.className = 'announce-track';
  bar.appendChild(track);
  track.appendChild(link);

  const clone = link.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('tabindex', '-1');
  track.appendChild(clone);
  bar.classList.add('is-marquee');

  // Animatia porneste doar sub 600px (CSS); aici doar calculam durata,
  // ca viteza sa ramana constanta indiferent cat de lung e anuntul.
  const narrow = window.matchMedia('(max-width: 600px)');
  const SPEED  = 45; // px pe secunda

  function setSpeed() {
    if (!narrow.matches) { track.style.animationDuration = ''; return; }
    const loop = track.scrollWidth / 2; // latimea unei singure copii
    if (loop > 0) track.style.animationDuration = (loop / SPEED).toFixed(1) + 's';
  }
  setSpeed();
  // fonturile web schimba latimea textului -> recalculam dupa ce s-au incarcat
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setSpeed);
  narrow.addEventListener('change', setSpeed);
  window.addEventListener('resize', setSpeed, { passive: true });

  // Pauza cat timp degetul (sau mouse-ul) e pe banda.
  const pause  = () => bar.classList.add('is-paused');
  const resume = () => bar.classList.remove('is-paused');
  bar.addEventListener('pointerdown', pause);
  bar.addEventListener('pointerup', resume);
  bar.addEventListener('pointercancel', resume);
  bar.addEventListener('pointerleave', resume);
})();


/* ============================
   1. NAV SCROLL
   ============================ */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================
   3. MOBILE MENU
   ============================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================
   4. FAQ ACCORDION
   ============================ */
(function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ============================
   5. TESTIMONIAL SLIDER
   ============================ */
(function initTestimonialSlider() {
  const slider = document.getElementById('testimonials-slider');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  if (!slider || !btnPrev || !btnNext) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let current = 0;

  function perView() {
    return window.innerWidth <= 920 ? 1 : 3;
  }
  function maxIdx() {
    return Math.max(0, cards.length - perView());
  }
  function getCardWidth() {
    const card = cards[0];
    if (!card) return 404;
    return card.offsetWidth + 24; // card + gap
  }
  function update() {
    current = Math.max(0, Math.min(maxIdx(), current));
    slider.scrollTo({ left: current * getCardWidth(), behavior: 'smooth' });
    btnPrev.disabled = current <= 0;
    btnNext.disabled = current >= maxIdx();
  }

  btnPrev.addEventListener('click', () => { current -= perView(); update(); });
  btnNext.addEventListener('click', () => { current += perView(); update(); });
  window.addEventListener('resize', update);

  // Touch/drag support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { current += diff > 0 ? 1 : -1; update(); }
  });

  btnPrev.disabled = true;
  btnNext.disabled = maxIdx() <= 0;
})();

/* ============================
   7. SMOOTH SCROLL (anchor links)
   ============================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================
   8. DYNAMIC COPYRIGHT YEAR
   ============================ */
(function initCopyrightYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.footer-copy, .copyright-inline').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/© \d{4}/, '© ' + year);
  });
})();
