/* =========================================
   RALUCA PĂDURARU — main.js
   ========================================= */

/* ============================
   0. ANNOUNCEMENT BAR
   ============================ */
(function injectAnnounceBar() {
  if (window.location.pathname.includes('viitoruri')) return;
  const bar = document.createElement('div');
  bar.className = 'announce-bar';
  bar.innerHTML = '<a href="/viitoruri">'
    + '<span class="announce-dot"></span>'
    + 'White paper nou: 4 viitoruri ale muncii \xeen Rom\xe2nia 2030 \u2192 Cite\u0219te-l \u0219i tu. Deja a fost desc\u0103rcat de +400 ori.'
    + '</a>';
  document.body.insertBefore(bar, document.body.firstChild);
  document.body.classList.add('has-announce-bar');
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

  function getCardWidth() {
    const card = cards[0];
    if (!card) return 404;
    return card.offsetWidth + 24; // card + gap
  }

  function scrollTo(index) {
    const maxIdx = cards.length - 1;
    current = Math.max(0, Math.min(maxIdx, index));
    slider.scrollTo({ left: current * getCardWidth(), behavior: 'smooth' });
  }

  btnPrev.addEventListener('click', () => scrollTo(current - 1));
  btnNext.addEventListener('click', () => scrollTo(current + 1));

  // Auto-slide every 5s
  let autoTimer = setInterval(() => {
    current = (current + 1) % cards.length;
    scrollTo(current);
  }, 5000);

  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => {
      current = (current + 1) % cards.length;
      scrollTo(current);
    }, 5000);
  });

  // Touch/drag support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) scrollTo(diff > 0 ? current + 1 : current - 1);
  });
})();

/* ============================
   6. FADE-UP ON SCROLL
   ============================ */
(function initFadeUp() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
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
