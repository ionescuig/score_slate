# Score Slate — Requirements (product)

**Canonical detail:** [`pdr.md`](./pdr.md). This file is a concise checklist for stakeholders and implementation; stack and architecture live in `docs/`.

## Product intent

- **Local-first** **Score Slate** for **Rummy**, **Mexican Train**, and **Whist** on laptop, tablet, and phone.
- **No accounts**, **no server database**; persistence via **Pinia** and **`localStorage`** (see `docs/infrastructure/state-and-persistence.md` when implemented).
- **Stack:** Nuxt 4, Vue 3 (Composition API), TypeScript, Tailwind CSS, client-side PDF (e.g. jsPDF).

## Players and setup

- **Player pool:** save and reuse names from `localStorage`; add new names during setup.
- **Per-game player limits (enforce in UI):**
  - **Rummy:** 2–6 players.
  - **Mexican Train:** 2–8 players.
  - **Whist:** 4–6 players.
- **Rummy:** optional **score limit** in setup. If set: when **at least one** player reaches or crosses the limit, the session may end with results. If not set (or play stops early): user uses **Finish** to show results.

## Scoring and winners

- **Individuals only** — no teams or partnerships.
- Each round: enter **per-player** scores; **running total** = previous total + this round.
- **Current round:** scores must be **editable** so mistakes can be fixed; totals **recalculate** immediately. **Label** columns (pip/cards) stay read-only per game rules.
- **Win rules:** **Rummy** and **Whist** — **highest** total wins. **Mexican Train** — **0 points** / target as in PDR.
- **Ties:** **no tie-break**; **multiple winners** allowed.

## Dealer and current leader (all games)

- **Dealer — rotation** in **setup order**. **First round:** dealer = **last player** in the list (deals to the **first**). Subsequent rounds: advance one seat forward, wrap **last → first**.
- **Dealer — UI:** always show who is dealer, but with **muted / secondary** styling (soft colours, low visual noise) — useful, **not** the main focus.
- **Current leader — UI:** **more important than dealer** — **stronger** emphasis for whoever is winning **right now** (running totals, same win logic as end of game: highest for Rummy/Whist, best toward **0** for Mexican Train). **Ties:** highlight **all** co-leaders.

## Scoreboard layout

- **Landscape-first** presentation without asking the user to rotate (layout + Screen Orientation API where available).
- **Fixed label column (read-only, not editable):**
  - **Mexican Train:** pip ladder **12 → 0**.
  - **Whist:** **cards per player** per row (automatic from ladder + player count).
  - **Rummy:** no pip/cards column; round structure per PDR.
- **Numeric entry**, **instant totals**, and **edit** for the **active round**’s score cells.

## PDF export

- **One PDF template** (shared shell: layout, typography, metadata, palette with **B&W-safe** structure).
- **Place** the correct **game scoresheet** (blank, in progress, or final) inside that template — not separate unrelated PDF designs per game.

## Distribution and offline

- **Web app only** — no install / “Add to Home Screen” requirement.
- Optional messaging: works **offline after first load** (browser cache).

## Visual design

- **Palette:** align with [`palette-reference.md`](./palette-reference.md) (teal/navy accents on **white** background).
- **Hierarchy:** **Leader** stands out; **dealer** stays subdued — must still work when printed or viewed without colour (contrast/weight).

## Out of scope

- Image uploads, auth, backend sync, and IDE-only tooling (Open Brain, MCP) as **non-product** dependencies.
