/* ============================================
   AETHER EVENTS — Premium Glassmorphism Engine
   ============================================ */

const Aether = (() => {
  'use strict';

  const doc = document;
  const win = window;

  /* --- Utilities --- */
  const qs = (s, ctx) => (ctx || doc).querySelector(s);
  const qsa = (s, ctx) => (ctx || doc).querySelectorAll(s);
  const on = (el, ev, fn) => {
    (typeof el === 'string' ? qsa(el) : [el]).forEach(e => e.addEventListener(ev, fn));
  };

  /* ===========================================
     1. Canvas Particle / Geometry Background
     =========================================== */
  function initCanvas() {
    const canvas = doc.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
      w = canvas.width = win.innerWidth;
      h = canvas.height = win.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.7 ? 45 : 220; // gold or blue
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.01;
        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;
      }
      draw() {
        const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const color = this.hue === 45
          ? `rgba(212, 175, 55, ${alpha})`
          : `rgba(255, 252, 247, ${alpha * 0.4})`;
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();
    win.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ===========================================
     2. Mouse Parallax for Floating Orbs
     =========================================== */
  function initMouseParallax() {
    const orbs = qsa('.orb');
    if (!orbs.length) return;
    let mx = 0, my = 0;

    win.addEventListener('mousemove', e => {
      mx = (e.clientX / win.innerWidth - 0.5) * 2;
      my = (e.clientY / win.innerHeight - 0.5) * 2;
    });

    function animateOrbs() {
      orbs.forEach((orb, i) => {
        const speed = 10 + i * 5;
        const x = mx * speed;
        const y = my * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(animateOrbs);
    }
    animateOrbs();
  }

  /* ===========================================
     3. Announcement Bar
     =========================================== */
  function initAnnouncement() {
    const bar = qs('.announcement-bar');
    if (!bar) return;

    const close = bar.querySelector('.announcement-close');
    if (close) {
      close.addEventListener('click', () => {
        bar.classList.add('dismissed');
        localStorage.setItem('ae_announcement', 'dismissed');
      });
    }
    if (localStorage.getItem('ae_announcement')) bar.classList.add('dismissed');

    const texts = bar.querySelectorAll('.announcement-text');
    if (texts.length > 1) {
      let idx = 0;
      setInterval(() => {
        texts.forEach(t => (t.style.display = 'none'));
        idx = (idx + 1) % texts.length;
        texts[idx].style.display = 'inline';
      }, 5000);
    }
  }

  /* ===========================================
     4. Sticky Glass Header
     =========================================== */
  function initHeader() {
    const header = qs('.site-header');
    if (!header) return;
    let ticking = false;
    win.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', win.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ===========================================
     5. Mobile Menu
     =========================================== */
  function initMobileMenu() {
    const toggle = qs('.mobile-toggle');
    const menu = qs('.mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      doc.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    qsa('.has-subnav > a', menu).forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        link.classList.toggle('open');
        const sub = link.nextElementSibling;
        if (sub) sub.classList.toggle('open');
      });
    });
  }

  /* ===========================================
     6. Scroll Progress Bar
     =========================================== */
  function initProgress() {
    const bar = qs('.scroll-progress');
    if (!bar) return;
    win.addEventListener('scroll', () => {
      const h = doc.documentElement.scrollHeight - win.innerHeight;
      bar.style.width = `${(win.scrollY / h) * 100}%`;
    });
  }

  /* ===========================================
     7. FAB Back to Top
     =========================================== */
  function initFAB() {
    const fab = qs('.fab-top');
    if (!fab) return;
    win.addEventListener('scroll', () => {
      fab.classList.toggle('visible', win.scrollY > 500);
    });
    fab.addEventListener('click', () => win.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ===========================================
     8. Glass Counter Animation
     =========================================== */
  function initCounters() {
    const counters = qsa('.stat-number[data-target]');
    if (!counters.length) return;

    function animate(el) {
      const target = parseInt(el.dataset.target);
      const duration = parseInt(el.dataset.duration) || 2200;
      const start = performance.now();
      const suffix = el.dataset.suffix || '';

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      }
      requestAnimationFrame(update);
    }

    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animate(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
  }

  /* ===========================================
     9. Filter System
     =========================================== */
  function initFilters() {
    qsa('.filter-bar').forEach(bar => {
      const parent = bar.parentElement;
      const items = parent.querySelectorAll('[data-category]');
      const btns = bar.querySelectorAll('.filter-btn');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.filter;
          items.forEach(item => {
            if (cat === 'all' || item.dataset.category === cat) {
              item.style.display = '';
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
              requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
            } else {
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
              setTimeout(() => { item.style.display = 'none'; }, 300);
            }
          });
        });
      });
    });
  }

  /* ===========================================
     10. Testimonial Glass Carousel
     =========================================== */
  function initTestimonials() {
    const track = qs('.testimonial-track');
    if (!track) return;
    const slides = track.children;
    if (slides.length < 2) return;
    const dots = qsa('.testimonial-dot');
    let idx = 0;
    let interval;

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { clearInterval(interval); goTo(i); startAuto(); });
    });

    const container = track.closest('.testimonial-glass');
    const prev = container?.querySelector('.testimonial-prev');
    const next = container?.querySelector('.testimonial-next');
    if (prev) prev.addEventListener('click', () => { clearInterval(interval); goTo(idx - 1); startAuto(); });
    if (next) next.addEventListener('click', () => { clearInterval(interval); goTo(idx + 1); startAuto(); });

    function startAuto() {
      interval = setInterval(() => goTo(idx + 1), 6000);
    }

    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(interval));
      container.addEventListener('mouseleave', startAuto);
    }
    startAuto();
    goTo(0);
  }

  /* ===========================================
     11. FAQ Accordion
     =========================================== */
  function initFAQ() {
    qsa('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        item.closest('.faq-list, .faq-glass')?.querySelectorAll('.faq-item.open').forEach(i => {
          if (i !== item) {
            i.classList.remove('open');
            i.querySelector('.faq-answer').style.maxHeight = '0';
          }
        });

        item.classList.toggle('open');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
      });
    });
  }

  /* ===========================================
     12. Lightbox
     =========================================== */
  function initLightbox() {
    const lb = qs('.lightbox');
    if (!lb) return;
    const img = lb.querySelector('img');
    const caption = lb.querySelector('.lightbox-caption');
    const close = lb.querySelector('.lightbox-close');
    const prev = lb.querySelector('.lightbox-prev');
    const next = lb.querySelector('.lightbox-next');
    let items = [];
    let idx = 0;

    qsa('[data-lightbox]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const group = el.dataset.lightbox;
        items = qsa(`[data-lightbox="${group}"]`);
        idx = Array.from(items).indexOf(el);
        open();
      });
    });

    function open() {
      const item = items[idx];
      img.src = item.dataset.src || item.href || item.querySelector('img')?.src;
      caption.textContent = item.dataset.caption || '';
      lb.classList.add('open');
      doc.body.style.overflow = 'hidden';
    }

    function nav(dir) { idx = (idx + dir + items.length) % items.length; open(); }

    close?.addEventListener('click', closeLB);
    prev?.addEventListener('click', () => nav(-1));
    next?.addEventListener('click', () => nav(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

    doc.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });

    function closeLB() { lb.classList.remove('open'); doc.body.style.overflow = ''; }
  }

  /* ===========================================
     13. Modal
     =========================================== */
  function initModals() {
    qsa('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        const modal = qs(`#${trigger.dataset.modal}`);
        if (modal) { modal.classList.add('open'); doc.body.style.overflow = 'hidden'; }
      });
    });

    qsa('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.closest('.modal-close')) {
          overlay.classList.remove('open');
          doc.body.style.overflow = '';
        }
      });
    });
  }

  /* ===========================================
     14. Toast
     =========================================== */
  function showToast(message, type) {
    const container = qs('.toast-container');
    if (!container) return;
    const toast = doc.createElement('div');
    toast.className = `toast ${type || 'info'}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  /* ===========================================
     15. Scroll Reveal (Intersection Observer)
     =========================================== */
  function initReveal() {
    const els = qsa('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay) || 0;
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  /* ===========================================
     16. Form Validation
     =========================================== */
  function initForms() {
    qsa('.needs-validation').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        qsa('[required]', form).forEach(input => {
          const error = input.closest('.form-group')?.querySelector('.form-error');
          const val = input.value.trim();

          input.classList.remove('error');

          if (!val) {
            input.classList.add('error');
            if (error) error.textContent = 'This field is required';
            valid = false;
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            input.classList.add('error');
            if (error) error.textContent = 'Please enter a valid email';
            valid = false;
          } else if (input.type === 'tel' && !/^[\d\s\+\-]{7,15}$/.test(val)) {
            input.classList.add('error');
            if (error) error.textContent = 'Please enter a valid phone number';
            valid = false;
          }
        });

        if (valid) {
          const btn = form.querySelector('.btn');
          btn?.classList.add('loading');
          showToast('Thank you! We\'ll be in touch within 24 hours.', 'success');
          setTimeout(() => {
            btn?.classList.remove('loading');
            form.reset();
            if (!win.location.pathname.includes('thank-you')) {
              win.location.href = '/thank-you/';
            }
          }, 1800);
        }
      });

      qsa('.form-input, .form-select, .form-textarea', form).forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
        input.addEventListener('change', () => input.classList.remove('error'));
      });
    });
  }

  /* ===========================================
     17. Cookie Banner
     =========================================== */
  function initCookies() {
    const banner = qs('.cookie-banner');
    if (!banner || localStorage.getItem('ae_cookies')) return;
    banner.classList.add('show');

    qs('.cookie-accept', banner)?.addEventListener('click', () => {
      localStorage.setItem('ae_cookies', 'accepted');
      banner.classList.remove('show');
    });

    qs('.cookie-decline', banner)?.addEventListener('click', () => {
      localStorage.setItem('ae_cookies', 'declined');
      banner.classList.remove('show');
    });
  }

  /* ===========================================
     18. Load More
     =========================================== */
  function initLoadMore() {
    qsa('[data-load-more]').forEach(btn => {
      btn.addEventListener('click', () => {
        const container = btn.parentElement.previousElementSibling;
        const hidden = container?.querySelectorAll('[data-hidden]');
        if (!hidden?.length) { btn.style.display = 'none'; return; }
        const count = parseInt(btn.dataset.loadCount) || 6;
        let shown = 0;
        hidden.forEach(el => {
          if (shown < count) {
            el.removeAttribute('data-hidden');
            el.style.display = '';
            setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
            shown++;
          }
        });
        if (!container.querySelector('[data-hidden]')) btn.style.display = 'none';
      });
    });
  }

  /* ===========================================
     19. Smooth Anchor Scroll
     =========================================== */
  function initSmoothScroll() {
    doc.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = qs(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(link.dataset.offset) || 80;
        const top = target.getBoundingClientRect().top + win.scrollY - offset;
        win.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ===========================================
     Initialize Everything
     =========================================== */
  function init() {
    initCanvas();
    initMouseParallax();
    initAnnouncement();
    initHeader();
    initMobileMenu();
    initProgress();
    initFAB();
    initCounters();
    initFilters();
    initTestimonials();
    initFAQ();
    initLightbox();
    initModals();
    initReveal();
    initForms();
    initCookies();
    initLoadMore();
    initSmoothScroll();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { showToast, init };
})();
