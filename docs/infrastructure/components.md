# Components

## Layering

Same idea as a larger Nuxt app, scaled down:

1. **Base** — Low-level building blocks (buttons, inputs, layout primitives) with stable props and Tailwind-based styling. No game-specific copy or rules.
2. **Common** — Repeated patterns built from base (e.g. a standardized page header, numeric cell wrapper) that are still generic across games.
3. **Domain** — Game flow and scoreboard (`components/game-scoreboard/`, setup UI on `pages/setup/`, shared tiles/buttons at component root). They know about players, rounds, and actions; they do **not** embed scoring formulas — those come from pure helpers or the store.

## Conventions

- Prefer **named exports** for small helpers; default export for Vue SFCs as usual.
- Keep **pages** readable: extract sections into domain components rather than 300-line `*.vue` pages.
- **Props down, events up** — parent owns navigation and store calls; children emit intents (`submit-round`, `export-pdf`).

## Related

- `docs/architecture/overview.md`
- `.cursor/rules/core.mdc`
