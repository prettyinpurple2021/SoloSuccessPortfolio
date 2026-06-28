const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlFiles = [];
const failures = [];

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') return;
      walk(fullPath);
      return;
    }
    if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  });
}

function normalizeTarget(fromFile, target) {
  const clean = target.split('?')[0];
  const hashIndex = clean.indexOf('#');
  const filePart = hashIndex >= 0 ? clean.slice(0, hashIndex) : clean;
  const hash = hashIndex >= 0 ? clean.slice(hashIndex + 1) : '';
  const resolved = filePart ? path.resolve(path.dirname(fromFile), filePart) : fromFile;
  return { resolved, hash };
}

function fileHasId(filePath, id) {
  const html = fs.readFileSync(filePath, 'utf8');
  return new RegExp(`id=["']${id}["']`).test(html);
}

walk(root);

htmlFiles.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relFile = path.relative(root, filePath) || path.basename(filePath);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  refs.forEach((target) => {
    if (!target || /^(https?:|mailto:|tel:|data:|javascript:)/.test(target)) return;
    const { resolved, hash } = normalizeTarget(filePath, target);
    if (!fs.existsSync(resolved)) {
      failures.push(`${relFile} -> missing target ${target}`);
      return;
    }
    if (hash && path.extname(resolved) === '.html' && !fileHasId(resolved, hash)) {
      failures.push(`${relFile} -> missing anchor ${target}`);
    }
  });
});

if (failures.length) {
  console.error('Link validation failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Link validation passed for ${htmlFiles.length} HTML files.`);
