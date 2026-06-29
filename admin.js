(function () {
  'use strict';

  var TYPE_COLORS = {
    'build-update': '#00cfff',
    'product-announcement': '#ff9a00',
    'lessons-learned': '#c87af9',
    'founder-thoughts': '#ff4ec8'
  };

  var PRODUCT_PAPERS = {
    'general': '#fffde7',
    'academy': '#e3f2fd',
    'content-factory': '#fff3e0',
    'soloscribe': '#f3e5f5',
    'solodesign': '#fffde7',
    'soloscout': '#e8f5e9',
    'soloconnect': '#fce4ec',
    'solosuccess-ai': '#ede7f6'
  };

  var TYPE_LABELS = {
    'build-update': 'Build Update',
    'product-announcement': 'Product Launch',
    'lessons-learned': 'Lessons Learned',
    'founder-thoughts': 'Founder Thoughts'
  };

  var postsState = [];
  var sourceLabel = 'Repository posts.json';

  function byId(id) {
    return document.getElementById(id);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(message) {
    var t = byId('admin-toast');
    if (!t) return;
    t.textContent = message;
    t.classList.add('is-visible');
    setTimeout(function () { t.classList.remove('is-visible'); }, 3000);
  }

  function setDefaultDate() {
    byId('f-date').value = new Date().toISOString().split('T')[0];
  }

  function updateSourceBadge() {
    var badge = byId('source-badge');
    if (badge) badge.textContent = sourceLabel;
  }

  function updatePreview() {
    var type = byId('f-type').value;
    var badge = byId('preview-badge');
    var color = TYPE_COLORS[type] || '#888';
    badge.textContent = (TYPE_LABELS[type] || type).toUpperCase();
    badge.style.color = color;
    badge.style.borderColor = color;
  }

  function sortPosts(posts) {
    return posts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function renderPosts() {
    var listEl = byId('admin-post-list');
    var badge = byId('post-count-badge');
    var posts = sortPosts(postsState);

    badge.textContent = posts.length + ' post' + (posts.length !== 1 ? 's' : '');

    if (!posts.length) {
      listEl.innerHTML = '<div style="padding:var(--sp6) var(--sp5);font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.08em;">No posts loaded yet. Import a posts.json file or create your first post.</div>';
      return;
    }

    listEl.innerHTML = posts.map(function (post) {
      var color = TYPE_COLORS[post.type] || '#888';
      var label = TYPE_LABELS[post.type] || post.type;
      return '<div class="admin-post-row">' +
        '<div class="admin-post-row__dot" style="background:' + color + '"></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div class="admin-post-row__title">' + esc(post.title) + '</div>' +
          '<div class="admin-post-row__meta">' + label + ' · ' + esc(post.date) + (post.product !== 'general' ? ' · ' + esc(post.product) : '') + '</div>' +
        '</div>' +
        '<button class="admin-post-row__delete" data-delete-id="' + esc(post.id) + '" title="Delete post" aria-label="Delete: ' + esc(post.title) + '">✕</button>' +
      '</div>';
    }).join('');

    listEl.querySelectorAll('[data-delete-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        deletePost(button.getAttribute('data-delete-id'));
      });
    });
  }

  function hydrateFromPosts(posts, nextLabel) {
    postsState = Array.isArray(posts) ? sortPosts(posts) : [];
    sourceLabel = nextLabel;
    updateSourceBadge();
    renderPosts();
  }

  function loadRepositoryPosts() {
    return fetch('./posts.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load posts.json');
        return response.json();
      })
      .then(function (posts) {
        hydrateFromPosts(posts, 'Repository posts.json');
      });
  }

  function handleImport(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var posts = JSON.parse(reader.result);
        if (!Array.isArray(posts)) throw new Error('posts.json must contain an array');
        hydrateFromPosts(posts, 'Imported file: ' + file.name);
        showToast('Imported ' + file.name);
      } catch (error) {
        showToast('Import failed. Check your JSON file.');
      }
    };
    reader.readAsText(file);
  }

  function buildPostFromForm() {
    var title = byId('f-title').value.trim();
    var excerpt = byId('f-excerpt').value.trim();
    var body = byId('f-body').value.trim();
    var date = byId('f-date').value;
    var type = byId('f-type').value;
    var product = byId('f-product').value;
    var featured = byId('f-featured').value === 'true';
    var tags = byId('f-tags').value.split(',').map(function (tag) { return tag.trim(); }).filter(Boolean);

    if (!title || !excerpt || !body || !date) {
      throw new Error('Please fill in all required fields.');
    }

    return {
      id: Date.now().toString(),
      title: title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      type: type,
      product: product,
      date: date,
      excerpt: excerpt,
      body: body,
      tags: tags,
      color: TYPE_COLORS[type] || '#888',
      paperColor: PRODUCT_PAPERS[product] || '#fffde7',
      featured: featured
    };
  }

  function exportJSON() {
    var blob = new Blob([JSON.stringify(sortPosts(postsState), null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('posts.json exported ↓');
  }

  function deletePost(id) {
    if (!window.confirm('Delete this post from the in-memory draft?')) return;
    postsState = postsState.filter(function (post) { return post.id !== id; });
    renderPosts();
    showToast('Post deleted.');
  }

  function setupForm() {
    var form = byId('post-form');
    var error = byId('form-error');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.style.display = 'none';
      try {
        postsState.unshift(buildPostFromForm());
        form.reset();
        setDefaultDate();
        updatePreview();
        renderPosts();
        showToast('Draft post added. Export posts.json to save it.');
      } catch (err) {
        error.textContent = err.message;
        error.style.display = 'block';
      }
    });
  }

  function bindUi() {
    byId('f-type').addEventListener('change', updatePreview);
    byId('import-file').addEventListener('change', function (event) {
      handleImport(event.target.files[0]);
      event.target.value = '';
    });
    byId('export-btn').addEventListener('click', exportJSON);
    byId('reload-btn').addEventListener('click', function () {
      loadRepositoryPosts().then(function () {
        showToast('Reloaded repository posts.json');
      }).catch(function () {
        showToast('Could not reload repository posts.json');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setDefaultDate();
    updatePreview();
    setupForm();
    bindUi();
    loadRepositoryPosts().catch(function () {
      hydrateFromPosts([], 'No posts loaded');
      showToast('Could not load posts.json');
    });
  });
})();
