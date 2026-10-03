# Conversion plan: static portfolio → Next.js + TinaCMS

Source: `ldugaduga.github.io` (plain HTML/CSS/JS, single `index.html` + `form.html`, content hand-edited inline).
Target: Next.js app with TinaCMS managing editable content as Markdown/MDX/JSON.

Work through phases in order; each has a "done when" so you know when to move on.

## Phase 0 — Decisions & accounts

- [x] Hosting decided: **no Tina Cloud, no self-hosted Tina backend at all.** The site renders by reading the committed JSON files in `content/` directly off disk (see `lib/content.ts`) — there is no live CMS/GraphQL backend in production. Editing only happens locally: run `npm run dev`, edit through `/admin`, Tina writes straight to those same JSON files (verified in Phase 4), commit, push, redeploy. Reasoning: this surfaced as a real build blocker (see 2026-10-03 note below) once a plain `next build` was attempted — Tina's generated GraphQL client always targets a live server, so a "normal" static build either needs Tina Cloud credentials or a constantly-running self-hosted datalayer, which is a lot of infrastructure for a single-editor portfolio. Revisit only if live in-browser visual editing on the deployed site becomes a real requirement
- [ ] Decide deploy target for the new site (Vercel recommended for Next.js; Netlify as alternative) — GitHub Pages cannot run this stack
- [ ] Decide final domain strategy: keep `ldugaduga.github.io`, or move to a custom domain, and when DNS/Pages cutover happens
- [x] Confirmed who edits content post-launch: just Louie — confirms the local-only editing decision above is the right fit (no need for Tina Cloud's hosted auth/multi-editor features)

**Done when:** hosting + deploy target chosen, accounts created, written down here. Hosting model decided 2026-10-03 (see above); deploy target + domain strategy still open, revisit in Phase 6.

> **2026-10-03 — build blocker & fix:** running `npm run build` failed with `Error: Client not configured properly. Missing clientId, token` — the `tinacms build && next build` script Phase 1 scaffolded assumes Tina Cloud credentials that don't exist yet. Tried `tinacms build --local --skip-cloud-checks` (builds a local-only client instead of a Tina Cloud one) — that got past the client check, but `next build`'s static page generation still does a live `fetch()` to `http://localhost:4001/graphql`, and the local datalayer server Tina's build step starts doesn't stay running for `next build` to query — `ECONNREFUSED`. Also tried `tinacms dev -c "next build"` (keeps the local server alive) — the fetch succeeded, but it broke in a different way (`next build` running under `tinacms dev`'s dev-mode `NODE_ENV` produced a React `useContext` crash on Next's auto-generated error page). Root cause: Tina's generated client is HTTP-only, so *any* production build needs a live GraphQL server at build or request time unless you opt out of it. Fix: rewrote `lib/content.ts` to read `content/**/*.json` straight off disk (`fs/promises`) instead of importing `tina/__generated__/client`, and reverted `package.json`'s `build` script to plain `next build`. Confirmed: `next build` now statically prerenders both routes with zero network calls, `next start` serves the real content, and `npm run dev` + `/admin` still edit the same files exactly as before. `tina/config.ts` and the generated client are unchanged and still exist — they're just no longer in the production render path, only used by the local Tina admin for editing.

## Phase 1 — Scaffold the new app

- [x] `npx create-next-app@latest` (TypeScript, App Router). Note: Tailwind ended up installed by the CLI's current default template despite requesting plain CSS — left in place since plain-CSS-vs-Tailwind was already an open question (see below); the `assets/style.css` port in Phase 3 can either go in as global CSS alongside Tailwind, or Tailwind can be removed first.
- [x] `npx @tinacms/cli init` → selected Next.js + NPM + TypeScript. Added `tina/config.ts` (demo `post` collection), a demo content file `content/posts/hello-world.md`, and a Pages Router demo route `pages/demo/blog/[filename].tsx` (coexists with the App Router `app/` — fine as a reference for Phase 2, delete once real collections replace it)
- [x] Verify local Tina admin loads at `/admin/index.html` (dev mode) against a placeholder collection — confirmed `npm run dev` serves `/` and `/admin/index.html` both with HTTP 200
- [x] Commit scaffold

**Done when:** `npm run dev` serves the Next.js app and the Tina admin loads with no content yet. ✅ Done 2026-10-03.

Known rough edges to revisit:
- Node engine mismatch warning: `@tinacms/cli` wants Node 22.x/24.x, this machine runs v26.8.2 — worked fine so far, but keep an eye out if something breaks later
- `tina/config.ts` still has placeholder `clientId`/`token` env vars (unset) — fine for local dev, required before any Tina Cloud / production use (Phase 0/6)

## Phase 2 — Content model

Map each section of the current `index.html` to a Tina collection/field schema:

- [x] `settings` (singleton, `content/settings/site.json`, `ui.global: true`): SEO title/description/canonical/OG image, GA id, hero headline/sub, availability strip text, 4 hero stats, contact form action, final CTA copy, social links
- [x] `service` (list, `content/services/*.json`): title, description, icon, featured flag, tags, order — all 4 real services migrated
- [x] `processStep` (list, `content/process/*.json`): title, description, icon, order — all 4 real steps migrated
- [x] `work` (list, `content/work/*.json`): title, description, live URL, screenshot image + alt, platform (wordpress/shopify), category, featured (shown-by-default vs. "load more"), order — all 21 real projects migrated, screenshots copied to `public/work/*.jpg`
- [x] `experience` (list, `content/experience/*.json`): company, role, date range, current flag, order — all 9 real timeline entries migrated
- [x] `testimonial` (list, `content/testimonials/*.json`): quote, attribution, rating, order — all 10 real Upwork testimonials migrated
- [x] File format: JSON for every collection (no prose body needed anywhere, so plain JSON frontmatter-less files kept things simple — no Markdown/MDX needed for this content)
- [x] Wrote `tina/config.ts` schema for all 6 collections above; removed the Tina CLI's demo `post` collection/content and the Pages Router demo route it scaffolded

**Done when:** every visible content block in current `index.html` has a corresponding Tina-editable field, with no hardcoded copy left to migrate. ✅ Done 2026-10-03 — verified via direct GraphQL queries against the local Tina dev server (`workConnection` returned all 21 projects, `settings` returned hero/stats, `testimonialConnection`/`experienceConnection` returned all 10/9 entries) and `/admin/index.html` loading with the real schema.

Notes / follow-ups for Phase 3:
- `heroHeadline` and `availabilityText` use a lightweight `*emphasis*` / `**bold**` text convention (plain string fields, not rich-text) — Phase 3 needs a small helper to render those spans instead of dumping raw asterisks
- `service.icon` stores either a Phosphor class name (`ph-code`) or the sentinel `simpleicons:wordpress` for the one brand-colored icon from `cdn.simpleicons.org` — Phase 3 needs a tiny branch in the icon renderer for that case
- Work item ordering was taken directly from source order (first 6 = `featured: true`, matching the current "show 6, load more" behavior); re-ordering later just means editing each file's `order` field in the Tina admin

## Phase 3 — Port design

- [x] Ported `assets/style.css` into `app/globals.css` almost verbatim (same custom properties, same class names) — dropped the Tailwind the Phase 1 scaffold pulled in (`npm uninstall tailwindcss @tailwindcss/postcss`, removed `postcss.config.mjs`) since nothing in the port uses it and the original open question favored plain CSS
- [x] Fonts: Inter via `next/font/google` (`--font-inter` CSS variable). Icons: Phosphor web CSS loaded via a `<link>` tag in the root layout (same CDN URL as the original, hoisted into `<head>` by Next)
- [x] Favicon set copied to `public/` (`favicon.svg`, 16×16/32×32 PNGs, apple-touch-icon) and wired via `generateMetadata().icons`
- [x] Rebuilt every section as a component under `components/`, composed in `app/(site)/page.tsx`, fetching real content server-side via `lib/content.ts` (Tina's generated GraphQL client): `Header`, `Hero` + `StatCounter`, `AvailabilityStrip`, `Services`, `Process`, `Work` (client component for "load more"), `Experience`, `Testimonials` (client component for the scroll-snap slider), `FinalCta`, `Footer`. `Reveal` reimplements the original IntersectionObserver fade-in as a small client wrapper. `Icon` and `RichLabel` handle the `simpleicons:` icon sentinel and the `*em*`/`**strong**` text convention from Phase 2
- [x] Contact form: ported both the modal (`ContactModal` + `ContactModalContext` + `StartProjectButton`, open from the nav/hero/final CTA) and the standalone `/form` fallback page (`FallbackContactForm`), matching `form.html` 1:1 including its no-header/no-footer layout — required splitting `app/layout.tsx` into a thin root layout (fonts, GA, JSON-LD, Phosphor stylesheet) plus an `app/(site)/layout.tsx` route group that adds the header/footer/modal only around the main site, so `/form` can stay bare. Both forms still POST to the Formspree endpoint from `settings.contactFormAction`
- [x] Re-added Google Analytics (gtag.js) via `next/script`, gated on `settings.gaId` being set

**Done when:** the new site visually matches the current one 1:1 in a side-by-side check, content now coming from Tina-managed files instead of inline HTML. ✅ Done 2026-10-03 — verified with `tsc --noEmit` (clean), `eslint` (clean on all our own code), `next build` compiling and type-checking successfully, and a real browser pass (Claude in Chrome) against the local dev server: hero/stats/services/process/work/experience/testimonials/footer all render with real content, "Load more work" reveals the remaining projects, the contact modal opens/closes (Escape, overlay click, focus handling) and the testimonials slider's prev/next buttons work with correct disabled states. No console errors.

~~Known gap, deferred to Phase 6~~ — **resolved 2026-10-03**, see the Phase 0 note above: `next build` no longer needs any live Tina GraphQL server at all, since rendering reads `content/**/*.json` directly off disk.

## Phase 4 — Editing workflow

- [x] Verified editing each collection in `/admin` updates the underlying JSON files correctly — tested end-to-end with a real browser (Claude in Chrome): opened `/admin/index.html`, entered local edit mode ("When you save, changes will be saved to the local filesystem"), edited a testimonial's attribution field, saved, confirmed the "Document updated!" toast, then confirmed on disk that `content/testimonials/10.json` had the new value. Reverted the test edit the same way afterward
- [x] Verified the Site Settings singleton: `/admin` → Site Settings opens straight to the one document (no list view, no "new"/"delete" actions) thanks to `ui.global: true` + `allowedActions`, exactly as modeled in Phase 2
- [x] Verified git-backed save flow: writes land directly on disk as plain file edits, so they show up as normal uncommitted changes (`git status`/`git diff`) ready to commit, push, and redeploy. Per the Phase 0 hosting decision there is no separate "deployed preview" editing flow to verify — editing only ever happens locally against the same files the production build reads, so this is the complete picture, not a partial one
- [x] Confirmed image uploads land correctly: used the admin's Media Manager to upload a test image (via the hidden file input, since the picker is a native OS dialog), confirmed it appeared in the library with a working public URL, and confirmed on disk it was written straight into `public/` as an untracked file ready for git. Also confirmed deleting it from the Media Manager removes it from disk. The existing `public/work/*.jpg` screenshots and favicons already show up and preview correctly in the same Media Manager
- [x] Branch/PR editorial workflow (Tina Cloud) — **not applicable**: this is a single-editor site with no Tina Cloud backend at all (Phase 0), so there's no editorial-review flow to set up. Revisit the whole hosting decision first if a second non-admin editor is ever added

**Done when:** content can be edited through the Tina admin UI (locally and on the deployed preview) and changes show up as git commits. ✅ Done 2026-10-03 — "deployed preview" editing doesn't apply under the local-only hosting model decided in Phase 0; editing is local-only by design, and those edits are exactly what gets committed and deployed.

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
