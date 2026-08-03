# Seams checklist

Self-check before handoff when a slice touches architecture-relevant code. Pair with [`quality-gates.md`](./quality-gates.md) and [`architecture/overview.md`](../architecture/overview.md).

## Layers

| Layer              | Belongs here                              | Red flags                                              |
| ------------------ | ----------------------------------------- | ------------------------------------------------------ |
| `app/pages/`       | Thin route orchestration                  | Scoring math, persistence keys, win rules inlined      |
| `app/components/`  | UI; base → common → domain                | Duplicated totals logic across SFCs                    |
| `app/composables/` | Bind UI to stores; multi-step flows       | Pure scoring reimplemented                             |
| `app/stores/`      | Session state + actions calling utils     | Direct `localStorage` outside the persistence boundary |
| `app/utils/game/`  | Pure scoring, win, scoreboard view-models | Vue/Pinia imports                                      |
| `app/utils/pdf/`   | PDF payload / shell                       | Game rules duplicated from `utils/game`                |
| `app/plugins/`     | Hydrate + subscribe persistence           | Scattered `getItem`/`setItem` elsewhere                |
| `tests/unit/`      | Mirror domain / stores / helpers          | New util with no test when behaviour changed           |

## Persistence

- [ ] Storage only behind `import.meta.client` / client plugin (see `ssr-patterns.mdc`)
- [ ] Schema / keys owned by the persistence seam — not inventing new keys in components
- [ ] Hydration order: restore before UI depends on session

## Scoring / display

- [ ] Rules in `utils/game/`; stores/composables **call** them
- [ ] Scoreboard / PDF labels share helpers where they should (`score-display`, grid builders)
- [ ] Landscape / dense grid changes still scannable (industrial UI bar when UI touched)

## Done

Tick applicable rows; note accepts for medium structure debt in the delivery-gate handoff.
