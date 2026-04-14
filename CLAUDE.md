# The Pie Lab - Landing Site

## What This Is

Marketing/landing website for **The Pie Lab**, a pizza-making mobile app (iOS & Android). Hosted on GitHub Pages at [pielab.app](https://pielab.app).

## Tech Stack

- **Pure HTML/CSS/JS** — no framework, no build tools, no package.json
- **Google Fonts: Fraunces (display) + Libre Franklin (body/UI) + Space Mono (data)** — loaded via `styles.css`
- **Shared `styles.css` at site root** holds the Ember Editorial design system (tokens, fonts, typography, wordmark). Every page links it via `<link rel="stylesheet" href="styles.css">` (or `../styles.css` for blog posts). Per-page `<style>` blocks still exist for page-specific components (hero sections, feature cards, pricing grids, etc.) and inherit tokens from styles.css.
- Vanilla JS for interactions (IntersectionObserver, accordion, dark mode toggle)

## Site Structure

```
index.html        — Main landing page (hero, features, testimonials, pricing, FAQ)
contact.html      — Native feedback form (submits to Google Sheet via Apps Script)
privacy.html      — Privacy policy
terms.html        — Terms of service
refund.html       — Refund policy
robots.txt        — Search engine directives
sitemap.xml       — XML sitemap for SEO
CNAME             — GitHub Pages custom domain (pielab.app)
assets/
  images/         — Pizza style showcase images (WebP)
  logos/          — SVG logos and favicon
  blog/           — Blog post hero and inline images
  og-image.jpg    — Open Graph social sharing image
Screenshots/      — App screenshots used in feature sections
blog/
  index.html      — Blog listing page (hand-maintained post grid)
  _template.html  — Copy this to create a new post
  *.html          — Individual blog posts (one file per post)
```

## Design System — Ember Editorial

- **Dark-first.** Page bg `#0F0D0A` (`--clr-char` / `--bg`), card bg `#1A1410` (`--clr-coal` / `--card`). Light mode is explicit opt-in via `[data-theme="light"]` (mainly for print).
- **Palette tokens** live in `styles.css` — both Ember names (`--clr-ember`, `--clr-crust`, `--clr-parchment`, `--clr-char`, `--clr-coal`, `--clr-ash`, `--clr-smoke`, `--clr-stone`) and legacy aliases (`--bg`, `--card`, `--primary`, `--accent`, `--text`, etc.) that map to Ember values. Per-page `<style>` blocks can reference either.
- **Primary (CTAs, "Lab" wordmark):** Ember orange `#D4713A`
- **Typography — strict three-font system:**
  - **Fraunces** (`var(--font-display)`) italic for display headings and the wordmark
  - **Libre Franklin** (`var(--font-body)`) weights 200–400 for body, nav, labels, buttons
  - **Space Mono** (`var(--font-data)` / `var(--font-mono)`) for all numerical output
  - Do not re-introduce Source Serif 4, Playfair Display, Inter, or Roboto Mono
- **Wordmark:** nav and hero logos render as inline HTML (`<span class="nav-logo-wordmark">The Pie <span class="lab">Lab</span></span>`), not `<img>`
- **No drop shadows on cards/modals** — use 1px `--clr-ash` borders instead
- **No pill shapes** (`border-radius: 999px`) on buttons or badges — use `--radius-btn` (2px)
- **No card radii above 8px** — use `--radius-card` (6px)
- Mobile-first responsive design (breakpoints at 768px and 480px)
- Phone mockup frames around app screenshots

## Key Details

- **Domain:** pielab.app (via CNAME for GitHub Pages)
- **Contact:** hello@pielab.app
- **Pricing:** $9.99 one-time purchase, 14-day free trial
- **App Store link:** Live at `https://apps.apple.com/us/app/the-pie-lab/id6761226323`
- **Google Play:** Coming soon — badge shown muted with `coming-soon` class; swap `<span>` back to `<a>` with real URL when ready
- **SEO:** Structured data (JSON-LD) for Organization, SoftwareApplication, and FAQPage
- **Contact form** submits to Google Sheet via Apps Script (honeypot + timing anti-spam)
- **No backend/API** — entirely static; contact form uses Google Apps Script as a relay

## Deployment

Static site served directly via GitHub Pages. No build step required — push to `main` and it deploys automatically.

## When Editing

- **Design-system tokens, fonts, typography, wordmark, and reset live in `styles.css`** — the single source of truth. Add shared component rules there.
- Per-page `<style>` blocks hold only page-specific components (hero sections unique to index, contact form, legal-page layouts, feature cards, pricing grids, etc.) and reference the tokens from styles.css.
- When updating navigation, footer, or other shared UI that lives in HTML, update **all HTML files** (index, contact, privacy, terms, refund, blog/index, blog/_template, and any published posts). The wordmark nav logo markup is the same on every page.
- Images use WebP format for performance; screenshots are JPG
- The `pielab-site/` subdirectory is a legacy artifact — ignore it

## Adding a Blog Post

1. Copy `blog/_template.html` to `blog/your-slug.html`
2. Replace all `POST_*` placeholders (title, description, date, tag, image, etc.)
3. Put hero/inline images in `assets/blog/`
4. Add a post card to `blog/index.html` — newest first, `class="featured"` on the first card only
5. Add the URL to `sitemap.xml`
6. Commit and push to `main`
