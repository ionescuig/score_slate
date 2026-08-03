# Feature preflight + done gate

Copy sections into task plans for **non-trivial** Score Slate work. Fill required blocks **before** implementation.

Pair with:

- [`../infrastructure/seams-checklist.md`](../infrastructure/seams-checklist.md)
- [`../architecture/overview.md`](../architecture/overview.md)
- [`../infrastructure/state-and-persistence.md`](../infrastructure/state-and-persistence.md)

Skills: [`feature-delivery`](../../.agents/skills/feature-delivery/SKILL.md) → [`tdd`](../../.agents/skills/tdd/SKILL.md) → [`delivery-gate`](../../.agents/skills/delivery-gate/SKILL.md). Merge sweep: [`done-gate`](../../.agents/skills/done-gate/SKILL.md).

---

## Goal

<One sentence: player outcome.>

## Architecture

<2–3 sentences: chosen boundary and why it is the simplest safe option.>

### Reference implementation

Files to mirror (do not invent parallel structure):

- <e.g. `usePlayPage` + scoreboard domain components>
- <e.g. `app/utils/game/...` for pure scoring>
- <e.g. `plugins/persist.client.ts` for persistence shape>

### Data contract

- Active session: Pinia store(s)
- Recovery / named players: `localStorage` via persistence plugin
- Product requirements: [`docs/product/requirements.md`](../product/requirements.md) / [`pdr.md`](../product/pdr.md)

---

## Boundary Contract (required before implementation)

### Public interface

- Inputs: `<name>`: `<type>`
- Outputs: `<name>`: `<type>`

### Ownership

- Business rules live in: `<utils/game or store actions calling utils>`
- Business rules must NOT live in: `<page templates / duplicated SFC logic>`

### Non-goals

- <what this change does not solve>

---

## Architecture preflight (self-score before coding)

Score 0–5. **Revise design if any score < 4.**

- Architectural boundaries: _/5
- Coupling and interface clarity: _/5
- Complexity: _/5
- Data flow: _/5
- Local-first / persistence clarity: _/5
- Testability and module depth: _/5

Risks and mitigations:

- Risk: … → Mitigation: …

---

## Phased tasks

### Task 1 — <title>

1. RED: failing test on public util/store interface
2. GREEN: minimal implementation
3. Refactor only while green

Verification: scoped `npm run test -- …` then lint

---

## Done looks like

- [ ] Stories (incl. ≥1 negative) satisfied
- [ ] Mechanical gates green (see quality-gates)
- [ ] Seams checklist for touched layers
- [ ] `docs/product/` (and tech `docs/`) updated if product behaviour changed
