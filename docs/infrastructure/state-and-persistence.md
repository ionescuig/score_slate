# State and persistence

## Pinia

- **`useGameStore` (name may vary):** Active session — game type, players in this session, rounds, scores, phase (setup / playing / finished).
- **`usePlayerStore` (name may vary):** Long-lived **player name pool** for quick reuse across games.

Stores hold **serializable** state. Derive totals and winners via getters or computed values that call **pure functions** from domain modules where possible.

## `localStorage`

- Read/write only on the client (`import.meta.client`).
- Prefer a **single persistence strategy**: Pinia plugin and/or `watch` with debounce for heavy writes.
- Version stored JSON if you might migrate shape later (e.g. `score-slate-state-v1`).

## SSR

Nuxt may render on the server first — never access `localStorage` during SSR. See `.cursor/rules/ssr-patterns.mdc`.

## Related

- `docs/architecture/overview.md`
- `internal/Score Slate PDR.md` §6
