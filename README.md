# ldugaduga-tina-cms

TinaCMS-powered rebuild of [ldugaduga.github.io](https://ldugaduga.github.io/), the static portfolio currently maintained at [ldugaduga/ldugaduga.github.io](https://github.com/ldugaduga/ldugaduga.github.io).

Current site is a single-page static HTML/CSS/vanilla-JS site with no build step, hand-edited directly. The goal here is to migrate it to a Next.js site with [TinaCMS](https://tina.io/) so content (services, work items, testimonials, experience timeline) can be edited through a visual admin UI and saved back to git as Markdown/MDX/JSON, without losing the current design, performance, or git-based ownership of content.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the full conversion checklist.

## Relationship to the live site

- This repo is developed independently — the live site at `ldugaduga.github.io` is untouched until this is ready to cut over.
- Source content and design are ported over from the existing repo (copied, not shared/synced).
- Cutover plan: once parity + edit workflow are verified, this becomes the new source of truth, deployed (e.g. via Vercel or Netlify, since GitHub Pages doesn't run Next.js SSR/ISR out of the box), with the custom domain repointed.

## Stack (target)

- [Next.js](https://nextjs.org/) (App Router)
- [TinaCMS](https://tina.io/) — git-backed, self-hosted or Tina Cloud for the editing UI
- Content as Markdown/MDX + JSON, versioned in this repo
- Deployment target: Vercel (TBD — see plan)
