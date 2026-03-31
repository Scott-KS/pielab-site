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
contact.html      — Contact page with embedded Google Feedback Form
privacy.html      — Privacy policy
terms.html        — Terms of service
refund.html       — Refund policy
robots.txt        — Search engine directives
sitemap.xml       — XML sitemap for SEO
CNAME             — GitHub Pages custom domain (pielab.app)
assets/
  images/         — Pizza style showcase images (WebP)
  logos/          — SVG logos and favicon
  og-image.jpg    — Open Graph social sharing image
Screenshots/      — App screenshots used in feature sections
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
- **App Store links:** Currently placeholder `#` — need real URLs when published
- **SEO:** Structured data (JSON-LD) for Organization, SoftwareApplication, and FAQPage
- **No backend/API** — entirely static, no forms submit data (contact uses embedded Google Form)

## Deployment

Static site served directly via GitHub Pages. No build step required — push to `main` and it deploys automatically.

## When Editing

- All pages share a similar CSS structure but styles are **not shared** — each HTML file has its own `<style>` block
- When updating navigation, footer, or shared UI, update **all HTML files** (index, contact, privacy, terms, refund)
- Images use WebP format for performance; screenshots are JPG
- The `pielab-site/` subdirectory is a legacy artifact — ignore it
