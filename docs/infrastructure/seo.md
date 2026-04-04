# SEO and social metadata

Score Slate is mostly a **client-heavy PWA** (Pinia + `localStorage`), but **marketing routes** (`/`, `/setup/*`) are still worth optimizing for search and link previews. There is **no dedicated SEO agent skill** in this repo; follow [Nuxt’s SEO and meta guide](https://nuxt.com/docs/getting-started/seo-meta) and keep this file updated when you change URLs or deploy targets.

## What we do today

| Area | Implementation |
|------|----------------|
| **Site-wide** | `nuxt.config.ts` `app.head`: `lang="en"`, default `title` / `description`, `theme-color`, `apple-mobile-web-app-title`, `/favicon.svg`, PWA manifest link. |
| **Title pattern** | `app.vue`: `titleTemplate` → `%s · Score Slate` when a page sets a title; otherwise **Score Slate**. |
| **Open Graph / Twitter** | `app.vue`: `og:site_name`, `og:type`, `og:locale`, `twitter:card`. Per-page `useSeoMeta` on home, setup, and play. |
| **Canonical + `og:url`** | `useScoreSlateRouteSeo()` in `app/layouts/default.vue` when `NUXT_PUBLIC_SITE_URL` is set (see below). |
| **Default share image** | Optional `NUXT_PUBLIC_OG_IMAGE_URL` (absolute URL). Omitted until you host an image. |
| **`/play`** | `useSeoMeta({ robots: 'noindex, nofollow' })` — session shell, SSR off; not meant as a landing page. |
| **robots.txt** | `public/robots.txt` allows crawlers; `/play` is discouraged via meta, not `Disallow` (so you can change mind without duplicate policy). |

## Environment variables (first deploy)

Set in the host’s env or a root `.env` (not committed):

| Variable | Purpose |
|----------|---------|
| `NUXT_PUBLIC_SITE_URL` | Public site origin **without** trailing slash, e.g. `https://scoreslate.example.com`. Enables `<link rel="canonical">` and `og:url` on every layout-wrapped page. |
| `NUXT_PUBLIC_OG_IMAGE_URL` | Absolute URL to a default OG image (commonly **1200×630**). Shown when links are shared if the page does not override `og:image`. |

Example (see also `.env.example`):

```bash
NUXT_PUBLIC_SITE_URL=https://scoreslate.example.com
NUXT_PUBLIC_OG_IMAGE_URL=https://scoreslate.example.com/og.png
```

Until these are set, relative URLs and local dev are fine; previews may not show a correct URL or image.

## How to verify locally

1. Run the app, **View Page Source** (or curl) on `/` and `/setup/rummy` — check `<title>`, `meta name="description"`, `meta property="og:*"`.
2. Temporarily set `NUXT_PUBLIC_SITE_URL=http://localhost:3000` and confirm `canonical` and `og:url` appear (optional smoke test).
3. After deploy, use your host’s inspector or [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / [Twitter Card Validator](https://cards-dev.twitter.com/validator) if still available.

## Backlog (do later)

Prioritize when you have a **production domain** and **analytics** needs.

1. **OG image asset** — Add a branded `og.png` (or WebP + `<meta>` if you standardize) under `public/` or your CDN; set `NUXT_PUBLIC_OG_IMAGE_URL`.
2. **Sitemap** — Add `@nuxtjs/sitemap` or static `sitemap.xml` listing `/`, `/setup/rummy`, `/setup/mexican-train`, `/setup/whist` (and only public URLs you want indexed).
3. **Structured data** — Optional JSON-LD (`WebApplication` or `SoftwareApplication`) on the home page for rich results.
4. **`/play` policy** — Revisit `noindex` if you ever ship SSR + real content there; keep session URLs out of the index unless intentional.
5. **i18n** — If you add locales, set `html lang`, `hreflang`, and localized `description` / titles per route.
6. **Lighthouse / Search Console** — Run after first production deploy; fix coverage, mobile UX, and Core Web Vitals as needed.
7. **Dedicated SEO skill** — If the team wants repeatable audits, add a small Cursor skill under `.agents/skills/` that points to this doc + Nuxt SEO docs + a short on-page checklist.

## Related

- `docs/architecture/overview.md`
- `docs/README.md`
- `.cursor/rules/ssr-patterns.mdc` — hydration and client-only routes affect what crawlers see without JS.
