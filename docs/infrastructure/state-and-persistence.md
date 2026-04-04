# State and persistence

## Pinia

- **`useGameStore`:** Active session — game type, player ids/names, row labels, per-round scores, `currentRoundIndex`, rummy options. **Phase** is `idle` | `playing` | `finished` (setup is a **route**, `/setup/[game]`, not a store phase).
- **`usePlayerStore`:** Long-lived **saved player list** for quick reuse on setup.

Stores hold **serializable** state. Derive totals and winners via getters that call **pure functions** from `app/utils/game/` where possible (avoid duplicating rules in components).

## `localStorage`

- Read/write only on the client (`import.meta.client`).
- **`app/plugins/persist.client.ts`** hydrates both stores from disk on load, then **`$subscribe`** writes back on every mutation. Keys: `score-slate-players-v1`, `score-slate-game-v1`. The game snapshot is only applied when persisted `phase` is not `idle`, so a fresh SSR/hydrate path does not resurrect an empty session as active.
- Version stored JSON with the key suffix (`-v1`) so you can migrate shape later without colliding with old data.

## SSR

Nuxt may render on the server first — never access `localStorage` during SSR. See `.cursor/rules/ssr-patterns.mdc`.

The **play** route (`app/pages/play.vue`) sets `definePageMeta({ ssr: false })` so the page is not server-rendered with an empty store while the client restores an in-progress session from `localStorage`. Home/setup use client-only guards or mount flags where needed (see those pages).

## Related

- `docs/architecture/overview.md`
- `internal/Score Slate PDR.md` §6
