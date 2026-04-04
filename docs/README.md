# Documentation

Technical documentation for **Score Slate** — implementation patterns, boundaries, and testing. Product requirements live in `internal/`; this folder is for how we build the app.

**Implementation (code):** Nuxt app under `app/` — `pages/` (home, setup, play), `stores/` (`usePlayerStore`, `useGameStore`), `composables/` (play/setup/PDF/landscape/score-modal orchestration), `plugins/persist.client.ts` (hydrate + subscribe to `localStorage`), `utils/game/` (pure scoring + scoreboard view-model helpers), `utils/pdf/` (PDF shell), `components/game-scoreboard/` (grid, modal, hints).

## Structure

### `architecture/`

System shape, layers, and boundaries (local-first, no backend).

- **[overview.md](./architecture/overview.md)** — layers, data flow, where logic belongs.

### `infrastructure/`

Reusable conventions: components, state, tests.

- **[components.md](./infrastructure/components.md)** — component layering (base / common / domain).
- **[state-and-persistence.md](./infrastructure/state-and-persistence.md)** — Pinia, `localStorage`, SSR guards.
- **[testing.md](./infrastructure/testing.md)** — test layout and priorities.

## Contributing

When adding docs: pick the closest folder, use a clear filename, and add a one-line entry here. Expand these files as the codebase grows; keep them short and accurate.
