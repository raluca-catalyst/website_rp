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

/* ============================
   9. FIRUL (puncte si linii, ca in carusele)
   ----------------------------
   Un fir punctat coboara pe margini prin toata pagina, schimba partea la
   granita dintre sectiuni si se opreste deasupra CTA-ului de jos. Punctul
   amber merge pe fir odata cu scroll-ul. Totul se deseneaza din DOM, deci
   merge pe orice pagina cu <main> fara modificari in HTML.
   ============================ */
(function initFir() {
  if (!document.querySelector('main')) return;
  // Build Your Cortex isi pastreaza reteaua din hero, fara fir
  if (document.querySelector('.byc-hero')) return;
  const NS = 'http://www.w3.org/2000/svg';
  const R = 24;          // raza colturilor
  const MIN_SWITCH = 320; // sectiunile mai scurte nu schimba partea

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'fir');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('class', 'fir-linie');
  const end = document.createElementNS(NS, 'circle');
  end.setAttribute('class', 'fir-capat');
  end.setAttribute('r', '5');
  const halo = document.createElementNS(NS, 'circle');
  halo.setAttribute('class', 'fir-halo');
  halo.setAttribute('r', '15');
  const node = document.createElementNS(NS, 'circle');
  node.setAttribute('class', 'fir-nod');
  node.setAttribute('r', '7');
  svg.append(path, end, halo, node);

  const B = 150;  // cat scroll (px) dureaza o traversare orizontala, de fiecare parte
  let len = 0;
  let keys = [];  // perechi [pozitie in pagina, distanta pe fir]
  let mainTop = 0;
  let main = null;

  function build() {
    // unele pagini au doua <main> (faza „in curand" si cea lansata) si aleg
    // dupa ce ruleaza scriptul asta -> il luam de fiecare data pe cel vizibil
    const m = [...document.querySelectorAll('main')]
      .sort((a, b) => b.offsetHeight - a.offsetHeight)[0];
    if (!m.offsetHeight) return;
    if (m !== main) {
      main = m;
      main.style.position = 'relative';
      main.appendChild(svg);
    }
    const blocks = [...main.children].filter(el => el !== svg && el.offsetHeight > 0);
    if (!blocks.length) { svg.style.display = 'none'; return; }
    svg.style.display = '';

    const W = main.clientWidth;
    mainTop = main.getBoundingClientRect().top + window.scrollY;
    const top = el => el.getBoundingClientRect().top + window.scrollY - mainTop;

    // marginea textului: din primul .container gasit, altfel latimea standard
    const box = main.querySelector('.container');
    let cl = (W - 1100) / 2 + 40;
    if (box) {
      const r = box.getBoundingClientRect();
      cl = r.left - main.getBoundingClientRect().left + parseFloat(getComputedStyle(box).paddingLeft);
    }
    const xL = Math.max(6, cl - 56);
    const xR = W - xL;

    // granitele dintre sectiuni. Firul se opreste deasupra CTA-ului de jos;
    // paginile fara CTA il opresc la capatul ultimei sectiuni.
    // Traversarea nu sta pe granita propriu-zisa (unele sectiuni n-au spatiu
    // deasupra cardului), ci la mijlocul golului dintre continutul celor doua.
    const edge = (el, side) => {
      const c = el.querySelector(':scope > .container') || el;
      const kids = [...c.children].filter(k => k !== svg && k.offsetHeight > 0 &&
        getComputedStyle(k).position !== 'absolute' && getComputedStyle(k).position !== 'fixed');
      if (!kids.length) return null;
      const ys = kids.map(k => { const r = k.getBoundingClientRect(); return side === 'top' ? r.top : r.bottom; });
      return (side === 'top' ? Math.min(...ys) : Math.max(...ys)) + window.scrollY - mainTop;
    };
    const tops = blocks.slice(1).map((b, i) => {
      const lo = edge(blocks[i], 'bottom'), hi = edge(b, 'top');
      return lo !== null && hi !== null && hi > lo ? (lo + hi) / 2 : top(b);
    });
    const lastBlock = blocks[blocks.length - 1];
    if (!lastBlock.classList.contains('footer-cta')) {
      const lo = edge(lastBlock, 'bottom');
      tops.push(lo !== null && lo < main.offsetHeight ? (lo + main.offsetHeight) / 2 : main.offsetHeight - 40);
    }
    const last = tops[tops.length - 1];

    // pornirea: in primul ecran, ca punctul sa se vada de la inceput.
    // Firul intra pe orizontala (ca pe coperta caruselului) doar daca golul de
    // sub prima sectiune e in primul ecran; altfel ar taia o poza sau textul,
    // asa ca porneste direct pe verticala, pe margine. La fel pe ecran ingust.
    const narrow = xL <= 16;
    const fold = window.innerHeight - mainTop - 90;
    const flat = !narrow && tops[0] <= fold;
    let y0 = flat ? tops[0] : Math.min(tops[0] - R, (window.innerHeight - mainTop) * 0.6);
    node.setAttribute('r', narrow ? 5 : 7);  // pe telefon punctul nu are voie sa acopere textul
    halo.setAttribute('r', narrow ? 9 : 15);
    let d = flat
      ? `M ${cl} ${y0} L ${xR - R} ${y0} Q ${xR} ${y0} ${xR} ${y0 + R}`
      : `M ${xR} ${y0}`;

    // Pe homepage firul pleaca din cercul portretului din dreapta, nu de sub
    // titlu, ca sa nu treaca peste text si peste iconitele de social.
    const pic = blocks[0].querySelector('.hero-circle');
    if (pic && pic.offsetWidth) {
      const r = pic.getBoundingClientRect();
      const px = r.right - main.getBoundingClientRect().left;
      const py = r.top + r.height / 2 + window.scrollY - mainTop;
      if (xR - px > R + 8 && py < tops[0] - R) {
        y0 = py;
        d = `M ${px} ${py} L ${xR - R} ${py} Q ${xR} ${py} ${xR} ${py + R}`;
      }
    }
    let x = xR;
    let prev = y0;
    const cross = [y0]; // y-ul fiecarei traversari orizontale
    tops.forEach((y, i) => {
      const isLast = i === tops.length - 1;
      if (!isLast && y - prev < MIN_SWITCH) return; // sectiune scurta: firul merge drept
      cross.push(y);
      const nx = isLast ? W / 2 : (x === xR ? xL : xR);
      const dir = nx < x ? -1 : 1;
      d += ` L ${x} ${y - R} Q ${x} ${y} ${x + dir * R} ${y}`;
      d += isLast ? ` L ${nx} ${y}` : ` L ${nx - dir * R} ${y} Q ${nx} ${y} ${nx} ${y + R}`;
      x = nx;
      prev = y;
    });

    path.setAttribute('d', d);
    len = path.getTotalLength();
    end.setAttribute('cx', W / 2);
    end.setAttribute('cy', last);

    // Punctul urmareste mijlocul ecranului. Pe verticale coboara odata cu
    // scroll-ul; la fiecare traversare foloseste B px de scroll inainte si
    // dupa ca sa treaca pe orizontala, deci nu sare si nu iese din ecran.
    const ys = [];
    for (let s = 0; s <= len; s += 6) ys.push([path.getPointAtLength(s).y, s]);
    const sAt = y => { const f = ys.find(p => p[0] >= y); return f ? f[1] : len; };
    keys = [[-Infinity, 0]];
    cross.forEach((y, i) => {
      if (i === 0) keys.push([y - B, 0]);
      else {
        const a = Math.max(y - B, keys[keys.length - 1][0] + 1); // ultima sectiune poate fi scurta
        keys.push([a, sAt(a)]);
      }
      if (i === cross.length - 1) keys.push([y, len]);
      else keys.push([y + B, sAt(y + B)]);
    });
    move();
  }

  function move() {
    if (!len) return;
    const vh = window.innerHeight;
    // in primul ecran punctul porneste de sus si coboara spre mijloc;
    // in ultimul ecran coboara mai departe, ca sa ajunga la capat
    const rest = document.documentElement.scrollHeight - vh - window.scrollY;
    let f = Math.min(0.5, window.scrollY / vh);
    if (rest < vh / 2) f = Math.max(f, 1 - rest / vh);
    const t = window.scrollY + f * vh - mainTop;
    let s = len;
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [y1, s1] = keys[i - 1], [y2, s2] = keys[i];
        s = y1 === -Infinity ? s2 : s1 + (s2 - s1) * (t - y1) / (y2 - y1);
        break;
      }
    }
    const pt = path.getPointAtLength(Math.max(0, Math.min(len, s)));
    [node, halo].forEach(c => { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); });
  }

  build();

  let raf = 0;
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; move(); });
  }, { passive: true });
  // inaltimile se schimba dupa fonturi, imagini, resize sau schimbarea fazei -> redesenam
  if ('ResizeObserver' in window) new ResizeObserver(() => build()).observe(document.body);
  document.addEventListener('DOMContentLoaded', build);
  window.addEventListener('load', build);
})();
