# The Pie Lab - Landing Site

## What This Is

Marketing/landing website for **The Pie Lab**, a pizza-making mobile app (iOS & Android). Hosted on GitHub Pages at [pielab.app](https://pielab.app).

## Tech Stack

- **Pure HTML/CSS/JS** — no framework, no build tools, no package.json
- Google Fonts: Playfair Display (serif headings) + Inter (body)
- All styles are embedded in each HTML file's `<style>` block
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

## Design System

- **Dark theme** with light mode support via `prefers-color-scheme`
- Accent color: burnt orange / terracotta
- Light theme color: `#f3ebe2`, dark theme color: `#0e0c0a`
- Mobile-first responsive design (breakpoints at 768px and 480px)
- Phone mockup frames around app screenshots

## Key Details

- **Domain:** pielab.app (via CNAME for GitHub Pages)
- **Contact:** hello@pielab.app
- **Pricing:** $4.99 one-time purchase, 14-day free trial
- **App Store link:** Live at `https://apps.apple.com/us/app/the-pie-lab/id6761226323`
- **Google Play:** Coming soon — badge shown muted with `coming-soon` class; swap `<span>` back to `<a>` with real URL when ready
- **SEO:** Structured data (JSON-LD) for Organization, SoftwareApplication, and FAQPage
- **Contact form** submits to Google Sheet via Apps Script (honeypot + timing anti-spam)
- **No backend/API** — entirely static; contact form uses Google Apps Script as a relay

## Deployment

Static site served directly via GitHub Pages. No build step required — push to `main` and it deploys automatically.

## When Editing

- All pages share a similar CSS structure but styles are **not shared** — each HTML file has its own `<style>` block
- When updating navigation, footer, or shared UI, update **all HTML files** (index, contact, privacy, terms, refund, blog/index, blog/_template, and any published posts)
- Images use WebP format for performance; screenshots are JPG
- The `pielab-site/` subdirectory is a legacy artifact — ignore it

## Adding a Blog Post

1. Copy `blog/_template.html` to `blog/your-slug.html`
2. Replace all `POST_*` placeholders (title, description, date, tag, image, etc.)
3. Put hero/inline images in `assets/blog/`
4. Add a post card to `blog/index.html` — newest first, `class="featured"` on the first card only
5. Add the URL to `sitemap.xml`
6. Commit and push to `main`
