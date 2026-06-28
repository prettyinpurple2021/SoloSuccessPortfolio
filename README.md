# SoloSuccess Solutions

Static marketing site and product portfolio for SoloSuccess Solutions.

## Tech stack

- Plain HTML, CSS, and vanilla JavaScript
- Static JSON content for the blog (`/posts.json`)
- Node.js generator for the product detail pages (`/build_pages.js`)

## Repository structure

- `/index.html` — homepage and product overview
- `/founder.html` — founder story page
- `/blog.html` — public blog feed
- `/admin.html` — local content studio for editing blog posts and exporting `posts.json`
- `/404.html` — branded not found page
- `/pages/*.html` — generated product detail pages
- `/assets/` — images and social assets
- `/blog.js` — blog feed, filters, search, modal, and inline product post rendering
- `/admin.js` — file-based blog content workflow for draft editing/export
- `/build_pages.js` — product page generator
- `/site.config.js` — shared site metadata and product content for generated pages
- `/scripts/check-site.js` — content and generation validation
- `/scripts/check-links.js` — local asset/link validation

## Local workflow

### Preview the site

```bash
npm run preview
```

This serves the repository root at `http://localhost:4173`.

### Regenerate product pages

```bash
npm run generate:pages
```

Generated files are written to `/home/runner/work/SoloSuccessPortfolio/SoloSuccessPortfolio/pages`.

### Validate the site

```bash
npm test
```

This runs:

1. product page generation
2. structural/content validation
3. local link checking

## Blog publishing workflow

The blog is static. Public pages read from `/posts.json` only.

Use `/admin.html` as a local editing tool:

1. Load the page locally.
2. Optionally import an existing `posts.json` file.
3. Add or remove draft posts in the browser.
4. Export the updated `posts.json` file.
5. Replace `/posts.json` in the repository.
6. Commit the updated file and deploy.

This intentionally avoids the old localStorage + passphrase flow, which looked private but was not a secure publishing system.

## SEO/base URL note

Canonical URLs and generated metadata use the base URL defined in `/site.config.js`.
If deployment moves to a custom domain, update `siteMeta.baseUrl` and regenerate the product pages.
