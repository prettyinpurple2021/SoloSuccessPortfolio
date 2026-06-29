const fs = require('fs');
const path = require('path');
const { siteMeta, products } = require('../site.config');

const root = path.join(__dirname, '..');
const failures = [];

function requireFile(relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) failures.push(`Missing file: ${relPath}`);
  return abs;
}

siteMeta.rootPages.forEach(requireFile);
products.forEach((product) => requireFile(path.join('pages', `${product.id}.html`)));

try {
  const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
  if (!Array.isArray(posts)) failures.push('posts.json must be an array.');
  const ids = new Set();
  const slugs = new Set();
  posts.forEach((post) => {
    if (!post.id) failures.push('Every post needs an id.');
    if (!post.slug) failures.push(`Post ${post.id || '(missing id)'} is missing a slug.`);
    if (ids.has(post.id)) failures.push(`Duplicate post id: ${post.id}`);
    if (slugs.has(post.slug)) failures.push(`Duplicate post slug: ${post.slug}`);
    ids.add(post.id);
    slugs.add(post.slug);
  });
} catch (error) {
  failures.push(`posts.json is invalid JSON: ${error.message}`);
}

products.forEach((product) => {
  const html = fs.readFileSync(path.join(root, 'pages', `${product.id}.html`), 'utf8');
  if (!html.includes('application/ld+json')) failures.push(`pages/${product.id}.html is missing structured data.`);
  if (!html.includes('<link rel="canonical"')) failures.push(`pages/${product.id}.html is missing a canonical URL.`);
  if (!html.includes(`inline-blog-${product.id}`)) failures.push(`pages/${product.id}.html is missing the inline blog mount.`);
});

if (failures.length) {
  console.error('Site validation failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site validation passed for ${products.length} product pages and ${siteMeta.rootPages.length} root pages.`);
