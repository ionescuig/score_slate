# Documentation

Technical and product documentation for **Score Slate**. How we build the app lives under `architecture/`, `infrastructure/`, and `guides/`; product canon under `product/`. Local scratch and branch reviews may use gitignored `internal/`.

**Implementation (code):** Nuxt app under `app/` — `pages/` (home, setup, play), `stores/` (`usePlayerStore`, `useGameStore`), `composables/` (play/setup/PDF/landscape/score-modal orchestration), `plugins/persist.client.ts` (hydrate + subscribe to `localStorage`), `utils/game/` (pure scoring + scoreboard view-model helpers), `utils/pdf/` (PDF shell), `components/game-scoreboard/` (grid, modal, hints).

## Structure

### `architecture/`

System shape, layers, and boundaries (local-first, no backend).

- **[overview.md](./architecture/overview.md)** — layers, data flow, where logic belongs.

### `infrastructure/`

Reusable conventions: components, state, tests, agent quality.

- **[components.md](./infrastructure/components.md)** — component layering (base / common / domain).
- **[state-and-persistence.md](./infrastructure/state-and-persistence.md)** — Pinia, `localStorage`, SSR guards.
- **[testing.md](./infrastructure/testing.md)** — test layout and priorities.
- **[quality-gates.md](./infrastructure/quality-gates.md)** — verification commands, severity, handoff bar.
- **[seams-checklist.md](./infrastructure/seams-checklist.md)** — layer ownership before merge.
- **[caveman.md](./infrastructure/caveman.md)** — default terse agent chat style.
- **[seo.md](./infrastructure/seo.md)** — meta tags, env vars for deploy, OG/Twitter, backlog.

### `guides/`

- **[feature-preflight-and-done-gate.md](./guides/feature-preflight-and-done-gate.md)** — Boundary Contract + plan checklist for non-trivial slices.

### `product/`

Versioned product canon (was previously local-only under `internal/`).

- **[requirements.md](./product/requirements.md)** — stakeholder checklist.
- **[pdr.md](./product/pdr.md)** — product design record.
- **[palette-reference.md](./product/palette-reference.md)** — teal/navy on white.
- **[prompts/ui-industrial-reviewer.md](./product/prompts/ui-industrial-reviewer.md)** — industrial UI review persona.

**Agent entry:** [`.agents/README.md`](../.agents/README.md).

## Contributing

When adding docs: pick the closest folder, use a clear filename, and add a one-line entry here. Expand these files as the codebase grows; keep them short and accurate.
