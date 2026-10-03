# ldugaduga-tina-cms

TinaCMS-powered rebuild of [ldugaduga.github.io](https://ldugaduga.github.io/), the static portfolio currently maintained at [ldugaduga/ldugaduga.github.io](https://github.com/ldugaduga/ldugaduga.github.io).

Current site is a single-page static HTML/CSS/vanilla-JS site with no build step, hand-edited directly. The goal here is to migrate it to a Next.js site with [TinaCMS](https://tina.io/) so content (services, work items, testimonials, experience timeline) can be edited through a visual admin UI and saved back to git as Markdown/MDX/JSON, without losing the current design, performance, or git-based ownership of content.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the full conversion checklist.

## Relationship to the live site

- This repo is developed independently — the live site at `ldugaduga.github.io` is untouched until this is ready to cut over.
- Source content and design are ported over from the existing repo (copied, not shared/synced).
- Cutover plan: once parity + edit workflow are verified, this becomes the new source of truth, deployed (e.g. via Vercel or Netlify, since GitHub Pages doesn't run Next.js SSR/ISR out of the box), with the custom domain repointed.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TinaCMS](https://tina.io/) — **local-editing only, no Tina Cloud or self-hosted backend** (see Phase 0 in the plan for why). The site renders by reading `content/**/*.json` straight off disk; Tina is only used locally to edit those files through a visual UI
- Content as JSON, versioned in this repo
- Deployment target: Vercel (TBD — see plan)

## Editing content

```bash
npm run dev
```

Then open `http://localhost:3000/admin/index.html`. Edits save straight to the JSON files in `content/` — commit and push them like any other change, then redeploy.

**`/admin` only works with `npm run dev` running.** It depends on Tina's local dev server (port 4001); running `npm run build && npm run start` (the production build) will show a "Failed loading TinaCMS assets" error if you open `/admin` there — that's expected, not a bug. The production build has no CMS backend at all by design.
