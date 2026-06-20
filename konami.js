/* ============================================================
   KONAMI CODE EASTER EGG — SoloSuccess Solutions
   Sequence: ↑ ↑ ↓ ↓ ← → ← → B A

   Timeline (total ~5.5s):
     0ms    — sequence detected, pre-flash + audio cue
     80ms   — body enters .konami-active
     120ms  — binary rain canvas starts drawing
     300ms  — all cards get simultaneous glitch burst
     400ms  — text inversion + holo scheme kicks in
     3400ms — restoration begins (reverse sweep)
     4200ms — binary rain fades
     5000ms — .konami-active removed, all clean
   ============================================================ */

(function () {
  'use strict';

  /* ── Konami sequence ──────────────────────────────────────── */
  var SEQUENCE = [
    'ArrowUp','ArrowUp',
    'ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight',
    'ArrowLeft','ArrowRight',
    'b','a',
  ];
  var buffer = [];
  var COOLDOWN = false;   // prevent re-triggering during animation
  var COOLDOWN_MS = 6000; // ms before sequence can fire again

  /* ── Listen globally, ignore when terminal input focused ─── */
  document.addEventListener('keydown', function (e) {
    /* Don't steal input from the terminal or any text field */
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (COOLDOWN) return;

    buffer.push(e.key);
    if (buffer.length > SEQUENCE.length) buffer.shift();

    if (buffer.join(',') === SEQUENCE.join(',')) {
      buffer = [];
      COOLDOWN = true;
      setTimeout(function () { COOLDOWN = false; }, COOLDOWN_MS);
      launchKonami();
    }
  });

  /* ============================================================
     BINARY RAIN CANVAS
  ============================================================ */
  var BinaryRain = {
    canvas: null,
    ctx: null,
    cols: [],
    raf: null,
    opacity: 0,
    targetOpacity: 0,
    fadeDir: 1,

    build: function () {
      if (this.canvas) return;
      var c = document.createElement('canvas');
      c.id = 'konami-rain';
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:9990',
        'pointer-events:none',
        'opacity:0',
        'transition:opacity 0.4s ease',
        'mix-blend-mode:screen',  // blends with page content
      ].join(';');
      document.body.appendChild(c);
      this.canvas = c;
      this.resize();
      window.addEventListener('resize', this.resize.bind(this));
    },

    resize: function () {
      if (!this.canvas) return;
      this.canvas.width  = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initCols();
    },

    initCols: function () {
      var fontSize = 13;
      var colCount = Math.floor(window.innerWidth / fontSize);
      this.cols = [];
      this.fontSize = fontSize;
      for (var i = 0; i < colCount; i++) {
        /* Each column starts at a random y position so they're desynchronised */
        this.cols.push({
          y: Math.random() * window.innerHeight,
          speed: 1.5 + Math.random() * 3.5,
          /* Hue per column — spread across the rainbow */
          hue: Math.round((i / colCount) * 360),
          bright: 0.6 + Math.random() * 0.4,
        });
      }
    },

    /* Characters: binary + katakana + block elements for Y2K vibe */
    CHARS: '01アイウエカサタナハマヤラワ▓▒░█▄▀■◆◈',

    draw: function () {
      var self = this;
      var c    = this.canvas;
      var ctx  = this.ctx || (this.ctx = c.getContext('2d'));
      var fs   = this.fontSize;
      var w    = c.width;
      var h    = c.height;

      /* Semi-transparent black fill creates the fading trail */
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = 'bold ' + fs + 'px "JetBrains Mono","Courier New",monospace';

      this.cols.forEach(function (col, i) {
        var char = self.CHARS[Math.floor(Math.random() * self.CHARS.length)];
        var x    = i * fs;

        /* Leading char is bright white */
        ctx.fillStyle = 'rgba(255,255,255,' + col.bright + ')';
        ctx.fillText(char, x, col.y);

        /* Draw a fading trail of 3 chars above the head */
        for (var t = 1; t <= 3; t++) {
          var trailChar = self.CHARS[Math.floor(Math.random() * self.CHARS.length)];
          var alpha     = (col.bright * (4 - t)) / 5;
          /* Holographic colour shift along the trail */
          var hue = (col.hue + t * 40) % 360;
          ctx.fillStyle = 'hsla(' + hue + ',100%,65%,' + alpha + ')';
          ctx.fillText(trailChar, x, col.y - t * fs);
        }

        /* Advance column; reset when it exits the bottom */
        col.y += col.speed;
        if (col.y > h + fs) {
          col.y     = -fs;
          col.speed = 1.5 + Math.random() * 3.5;
          col.hue   = Math.round(Math.random() * 360);
        }
      });

      self.raf = requestAnimationFrame(self.draw.bind(self));
    },

    show: function () {
      this.build();
      this.canvas.style.opacity = '0.55';
      if (!this.raf) this.draw();
    },

    hide: function () {
      if (!this.canvas) return;
      this.canvas.style.opacity = '0';
      var self = this;
      /* Stop drawing after fade completes */
      setTimeout(function () {
        if (self.raf) { cancelAnimationFrame(self.raf); self.raf = null; }
        /* Clear the canvas so no ghosting next time */
        if (self.ctx) self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      }, 500);
    },
  };

  /* ============================================================
     SIMULTANEOUS CARD GLITCH BURST
     Fires ALL 7 scrap cards at once with staggered pixel spawns
  ============================================================ */
  function burstAllCards() {
    var cards = document.querySelectorAll('.scrap-card');

    /* If glitch.js pixel burst hook is available, use it */
    var spawnPixels = window.__glitchBurst;

    cards.forEach(function (card, i) {
      var inner = card.querySelector('.scrap-card__inner');

      /* Stagger by 40ms per card so bursts cascade across the grid */
      setTimeout(function () {
        /* 1. CSS class burst */
        card.classList.add('is-glitching', 'konami-card-burst');
        if (spawnPixels && inner) spawnPixels(inner, true);

        /* 2. Extra-intense pixel salvo after 120ms */
        setTimeout(function () {
          if (spawnPixels && inner) spawnPixels(inner, true);
        }, 120);

        /* 3. Second CSS burst after 250ms for a double-hit feel */
        setTimeout(function () {
          card.classList.remove('is-glitching');
          setTimeout(function () {
            card.classList.add('is-glitching');
            if (spawnPixels && inner) spawnPixels(inner, true);
          }, 80);
        }, 250);

      }, i * 40);
    });

    /* Remove burst classes after the full animation window */
    setTimeout(function () {
      cards.forEach(function (card) {
        card.classList.remove('is-glitching', 'konami-card-burst');
      });
    }, 1800);
  }

  /* ============================================================
     MAIN SEQUENCE
  ============================================================ */
  function launchKonami() {

    /* ── Phase 0 (0ms): Pre-flash — single white burst ────── */
    var flash = document.createElement('div');
    flash.id = 'konami-flash';
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);

    /* ── Phase 1 (80ms): Activate body class + binary rain ── */
    setTimeout(function () {
      document.body.classList.add('konami-active');
      BinaryRain.show();
    }, 80);

    /* ── Phase 2 (300ms): Simultaneous card burst ─────────── */
    setTimeout(function () {
      burstAllCards();
    }, 300);

    /* ── Phase 3 (400ms): Full text inversion ─────────────── */
    setTimeout(function () {
      document.body.classList.add('konami-text-invert');

      /* Trigger scanline intensification on every card */
      document.querySelectorAll('.scrap-card__scanlines').forEach(function (el) {
        el.style.opacity = '1';
        el.style.animationDuration = '0.5s';
      });
    }, 400);

    /* ── Phase 4 (2600ms): Mid-point second card burst ────── */
    setTimeout(function () {
      burstAllCards();
    }, 2600);

    /* ── Phase 5 (3400ms): Begin restoration ─────────────── */
    setTimeout(function () {
      document.body.classList.remove('konami-text-invert');

      /* Reset scanlines */
      document.querySelectorAll('.scrap-card__scanlines').forEach(function (el) {
        el.style.opacity = '';
        el.style.animationDuration = '';
      });
    }, 3400);

    /* ── Phase 6 (4000ms): Fade binary rain ──────────────── */
    setTimeout(function () {
      BinaryRain.hide();
    }, 4000);

    /* ── Phase 7 (5000ms): Full cleanup ──────────────────── */
    setTimeout(function () {
      document.body.classList.remove('konami-active');
      var f = document.getElementById('konami-flash');
      if (f) f.remove();
    }, 5000);
  }

  /* ============================================================
     CSS — injected at runtime so it stays in one file
  ============================================================ */
  var style = document.createElement('style');
  style.textContent = [

    /* ── Flash overlay ───────────────────────────────────── */
    '#konami-flash {',
    '  position: fixed; inset: 0; z-index: 9999;',
    '  pointer-events: none;',
    '  background: #fff;',
    '  animation: konami-flash-anim 0.35s ease forwards;',
    '}',
    '@keyframes konami-flash-anim {',
    '  0%   { opacity: 0; }',
    '  12%  { opacity: 1; }',
    '  30%  { opacity: 0.6; }',
    '  55%  { opacity: 0.15; }',
    '  100% { opacity: 0; }',
    '}',

    /* ── Body takeover — dot grid → glitch filter ─────────── */
    'body.konami-active::before {',
    '  background-image: none !important;', /* kill dot-grid */
    '  animation: none !important;',
    '}',

    /* Site-wide filter during active state */
    'body.konami-active {',
    '  animation: konami-body-flicker 0.12s steps(1) infinite;',
    '}',
    '@keyframes konami-body-flicker {',
    '  0%   { filter: none; }',
    '  20%  { filter: hue-rotate(60deg)  contrast(1.15) brightness(1.05); }',
    '  40%  { filter: hue-rotate(120deg) contrast(1.05) brightness(0.97); }',
    '  60%  { filter: hue-rotate(200deg) contrast(1.2)  brightness(1.08); }',
    '  80%  { filter: hue-rotate(290deg) contrast(1.1)  brightness(1.0); }',
    '  100% { filter: none; }',
    '}',

    /* ── Text inversion pass ──────────────────────────────── */
    /*
      Strategy: instead of inverting every element individually,
      we apply a CSS filter to specific containers. This keeps
      the binary rain canvas unaffected (it's outside body flow).
    */
    'body.konami-text-invert .hero__title,',
    'body.konami-text-invert .section__title,',
    'body.konami-text-invert .about__body .section__title,',
    'body.konami-text-invert .scrap-card__name,',
    'body.konami-text-invert .cta-title,',
    'body.konami-text-invert .manifesto__quote,',
    'body.konami-text-invert .stat-row__num,',
    'body.konami-text-invert .audience-card__title {',
    '  background: linear-gradient(105deg,',
    '    #ff00cc 0%, #00ffcc 16%, #ffff00 32%,',
    '    #ff6600 48%, #00ccff 64%, #ff0066 80%, #aaff00 100%',
    '  ) !important;',
    '  background-size: 300% 300% !important;',
    '  -webkit-background-clip: text !important;',
    '  background-clip: text !important;',
    '  -webkit-text-fill-color: transparent !important;',
    '  animation: konami-text-cycle 0.8s linear infinite !important;',
    '  text-shadow: none !important;',
    '}',
    '@keyframes konami-text-cycle {',
    '  0%   { background-position: 0%   50%; filter: none; }',
    '  25%  { background-position: 100% 0%;  filter: brightness(1.3); }',
    '  50%  { background-position: 200% 50%; filter: contrast(1.5); }',
    '  75%  { background-position: 100% 100%; filter: brightness(0.9); }',
    '  100% { background-position: 0%   50%; filter: none; }',
    '}',

    /* Body text inversion — high contrast swap */
    'body.konami-text-invert .hero__sub,',
    'body.konami-text-invert .section__desc,',
    'body.konami-text-invert .about__para,',
    'body.konami-text-invert .audience-card__desc,',
    'body.konami-text-invert .scrap-card__desc,',
    'body.konami-text-invert .cta-desc {',
    '  color: #00ffcc !important;',
    '  text-shadow: 0 0 8px rgba(0,255,200,0.5) !important;',
    '  animation: konami-body-text-flicker 0.25s steps(1) infinite !important;',
    '}',
    '@keyframes konami-body-text-flicker {',
    '  0%   { color: #00ffcc; }',
    '  33%  { color: #ff00cc; }',
    '  66%  { color: #ffff00; }',
    '  100% { color: #00ffcc; }',
    '}',

    /* Backgrounds invert to deep black with holo shimmer edges */
    'body.konami-text-invert {',
    '  background-color: #000 !important;',
    '}',
    'body.konami-text-invert .hero {',
    '  background: #000 !important;',
    '}',
    'body.konami-text-invert .hero__stripe::before,',
    'body.konami-text-invert .hero__stripe::after {',
    '  opacity: 0.35 !important;',
    '}',
    'body.konami-text-invert .scrap-card__paper {',
    '  background-color: #0a0012 !important;',
    '  border-color: #ff00cc !important;',
    '  box-shadow: 6px 6px 0 #ff00cc, 0 0 20px rgba(255,0,200,0.3) !important;',
    '  animation: konami-card-border 0.4s steps(1) infinite !important;',
    '}',
    '@keyframes konami-card-border {',
    '  0%   { border-color: #ff00cc; box-shadow: 6px 6px 0 #ff00cc; }',
    '  25%  { border-color: #00ffcc; box-shadow: 6px 6px 0 #00ffcc; }',
    '  50%  { border-color: #ffff00; box-shadow: 6px 6px 0 #ffff00; }',
    '  75%  { border-color: #00aaff; box-shadow: 6px 6px 0 #00aaff; }',
    '  100% { border-color: #ff00cc; box-shadow: 6px 6px 0 #ff00cc; }',
    '}',
    'body.konami-text-invert .scrap-card__inner {',
    '  background: rgba(0,0,0,0.85) !important;',
    '  border-color: rgba(255,0,200,0.3) !important;',
    '}',

    /* Nav bar inverts */
    'body.konami-text-invert .nav {',
    '  background: rgba(0,0,0,0.95) !important;',
    '  border-bottom-color: #ff00cc !important;',
    '}',
    'body.konami-text-invert .nav__links a,',
    'body.konami-text-invert .nav__logo-name {',
    '  color: #00ffcc !important;',
    '  -webkit-text-fill-color: #00ffcc !important;',
    '}',

    /* Ticker inverts */
    'body.konami-text-invert .ticker {',
    '  background: #ff00cc !important;',
    '}',

    /* Stat row */
    'body.konami-text-invert .stat-row {',
    '  background: #000 !important;',
    '  border-color: #ff00cc !important;',
    '}',
    'body.konami-text-invert .stat-row__label {',
    '  color: #00ffcc !important;',
    '}',

    /* Manifesto dark band — invert the inversion (goes bright) */
    'body.konami-text-invert .manifesto {',
    '  background: #ff00cc !important;',
    '}',
    'body.konami-text-invert .manifesto__quote {',
    '  color: #fff !important;',
    '}',

    /* Scrap card taglines */
    'body.konami-text-invert .scrap-card__tagline {',
    '  animation: konami-text-cycle 0.6s linear infinite !important;',
    '}',

    /* Section labels */
    'body.konami-text-invert .section__label {',
    '  color: #ff00cc !important;',
    '}',

    /* Audience cards */
    'body.konami-text-invert .audience-card {',
    '  background: #050010 !important;',
    '  border-color: rgba(0,255,200,0.3) !important;',
    '}',

    /* ── Card burst extra intensity ──────────────────────── */
    '.konami-card-burst .scrap-card__paper {',
    '  animation: konami-card-burst-anim 0.08s steps(1) 6 forwards !important;',
    '}',
    '@keyframes konami-card-burst-anim {',
    '  0%   { transform: translate(0,0)      rotate(var(--r,0deg)); }',
    '  20%  { transform: translate(-4px,2px) rotate(var(--r,0deg)) scaleX(1.02); }',
    '  40%  { transform: translate(3px,-3px) rotate(var(--r,0deg)) scaleX(0.98); }',
    '  60%  { transform: translate(-2px,4px) rotate(var(--r,0deg)) scaleX(1.01); }',
    '  80%  { transform: translate(4px,-1px) rotate(var(--r,0deg)); }',
    '  100% { transform: translate(0,0)      rotate(var(--r,0deg)); }',
    '}',

    /* ── Smooth transitions in/out for body bg ───────────── */
    'body { transition: background-color 0.3s ease; }',
    'body.konami-active .scrap-card { z-index: 5; }',

    /* ── Reduced motion: kill all konami animations ──────── */
    '@media (prefers-reduced-motion: reduce) {',
    '  body.konami-active { animation: none !important; filter: none !important; }',
    '  body.konami-text-invert * { animation: none !important; }',
    '  #konami-flash { display: none !important; }',
    '  #konami-rain  { display: none !important; }',
    '}',

  ].join('\n');
  document.head.appendChild(style);

  /* ── Announce to screen readers ──────────────────────────── */
  var announce = document.createElement('div');
  announce.setAttribute('role', 'status');
  announce.setAttribute('aria-live', 'polite');
  announce.className = 'sr-only';
  announce.id = 'konami-announce';
  document.body.appendChild(announce);

  function announceKonami() {
    var el = document.getElementById('konami-announce');
    if (el) el.textContent = 'Konami code activated. Visual chaos mode engaged for 3 seconds.';
    setTimeout(function () { if (el) el.textContent = ''; }, 5000);
  }

  /* Patch launchKonami to also announce */
  var _originalLaunch = launchKonami;
  launchKonami = function () { // eslint-disable-line no-func-assign
    announceKonami();
    _originalLaunch();
  };

  /* ── Hint in console for developers who poke around ─────── */
  /* Using setTimeout so it logs after page is fully loaded */
  setTimeout(function () {
    var styles = [
      'background: linear-gradient(90deg,#ff00cc,#00ffcc,#ffff00)',
      'color: #000',
      'font-weight: 900',
      'font-size: 13px',
      'padding: 4px 8px',
      'border-radius: 2px',
    ].join(';');
    console.log(
      '%c SoloSuccess Solutions ',
      styles,
      '\n\n  ↑ ↑ ↓ ↓ ← → ← → B A\n\n  You know what to do.\n'
    );
  }, 1500);

})();
