/* ============================================================
   Page generator — run with node build_pages.js
   Writes all 7 product pages into /pages/
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pages');
fs.mkdirSync(OUT, { recursive: true });

/* ── Shared data ─────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'solosuccess-ai',
    num: '01',
    name: 'SoloSuccess',
    nameAccent: 'AI',
    tagline: 'Your AI co-founder, always on.',
    desc: 'The intelligence layer powering the entire SoloSuccess ecosystem. Strategy generation, task automation, and real-time decision support — available 24/7, fully aligned with your goals, never needing a salary.',
    color: '#7c4dff',
    paper: '#ede7f6',
    status: 'soon',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg>`,
    features: [
      { title: 'Strategy Engine', desc: 'Generate go-to-market strategies, product roadmaps, and growth plans tailored to your specific stage and context.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20M6 20V10l6-6 6 6v10"/></svg>` },
      { title: 'Task Automation', desc: 'Delegate recurring tasks to AI agents that execute autonomously — from email drafting to research to data processing.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
      { title: 'Decision Support', desc: 'Get AI-backed analysis on key decisions: pricing, positioning, hiring, partnerships — with full reasoning shown.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>` },
      { title: 'Ecosystem Sync', desc: 'SoloSuccess AI is the connective tissue between all 7 products — context flows between them so nothing starts from scratch.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>` },
      { title: 'Context Memory', desc: 'Remembers your business context, preferences, and history so every interaction builds on the last.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
      { title: '24/7 Availability', desc: 'No downtime, no PTO, no scheduling. Your AI co-founder is always ready when you need it.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>` },
    ],
    steps: [
      { label: 'Tell it your context', title: 'Onboard once', desc: 'Describe your business, stage, goals, and constraints. SoloSuccess AI builds a persistent model of your company that improves over time.' },
      { label: 'Ask anything', title: 'Query or delegate', desc: 'Ask strategic questions, request analysis, or delegate tasks entirely. The AI works in the background and reports back.' },
      { label: 'Review + refine', title: 'Iterate fast', desc: 'Review outputs, push back, refine the context. Every session makes the AI more useful for your specific situation.' },
      { label: 'Ship', title: 'Execute with confidence', desc: 'Move faster and with more certainty than founders who are guessing alone.' },
    ],
    pricing: null, // coming soon
    waitlistTitle: 'Be first when we launch.',
    waitlistDesc: 'SoloSuccess AI is in private development. Join the waitlist to get early access and founding-member pricing.',
  },

  {
    id: 'academy',
    num: '02',
    name: 'SoloSuccess',
    nameAccent: 'Academy',
    tagline: 'Learn. Build. Ship.',
    desc: 'AI-personalized courses and playbooks built for solo founders. Every lesson is filtered through your actual business context — no generic advice, no filler, just tactics that work when you\'re building alone.',
    color: '#00cfff',
    paper: '#e3f2fd',
    status: 'live',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    features: [
      { title: 'Adaptive Curriculum', desc: 'The course path adjusts based on your business stage, industry, and goals. No wasted time on topics you\'ve already mastered.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
      { title: 'Founder Playbooks', desc: 'Condensed, battle-tested frameworks for launching, growing, and sustaining a solo-operated business.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>` },
      { title: 'Live Workshops', desc: 'Weekly sessions with practitioners who\'ve built solo — not theory professors. Real war stories, real tactics.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
      { title: 'AI Study Partner', desc: 'Ask questions mid-lesson, get personalized explanations, and apply concepts directly to your own business in real time.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
      { title: 'Progress Tracking', desc: 'Visual dashboards showing where you are in your learning journey, what you\'ve completed, and what\'s next.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
      { title: 'Certification', desc: 'Earn a verified Solo Founder certification to display on your profile and prove your systematic approach to building.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>` },
    ],
    steps: [
      { label: 'Profile your business', title: 'Tell us where you are', desc: 'Answer 5 questions about your stage, goals, and gaps. Academy builds a personalised learning path in under 60 seconds.' },
      { label: 'Start your first module', title: 'Learn in sprints', desc: 'Modules are 15–20 minutes each. Consume them when you have time — even between client calls or during lunch.' },
      { label: 'Apply to your business', title: 'Build while you learn', desc: 'Every lesson ends with a direct action you can take in your business today, not someday.' },
      { label: 'Track progress', title: 'See yourself grow', desc: 'Watch your skills map fill out as you complete modules. Your certification unlocks when you\'ve hit every milestone.' },
    ],
    pricing: [
      { tier: 'Free', price: '$0', note: 'Forever free · No credit card', badge: null, featured: false, features: ['5 core modules', 'Founder playbook library', 'Community access', 'Basic AI study partner'] },
      { tier: 'Builder', price: '$29', priceSub: '/mo', note: 'Billed monthly · Cancel anytime', badge: 'Most Popular', featured: true, features: ['Full course library (50+ modules)', 'Weekly live workshops', 'Advanced AI study partner', 'Progress tracking + certification', 'Priority community access'] },
      { tier: 'Pro', price: '$79', priceSub: '/mo', note: 'Billed monthly · Cancel anytime', badge: null, featured: false, features: ['Everything in Builder', '1-on-1 mentor sessions', 'Private founder cohort', 'Early access to new modules', 'White-glove onboarding'] },
    ],
  },

  {
    id: 'content-factory',
    num: '03',
    name: 'Content',
    nameAccent: 'Factory',
    tagline: 'One input. Infinite output.',
    desc: 'Transform a single idea, article, or video into a full multi-platform content library. Posts, threads, newsletters, scripts — generated, optimised for each platform, and ready to publish.',
    color: '#ff9a00',
    paper: '#fff3e0',
    status: 'live',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    features: [
      { title: 'One-Click Expansion', desc: 'Drop in a URL, paste text, or upload a doc. Content Factory builds a full content calendar around it instantly.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>` },
      { title: 'Platform Optimiser', desc: 'Each piece is rewritten for the specific platform — Twitter threads, LinkedIn posts, newsletters, TikTok scripts — each optimised for native engagement.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
      { title: 'Brand Voice Lock', desc: 'Upload 3 examples of your best content and Content Factory learns your tone, style, and vocabulary. Every output sounds like you.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>` },
      { title: 'Repurposing Engine', desc: 'Turn old content into new. Point it at last year\'s blog posts and get a fresh batch of social content without writing a word.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.8"/></svg>` },
      { title: 'Schedule & Publish', desc: 'Connect your social accounts and schedule directly from Content Factory. One workflow from idea to published.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
      { title: 'Analytics Loop', desc: 'Track which content performs best and feed that back into future generation — the engine gets smarter the more you use it.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
    ],
    steps: [
      { label: 'Input your source', title: 'Drop anything in', desc: 'A URL, a PDF, raw text, a YouTube link, or a voice memo. Content Factory reads and understands it.' },
      { label: 'Choose your platforms', title: 'Pick your channels', desc: 'Select which platforms you want content for. Mix and match: Twitter, LinkedIn, newsletter, blog, YouTube description.' },
      { label: 'Review + edit', title: 'Refine in seconds', desc: 'Every output is editable inline. Tweak the tone, change a sentence, swap the hook — then approve.' },
      { label: 'Publish or schedule', title: 'Ship immediately', desc: 'Post directly or schedule to your connected accounts. Your entire content calendar can be set for the week in under 15 minutes.' },
    ],
    pricing: [
      { tier: 'Starter', price: '$19', priceSub: '/mo', note: 'Billed monthly', badge: null, featured: false, features: ['30 content pieces/month', '5 platform types', 'Brand voice training (1 profile)', 'Basic scheduling'] },
      { tier: 'Growth', price: '$49', priceSub: '/mo', note: 'Billed monthly', badge: 'Best Value', featured: true, features: ['Unlimited content pieces', 'All platform types', '3 brand voice profiles', 'Repurposing engine', 'Direct scheduling + publishing', 'Analytics dashboard'] },
      { tier: 'Agency', price: '$129', priceSub: '/mo', note: 'Billed monthly', badge: null, featured: false, features: ['Everything in Growth', '10 brand voice profiles', 'Team collaboration', 'White-label exports', 'API access', 'Priority support'] },
    ],
  },

  {
    id: 'soloscribe',
    num: '04',
    name: 'Solo',
    nameAccent: 'Scribe',
    tagline: 'Write like a team. Publish like a founder.',
    desc: 'An AI writing assistant built for long-form creation. Proposals, blog posts, newsletters, and documentation — SoloScribe matches your voice, maintains consistency, and never loses context between sessions.',
    color: '#c87af9',
    paper: '#f3e5f5',
    status: 'live',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    features: [
      { title: 'Voice Matching', desc: 'Upload writing samples and SoloScribe learns exactly how you write — your rhythm, vocabulary, and personality carry through every output.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>` },
      { title: 'Long-Form AI', desc: 'Write blog posts, white papers, and guides that need depth and structure — not just bullet points. SoloScribe holds the whole document in context.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
      { title: 'Template Library', desc: '50+ templates for every document type a solo founder needs: proposals, SOPs, case studies, pitch decks, and more.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
      { title: 'Persistent Context', desc: 'SoloScribe remembers everything across sessions — your business context, past documents, client names — so you never have to re-explain yourself.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
      { title: 'SEO Optimiser', desc: 'Built-in keyword analysis and SEO scoring so every blog post you publish has a fighting chance to rank.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>` },
      { title: 'Export Anywhere', desc: 'Export to Google Docs, Notion, Word, or plain markdown. Your documents live wherever your workflow lives.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>` },
    ],
    steps: [
      { label: 'Set your voice', title: 'Train once', desc: 'Upload 3–5 pieces of your existing writing. SoloScribe builds a voice profile that persists across every document.' },
      { label: 'Pick a template or start fresh', title: 'Choose your format', desc: 'Select from the library or give SoloScribe a brief. It drafts a full outline before writing a single paragraph.' },
      { label: 'Write with AI', title: 'Collaborate in real time', desc: 'Accept, reject, or modify suggestions inline. Expand sections, rewrite paragraphs, or let SoloScribe take a full first pass.' },
      { label: 'Export and publish', title: 'Ship in your format', desc: 'Export wherever you need it. Formatted, proofed, and ready to go.' },
    ],
    pricing: [
      { tier: 'Solo', price: '$15', priceSub: '/mo', note: 'Billed monthly', badge: null, featured: false, features: ['30 documents/month', '1 voice profile', 'Template library', 'Basic export (Markdown, Word)'] },
      { tier: 'Studio', price: '$39', priceSub: '/mo', note: 'Billed monthly', badge: 'Most Popular', featured: true, features: ['Unlimited documents', '3 voice profiles', 'Full template library', 'SEO optimiser', 'Persistent context memory', 'All export formats'] },
      { tier: 'Agency', price: '$99', priceSub: '/mo', note: 'Billed monthly', badge: null, featured: false, features: ['Everything in Studio', '10 voice profiles', 'Team workspace', 'Client document portals', 'API access', 'Priority support'] },
    ],
  },

  {
    id: 'solodesign',
    num: '05',
    name: 'Solo',
    nameAccent: 'Design',
    tagline: 'Ship beautiful. No designer needed.',
    desc: 'Describe what you need and SoloDesign delivers polished, brand-consistent visual assets. Brand kits, social graphics, pitch decks, and more — generated at the quality level of a professional designer, in minutes.',
    color: '#ffe800',
    paper: '#fffde7',
    status: 'live',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    features: [
      { title: 'Brand Kit Generator', desc: 'Upload your logo and SoloDesign extracts a full brand kit — colours, fonts, spacing rules — that every asset respects automatically.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 5 5a10 10 0 0 0 0 14 10 10 0 0 0 14.07-1"/></svg>` },
      { title: 'Social Asset Engine', desc: 'Generate on-brand graphics for every platform — Instagram, LinkedIn, Twitter, YouTube — sized and formatted correctly, every time.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
      { title: 'Pitch Deck Builder', desc: 'Turn a bullet-point outline into a designed, investor-ready pitch deck with consistent visual hierarchy and your brand throughout.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
      { title: 'AI Art Direction', desc: 'Describe a mood, a concept, or a feeling — SoloDesign translates your brief into a visual direction and executes it across all asset types.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>` },
      { title: 'Template Marketplace', desc: '500+ professional templates across every use case. Customise in seconds, or start fully from scratch with AI guidance.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
      { title: 'One-Click Resize', desc: 'Design once, export in every size. LinkedIn banner, Twitter header, email header, Instagram story — all from one original.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>` },
    ],
    steps: [
      { label: 'Set your brand', title: 'Upload your identity', desc: 'Drop in your logo. SoloDesign extracts your brand palette, fonts, and style in 30 seconds.' },
      { label: 'Describe what you need', title: 'Brief it naturally', desc: '"Make a LinkedIn banner for my coaching business that feels premium and modern." That\'s all you need.' },
      { label: 'Review variations', title: 'Pick your favourite', desc: 'SoloDesign generates 3 variations per brief. Pick the closest, then refine it with natural language instructions.' },
      { label: 'Export', title: 'Download in any format', desc: 'PNG, SVG, PDF, or direct export to Canva. Every asset is resolution-independent and print-ready.' },
    ],
    pricing: [
      { tier: 'Free', price: '$0', note: 'Forever free', badge: null, featured: false, features: ['10 assets/month', 'Template library (limited)', '1 brand kit', 'PNG export'] },
      { tier: 'Creator', price: '$35', priceSub: '/mo', note: 'Billed monthly', badge: 'Most Popular', featured: true, features: ['Unlimited assets', 'Full template library (500+)', '5 brand kits', 'All export formats', 'Pitch deck builder', 'One-click resize'] },
      { tier: 'Studio', price: '$89', priceSub: '/mo', note: 'Billed monthly', badge: null, featured: false, features: ['Everything in Creator', 'Unlimited brand kits', 'Team collaboration', 'White-label output', 'Custom template creation', 'Priority rendering'] },
    ],
  },

  {
    id: 'soloscout',
    num: '06',
    name: 'Solo',
    nameAccent: 'Scout',
    tagline: 'Find opportunities before the crowd.',
    desc: 'An AI-powered market intelligence tool for solo founders. SoloScout monitors trends, surfaces leads, tracks competitors, and alerts you to high-signal opportunities — so you always move first.',
    color: '#00e676',
    paper: '#e8f5e9',
    status: 'soon',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    features: [
      { title: 'Trend Monitoring', desc: 'Real-time tracking of signals across Twitter, Reddit, Product Hunt, and industry publications. Know what\'s emerging before it becomes mainstream.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
      { title: 'Lead Discovery', desc: 'Identify potential customers from public signals — job postings, social activity, community posts — and surface them before your competitors do.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="3"/></svg>` },
      { title: 'Competitor Alerts', desc: 'Track your competitors\' moves: new features, pricing changes, job postings, press coverage. Stay a step ahead.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>` },
      { title: 'Opportunity Scoring', desc: 'Not every signal is worth your time. SoloScout scores opportunities by relevance, urgency, and potential value so you focus on what matters.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
      { title: 'Custom Watchlists', desc: 'Set up watchlists for specific keywords, companies, people, or topics. SoloScout monitors them 24/7 and pings you when something significant happens.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>` },
      { title: 'Weekly Intel Reports', desc: 'A curated weekly briefing on your market, competitors, and opportunities — delivered to your inbox every Monday.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
    ],
    steps: [
      { label: 'Define your market', title: 'Tell Scout what to watch', desc: 'Describe your business, your target customer, and your competitors. Scout builds a monitoring profile around your specific situation.' },
      { label: 'Set your alerts', title: 'Configure your watchlist', desc: 'Choose what triggers a notification: new trends, competitor moves, lead signals, or market shifts.' },
      { label: 'Review your feed', title: 'Your personal market Intel', desc: 'Log in to a curated feed of only the signals that matter to you — no noise, no irrelevant content.' },
      { label: 'Act on insights', title: 'Move first', desc: 'Click through to any signal, understand the full context, and take action — before the opportunity closes.' },
    ],
    pricing: null,
    waitlistTitle: 'Get early access.',
    waitlistDesc: 'SoloScout is in private beta. Join the waitlist to be notified when spots open — early members get founding-tier pricing locked in forever.',
  },

  {
    id: 'soloconnect',
    num: '07',
    name: 'Solo',
    nameAccent: 'Connect',
    tagline: 'Your network, amplified by AI.',
    desc: 'A smart community platform for solo founders, freelancers, and indie hackers. SoloConnect surfaces the right people, facilitates meaningful introductions, and helps you build the relationships that actually move your business forward.',
    color: '#ff4ec8',
    paper: '#fce4ec',
    status: 'soon',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857"/><path d="M9 20H4v-2a3 3 0 0 1 5.356-1.857"/><circle cx="12" cy="10" r="3"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
    features: [
      { title: 'Smart Matching', desc: 'AI-powered member matching based on complementary skills, shared goals, and business stage — not just industry tags.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
      { title: 'AI Introductions', desc: 'SoloConnect writes personalised introduction messages on your behalf — so asking for a connection feels natural, not awkward.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M9 20H4v-2a3 3 0 0 1 5.356-1.857M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>` },
      { title: 'Founder Rooms', desc: 'Private, stage-gated discussion rooms for founders at similar points in their journey. Pre-revenue, early traction, scaling — each room has its own focus.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
      { title: 'Accountability Pods', desc: 'Get matched with 3–4 founders at your stage for weekly check-ins, goal tracking, and mutual accountability.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
      { title: 'Skill Exchange', desc: 'Find someone to trade services with — a designer who needs copywriting, a developer who needs marketing strategy. Real value, zero cash.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>` },
      { title: 'Deal Flow', desc: 'Members-only deal sharing for products, tools, and services at founder-friendly pricing. Save thousands a year just by being in the network.', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
    ],
    steps: [
      { label: 'Build your profile', title: 'Tell your story', desc: 'Share where you are in your journey, what you\'re building, and what kinds of connections you\'re looking for.' },
      { label: 'Get matched', title: 'Let AI find your people', desc: 'SoloConnect surfaces 5 new high-quality matches every week based on your profile, goals, and activity.' },
      { label: 'Connect with intent', title: 'No cold outreach awkwardness', desc: 'AI-written introduction messages make reaching out feel natural. Hit send in one click.' },
      { label: 'Build relationships', title: 'Grow your inner circle', desc: 'Join accountability pods, participate in founder rooms, and trade skills. The community does what a team used to do.' },
    ],
    pricing: null,
    waitlistTitle: 'Join the founding community.',
    waitlistDesc: 'SoloConnect launches with a founding cohort of 500 members. Join the waitlist now to secure your spot — founding members get lifetime access at pre-launch pricing.',
  },
];

/* ── Switcher HTML ─────────────────────────────────────────── */
function switcher(activeId) {
  const items = PRODUCTS.map(p => `
    <a href="./${p.id}.html" class="switcher__item${p.id === activeId ? ' switcher__item--active' : ''} switcher__item--${p.status}" aria-label="${p.name} ${p.nameAccent}${p.id === activeId ? ' (current)' : ''}">
      <span class="switcher__num">${p.num}</span>
      <span class="switcher__name">${p.name.replace('Solo','').trim() || p.nameAccent}</span>
      <span class="switcher__dot" title="${p.status === 'live' ? 'Live' : 'Coming Soon'}"></span>
    </a>`).join('');
  return `<nav class="switcher" aria-label="Product switcher"><div class="switcher__track">${items}</div></nav>`;
}

/* ── Prev/Next ─────────────────────────────────────────────── */
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

/* ── Pricing HTML ──────────────────────────────────────────── */
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
  const cards = p.pricing.map(tier => `
    <div class="price-card${tier.featured ? ' price-card--featured' : ''}">
      ${tier.badge ? `<span class="price-card__badge">${tier.badge}</span>` : ''}
      <div class="price-card__tier">${tier.tier}</div>
      <div class="price-card__price"><sup>$</sup>${tier.price.replace('$','')}${tier.priceSub ? `<sub>${tier.priceSub}</sub>` : ''}</div>
      <div class="price-card__note">${tier.note}</div>
      <div class="price-card__divider"></div>
      <ul class="price-card__features">${tier.features.map(f => `<li class="price-card__feature">${f}</li>`).join('')}</ul>
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

/* ── Full page HTML ────────────────────────────────────────── */
function buildPage(p, idx) {
  const featCards = p.features.map(f => `
    <div class="feature-card">
      <div class="feature-card__icon" aria-hidden="true">${f.icon}</div>
      <h3 class="feature-card__title">${f.title}</h3>
      <p class="feature-card__desc">${f.desc}</p>
    </div>`).join('');

  const stepCards = p.steps.map(s => `
    <div class="how__step">
      <p class="how__step-label">${s.label}</p>
      <h3 class="how__step-title">${s.title}</h3>
      <p class="how__step-desc">${s.desc}</p>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en" style="--product-color:${p.color};--product-paper:${p.paper};">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${p.name} ${p.nameAccent} — SoloSuccess Solutions</title>
  <meta name="description" content="${p.desc.slice(0, 155)}"/>
  <link rel="preconnect" href="https://api.fontshare.com"/>
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,700,800,900&f[]=satoshi@400,500,700&f[]=jet-brains-mono@400,700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../base.css"/>
  <link rel="stylesheet" href="../style.css"/>
  <link rel="stylesheet" href="../product.css"/>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='0' fill='${encodeURIComponent(p.color)}'/><text x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial Black' font-size='18' font-weight='900' fill='%23fff'>${p.nameAccent[0]}</text></svg>"/>
</head>
<body>

<a href="#main" class="sr-only">Skip to main content</a>

<!-- TICKER -->
<div class="ticker" aria-hidden="true">
  <div class="ticker__track">
    ${[...Array(2)].map(() => `
    <span class="ticker__item">${p.name} ${p.nameAccent}</span>
    <span class="ticker__item">${p.tagline}</span>
    <span class="ticker__item">SoloSuccess Solutions</span>
    <span class="ticker__item">7 Products · 1 Platform</span>`).join('')}
  </div>
</div>

<!-- NAV -->
<header role="banner">
  <nav class="nav" aria-label="Main navigation">
    <div class="container">
      <div class="nav__inner">
        <a href="../index.html" class="nav__logo" aria-label="SoloSuccess Solutions home">
          <div class="nav__logo-gem" style="width:38px;height:38px;border:2px solid var(--ink);overflow:hidden;flex-shrink:0;">
            <img src="../assets/logo.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;mix-blend-mode:multiply;"/>
          </div>
          <div>
            <span class="nav__logo-name">SoloSuccess Solutions</span>
            <span class="nav__logo-sub">${p.num} / 07 — ${p.name} ${p.nameAccent}</span>
          </div>
        </a>
        <div style="display:flex;align-items:center;gap:var(--sp4);">
          <a href="../index.html" class="btn-outline" style="font-size:var(--text-sm);padding:8px 16px;">← All Products</a>
          <a href="#pricing" class="btn-holo" style="font-size:var(--text-sm);padding:8px 16px;">${p.status === 'live' ? 'Get Started' : 'Join Waitlist'}</a>
        </div>
      </div>
    </div>
  </nav>
</header>

<!-- SWITCHER BAR -->
${switcher(p.id)}

<main id="main">

  <!-- HERO -->
  <section class="prod-hero" aria-label="${p.name} ${p.nameAccent} hero">
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

  <!-- HOW IT WORKS -->
  <section class="how" id="how-it-works" aria-labelledby="how-title">
    <div class="container">
      <p class="section__label">How It Works</p>
      <h2 class="section__title" id="how-title">From zero to running<br/>in minutes.</h2>
      <div class="how__steps" role="list">
        ${stepCards}
      </div>
    </div>
  </section>

  <!-- FEATURES -->
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

  <!-- PRICING -->
  ${pricingSection(p)}

</main>

<!-- FOOTER NAV -->
${prevNext(idx)}

<script>
function handleWaitlist(e) {
  e.preventDefault();
  var form  = e.target;
  var email = form.querySelector('input[type=email]').value;
  if (!email) return;
  var btn = form.querySelector('button');
  btn.textContent = '✓ You\'re on the list!';
  btn.disabled = true;
  btn.style.background = '#27c93f';
  form.querySelector('input').disabled = true;
}
(function(){
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(this.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
    });
  });
})();
</script>
</body>
</html>`;
}

/* ── Write all pages ─────────────────────────────────────── */
PRODUCTS.forEach(function(p, i) {
  const html = buildPage(p, i);
  const file = path.join(OUT, `${p.id}.html`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`✓ pages/${p.id}.html`);
});

console.log(`\nDone — ${PRODUCTS.length} pages written to /pages/`);
