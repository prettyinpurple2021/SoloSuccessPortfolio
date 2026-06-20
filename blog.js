/* ============================================================
   BLOG.JS — Shared post engine
   Used by: blog.html (full feed) + product pages (inline)
   Data source: /posts.json (base), merged with localStorage posts
   ============================================================ */

(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────── */
  var STORAGE_KEY = 'ss_posts';
  var BASE_PATH   = (function() {
    var p = window.location.pathname;
    // If we're in /pages/, path to root is ../
    return p.includes('/pages/') ? '../' : './';
  })();

  /* ── Type config ─────────────────────────────────────────── */
  var TYPES = {
    'build-update':          { label: 'Build Update',        color: '#00cfff' },
    'product-announcement':  { label: 'Product Launch',      color: '#ff9a00' },
    'lessons-learned':       { label: 'Lessons Learned',     color: '#c87af9' },
    'founder-thoughts':      { label: 'Founder Thoughts',    color: '#ff4ec8' },
  };

  var PRODUCTS = {
    'general':         { label: 'General',         color: '#888' },
    'academy':         { label: 'Academy',          color: '#00cfff' },
    'content-factory': { label: 'Content Factory',  color: '#ff9a00' },
    'soloscribe':      { label: 'SoloScribe',        color: '#c87af9' },
    'solodesign':      { label: 'SoloDesign',        color: '#ffe800' },
    'soloscout':       { label: 'SoloScout',         color: '#00e676' },
    'soloconnect':     { label: 'SoloConnect',       color: '#ff4ec8' },
    'solosuccess-ai':  { label: 'SoloSuccess AI',    color: '#7c4dff' },
  };

  /* Rotations for the scrapbook stagger */
  var ROTS  = ['-1.5deg','1.2deg','-2deg','1.8deg','-0.8deg','2.2deg','-1.1deg'];
  var TAPES = ['','holo','','holo','','','holo'];

  /* ── Date formatting ─────────────────────────────────────── */
  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  }

  /* ── Load posts — merge JSON + localStorage ──────────────── */
  var _cache = null;

  function loadPosts(callback) {
    if (_cache) { callback(_cache); return; }
    fetch(BASE_PATH + 'posts.json')
      .then(function(r){ return r.json(); })
      .then(function(base) {
        var stored = [];
        try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e){}
        // Merge: stored posts take priority; sort newest first
        var all = base.concat(stored);
        // Deduplicate by id (stored overrides base)
        var seen = {};
        all = all.filter(function(p){
          if(seen[p.id]) return false;
          seen[p.id] = true;
          return true;
        });
        all.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
        _cache = all;
        callback(all);
      })
      .catch(function() {
        // Fallback: localStorage only
        var stored = [];
        try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e){}
        stored.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
        _cache = stored;
        callback(stored);
      });
  }

  /* ── Expose for admin.js ─────────────────────────────────── */
  window.BlogEngine = {
    loadPosts: loadPosts,
    TYPES: TYPES,
    PRODUCTS: PRODUCTS,
    STORAGE_KEY: STORAGE_KEY,
    invalidateCache: function() { _cache = null; },
  };

  /* ============================================================
     BLOG PAGE — full feed
  ============================================================ */
  function initBlogPage() {
    var grid    = document.getElementById('post-grid');
    var empty   = document.getElementById('blog-empty');
    var filterBar = document.getElementById('filter-bar');
    var countEl = document.getElementById('post-count');
    var heroStats = document.getElementById('hero-stats');
    var featuredEl = document.getElementById('featured-posts');
    if (!grid) return;

    var activeFilter = 'all';
    var allPosts = [];

    loadPosts(function(posts) {
      allPosts = posts;
      buildHeroStats(posts);
      buildFeatured(posts);
      buildFilters(posts);
      renderPosts(posts);
    });

    function buildHeroStats(posts) {
      if (!heroStats) return;
      var types = {};
      posts.forEach(function(p){ types[p.type] = (types[p.type]||0)+1; });
      var chips = [
        { label: posts.length + ' posts total', color: '' },
        { label: Object.keys(types).length + ' topics', color: '' },
        { label: '100% transparent', color: '' },
      ];
      heroStats.innerHTML = chips.map(function(c){
        return '<span class="blog-meta-chip" role="listitem">' + c.label + '</span>';
      }).join('');
    }

    function buildFeatured(posts) {
      if (!featuredEl) return;
      var featured = posts.filter(function(p){ return p.featured; }).slice(0,3);
      var rots = ['-2deg','1.5deg','-1deg'];
      var papers = ['var(--paper-2)','var(--paper-1)','var(--paper-3)'];
      featuredEl.innerHTML = featured.map(function(p, i){
        var typeInfo = TYPES[p.type] || { label: p.type, color: '#888' };
        return '<a href="#" class="blog-hero-featured-card" data-id="' + p.id + '"' +
          ' style="--card-rot:' + rots[i] + ';--paper-bg:' + papers[i] + ';--card-color:' + p.color + ';"' +
          ' aria-label="Read: ' + escHtml(p.title) + '">' +
          '<div class="bhfc__type">' + escHtml(typeInfo.label) + '</div>' +
          '<div class="bhfc__title">' + escHtml(p.title) + '</div>' +
          '<div class="bhfc__excerpt">' + escHtml(p.excerpt) + '</div>' +
          '<div class="bhfc__date">' + formatDate(p.date) + '</div>' +
          '</a>';
      }).join('');
      // Click → open modal
      featuredEl.querySelectorAll('.blog-hero-featured-card').forEach(function(el){
        el.addEventListener('click', function(e){
          e.preventDefault();
          openModal(el.getAttribute('data-id'), allPosts);
        });
      });
    }

    function buildFilters(posts) {
      if (!filterBar) return;
      // Collect unique types and products
      var types    = {};
      var products = {};
      posts.forEach(function(p){
        types[p.type]       = true;
        products[p.product] = true;
      });

      var html = '<button class="filter-btn is-active" data-filter="all" style="--filter-color:rgba(255,255,255,0.12)" role="tab" aria-selected="true">' +
        '<span class="filter-btn__dot" style="background:rgba(255,255,255,0.4)"></span>All</button>' +
        '<div class="filter-divider" aria-hidden="true"></div>';

      // Post types
      Object.keys(TYPES).forEach(function(key){
        if (!types[key]) return;
        var t = TYPES[key];
        html += '<button class="filter-btn" data-filter="type:' + key + '" style="--filter-color:' + t.color + '" role="tab" aria-selected="false">' +
          '<span class="filter-btn__dot"></span>' + t.label + '</button>';
      });

      html += '<div class="filter-divider" aria-hidden="true"></div>';

      // Products
      Object.keys(PRODUCTS).forEach(function(key){
        if (!products[key]) return;
        var pr = PRODUCTS[key];
        html += '<button class="filter-btn" data-filter="product:' + key + '" style="--filter-color:' + pr.color + '" role="tab" aria-selected="false">' +
          '<span class="filter-btn__dot"></span>' + pr.label + '</button>';
      });

      filterBar.innerHTML = html;

      // Click handlers
      filterBar.querySelectorAll('.filter-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
          filterBar.querySelectorAll('.filter-btn').forEach(function(b){
            b.classList.remove('is-active');
            b.setAttribute('aria-selected','false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected','true');
          activeFilter = btn.getAttribute('data-filter');
          renderPosts(allPosts);
        });
      });
    }

    function renderPosts(posts) {
      var filtered = posts.filter(function(p){
        if (activeFilter === 'all') return true;
        if (activeFilter.startsWith('type:'))    return p.type    === activeFilter.slice(5);
        if (activeFilter.startsWith('product:')) return p.product === activeFilter.slice(8);
        return true;
      });

      if (countEl) {
        countEl.innerHTML = '<strong>' + filtered.length + '</strong> post' + (filtered.length !== 1 ? 's' : '') +
          (activeFilter !== 'all' ? ' · filtered' : '');
      }

      if (!filtered.length) {
        grid.innerHTML = '';
        if (empty) empty.classList.add('is-visible');
        return;
      }
      if (empty) empty.classList.remove('is-visible');

      grid.innerHTML = filtered.map(function(p, i){
        return buildPostCard(p, i);
      }).join('');

      // Click handlers
      grid.querySelectorAll('.post-card').forEach(function(card){
        card.addEventListener('click', function(){
          openModal(card.getAttribute('data-id'), allPosts);
        });
        card.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(card.getAttribute('data-id'), allPosts);
          }
        });
      });
    }
  }

  /* ── Build one post card HTML ─────────────────────────────── */
  function buildPostCard(p, i) {
    var typeInfo    = TYPES[p.type]    || { label: p.type,    color: '#888' };
    var productInfo = PRODUCTS[p.product] || { label: p.product, color: '#888' };
    var rot  = ROTS[i % ROTS.length];
    var tape = TAPES[i % TAPES.length];
    return '<article class="post-card" role="listitem" tabindex="0"' +
      ' data-id="' + p.id + '" data-type="' + p.type + '" data-product="' + p.product + '"' +
      ' style="--post-rot:' + rot + ';--post-color:' + p.color + ';--post-paper:' + p.paperColor + ';"' +
      ' aria-label="' + escHtml(p.title) + '">' +
      '<div class="post-card__tape' + (tape === 'holo' ? ' post-card__tape--holo' : '') + '" style="--tape-rot:' + (i%2===0?'-1.5deg':'1.5deg') + ';" aria-hidden="true"></div>' +
      '<div class="post-card__paper">' +
        '<div class="post-card__inner">' +
          '<div class="post-card__meta">' +
            '<span class="post-card__type-badge">' + escHtml(typeInfo.label) + '</span>' +
            (p.product !== 'general' ? '<span class="post-card__product-badge">· ' + escHtml(productInfo.label) + '</span>' : '') +
            '<span class="post-card__date">' + formatDate(p.date) + '</span>' +
          '</div>' +
          '<h2 class="post-card__title">' + escHtml(p.title) + '</h2>' +
          '<p class="post-card__excerpt">' + escHtml(p.excerpt) + '</p>' +
          (p.tags && p.tags.length ? '<div class="post-card__tags">' + p.tags.map(function(t){ return '<span class="post-card__tag">' + escHtml(t) + '</span>'; }).join('') + '</div>' : '') +
        '</div>' +
        '<div class="post-card__arrow" aria-hidden="true">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ── Modal ───────────────────────────────────────────────── */
  function openModal(id, posts) {
    var post = posts.find(function(p){ return p.id === id; });
    if (!post) return;
    var overlay = document.getElementById('post-modal-overlay');
    if (!overlay) return;

    var typeInfo = TYPES[post.type] || { label: post.type, color: '#888' };

    document.getElementById('modal-type').textContent    = typeInfo.label;
    document.getElementById('modal-type').style.color    = typeInfo.color;
    document.getElementById('modal-date').textContent    = formatDate(post.date);
    document.getElementById('modal-title').textContent   = post.title;
    document.getElementById('modal-date-full').textContent = formatDate(post.date) + (post.product !== 'general' ? ' · ' + (PRODUCTS[post.product]||{label:post.product}).label : '');
    // Render body — split on \n\n for paragraphs
    var bodyEl = document.getElementById('modal-content');
    bodyEl.innerHTML = post.body.split('\n\n').map(function(para){
      return '<p>' + escHtml(para).replace(/\n/g,'<br/>') + '</p>';
    }).join('');

    var tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = (post.tags||[]).map(function(t){
      return '<span class="post-card__tag">' + escHtml(t) + '</span>';
    }).join('');

    overlay.removeAttribute('hidden');
    requestAnimationFrame(function(){ overlay.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';

    // Focus modal
    var modal = document.getElementById('post-modal');
    if (modal) modal.focus();
  }

  function closeModal() {
    var overlay = document.getElementById('post-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    setTimeout(function(){ overlay.setAttribute('hidden',''); }, 320);
    document.body.style.overflow = '';
  }

  // Wire modal close
  document.addEventListener('DOMContentLoaded', function(){
    var closeBtn = document.getElementById('modal-close');
    var overlay  = document.getElementById('post-modal-overlay');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay)  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  });

  /* ============================================================
     PRODUCT PAGE — inline posts section
     Call: BlogEngine.renderInline(containerId, productId)
  ============================================================ */
  window.BlogEngine.renderInline = function(containerId, productId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    loadPosts(function(posts){
      var filtered = posts.filter(function(p){ return p.product === productId; });
      if (!filtered.length) {
        container.style.display = 'none';
        return;
      }
      container.innerHTML =
        '<div class="inline-posts" aria-labelledby="inline-posts-title-' + productId + '">' +
          '<div class="container">' +
            '<p class="section__label">Building in Public</p>' +
            '<h2 class="section__title" id="inline-posts-title-' + productId + '">' +
              filtered.length + ' Post' + (filtered.length !== 1 ? 's' : '') + ' on This Product.</h2>' +
            '<div class="inline-posts__grid" role="list">' +
              filtered.slice(0,3).map(function(p){
                var typeInfo = TYPES[p.type] || { label: p.type, color: '#888' };
                return '<a href="' + BASE_PATH + 'blog.html#post-' + p.id + '" class="inline-post-card" role="listitem"' +
                  ' style="--post-color:' + p.color + ';" aria-label="' + escHtml(p.title) + '">' +
                  '<div class="ipc__type">' + escHtml(typeInfo.label) + '</div>' +
                  '<h3 class="ipc__title">' + escHtml(p.title) + '</h3>' +
                  '<p class="ipc__excerpt">' + escHtml(p.excerpt) + '</p>' +
                  '<p class="ipc__date">' + formatDate(p.date) + '</p>' +
                  '</a>';
              }).join('') +
            '</div>' +
            (filtered.length > 3 ?
              '<div style="margin-top:var(--sp6);"><a href="' + BASE_PATH + 'blog.html" class="btn-outline" style="font-size:var(--text-sm);padding:10px 24px;">View All ' + filtered.length + ' Posts →</a></div>'
              : '') +
          '</div>' +
        '</div>';
    });
  };

  /* ── Hash-based deep link: blog.html#post-001 ────────────── */
  function checkHash() {
    var hash = window.location.hash;
    if (!hash || !hash.startsWith('#post-')) return;
    var id = hash.replace('#post-','');
    loadPosts(function(posts){ openModal(id, posts); });
  }

  /* ── HTML escape ─────────────────────────────────────────── */
  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Boot ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      initBlogPage();
      checkHash();
    });
  } else {
    initBlogPage();
    checkHash();
  }

})();
