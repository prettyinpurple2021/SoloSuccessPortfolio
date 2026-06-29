/* ============================================================
   BLOG.JS — Shared post engine
   Used by: blog.html (full feed) + product pages (inline)
   Data source: /posts.json
   ============================================================ */

(function () {
  'use strict';

  var BASE_PATH = (function () {
    var p = window.location.pathname;
    return p.includes('/pages/') ? '../' : './';
  })();

  var STORAGE_KEY = 'ss_posts';

  var TYPES = {
    'build-update': { label: 'Build Update', color: '#00cfff' },
    'product-announcement': { label: 'Product Launch', color: '#ff9a00' },
    'lessons-learned': { label: 'Lessons Learned', color: '#c87af9' },
    'founder-thoughts': { label: 'Founder Thoughts', color: '#ff4ec8' }
  };

  var PRODUCTS = {
    'general': { label: 'General', color: '#888' },
    'academy': { label: 'Academy', color: '#00cfff' },
    'content-factory': { label: 'Content Factory', color: '#ff9a00' },
    'soloscribe': { label: 'SoloScribe', color: '#c87af9' },
    'solodesign': { label: 'SoloDesign', color: '#ffe800' },
    'soloscout': { label: 'SoloScout', color: '#00e676' },
    'soloconnect': { label: 'SoloConnect', color: '#ff4ec8' },
    'solosuccess-ai': { label: 'SoloSuccess AI', color: '#7c4dff' }
  };

  var ROTS = ['-1.5deg', '1.2deg', '-2deg', '1.8deg', '-0.8deg', '2.2deg', '-1.1deg'];
  var TAPES = ['', 'holo', '', 'holo', '', '', 'holo'];
  var cache = null;
  var lastFocused = null;
  var currentPost = null;

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function absolutePostUrl(post) {
    return new URL(BASE_PATH + 'blog.html#post-' + post.id, window.location.href).toString();
  }

  function loadPosts(callback) {
    if (cache) {
      callback(cache);
      return;
    }

    fetch(BASE_PATH + 'posts.json', { cache: 'no-store' })
      .then(function (response) { return response.json(); })
      .then(function (posts) {
        posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        cache = posts;
        callback(posts);
      })
      .catch(function () {
        cache = [];
        callback([]);
      });
  }

  window.BlogEngine = {
    loadPosts: loadPosts,
    TYPES: TYPES,
    PRODUCTS: PRODUCTS,
    STORAGE_KEY: STORAGE_KEY,
    invalidateCache: function () { cache = null; }
  };

  function initBlogPage() {
    var grid = document.getElementById('post-grid');
    var empty = document.getElementById('blog-empty');
    var filterBar = document.getElementById('filter-bar');
    var countEl = document.getElementById('post-count');
    var heroStats = document.getElementById('hero-stats');
    var featuredEl = document.getElementById('featured-posts');
    var searchInput = document.getElementById('blog-search');
    if (!grid) return;

    var activeFilter = 'all';
    var activeQuery = '';
    var allPosts = [];

    loadPosts(function (posts) {
      allPosts = posts;
      buildHeroStats(posts);
      buildFeatured(posts);
      buildFilters(posts);
      renderPosts(posts);
    });

    function buildHeroStats(posts) {
      if (!heroStats) return;
      var types = {};
      posts.forEach(function (p) { types[p.type] = (types[p.type] || 0) + 1; });
      heroStats.innerHTML = [
        { label: posts.length + ' posts total' },
        { label: Object.keys(types).length + ' topics' },
        { label: 'Searchable archive' }
      ].map(function (chip) {
        return '<span class="blog-meta-chip" role="listitem">' + chip.label + '</span>';
      }).join('');
    }

    function buildFeatured(posts) {
      if (!featuredEl) return;
      var featured = posts.filter(function (p) { return p.featured; }).slice(0, 3);
      var rots = ['-2deg', '1.5deg', '-1deg'];
      var papers = ['var(--paper-2)', 'var(--paper-1)', 'var(--paper-3)'];
      featuredEl.innerHTML = featured.map(function (post, i) {
        var typeInfo = TYPES[post.type] || { label: post.type, color: '#888' };
        return '<a href="#post-' + post.id + '" class="blog-hero-featured-card" data-id="' + post.id + '"' +
          ' style="--card-rot:' + rots[i] + ';--paper-bg:' + papers[i] + ';--card-color:' + post.color + ';"' +
          ' aria-label="Read: ' + escHtml(post.title) + '">' +
          '<div class="bhfc__type">' + escHtml(typeInfo.label) + '</div>' +
          '<div class="bhfc__title">' + escHtml(post.title) + '</div>' +
          '<div class="bhfc__excerpt">' + escHtml(post.excerpt) + '</div>' +
          '<div class="bhfc__date">' + formatDate(post.date) + '</div>' +
          '</a>';
      }).join('');

      featuredEl.querySelectorAll('.blog-hero-featured-card').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          openModal(el.getAttribute('data-id'), allPosts, el);
        });
      });
    }

    function buildFilters(posts) {
      if (!filterBar) return;
      var types = {};
      var products = {};
      posts.forEach(function (post) {
        types[post.type] = true;
        products[post.product] = true;
      });

      var html = '<button class="filter-btn is-active" data-filter="all" style="--filter-color:rgba(255,255,255,0.12)" role="tab" aria-selected="true">' +
        '<span class="filter-btn__dot" style="background:rgba(255,255,255,0.4)"></span>All</button>' +
        '<div class="filter-divider" aria-hidden="true"></div>';

      Object.keys(TYPES).forEach(function (key) {
        if (!types[key]) return;
        var type = TYPES[key];
        html += '<button class="filter-btn" data-filter="type:' + key + '" style="--filter-color:' + type.color + '" role="tab" aria-selected="false">' +
          '<span class="filter-btn__dot"></span>' + type.label + '</button>';
      });

      html += '<div class="filter-divider" aria-hidden="true"></div>';

      Object.keys(PRODUCTS).forEach(function (key) {
        if (!products[key]) return;
        var product = PRODUCTS[key];
        html += '<button class="filter-btn" data-filter="product:' + key + '" style="--filter-color:' + product.color + '" role="tab" aria-selected="false">' +
          '<span class="filter-btn__dot"></span>' + product.label + '</button>';
      });

      filterBar.innerHTML = html;

      filterBar.querySelectorAll('.filter-btn').forEach(function (button) {
        button.addEventListener('click', function () {
          filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-selected', 'false');
          });
          button.classList.add('is-active');
          button.setAttribute('aria-selected', 'true');
          activeFilter = button.getAttribute('data-filter');
          renderPosts(allPosts);
        });
      });
    }

    function matchesSearch(post) {
      if (!activeQuery) return true;
      var haystack = [
        post.title,
        post.excerpt,
        post.body,
        post.product,
        post.type,
        (post.tags || []).join(' ')
      ].join(' ').toLowerCase();
      return haystack.indexOf(activeQuery) !== -1;
    }

    function renderPosts(posts) {
      var filtered = posts.filter(function (post) {
        var matchesFilter = true;
        if (activeFilter.startsWith('type:')) matchesFilter = post.type === activeFilter.slice(5);
        if (activeFilter.startsWith('product:')) matchesFilter = post.product === activeFilter.slice(8);
        return matchesFilter && matchesSearch(post);
      });

      if (countEl) {
        countEl.innerHTML = '<strong>' + filtered.length + '</strong> post' + (filtered.length !== 1 ? 's' : '') +
          (activeFilter !== 'all' ? ' · filtered' : '') + (activeQuery ? ' · search active' : '');
      }

      if (!filtered.length) {
        grid.innerHTML = '';
        if (empty) empty.classList.add('is-visible');
        return;
      }

      if (empty) empty.classList.remove('is-visible');
      grid.innerHTML = filtered.map(function (post, i) { return buildPostCard(post, i); }).join('');

      grid.querySelectorAll('.post-card').forEach(function (card) {
        card.addEventListener('click', function () {
          openModal(card.getAttribute('data-id'), allPosts, card);
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(card.getAttribute('data-id'), allPosts, card);
          }
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        activeQuery = searchInput.value.trim().toLowerCase();
        renderPosts(allPosts);
      });
    }
  }

  function buildPostCard(post, index) {
    var typeInfo = TYPES[post.type] || { label: post.type, color: '#888' };
    var productInfo = PRODUCTS[post.product] || { label: post.product, color: '#888' };
    var rot = ROTS[index % ROTS.length];
    var tape = TAPES[index % TAPES.length];

    return '<article class="post-card" role="listitem" tabindex="0"' +
      ' data-id="' + post.id + '" data-type="' + post.type + '" data-product="' + post.product + '"' +
      ' style="--post-rot:' + rot + ';--post-color:' + post.color + ';--post-paper:' + post.paperColor + ';"' +
      ' aria-label="' + escHtml(post.title) + '">' +
      '<div class="post-card__tape' + (tape === 'holo' ? ' post-card__tape--holo' : '') + '" style="--tape-rot:' + (index % 2 === 0 ? '-1.5deg' : '1.5deg') + ';" aria-hidden="true"></div>' +
      '<div class="post-card__paper">' +
        '<div class="post-card__inner">' +
          '<div class="post-card__meta">' +
            '<span class="post-card__type-badge">' + escHtml(typeInfo.label) + '</span>' +
            (post.product !== 'general' ? '<span class="post-card__product-badge">· ' + escHtml(productInfo.label) + '</span>' : '') +
            '<span class="post-card__date">' + formatDate(post.date) + '</span>' +
          '</div>' +
          '<h2 class="post-card__title">' + escHtml(post.title) + '</h2>' +
          '<p class="post-card__excerpt">' + escHtml(post.excerpt) + '</p>' +
          (post.tags && post.tags.length ? '<div class="post-card__tags">' + post.tags.map(function (tag) { return '<span class="post-card__tag">' + escHtml(tag) + '</span>'; }).join('') + '</div>' : '') +
        '</div>' +
        '<div class="post-card__arrow" aria-hidden="true">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function setModalActions(post) {
    var shareLink = document.getElementById('modal-share-x');
    var copyButton = document.getElementById('modal-copy-link');
    if (!shareLink || !copyButton) return;

    var url = absolutePostUrl(post);
    shareLink.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.title + ' — ' + url);
    copyButton.setAttribute('data-url', url);
  }

  function openModal(id, posts, triggerEl) {
    var post = posts.find(function (entry) { return entry.id === id; });
    var overlay = document.getElementById('post-modal-overlay');
    if (!post || !overlay) return;

    currentPost = post;
    lastFocused = triggerEl || document.activeElement;

    var typeInfo = TYPES[post.type] || { label: post.type, color: '#888' };
    document.getElementById('modal-type').textContent = typeInfo.label;
    document.getElementById('modal-type').style.color = typeInfo.color;
    document.getElementById('modal-date').textContent = formatDate(post.date);
    document.getElementById('modal-title').textContent = post.title;
    document.getElementById('modal-date-full').textContent = formatDate(post.date) + (post.product !== 'general' ? ' · ' + (PRODUCTS[post.product] || { label: post.product }).label : '');
    document.getElementById('modal-content').innerHTML = post.body.split('\n\n').map(function (para) {
      return '<p>' + escHtml(para).replace(/\n/g, '<br/>') + '</p>';
    }).join('');
    document.getElementById('modal-tags').innerHTML = (post.tags || []).map(function (tag) {
      return '<span class="post-card__tag">' + escHtml(tag) + '</span>';
    }).join('');

    setModalActions(post);
    overlay.removeAttribute('hidden');
    requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    if (window.location.hash !== '#post-' + post.id) {
      window.history.replaceState(null, '', '#post-' + post.id);
    }

    var modal = document.getElementById('post-modal');
    if (modal) modal.focus();
  }

  function closeModal() {
    var overlay = document.getElementById('post-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    setTimeout(function () { overlay.setAttribute('hidden', ''); }, 320);
    document.body.style.overflow = '';
    currentPost = null;
    if (window.location.hash.indexOf('#post-') === 0) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function copyCurrentPostLink() {
    var button = document.getElementById('modal-copy-link');
    var url = button ? button.getAttribute('data-url') : '';
    if (!url) return;

    var finish = function (label) {
      if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
      button.textContent = label;
      setTimeout(function () { button.innerHTML = button.dataset.originalHtml; }, 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        finish('Copied!');
      }, function () {
        finish('Copy failed');
      });
      return;
    }

    var input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      finish('Copied!');
    } catch (err) {
      finish('Copy failed');
    }
    document.body.removeChild(input);
  }

  window.BlogEngine.renderInline = function (containerId, productId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    loadPosts(function (posts) {
      var filtered = posts.filter(function (post) { return post.product === productId; });
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
              filtered.slice(0, 3).map(function (post) {
                var typeInfo = TYPES[post.type] || { label: post.type, color: '#888' };
                return '<a href="' + BASE_PATH + 'blog.html#post-' + post.id + '" class="inline-post-card" role="listitem"' +
                  ' style="--post-color:' + post.color + ';" aria-label="' + escHtml(post.title) + '">' +
                  '<div class="ipc__type">' + escHtml(typeInfo.label) + '</div>' +
                  '<h3 class="ipc__title">' + escHtml(post.title) + '</h3>' +
                  '<p class="ipc__excerpt">' + escHtml(post.excerpt) + '</p>' +
                  '<p class="ipc__date">' + formatDate(post.date) + '</p>' +
                  '</a>';
              }).join('') +
            '</div>' +
            (filtered.length > 3 ? '<div style="margin-top:var(--sp6);"><a href="' + BASE_PATH + 'blog.html" class="btn-outline" style="font-size:var(--text-sm);padding:10px 24px;">View All ' + filtered.length + ' Posts →</a></div>' : '') +
          '</div>' +
        '</div>';
    });
  };

  function checkHash() {
    var hash = window.location.hash;
    if (!hash || hash.indexOf('#post-') !== 0) return;
    var id = hash.replace('#post-', '');
    loadPosts(function (posts) { openModal(id, posts); });
  }

  function bindModal() {
    var closeBtn = document.getElementById('modal-close');
    var overlay = document.getElementById('post-modal-overlay');
    var copyButton = document.getElementById('modal-copy-link');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    if (copyButton) copyButton.addEventListener('click', copyCurrentPostLink);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    window.addEventListener('hashchange', function () {
      if (window.location.hash.indexOf('#post-') === 0) {
        checkHash();
      } else if (currentPost) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initBlogPage();
      bindModal();
      checkHash();
    });
  } else {
    initBlogPage();
    bindModal();
    checkHash();
  }
})();
