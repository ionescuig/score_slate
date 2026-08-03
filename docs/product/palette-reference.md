# Resume Optimiser — colour reference for Score Slate (white background)

Source: `https://resumeoptimiser.snest.icu/` — extracted from `/_nuxt/entry.*.css` (hashed filename may change on deploy).

**Intent:** Reuse this site’s palette on a **white** (`#ffffff`) app background; map accents to buttons, focus rings, and highlights rather than large teal fields.

## Hex (from bundled CSS)

| Role (suggested) | Values |
| --- | --- |
| Teal / cyan accent | `#00B8B0`, `#00CFC8`, `#02E6E0`, `#03fff6` (and alpha variants like `#00cfc826`, `#03fff61a` for subtle fills) |
| Navy / deep blue | `#0f2942`, `#19436b` (and `#...d9` alpha variants) — strong for text or borders on white |
| Neutrals | `#e5e7eb`, soft cyan tints `#cefafeb3`, `#ecfeff80`, `#dbeafeb3`, `#eff6ff80` |

## OKLCH (Tailwind-style tokens in bundle)

Various `oklch(...)` values appear for greys and semantic colours; prefer mapping to Tailwind theme extensions that mirror the hex accents above for consistency on white.

## Note

Rebuild this list if the resume site’s CSS hash changes significantly; re-fetch `/_nuxt/entry.*.css` and grep for `#` / `oklch(`.
