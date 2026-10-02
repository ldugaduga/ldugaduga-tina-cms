# Conversion plan: static portfolio → Next.js + TinaCMS

Source: `ldugaduga.github.io` (plain HTML/CSS/JS, single `index.html` + `form.html`, content hand-edited inline).
Target: Next.js app with TinaCMS managing editable content as Markdown/MDX/JSON.

Work through phases in order; each has a "done when" so you know when to move on.

## Phase 0 — Decisions & accounts

- [ ] Decide hosting: Tina Cloud (hosted editing + auth, free tier available) vs. self-hosted Tina (local/custom auth, more setup)
- [ ] Decide deploy target for the new site (Vercel recommended for Next.js; Netlify as alternative) — GitHub Pages cannot run this stack
- [ ] Create Tina Cloud account + project if using Tina Cloud, note Client ID / Token
- [ ] Decide final domain strategy: keep `ldugaduga.github.io`, or move to a custom domain, and when DNS/Pages cutover happens
- [ ] Confirm who edits content post-launch (just Louie, or others) — affects whether Tina Cloud's visual editing/auth is worth it over local-only editing

**Done when:** hosting + deploy target chosen, accounts created, written down here.

## Phase 1 — Scaffold the new app

- [ ] `npx create-next-app@latest` (TypeScript, App Router, Tailwind optional — current site uses plain CSS, decide whether to port as-is or adopt Tailwind)
- [ ] `npx @tinacms/cli init` (or manual install: `tinacms`, `@tinacms/cli`) to add Tina config and `tina/config.ts`
- [ ] Verify local Tina admin loads at `/admin/index.html` (dev mode) against a placeholder collection
- [ ] Commit scaffold

**Done when:** `npm run dev` serves the Next.js app and the Tina admin loads with no content yet.

## Phase 2 — Content model

Map each section of the current `index.html` to a Tina collection/field schema:

- [ ] `siteSettings` (singleton): hero headline/subhead, availability strip text, contact info, social links, GA tracking ID
- [ ] `services` (list): title, description, icon (Phosphor icon name)
- [ ] `process` (list): step title, description, order
- [ ] `work` (list): project title, description, screenshot image, live URL, platform/tech pills — port images from `assets/work/*.jpg`
- [ ] `experience` (list): role/company, date range, description — timeline entries
- [ ] `testimonials` (list): quote, author name, source (Upwork), rating, link if any
- [ ] Decide file format per collection: Markdown+frontmatter vs. pure JSON (JSON is fine for structured, non-prose list data like `work`/`testimonials`)
- [ ] Write `tina/config.ts` schema for each collection above

**Done when:** every visible content block in current `index.html` has a corresponding Tina-editable field, with no hardcoded copy left to migrate.

## Phase 3 — Port design

- [ ] Port `assets/style.css` into the Next.js app (global CSS import or CSS modules — keep visual parity, don't redesign)
- [ ] Port fonts (Inter via Google Fonts) and icons (Phosphor) — use `next/font` for Inter
- [ ] Port favicon set (`favicon.svg`, 16/32 PNGs, apple-touch-icon)
- [ ] Rebuild page markup as React components driven by Tina content (hero, availability strip, services, process, selected work, experience timeline, testimonials carousel, contact modal)
- [ ] Port contact form (`form.html` fallback) — decide: keep as static fallback, or replace with a Next.js API route / form service (e.g. Formspree, Resend)
- [ ] Re-add Google Analytics (gtag.js) via `next/script`

**Done when:** the new site visually matches the current one 1:1 in a side-by-side check, content now coming from Tina-managed files instead of inline HTML.

## Phase 4 — Editing workflow

- [ ] Verify editing each collection in `/admin` updates the underlying Markdown/JSON files correctly
- [ ] Verify git-backed save flow: local dev writes to disk; Tina Cloud (if used) writes via GitHub App commits on the deployed site
- [ ] Set up branch/PR workflow if non-admin users will edit on the deployed site (Tina Cloud supports editorial workflow with PR review — decide if needed)
- [ ] Confirm image uploads (e.g. new work screenshots) land in the right `public/` or media location and are git-tracked

**Done when:** content can be edited through the Tina admin UI (locally and on the deployed preview) and changes show up as git commits.

## Phase 5 — SEO & a11y parity

- [ ] Port `robots.txt`, `sitemap.xml` (or regenerate via `next-sitemap`)
- [ ] Port meta tags, Open Graph tags, structured data if present in current `index.html`
- [ ] Re-check accessibility fixes already made in the current site (per recent commit history) carry over — alt text, aria labels, focus states
- [ ] Run Lighthouse against both sites and compare scores (performance, SEO, a11y)

**Done when:** Lighthouse scores on the new site are at or above the current static site's.

## Phase 6 — Deploy & cutover

- [ ] Deploy to Vercel/Netlify from this repo, get a preview URL
- [ ] Connect Tina Cloud to the deployed branch (if using Tina Cloud) and confirm admin works in production
- [ ] Full regression pass: every link, image, and form on the deployed preview
- [ ] Point custom domain / repoint `ldugaduga.github.io` DNS or redirect once confident (decide rollback plan — keep old repo's Pages deploy live until DNS propagates)
- [ ] Archive or clearly mark the old static repo as superseded, pointing to this one

**Done when:** the new TinaCMS site is live at the real domain and the old static repo is no longer the deployed source.

## Open questions

- [ ] Plain CSS vs. Tailwind for the rebuild?
- [ ] Tina Cloud vs. fully self-hosted auth for the admin?
- [ ] Contact form: keep current fallback approach or switch providers?
