### Product Requirements Document (PRD): **Multi-Game Scoreboard**

This document outlines **Score Slate**: a local-first, responsive web application designed to replace physical score sheets for tabletop games.

---

## 1. Project Overview
* **Goal:** Create a lightweight, high-performance web app for tracking scores in Rummy, Mexican Train, and Whist.
* **Target Devices:** Laptop, Tablet, and Mobile (optimized for **Locked Landscape** orientation).
* **Core Philosophy:** No accounts, no database, no internet required after initial load. Fast numeric entry and professional PDF exports. **No install prompt:** ship as a normal web app; optional copy that scoring works offline after the first load (browser cache).

---

## 2. Technical Stack
* **Framework:** Nuxt 4 (utilizing Vue 3 Composition API).
* **Styling:** Tailwind CSS (utility-first, responsive layouts).
* **State Management:** **Pinia** (for active game state) synchronized with **LocalStorage** (for player persistence and game recovery).
* **Export Engine:** Client-side PDF generation (e.g., `jsPDF`).

---

## 3. Game Specifications & Scoring Logic

**Shared rules (all games):** Scores are **per individual** only — **no partnerships or teams**. Each round, users enter that round’s points per player; **running total** for a player = previous total + this round’s score. **Mistakes:** scores for the **current round** must be **editable**; any change **recomputes** running totals immediately.

**Dealer (all games):** Every game shows **dealer by rotation** in **setup order** (players ordered left-to-right or as listed). **First round’s dealer** is the **last player in that order** (convention: they deal to the **first** player). Each subsequent round advances the dealer one step forward in order, wrapping from last to first. *Implementation note:* for **n** players and **0-based** round index **r**, dealer player index **(n − 1 + r) mod n**. **UI — dealer:** visible but **secondary** — **muted** treatment (e.g. soft/muted palette, light border, or low-contrast badge). Dealer is **nice to see**, not the main focal point.

**Current leader (all games):** The scoreboard should **emphasize who is leading right now** based on **running totals** and each game’s win rule — **more prominent than dealer**. **Rummy** and **Whist:** leader(s) = player(s) with the **highest** total (ties: **all** co-leaders get the emphasis). **Mexican Train:** leader(s) = player(s) **closest to winning** per the **0**-target rule — typically **lowest** running total (ties: all tied on the best score). **UI — leader:** stronger emphasis (e.g. clearer accent from the palette, weight, or column highlight). Update as soon as totals change.

**Win conditions (differ by game):** **Rummy** — **highest** cumulative score wins (**not** lowest). **Mexican Train** — **0 points** wins / target (lowest toward zero; same “not highest-wins” family as classic domino scoring). **Whist** — **highest** cumulative score wins unless you later define otherwise.

**Ties:** **No tie-break** logic. If several players meet the win criteria equally, **all** may be shown as winners (shared win).

**Rummy — ending a session:** Setup may include an optional **score limit** (e.g. play to 500). If a limit is set: when **at least one** player reaches or crosses that limit, the session can end and show results. If no limit is set, or play stops before anyone hits the limit: the user may press **Finish** at any time to show results. (Exact labels in UI: product copy.)

| Game              | Players (setup) | Scoring & win                                                                 | Rows / rounds (UI)                                                                 | Other UI                         |
| :---------------- | :-------------- | :---------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :------------------------------- |
| **Rummy**         | **2–6**         | Cumulative addition; **highest** total wins (not lowest).                     | Game-specific round rows from setup or limits (e.g. play to N points).             | Points-in-hand entry; **dealer** (muted) + **leader** (emphasized).      |
| **Mexican Train** | **2–8**         | Cumulative toward **0**; **0 points** wins.                                   | See **Mexican Train** below (fixed label column).                                  | Round score + total; **dealer** (muted) + **leader** (emphasized).     |
| **Whist**         | **4–6**         | Per-player score each round; **highest** total wins.                          | See **Whist** below (fixed label column).                                          | **Dealer** (muted) + **leader** (emphasized).  |

### Mexican Train (individuals; no teams)

* **Player count:** **2 to 8 players** (enforce in setup).

* **First column (read-only):** Same idea as Whist — a **fixed label column**, not a score cell. Shows the domino **“game” / pip ladder** **12 → 11 → … → 0** (one row per value). **Automatic**; the user **does not** edit this column.

* **Score cells:** User enters the **round score** per player; **running total** = previous total + this round (as elsewhere).

### Whist (individuals; no teams)

* **Player count:** **4, 5, or 6 players only** (enforce in setup; no 2–3 or 7+ for this game).

* **First column (read-only):** Shows **number of cards per player** for that row — a **label**, not a score cell. Values are **automatic** from the round ladder and **N** (number of players); the user **does not** edit this column.

* **Round ladder** (N = number of players): same deal structure as before; each row’s first-column label is the **cards-per-player** count for that deal:

1. **N** rows labeled **1** (one card each).
2. Then rows **2, 3, 4, 5, 6, 7** (cards per player for each deal).
3. **N** rows labeled **8**.
4. Then **7, 6, 5, 4, 3, 2** (cards per player).
5. **N** final rows labeled **1**.

* **Score cells:** User enters **final score per round per player** in the player columns; running total as elsewhere.

*PRD note (Apr 2026):* Original phrasing: “1 × players number, 2…7, then 8 × players number, 7…2, then 1 × players number” — first column = cards per player per row.

---

## 4. Functional Requirements

### 4.1 Player Management
* **Player Pool:** Store a list of names in `localStorage`.
* **Selection:** Users can pick from existing players or "Add New" during game setup.
* **Limit (per game, enforce in setup):** **Rummy** — **2 to 6** players. **Mexican Train** — **2 to 8** players. **Whist** — **4 to 6** players (see §3).

### 4.2 Game Flow
1.  **Selection Screen:** Choose game (Rummy, Mexican Train, or Whist).
2.  **Setup Screen:** Select players from the pool and define game-specific limits (e.g., "Play to 500 points").
3.  **Active Scoreboard:**
    * **Landscape View:** Columns represent Players; Rows represent Rounds. **Fixed label column (read-only, not scores):** **Mexican Train** — **12 → 0** pip ladder; **Whist** — **cards per player** for that row (from ladder + player count). **Rummy** — no such column unless round numbers are shown elsewhere in the layout.
    * **Numeric Input:** Tap a cell to open a numeric keypad/input for score entry.
    * **Editing:** The **current round**’s score cells are **editable** (typos happen); **read-only** rules apply only to **label** columns (Mexican Train / Whist), not to score cells. **Auto-Calculation:** Totals update instantly when values change.
    * **At-a-glance:** **Current leader(s)** use **strong** visual emphasis; **dealer** uses **muted** emphasis (leader > dealer in visual hierarchy).
4.  **Game Completion:** Highlight winner(s) per game rules (**highest** for Rummy and Whist; **Mexican Train** — **0** / target per rules). **Ties:** show **all** tied winners; no tie-break. When a **Rummy** limit is set and at least one player reaches it, offer or auto-move to results; otherwise **Finish** shows results.

### 4.3 Export System
* **Single PDF format:** One **shared PDF template** (consistent page layout, margins, typography, title/metadata, palette — see `docs/product/palette-reference.md`; **print-safe** greys/borders for B&W printers). **Game-specific content** = the appropriate **scoresheet** (grid/labels) **placed inside** that template — blank (pre-play), in-progress snapshot, or finished summary using the **same** shell.
* **Blank Template:** Same template with an **empty** scoresheet for the chosen game (pen-and-paper).
* **Live Export:** Same template with **current** scores.
* **Final Report:** Same template with **final** scores and winner(s).

---

## 5. UI/UX Requirements
* **Landscape Orientation:** The UI should **present in landscape without asking the user to rotate** — use layout/CSS and, where supported, the **Screen Orientation API** (or equivalent) so the scoreboard is usable in landscape by default. Do not rely on the user manually switching orientation.
* **Offline after load:** The app must work without a network once assets are cached; **no “Add to Home Screen” / install requirement** — optional non-blocking messaging that offline use works after first load.
* **No Auth:** Immediate access to scoring; no login or registration.
* **Text-Only:** No image assets or uploads; clean, typography-focused design.
* **Palette (see `docs/product/palette-reference.md`):** Match the web palette on screen; for **PDF export**, use the same palette **and** ensure **black-and-white printers** remain readable (weight, borders, patterns — not colour alone).
* **Visual hierarchy (live scoreboard):** **Leader** emphasis must read clearly in colour **and** in greyscale (weight/pattern); **dealer** must stay **noticeably quieter** than leader so attention goes to standings first.

---

## 6. Data Architecture (Store Strategy)
* **Pinia Store (`useGameStore`):** Holds the current active game object (game type, current round, scores per player).
* **Pinia Store (`usePlayerStore`):** Holds the master list of all-time player names.
* **Persistence:** Use a Pinia plugin or `watch` effect to mirror all state changes to `localStorage` immediately.

---

## 7. Scope: product vs. development tooling

* **In scope for the shipped app:** Everything in sections 1–6 — browser-only behavior, local storage, PDF export, and the UX constraints listed above.
* **Out of scope for the product:** External memory services, team knowledge bases, or any MCP (including Open Brain) used from the IDE. Those exist only to help implement and review the app; they are not dependencies, features, or data flows for end users.
* **Related artifacts:** Product canon under `docs/product/` (this document, requirements, palette, optional AI prompts for design review). **Implementation** architecture and conventions live under `docs/architecture/`, `docs/infrastructure/`, and evolve with the codebase. Local scratch/reviews may use gitignored `internal/`.