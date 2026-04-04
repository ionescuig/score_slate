# Architecture overview

Score Slate is a **local-first** Nuxt app: no login, no remote API for core gameplay. After the shell is loaded, scoring works offline; data stays in the browser (Pinia + `localStorage`).

## Directory layout (Nuxt)

Use the standard **`app/`** tree: `app/pages`, `app/layouts`, `app/components` (with **base → common → domain** subfolders per `docs/infrastructure/components.md`), `app/composables`, `app/stores`, and `assets/` for global CSS. Unit tests live under `tests/` and mirror domain/store modules as they grow. Keeps routes thin and logic discoverable without coupling pages to persistence details.

## Layered structure

Roughly top to bottom:

| Layer | Responsibility |
| ----- | -------------- |
| **Pages** | Routes, layout, compose domain components; stay thin. |
| **Domain components** | Game setup, scoreboard grid, export triggers — UI for one feature area. |
| **Composables** | Orchestration: bind UI to stores, coordinate steps (e.g. `usePlayPage`, `useScoreRoundModal`, landscape/PDF hooks). |
| **Pinia stores** | Reactive session state: active game, players pool, UI-safe snapshots for persistence. |
| **Domain logic (pure)** | Scoring rules, win detection, shared scoreboard/PDF row labels (`app/utils/game/score-display.ts`), scoreboard view-model assembly (`app/utils/game/scoreboard-grid-build.ts`), per-game math — **functions** with no Vue/Pinia imports. Easy to unit test. |
| **Persistence** | Serialize/deserialize app state to `localStorage`; only touch storage behind `import.meta.client` (see `.cursor/rules/ssr-patterns.mdc`). |

## Principles (aligned with a ports-and-adapters style)

- **Core vs. edges:** Game rules and totals belong in **pure** modules. Stores and composables **call** those modules; they should not duplicate rule text in ad hoc form.
- **Single persistence boundary:** One place (plugin or store helper) knows storage keys and schema versioning — avoids scattered `getItem`/`setItem`.
- **No API layer for v1:** There is no `server/api` contract for gameplay. If server routes appear later (e.g. analytics), they stay optional and outside the scoring core.

## Flow (simplified)

```
User action → Component → Composable / Store action → Pure domain helpers → Store updates → UI
                                                                    ↓
                                                          Persistence (debounced or immediate)
```

## Related

- `internal/Score Slate PDR.md` — product scope.
- `docs/infrastructure/state-and-persistence.md` — Pinia + storage details.
- `docs/infrastructure/seo.md` — titles, Open Graph, env-based canonical URLs.
- `.cursor/rules/state-and-persistence.mdc` — agent-oriented summary.
