/* ============================================================
   GLITCH ENGINE — Y2K Pixel Artifact System
   Spawns randomised digital artifacts on each scrap card:
   - Pixel noise bursts (random position, colour, size)
   - Cluster streaks (horizontal smear)
   - Per-card desynchronised timing so they never fire in sync
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────── */
  var CFG = {
    // Idle: very rare, tiny bursts — almost invisible
    PIXELS_PER_BURST: [0, 0],        // idle fires NO pixels — visual only on hover
    CLUSTER_PER_BURST: [0, 0],
    // Idle interval — effectively disabled (very long intervals, no pixels anyway)
    BURST_INTERVAL_BASE: 15000,       // 15 seconds between idle checks
    BURST_INTERVAL_JITTER: 10000,     // + up to 10s more
    // Hover: active and satisfying
    HOVER_INTERVAL: 400,
    HOVER_PIXELS: [4, 8],
    HOVER_CLUSTERS: [1, 3],
    // Pixel lifetime (ms)
    PIXEL_LIFE: [200, 500],
    // Colour palette — Y2K brights
    COLORS: [
      'rgba(255,0,200,0.8)',
      'rgba(0,220,255,0.8)',
      'rgba(255,230,0,0.8)',
      'rgba(170,255,0,0.8)',
      'rgba(255,100,0,0.8)',
      'rgba(180,0,255,0.8)',
      'rgba(255,255,255,0.85)',
    ],
  };

  /* ── Helpers ──────────────────────────────────────────────── */
  function rnd(min, max) { return Math.random() * (max - min) + min; }
  function rndInt(min, max) { return Math.floor(rnd(min, max + 1)); }
  function pick(arr) { return arr[rndInt(0, arr.length - 1)]; }

  /* ── Per-card state ──────────────────────────────────────── */
  var cards = [];

  /* ── Spawn one pixel artifact inside a card ─────────────── */
  function spawnPixel(inner, isHover) {
    var px = document.createElement('span');
    px.className = 'glitch-pixel';

    var w    = rndInt(2, isHover ? 14 : 8);
    var h    = rndInt(1, isHover ? 5  : 3);
    var x    = rnd(0, 95);   // % left
    var y    = rnd(5, 90);   // % top
    var life = rndInt(CFG.PIXEL_LIFE[0], CFG.PIXEL_LIFE[1]);
    var color = pick(CFG.COLORS);
    var drift = (Math.random() < 0.5 ? -1 : 1) * rndInt(2, 12);

    px.style.cssText = [
      'left:'        + x    + '%',
      'top:'         + y    + '%',
      '--px-w:'      + w    + 'px',
      '--px-h:'      + h    + 'px',
      '--px-color:'  + color,
      '--px-dur:'    + life + 'ms',
      '--px-delay:0ms',
      '--px-drift:'  + drift + 'px',
    ].join(';');

    inner.appendChild(px);
    setTimeout(function () { px.remove(); }, life + 60);
  }

  /* ── Spawn a cluster streak ──────────────────────────────── */
  function spawnCluster(inner, isHover) {
    var px = document.createElement('span');
    px.className = 'glitch-pixel glitch-pixel--cluster';

    var w    = rndInt(isHover ? 20 : 8, isHover ? 60 : 24);
    var h    = rndInt(1, 2);
    var x    = rnd(0, 80);
    var y    = rnd(10, 88);
    var life = rndInt(250, isHover ? 500 : 400);
    var color = pick(CFG.COLORS);

    px.style.cssText = [
      'left:'       + x    + '%',
      'top:'        + y    + '%',
      '--px-w:'     + w    + 'px',
      '--px-h:'     + h    + 'px',
      '--px-color:' + color,
      '--px-dur:'   + life + 'ms',
      '--px-delay:0ms',
    ].join(';');

    inner.appendChild(px);
    setTimeout(function () { px.remove(); }, life + 60);
  }

  /* ── Run one burst on a card ─────────────────────────────── */
  function runBurst(state, isHover) {
    var inner = state.inner;
    if (!inner) return;

    var nPx  = rndInt.apply(null, isHover ? CFG.HOVER_PIXELS   : CFG.PIXELS_PER_BURST);
    var nCl  = rndInt.apply(null, isHover ? CFG.HOVER_CLUSTERS : CFG.CLUSTER_PER_BURST);

    for (var i = 0; i < nPx; i++) spawnPixel(inner, isHover);
    for (var j = 0; j < nCl; j++) spawnCluster(inner, isHover);

    // Occasionally fire a second micro-burst 80ms later
    if (Math.random() < 0.35) {
      setTimeout(function () {
        for (var k = 0; k < rndInt(1, 3); k++) spawnPixel(inner, isHover);
      }, 80);
    }
  }

  /* ── Schedule idle bursts for one card ───────────────────── */
  function scheduleIdle(state) {
    if (state.hovered) return; // hovering handles its own loop
    var delay = CFG.BURST_INTERVAL_BASE + rnd(0, CFG.BURST_INTERVAL_JITTER);
    state.idleTimer = setTimeout(function () {
      if (!state.hovered) runBurst(state, false);
      scheduleIdle(state);
    }, delay);
  }

  /* ── Hover burst loop ────────────────────────────────────── */
  function startHoverLoop(state) {
    // Fire immediately
    runBurst(state, true);
    state.hoverTimer = setInterval(function () {
      runBurst(state, true);
    }, CFG.HOVER_INTERVAL + rndInt(0, 120));
  }

  function stopHoverLoop(state) {
    clearInterval(state.hoverTimer);
    state.hoverTimer = null;
  }

  /* ── Per-card glitch CSS vars (randomise slice position) ─── */
  var GLITCH_POSITIONS = ['18%','28%','38%','52%','62%','72%','80%'];
  var GLITCH_PERIODS   = ['5s','6s','7s','8s','9s','11s','13s'];
  var GLITCH_DELAYS    = ['0s','0.8s','1.6s','2.2s','3.1s','4.0s','0.4s'];
  var BADGES           = ['SYS_OK','RUN','ERR_00','EXEC','INIT','LOAD','SYNC'];

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    var els = document.querySelectorAll('.scrap-card');
    if (!els.length) return;

    els.forEach(function (card, i) {
      /* -- Inject scanlines + noise layers into .scrap-card__paper -- */
      var paper = card.querySelector('.scrap-card__paper');
      if (paper) {
        var scanlines = document.createElement('div');
        scanlines.className = 'scrap-card__scanlines';
        scanlines.setAttribute('aria-hidden', 'true');
        paper.appendChild(scanlines);

        var noise = document.createElement('div');
        noise.className = 'scrap-card__noise';
        noise.setAttribute('aria-hidden', 'true');
        paper.appendChild(noise);
      }

      /* -- Inject badge into paper -- */
      if (paper) {
        var badge = document.createElement('span');
        badge.className = 'scrap-card__badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = BADGES[i % BADGES.length];
        paper.appendChild(badge);
      }

      /* -- Set per-card CSS custom props on the card element -- */
      card.style.setProperty('--glitch-y',       GLITCH_POSITIONS[i % GLITCH_POSITIONS.length]);
      card.style.setProperty('--glitch-period',  GLITCH_PERIODS[i % GLITCH_PERIODS.length]);
      card.style.setProperty('--glitch-delay',   GLITCH_DELAYS[i % GLITCH_DELAYS.length]);
      card.style.setProperty('--glitch-x',       (i % 2 === 0 ? '-' : '') + (4 + i * 3) + 'px');

      /* -- Build state object -- */
      var inner = card.querySelector('.scrap-card__inner');
      var state = { card: card, inner: inner, hovered: false, idleTimer: null, hoverTimer: null };
      cards.push(state);

      /* -- Event listeners -- */
      card.addEventListener('mouseenter', function () {
        state.hovered = true;
        clearTimeout(state.idleTimer);
        startHoverLoop(state);
      });

      card.addEventListener('mouseleave', function () {
        state.hovered = false;
        stopHoverLoop(state);
        // Stagger restart of idle loop so cards de-sync naturally
        setTimeout(function () { scheduleIdle(state); }, rndInt(200, 800));
      });

      /* -- Start idle loop with a unique initial delay per card -- */
      var initialDelay = i * 400 + rndInt(0, 1200);
      setTimeout(function () { scheduleIdle(state); }, initialDelay);
    });
  }

  /* ── Boot after DOM ready ─────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Respect reduced motion ───────────────────────────────── */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    // Override: don't schedule any bursts
    cards.forEach(function (s) {
      clearTimeout(s.idleTimer);
      clearInterval(s.hoverTimer);
    });
  }

})();

/* ── Public hook for mobile tap integration ─────────────────
   mobile.js calls window.__glitchBurst(inner, isHover) on tap
   to fire pixel artifacts without hover state.
   ─────────────────────────────────────────────────────────── */
window.__glitchBurst = function (inner, isHover) {
  if (!inner) return;
  var nPx  = isHover ? 10 : 4;
  var nCl  = isHover ? 3  : 1;
  var COLORS = [
    'rgba(255,0,200,0.85)',
    'rgba(0,220,255,0.85)',
    'rgba(255,230,0,0.85)',
    'rgba(170,255,0,0.85)',
    'rgba(255,100,0,0.85)',
    'rgba(180,0,255,0.85)',
    'rgba(255,255,255,0.9)',
  ];
  function rnd(a,b){ return Math.random()*(b-a)+a; }
  function rndI(a,b){ return Math.floor(rnd(a,b+1)); }
  function pick(a){ return a[rndI(0,a.length-1)]; }

  for (var i=0; i<nPx; i++) {
    var px = document.createElement('span');
    px.className = 'glitch-pixel';
    var w=rndI(2,14), h=rndI(1,5), x=rnd(0,95), y=rnd(5,90);
    var life=rndI(200,600), color=pick(COLORS), drift=(Math.random()<0.5?-1:1)*rndI(2,12);
    px.style.cssText='left:'+x+'%;top:'+y+'%;--px-w:'+w+'px;--px-h:'+h+'px;--px-color:'+color+';--px-dur:'+life+'ms;--px-delay:0ms;--px-drift:'+drift+'px';
    inner.appendChild(px);
    setTimeout(function(p){ p.remove(); }, life+60, px);
  }
  for (var j=0; j<nCl; j++) {
    var cl = document.createElement('span');
    cl.className = 'glitch-pixel glitch-pixel--cluster';
    var cw=rndI(20,60), ch=1, cx=rnd(0,80), cy=rnd(10,88);
    var clife=rndI(250,500), ccolor=pick(COLORS);
    cl.style.cssText='left:'+cx+'%;top:'+cy+'%;--px-w:'+cw+'px;--px-h:'+ch+'px;--px-color:'+ccolor+';--px-dur:'+clife+'ms;--px-delay:0ms';
    inner.appendChild(cl);
    setTimeout(function(p){ p.remove(); }, clife+60, cl);
  }
};
