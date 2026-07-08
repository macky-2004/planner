/* ============================================
   AE AETHER EVENTS — Shared Interactivity
   Same script.js linked by all 44 pages
   ============================================ */

(function () {
  'use strict';

  /* ============ STICKY HEADER ============ */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ============ MOBILE NAV ============ */
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============ SMOOTH ANCHORS ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight : 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============ SCROLL REVEAL (IntersectionObserver) ============ */
  var revealSelectors = '.service-card, .stat-item, .usp-card, .glass-card, ' +
    '.portfolio-item, .testimonial-card, .pricing-card, ' +
    '.faq-item, .about-grid, .about-image-wrap, .contact-item, ' +
    '.contact-form, .process-step, .team-card';

  var revealElements = document.querySelectorAll(revealSelectors);

  if (revealElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      observer.observe(el);
    });

    /* Staggered delay */
    var grids = document.querySelectorAll('.services-grid, .usp-grid, .portfolio-grid, .testimonial-grid, .pricing-grid, .stats-grid, .team-grid');
    grids.forEach(function (grid) {
      grid.querySelectorAll(':scope > *').forEach(function (el, i) {
        el.style.transitionDelay = (i * 70) + 'ms';
      });
    });
  }

  /* ============ COUNTER ANIMATION ============ */
  var counters = document.querySelectorAll('.stat-number');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.target, 10);
          var suffix = el.dataset.suffix || '';
          var duration = 2000;
          var start = performance.now();

          function update(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  /* ============ PORTFOLIO FILTER ============ */
  var filterPills = document.querySelectorAll('.filter-pill');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterPills.length && portfolioItems.length) {
    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.dataset.filter;

        portfolioItems.forEach(function (item) {
          var cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(16px)';
            requestAnimationFrame(function () {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============ BACK TO TOP ============ */
  var backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ NEWSLETTER FORM ============ */
  var nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      if (input && input.value.trim()) {
        var btn = this.querySelector('button');
        var orig = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
          input.value = '';
        }, 2500);
      }
    });
  }

  /* ============ FORM HANDLING ============ */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('.btn-submit');
      var original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Sent!';
        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 2500);
      }, 1200);
    });
  }

  /* ============ LIGHTBOX ============ */
  var lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  if (lightboxTriggers.length) {
    var lightbox = document.createElement('div');
    lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:none;align-items:center;justify-content:center;cursor:pointer;';
    lightbox.innerHTML = '<button style="position:absolute;top:20px;right:20px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;">&times;</button><img src="" alt="" style="max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);">';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('button');

    lightboxTriggers.forEach(function (el) {
      el.addEventListener('click', function () {
        var img = this.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });

    closeBtn.addEventListener('click', function () {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

})();
