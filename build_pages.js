/* ============================================================
   Product page generator — run with node build_pages.js
   Source of truth: ./site.config.js
   Writes all 7 product pages into /pages/
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { siteMeta, products: PRODUCTS } = require('./site.config');

const OUT = path.join(__dirname, 'pages');
fs.mkdirSync(OUT, { recursive: true });

function absoluteUrl(relativePath) {
  return `${siteMeta.baseUrl}/${relativePath}`;
}

function switcher(activeId) {
  const items = PRODUCTS.map((p) => `
    <a href="./${p.id}.html" class="switcher__item${p.id === activeId ? ' switcher__item--active' : ''} switcher__item--${p.status}" aria-label="${p.name} ${p.nameAccent}${p.id === activeId ? ' (current)' : ''}">
      <span class="switcher__num">${p.num}</span>
      <span class="switcher__name">${p.shortName}</span>
      <span class="switcher__dot" title="${p.status === 'live' ? 'Live' : 'Coming Soon'}"></span>
    </a>`).join('');
  return `<nav class="switcher" aria-label="Product switcher"><div class="switcher__track">${items}</div></nav>`;
}

function prevNext(idx) {
  const prev = PRODUCTS[idx - 1];
  const next = PRODUCTS[idx + 1];
  return `
  <nav class="prod-footer-nav" aria-label="Product navigation">
    <div class="container">
      <div class="prod-footer-nav__inner">
        ${prev ? `<a href="./${prev.id}.html" class="prod-nav-arrow" aria-label="Previous: ${prev.name} ${prev.nameAccent}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          ${prev.num} — ${prev.name} ${prev.nameAccent}
        </a>` : '<span></span>'}
        <a href="../index.html" class="prod-nav-arrow prod-nav-arrow--home">← Back to Portfolio</a>
        ${next ? `<a href="./${next.id}.html" class="prod-nav-arrow" aria-label="Next: ${next.name} ${next.nameAccent}">
          ${next.num} — ${next.name} ${next.nameAccent}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>` : '<span></span>'}
      </div>
    </div>
  </nav>`;
}

function pricingSection(p) {
  if (!p.pricing) {
    return `
  <section class="pricing" id="pricing" aria-labelledby="pricing-title">
    <div class="container">
      <p class="section__label">Pricing</p>
      <h2 class="section__title" id="pricing-title">Get Early Access.</h2>
      <div style="max-width:600px; margin-top: clamp(var(--sp10),5vw,var(--sp16));">
        <div class="waitlist-card">
          <h3 class="waitlist-card__title">${p.waitlistTitle}</h3>
          <p class="waitlist-card__desc">${p.waitlistDesc}</p>
          <form class="waitlist-form" onsubmit="handleWaitlist(event)" novalidate>
            <input type="email" class="waitlist-input" placeholder="your@email.com" aria-label="Email address" required />
            <button type="submit" class="btn-holo" style="font-size:var(--text-sm);padding:10px 24px;">Join Waitlist</button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
  }

  const cards = p.pricing.map((tier) => `
    <div class="price-card${tier.featured ? ' price-card--featured' : ''}">
      ${tier.badge ? `<span class="price-card__badge">${tier.badge}</span>` : ''}
      <div class="price-card__tier">${tier.tier}</div>
      <div class="price-card__price"><sup>$</sup>${tier.price.replace('$', '')}${tier.priceSub ? `<sub>${tier.priceSub}</sub>` : ''}</div>
      <div class="price-card__note">${tier.note}</div>
      <div class="price-card__divider"></div>
      <ul class="price-card__features">${tier.features.map((feature) => `<li class="price-card__feature">${feature}</li>`).join('')}</ul>
      <a href="#" class="btn-holo" style="width:100%;justify-content:center;font-size:var(--text-sm);" target="_blank" rel="noopener noreferrer">Get Started →</a>
    </div>`).join('');

  return `
  <section class="pricing" id="pricing" aria-labelledby="pricing-title">
    <div class="container">
      <p class="section__label">Pricing</p>
      <h2 class="section__title" id="pricing-title">Simple, Honest Pricing.</h2>
      <p class="section__desc">Start free. Upgrade when you need more power.</p>
      <div class="pricing__inner">${cards}</div>
    </div>
  </section>`;
}

function launchSection(p) {
  const copy = p.status === 'live'
    ? ['Live today', 'Available now as part of the SoloSuccess ecosystem.']
    : ['Coming soon', 'Actively on the roadmap and designed to connect with the live SoloSuccess products on launch.'];

  return `
  <section class="section" aria-labelledby="launch-title">
    <div class="container">
      <p class="section__label">Launch Snapshot</p>
      <h2 class="section__title" id="launch-title">Where this product fits.</h2>
      <div class="audience-grid" role="list">
        <div class="audience-card" role="listitem">
          <div class="audience-card__num">01</div>
          <h3 class="audience-card__title">Status</h3>
          <p class="audience-card__desc">${copy[0]}</p>
        </div>
        <div class="audience-card" role="listitem">
          <div class="audience-card__num">02</div>
          <h3 class="audience-card__title">Role</h3>
          <p class="audience-card__desc">${copy[1]}</p>
        </div>
        <div class="audience-card" role="listitem">
          <div class="audience-card__num">03</div>
          <h3 class="audience-card__title">Who It's For</h3>
          <p class="audience-card__desc">${p.whoItsFor}</p>
        </div>
      </div>
    </div>
  </section>`;
}

function inlineBlogSection(p) {
  return `<div id="inline-blog-${p.id}"></div>`;
}

function structuredData(p) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${p.name} ${p.nameAccent}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: p.desc,
    brand: {
      '@type': 'Brand',
      name: siteMeta.brandName,
    },
    creator: {
      '@type': 'Person',
      name: siteMeta.founderName,
    },
    offers: p.pricing && p.pricing.length ? p.pricing.map((tier) => ({
      '@type': 'Offer',
      name: tier.tier,
      price: tier.price.replace('$', ''),
      priceCurrency: 'USD',
    })) : [{
      '@type': 'Offer',
      availability: 'https://schema.org/PreOrder',
      price: '0',
      priceCurrency: 'USD',
    }],
    url: absoluteUrl(`pages/${p.id}.html`),
  }, null, 2);
}

function buildPage(p, idx) {
  const featCards = p.features.map((f) => `
    <div class="feature-card">
      <div class="feature-card__icon" aria-hidden="true">${f.icon}</div>
      <h3 class="feature-card__title">${f.title}</h3>
      <p class="feature-card__desc">${f.desc}</p>
    </div>`).join('');

  const stepCards = p.steps.map((s) => `
    <div class="how__step">
      <p class="how__step-label">${s.label}</p>
      <h3 class="how__step-title">${s.title}</h3>
      <p class="how__step-desc">${s.desc}</p>
    </div>`).join('');

  const productName = `${p.name} ${p.nameAccent}`;
  const productUrl = absoluteUrl(`pages/${p.id}.html`);

  return `<!DOCTYPE html>
<html lang="en" style="--product-color:${p.color};--product-paper:${p.paper};">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${productName} — ${siteMeta.brandName}</title>
  <meta name="description" content="${p.desc.slice(0, 155)}"/>
  <link rel="canonical" href="${productUrl}"/>
  <link rel="icon" type="image/png" href="../assets/favicon.png"/>
  <meta property="og:title" content="${productName} — ${siteMeta.brandName}"/>
  <meta property="og:description" content="${p.desc.slice(0, 155)}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${productUrl}"/>
  <meta property="og:image" content="${absoluteUrl('assets/og-image.png')}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="${siteMeta.socialHandle}"/>
  <meta name="twitter:image" content="${absoluteUrl('assets/og-image.png')}"/>
  <meta name="twitter:title" content="${productName} — ${siteMeta.brandName}"/>
  <meta name="twitter:description" content="${p.desc.slice(0, 155)}"/>
  <link rel="preconnect" href="https://api.fontshare.com"/>
  <link href="${siteMeta.fontshareHref}" rel="stylesheet"/>
  <link rel="stylesheet" href="../base.css"/>
  <link rel="stylesheet" href="../style.css"/>
  <link rel="stylesheet" href="../product.css"/>
  <link rel="stylesheet" href="../blog.css"/>
  <script type="application/ld+json">${structuredData(p)}</script>
</head>
<body>

<a href="#main" class="sr-only">Skip to main content</a>

<div class="ticker" aria-hidden="true">
  <div class="ticker__track">
    ${[...Array(2)].map(() => `
    <span class="ticker__item">${productName}</span>
    <span class="ticker__item">${p.tagline}</span>
    <span class="ticker__item">${siteMeta.brandName}</span>
    <span class="ticker__item">7 Products · 1 Platform</span>`).join('')}
  </div>
</div>

<header role="banner">
  <nav class="nav" aria-label="Main navigation">
    <div class="container">
      <div class="nav__inner">
        <a href="../index.html" class="nav__logo" aria-label="${siteMeta.brandName} home">
          <div class="nav__logo-gem" style="width:38px;height:38px;border:2px solid var(--ink);overflow:hidden;flex-shrink:0;">
            <img src="../assets/logo.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;mix-blend-mode:multiply;"/>
          </div>
          <div>
            <span class="nav__logo-name">${siteMeta.brandName}</span>
            <span class="nav__logo-sub">${p.num} / 07 — ${productName}</span>
          </div>
        </a>
        <div style="display:flex;align-items:center;gap:var(--sp4);flex-wrap:wrap;">
          <a href="../founder.html" class="btn-outline" style="font-size:var(--text-sm);padding:8px 16px;">Meet ${siteMeta.founderName} →</a>
          <a href="../index.html" class="btn-outline" style="font-size:var(--text-sm);padding:8px 16px;">← All Products</a>
          <a href="#pricing" class="btn-holo" style="font-size:var(--text-sm);padding:8px 16px;">${p.status === 'live' ? 'Get Started' : 'Join Waitlist'}</a>
        </div>
      </div>
    </div>
  </nav>
</header>

${switcher(p.id)}

<main id="main">
  <section class="prod-hero" aria-label="${productName} hero">
    <div class="prod-hero__stripe" aria-hidden="true"></div>
    <div class="prod-hero__tape prod-hero__tape--1" aria-hidden="true"></div>
    <div class="prod-hero__tape prod-hero__tape--2" aria-hidden="true"></div>
    <div class="prod-hero__content container">
      <div class="prod-num">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style="color:var(--product-color)"><polygon points="6,0 8,4 12,4 9,7 10,11 6,9 2,11 3,7 0,4 4,4"/></svg>
        Product ${p.num} of 07
      </div>
      <div class="prod-status prod-status--${p.status}" role="status">
        <span class="prod-status__dot" aria-hidden="true"></span>
        ${p.status === 'live' ? 'Live Now' : 'Coming Soon'}
      </div>
      <h1 class="prod-name">${p.name}<span class="accent">${p.nameAccent}</span></h1>
      <p class="prod-tagline">${p.tagline}</p>
      <p class="prod-desc">${p.desc}</p>
      <div class="prod-hero__actions">
        <a href="#pricing" class="btn-holo" style="font-size:var(--text-base);padding:12px 32px;">
          ${p.status === 'live' ? 'Get Started →' : 'Join the Waitlist →'}
        </a>
        <a href="#features" class="btn-outline" style="font-size:var(--text-base);padding:12px 32px;">See Features</a>
      </div>
    </div>
  </section>

  ${launchSection(p)}

  <section class="how" id="how-it-works" aria-labelledby="how-title">
    <div class="container">
      <p class="section__label">How It Works</p>
      <h2 class="section__title" id="how-title">From zero to running<br/>in minutes.</h2>
      <div class="how__steps" role="list">
        ${stepCards}
      </div>
    </div>
  </section>

  <section class="features" id="features" aria-labelledby="features-title">
    <div class="container">
      <p class="section__label">Features</p>
      <h2 class="section__title" id="features-title">Everything you need.<br/>Nothing you don't.</h2>
      <p class="section__desc">Built by a solo founder who knows exactly what wastes your time and what doesn't.</p>
      <div class="features__grid" role="list">
        ${featCards}
      </div>
    </div>
  </section>

  ${pricingSection(p)}
</main>

${inlineBlogSection(p)}
${prevNext(idx)}

<script>
function handleWaitlist(e) {
  e.preventDefault();
  var form = e.target;
  var email = form.querySelector('input[type=email]').value;
  if (!email) return;
  var btn = form.querySelector('button');
  btn.textContent = '✓ You\'re on the list!';
  btn.disabled = true;
  btn.style.background = '#27c93f';
  form.querySelector('input').disabled = true;
}
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(this.getAttribute('href'));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
</script>
<script src="../blog.js"></script>
<script>BlogEngine.renderInline('inline-blog-${p.id}','${p.id}');</script>
</body>
</html>`;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function buildRssFeed() {
  const postsFile = path.join(__dirname, 'posts.json');
  if (!fs.existsSync(postsFile)) {
    console.error('posts.json not found, skipping RSS generation');
    return;
  }
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const xmlItems = posts.map(post => {
    const titleEscaped = escapeXml(post.title);
    const link = `${siteMeta.baseUrl}/blog.html#post-${post.id}`;
    const pubDate = new Date(post.date).toUTCString();
    return `    <item>
      <title>${titleEscaped}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;
  }).join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${siteMeta.brandName} Blog</title>
  <link>${siteMeta.baseUrl}/blog.html</link>
  <description>Building in public: Updates and insights from SoloSuccess Solutions.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteMeta.baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${xmlItems}
</channel>
</rss>`;

  fs.writeFileSync(path.join(__dirname, 'feed.xml'), rssFeed, 'utf8');
  console.log('✓ feed.xml generated');
}

PRODUCTS.forEach((p, i) => {
  const html = buildPage(p, i);
  const file = path.join(OUT, `${p.id}.html`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`✓ pages/${p.id}.html`);
});

buildRssFeed();

console.log(`\nDone — ${PRODUCTS.length} pages written to /pages/`);
