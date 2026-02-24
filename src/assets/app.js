/* ============================================
   ASTRA DENTAL STUDIO — Main JavaScript
   Pure Vanilla JS · No Dependencies
   ============================================ */

(function () {
  'use strict';

  /* ---- Reduced Motion Check ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    pageTransitionIn();
    initNav();
    initScrollReveal();
    initFAQ();
    initBeforeAfter();
    initMagneticButtons();
    initCardTilt();
    initParallax();
    initCounters();
    initBookingForm();
    initInternalLinks();
    initSmoothScroll();
    initReviewsCarousel();
    initStickyBarTrigger();
  }

  /* ==============================
     PAGE TRANSITIONS
     ============================== */
  function pageTransitionIn() {
    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;
    // Small delay so the browser paints the initial state first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapper.classList.add('is-loaded');
      });
    });
  }

  function pageTransitionOut(href) {
    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) { window.location.href = href; return; }
    wrapper.classList.add('is-exiting');
    wrapper.classList.remove('is-loaded');
    setTimeout(() => { window.location.href = href; }, 300);
  }

  /* Intercept all internal links for page transition */
  function initInternalLinks() {
    if (prefersReducedMotion) return; // skip transition for a11y
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      // Only intercept local .html links (not anchors, not external)
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
      if (href.endsWith('.html') || href === '/' || href === '') {
        e.preventDefault();
        pageTransitionOut(href);
      }
    });
  }

  /* ==============================
     NAVIGATION
     ============================== */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');

    if (!nav) return;

    /* Scroll glass effect */
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('is-scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    });

    /* Mobile toggle */
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('is-open');
        links.classList.toggle('is-open');
        document.body.style.overflow = links.classList.contains('is-open') ? 'hidden' : '';
      });
      // Close on link click
      links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('is-open');
          links.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }

    /* Active link highlight */
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/' + currentPage || href === currentPage || href === currentPath || (currentPage === '' && (href === '/index.html' || href === 'index.html'))) {
        link.classList.add('is-active');
      }
    });

    /* Responsive: switch to hamburger when links would wrap */
    function checkNavOverflow() {
      nav.classList.remove('nav--mobile');
      const inner = nav.querySelector('.nav__inner');
      const linksEl = nav.querySelector('.nav__links');
      if (!inner || !linksEl) return;

      // Force single-line measurement
      linksEl.style.flexWrap = 'nowrap';
      linksEl.style.overflow = 'hidden';
      linksEl.style.whiteSpace = 'nowrap';

      const logoWidth = nav.querySelector('.nav__logo').offsetWidth;
      const linksWidth = linksEl.scrollWidth;
      const available = inner.offsetWidth - logoWidth - 40;

      // Reset temp styles
      linksEl.style.flexWrap = '';
      linksEl.style.overflow = '';
      linksEl.style.whiteSpace = '';

      if (linksWidth > available) {
        nav.classList.add('nav--mobile');
      }
    }
    checkNavOverflow();
    window.addEventListener('resize', checkNavOverflow);
  }

  /* ==============================
     SCROLL REVEAL (IntersectionObserver)
     ============================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ==============================
     FAQ ACCORDION
     ============================== */
  function initFAQ() {
    document.querySelectorAll('.faq-item__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const content = item.querySelector('.faq-item__content');
        const isOpen = item.classList.contains('is-open');

        // Close siblings
        item.parentElement.querySelectorAll('.faq-item.is-open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-item__content').style.maxHeight = '0';
          }
        });

        // Toggle current
        item.classList.toggle('is-open');
        content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
      });
    });
  }

  /* ==============================
     BEFORE / AFTER SLIDER
     ============================== */
  function initBeforeAfter() {
    document.querySelectorAll('.ba-slider').forEach(slider => {
      const before = slider.querySelector('.ba-slider__before');
      const after = slider.querySelector('.ba-slider__after');
      const line = slider.querySelector('.ba-slider__line');
      const handle = slider.querySelector('.ba-slider__handle');
      let isDragging = false;

      function updatePosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(5, Math.min(95, pct));
        before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        after.style.clipPath = `inset(0 0 0 ${pct}%)`;
        line.style.left = pct + '%';
        handle.style.left = pct + '%';
      }

      slider.addEventListener('mousedown', (e) => { isDragging = true; updatePosition(e.clientX); });
      window.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
      window.addEventListener('mouseup', () => { isDragging = false; });

      slider.addEventListener('touchstart', (e) => { isDragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { isDragging = false; });

      /* Keyboard a11y */
      slider.setAttribute('tabindex', '0');
      slider.setAttribute('role', 'slider');
      slider.setAttribute('aria-label', 'Before and after comparison');
      slider.setAttribute('aria-valuemin', '0');
      slider.setAttribute('aria-valuemax', '100');
      slider.setAttribute('aria-valuenow', '50');
      slider.addEventListener('keydown', (e) => {
        const rect = slider.getBoundingClientRect();
        const currentPct = (parseFloat(line.style.left) || 50);
        let newPct = currentPct;
        if (e.key === 'ArrowLeft') newPct = Math.max(5, currentPct - 2);
        if (e.key === 'ArrowRight') newPct = Math.min(95, currentPct + 2);
        if (newPct !== currentPct) {
          e.preventDefault();
          const newX = rect.left + (newPct / 100) * rect.width;
          updatePosition(newX);
          slider.setAttribute('aria-valuenow', Math.round(newPct));
        }
      });
    });
  }

  /* ==============================
     MAGNETIC BUTTONS
     ============================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.3;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ==============================
     CARD TILT EFFECT
     ============================== */
  function initCardTilt() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = y * -6; // degrees
        const tiltY = x * 6;
        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ==============================
     PARALLAX
     ============================== */
  function initParallax() {
    if (prefersReducedMotion) return;
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          els.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.1;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + scrollY) * speed;
            el.style.transform = `translateY(${scrollY * speed - offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ==============================
     ANIMATED COUNTERS
     ============================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ==============================
     BOOKING FORM VALIDATION
     ============================== */
  function initBookingForm() {
    const form = document.querySelector('#lead-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#EF4444';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      if (valid) {
        const btn = form.querySelector('.btn');
        const originalHTML = btn.innerHTML;
        btn.textContent = '\u0395\u03C5\u03C7\u03B1\u03C1\u03B9\u03C3\u03C4\u03BF\u03CD\u03BC\u03B5! \u0398\u03B1 \u03C3\u03B1\u03C2 \u03BA\u03B1\u03BB\u03AD\u03C3\u03BF\u03C5\u03BC\u03B5 \u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03B1.';
        btn.style.background = '#10B981';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  }

  /* ==============================
     SMOOTH SCROLL FOR ANCHORS
     ============================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ==============================
     REVIEWS CAROUSEL
     ============================== */
  function initReviewsCarousel() {
    document.querySelectorAll('.reviews-carousel').forEach(carousel => {
      const track = carousel.querySelector('.reviews-carousel__track');
      if (!track) return;

      // Measure original content width before cloning
      const cards = Array.from(track.querySelectorAll('.review-card'));
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const originalWidth = cards.reduce((sum, c) => sum + c.offsetWidth, 0) + gap * cards.length;

      // Clone cards for seamless infinite loop
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });

      // Set exact scroll distance and speed (40px/s)
      track.style.setProperty('--scroll-distance', `-${originalWidth}px`);
      track.style.setProperty('--scroll-duration', `${originalWidth / 40}s`);
    });
  }

  /* ==============================
     STICKY BAR — Show after scrolling past form
     ============================== */
  function initStickyBarTrigger() {
    const stickyBar = document.querySelector('.sticky-bar');
    const formSection = document.querySelector('#contact-form');
    if (!formSection || !stickyBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyBar.classList.remove('is-visible');
        } else {
          stickyBar.classList.add('is-visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(formSection);
  }

})();
