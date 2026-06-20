/* ============================================================
   MOBILE.JS — Carousel, Drawer, Tap Glitch
   Activates on touch/small-screen devices only.
   Designed to be safely loaded on all viewports — all
   behaviour is gated behind media query checks.
   ============================================================ */

(function () {
  'use strict';

  /* ── Util ───────────────────────────────────────────────── */
  var isMobile = function () { return window.innerWidth <= 700; };
  var isTouchDevice = function () { return window.matchMedia('(hover: none)').matches; };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     CAROUSEL
     Wraps .scrap-card items in a horizontal scroll-snap track,
     adds dot navigation, swipe hint, and live counter.
  ============================================================ */
  var Carousel = {
    grid: null,
    track: null,
    cards: [],
    dots: [],
    dotsWrap: null,
    counter: null,
    activeIndex: 0,

    init: function () {
      var grid = document.querySelector('.scrap-grid');
      if (!grid) return;
      this.grid = grid;
      this.cards = Array.from(grid.querySelectorAll('.scrap-card'));
      if (!this.cards.length) return;

      // Wrap cards in a track div
      var track = document.createElement('div');
      track.className = 'carousel-track';
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Product carousel');

      // Move each card into the track
      this.cards.forEach(function (card) { track.appendChild(card); });
      grid.appendChild(track);
      this.track = track;

      // Build swipe hint
      var hint = document.createElement('div');
      hint.className = 'carousel-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        'Swipe to explore' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      grid.appendChild(hint);

      // Build dot nav
      this.dotsWrap = document.createElement('div');
      this.dotsWrap.className = 'carousel-dots';
      this.dotsWrap.setAttribute('role', 'tablist');
      this.dotsWrap.setAttribute('aria-label', 'Product navigation dots');

      this.cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to product ' + (i + 1));
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () { Carousel.goTo(i, true); });
        Carousel.dotsWrap.appendChild(dot);
        Carousel.dots.push(dot);
      });
      grid.appendChild(this.dotsWrap);

      // Build counter
      this.counter = document.createElement('div');
      this.counter.className = 'carousel-counter';
      this.counter.setAttribute('aria-live', 'polite');
      this.counter.setAttribute('aria-atomic', 'true');
      grid.appendChild(this.counter);

      // Set first card active
      this.setActive(0);

      // Listen for scroll to update active dot
      var ticking = false;
      track.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            Carousel.onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Keyboard arrow navigation
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') Carousel.goTo(Carousel.activeIndex + 1, true);
        if (e.key === 'ArrowLeft')  Carousel.goTo(Carousel.activeIndex - 1, true);
      });
    },

    setActive: function (idx) {
      var total = this.cards.length;
      idx = Math.max(0, Math.min(total - 1, idx));
      this.activeIndex = idx;

      // Update card classes
      this.cards.forEach(function (c, i) {
        c.classList.toggle('is-active', i === idx);
      });

      // Update dots
      this.dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });

      // Update counter — "01 / 07"
      if (this.counter) {
        var n  = String(idx + 1).padStart(2, '0');
        var tot = String(total).padStart(2, '0');
        this.counter.innerHTML = '<strong>' + n + '</strong> / ' + tot;
      }
    },

    goTo: function (idx, animate) {
      var total = this.cards.length;
      idx = Math.max(0, Math.min(total - 1, idx));
      var card = this.cards[idx];
      if (!card || !this.track) return;
      // Scroll card into the centre of the track
      var trackRect  = this.track.getBoundingClientRect();
      var cardRect   = card.getBoundingClientRect();
      var offset     = card.offsetLeft - this.track.offsetLeft;
      var centre     = offset - (this.track.clientWidth / 2) + (card.offsetWidth / 2);
      this.track.scrollTo({ left: centre, behavior: animate ? 'smooth' : 'instant' });
      this.setActive(idx);
    },

    onScroll: function () {
      if (!this.track) return;
      var trackMid = this.track.scrollLeft + this.track.clientWidth / 2;
      var closest = 0;
      var closestDist = Infinity;
      this.cards.forEach(function (card, i) {
        var cardMid = card.offsetLeft - Carousel.track.offsetLeft + card.offsetWidth / 2;
        var dist = Math.abs(trackMid - cardMid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      if (closest !== this.activeIndex) this.setActive(closest);
    },

    destroy: function () {
      // Move cards back out of track on resize to desktop
      if (!this.track) return;
      this.cards.forEach(function (card) { Carousel.grid.appendChild(card); });
      var track = this.grid.querySelector('.carousel-track');
      var hint  = this.grid.querySelector('.carousel-hint');
      var dots  = this.grid.querySelector('.carousel-dots');
      var ctr   = this.grid.querySelector('.carousel-counter');
      if (track) track.remove();
      if (hint)  hint.remove();
      if (dots)  dots.remove();
      if (ctr)   ctr.remove();
      this.track = null;
      this.dots = [];
      this.dotsWrap = null;
      this.counter = null;
      this.activeIndex = 0;
    },
  };

  /* ============================================================
     DRAWER
     Full-height Y2K slide-in panel with all 7 product links
     and section links. Replaces old .nav__mobile overlay.
  ============================================================ */
  var Drawer = {
    el: null,
    overlay: null,
    isOpen: false,

    build: function () {
      // Overlay
      var overlay = document.createElement('div');
      overlay.className = 'drawer-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.addEventListener('click', function () { Drawer.close(); });
      document.body.appendChild(overlay);
      this.overlay = overlay;

      // Drawer panel
      var drawer = document.createElement('nav');
      drawer.className = 'drawer';
      drawer.setAttribute('aria-label', 'Navigation drawer');
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('hidden', '');
      drawer.innerHTML = [
        /* Header */
        '<div class="drawer__header">',
        '  <a href="#" class="drawer__logo" aria-label="SoloSuccess Solutions home">',
        '    <div class="drawer__logo-gem"><img src="./assets/logo.jpg" alt="" /></div>',
        '    <span class="drawer__logo-name">SoloSuccess<br/>Solutions</span>',
        '  </a>',
        '  <button class="drawer__close" aria-label="Close navigation">',
        '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
        '  </button>',
        '</div>',

        /* Body */
        '<div class="drawer__body">',
        '  <div class="drawer__section-title">Pages</div>',
        '  <a href="#ecosystem" class="drawer__nav-link">',
        '    <span class="drawer__nav-label">Ecosystem</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#about" class="drawer__nav-link">',
        '    <span class="drawer__nav-label">About</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#audience" class="drawer__nav-link">',
        '    <span class="drawer__nav-label">Who It\'s For</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',

        '  <div class="drawer__section-title">Products</div>',

        '  <a href="#ecosystem" class="drawer__nav-link" data-product="ai" data-card="0">',
        '    <span class="drawer__nav-num">01</span>',
        '    <span class="drawer__nav-label">SoloSuccess AI</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="academy" data-card="1">',
        '    <span class="drawer__nav-num">02</span>',
        '    <span class="drawer__nav-label">Academy</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="content" data-card="2">',
        '    <span class="drawer__nav-num">03</span>',
        '    <span class="drawer__nav-label">Content Factory</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="scribe" data-card="3">',
        '    <span class="drawer__nav-num">04</span>',
        '    <span class="drawer__nav-label">SoloScribe</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="design" data-card="4">',
        '    <span class="drawer__nav-num">05</span>',
        '    <span class="drawer__nav-label">SoloDesign</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="scout" data-card="5">',
        '    <span class="drawer__nav-num">06</span>',
        '    <span class="drawer__nav-label">SoloScout</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <a href="#ecosystem" class="drawer__nav-link" data-product="connect" data-card="6">',
        '    <span class="drawer__nav-num">07</span>',
        '    <span class="drawer__nav-label">SoloConnect</span>',
        '    <svg class="drawer__nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '</div>',

        /* Footer CTA */
        '<div class="drawer__footer">',
        '  <a href="#ecosystem" class="drawer__footer-cta" aria-label="Explore all 7 products">',
        '    Explore All 7 Products',
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
        '  </a>',
        '  <p class="drawer__footer-tag">AI-First · Solo-Founded · 7 Products</p>',
        '</div>',
      ].join('\n');

      document.body.appendChild(drawer);
      this.el = drawer;

      // Close button
      drawer.querySelector('.drawer__close').addEventListener('click', function () {
        Drawer.close();
      });

      // Product links — close drawer then scroll + navigate carousel to that card
      drawer.querySelectorAll('[data-card]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          var cardIdx = parseInt(this.getAttribute('data-card'), 10);
          Drawer.close();
          // Small delay so drawer animates out first
          setTimeout(function () {
            var section = document.getElementById('ecosystem');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // If carousel is active, navigate to that card
            setTimeout(function () {
              if (isMobile() && Carousel.track) Carousel.goTo(cardIdx, true);
            }, 400);
          }, 200);
        });
      });

      // All other links: just close drawer
      drawer.querySelectorAll('a:not([data-card])').forEach(function (link) {
        link.addEventListener('click', function () { Drawer.close(); });
      });

      // Trap focus inside drawer when open
      drawer.addEventListener('keydown', function (e) {
        if (!Drawer.isOpen) return;
        if (e.key === 'Escape') { Drawer.close(); return; }
        if (e.key !== 'Tab') return;
        var focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      });
    },

    open: function () {
      if (!this.el) return;
      this.el.removeAttribute('hidden');
      requestAnimationFrame(function () {
        Drawer.el.classList.add('is-open');
        Drawer.overlay.classList.add('is-open');
      });
      document.body.classList.add('drawer-open');
      this.isOpen = true;
      // Focus close button
      setTimeout(function () {
        var closeBtn = Drawer.el.querySelector('.drawer__close');
        if (closeBtn) closeBtn.focus();
      }, 50);
      // Update hamburger aria
      var burger = document.getElementById('hamburger');
      if (burger) burger.setAttribute('aria-expanded', 'true');
    },

    close: function () {
      if (!this.el) return;
      this.el.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
      this.isOpen = false;
      // Restore scroll after transition
      setTimeout(function () {
        if (Drawer.el) Drawer.el.setAttribute('hidden', '');
      }, 330);
      // Return focus to burger
      var burger = document.getElementById('hamburger');
      if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
    },

    toggle: function () {
      this.isOpen ? this.close() : this.open();
    },
  };

  /* ============================================================
     TAP GLITCH — Touch devices
     Tapping a card fires the .is-glitching class for 800ms,
     triggering the same CSS animation set as hover on desktop.
     The glitch.js pixel system also fires a burst on tap.
  ============================================================ */
  function initTapGlitch() {
    var cards = document.querySelectorAll('.scrap-card');
    cards.forEach(function (card) {
      card.addEventListener('touchstart', function (e) {
        // Only fire on actual touch, not programmatic
        if (!e.isTrusted) return;

        // Brief press feedback
        card.classList.add('is-tapped');
        setTimeout(function () { card.classList.remove('is-tapped'); }, 120);

        if (reducedMotion) return;

        // Fire glitch burst
        card.classList.add('is-glitching');

        // Also trigger pixel burst via glitch.js if available
        var inner = card.querySelector('.scrap-card__inner');
        if (inner && window.__glitchBurst) {
          window.__glitchBurst(inner, true);
        }

        setTimeout(function () {
          card.classList.remove('is-glitching');
        }, 820);
      }, { passive: true });
    });
  }

  /* ============================================================
     HAMBURGER — wire to Drawer instead of old mobile nav
  ============================================================ */
  function initHamburger() {
    var burger = document.getElementById('hamburger');
    if (!burger) return;
    // Remove old click listener by cloning the button
    var fresh = burger.cloneNode(true);
    burger.parentNode.replaceChild(fresh, burger);
    fresh.id = 'hamburger'; // restore id
    fresh.addEventListener('click', function () { Drawer.toggle(); });
  }

  /* ============================================================
     RESPONSIVE: rebuild/destroy carousel on resize
  ============================================================ */
  var carouselBuilt = false;

  function handleResize() {
    if (isMobile() && !carouselBuilt) {
      Carousel.init();
      carouselBuilt = true;
    } else if (!isMobile() && carouselBuilt) {
      Carousel.destroy();
      carouselBuilt = false;
    }
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });

  /* ============================================================
     EXPOSE glitch burst hook for glitch.js integration
  ============================================================ */
  // glitch.js sets window.__glitchBurst after init —
  // we expose the hook here so tap can call it.
  // (glitch.js should set: window.__glitchBurst = function(inner, isHover) {...} )

  /* ============================================================
     BOOT
  ============================================================ */
  function boot() {
    Drawer.build();
    initHamburger();
    initTapGlitch();
    if (isMobile()) {
      Carousel.init();
      carouselBuilt = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
