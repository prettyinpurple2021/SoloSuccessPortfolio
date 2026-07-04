# SoloSuccess Solutions — Site Improvement Tracker
**Live document. Updated as work is completed or new issues are found.**
Last updated: June 21, 2026

---

## 🔴 High Priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Replace insecure admin publishing flow | ✅ Done | Removed passphrase/localStorage flow; admin now edits an in-memory draft and exports posts.json |
| 2 | Real social / contact links (X, email) | ✅ Done | X → https://x.com/solosuccessai · Email → founder@solosuccesss.com |
| 3 | Replace placeholder blog posts with real content | ⏳ Needs Fran | 7 sample posts exist; Fran to write real ones or approve edits |
| 4 | "Get Started" pricing buttons → real links | ⏳ Needs Fran | Need actual signup/Stripe/waitlist URLs for each live product |
| 5 | Real app links on each product page | ⏳ Needs Fran | Need live URLs for all 7 apps |

---

## 🟡 Medium Priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6 | Replace SVG avatar with real photo of Fran | ✅ Done | Photo uploaded and placed in founder page |
| 7 | Fix product switcher bar — truncated names | ✅ Done | Short names: AI, Academy, Content, Scribe, Design, Scout, Connect |
| 8 | Fix timeline dates — products launched in correct order | ✅ Done | AI Dec 2025 → Academy Feb 2026 → Parent co Mar 2026 → Content/Scribe/Design → Scout May 2026 |
| 9 | Fix story / about copy — "born after first app" | ✅ Done | Updated to reflect correct founding story |
| 10 | Add social proof / waitlist counters | ⏳ Todo | Placeholder sections for testimonials or signups |
| 11 | Homepage CTA → meaningful destination | ✅ Done | Points to #ecosystem (acceptable for now; update when signup exists) |

---

## 🟢 Lower Priority / Polish

| # | Task | Status | Notes |
|---|------|--------|-------|
| 12 | Build branded 404.html page | ✅ Done | Y2K styled, links back to home |
| 13 | Fix favicon — data-URI SVG doesn't work in Safari | ✅ Done | PNG favicon generated and linked |
| 14 | Add og:image meta tag to all pages | ✅ Done | 1200×630 social preview image generated |
| 15 | Blog admin persistence — localStorage only | ✅ Done | Replaced with file-based posts.json import/export workflow |
| 16 | SoloConnect product page — listed as product but no launch date yet | ⏳ Needs Fran | Confirm if SoloConnect is planned / when |

---

## 🆕 Additional Suggestions Found During Audit

| # | Task | Status | Notes |
|---|------|--------|-------|
| 17 | Add a "roadmap" or "what's next" section to the home page | ✅ Done | Added timeline showing Q3 2026 - Q2 2027 milestone cards |
| 18 | Blog RSS feed | ✅ Done | Static RSS feed XML generated on build at feed.xml |
| 19 | Keyboard accessibility audit — focus states on all interactive elements | ✅ Done | Audited and added gorgeous high-visibility magenta outline style |
| 20 | Performance — font preload optimization | ✅ Done | Added crossorigin tag to Fontshare preconnect links across all pages |
| 21 | Add "Share on X" button to blog post modal | ✅ Done | Installed button template and click routing logic |
| 22 | Add print / copy link button to blog posts | ✅ Done | Added Copy link button in blog modal with success state |
| 23 | Product page — "Who it's for" section | ✅ Done | Customized snapshot column for each product |
| 24 | Vercel analytics | ⏳ Todo | Enable Vercel Analytics to track page views and user behaviour |

---

## ⏳ Waiting on Fran

| What I need | Why |
|-------------|-----|
| Live URLs for all 7 apps | To link "Get Started" / "Launch App" buttons on each product page |
| Pricing info per product | To replace placeholder $0/$29/$79 tiers with real pricing |
| New passphrase for admin | Security — default is currently visible in the code |
| Real blog posts (or approval of existing ones) | Sample posts are placeholders |
| Confirmation on SoloConnect status | Is it planned? Coming soon? No date yet? |

---

## ✅ Completed This Session

- Founder photo added (real headshot)
- Social links wired (X + email)
- Switcher bar names fixed
- Timeline dates corrected (Dec 2025 → Feb 2026 → Mar 2026 → May 2026)
- Founding story copy updated
- 404 page built
- Favicon fixed
- og:image added
- Homepage detailed roadmap section added
- Product page "Who It's For" custom details templated
- Static blog RSS feed built and integrated
