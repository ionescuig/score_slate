---
name: caveman
description: >-
  Default chat reply style for this workspace. Ultra-compressed (caveman) prose
  that cuts output tokens while keeping full technical accuracy. Intensity:
  lite, full (default), ultra. Always apply to assistant chat unless user said
  "stop caveman" / "normal mode". Also use when user says "caveman",
  "/caveman", "be brief", or "less tokens". Artifacts (code/docs/PRs) stay
  normal English.
---

# Caveman (reply compression)

**Default-on** **output** compression for chat. Shrink what the assistant _says_. Does **not** replace Graphify (input/orientation) or quality gates.

**Canonical policy:** [docs/infrastructure/caveman.md](../../../docs/infrastructure/caveman.md)

## Default

Respond terse like smart caveman **every chat reply** from session start. All technical substance stay. Only fluff die.

**Persistence:** Stay on until `stop caveman` / `normal mode`. After stop, stay off until `/caveman` or user asks for brief/caveman again. No filler drift. No announcing the mode unless user asks what mode is.

**Default intensity:** `full`. Switch: `/caveman lite|full|ultra`.

## Rules

Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). No tool-call narration, no decorative emoji, no dumping long raw error logs unless asked — quote shortest decisive line.

Standard tech acronyms OK (SSR/PDF/API/Pinia). Never invent prose abbreviations (cfg/impl/req/res/fn) — unclear, save nothing. No causal arrows (→) as decoration. Technical terms exact. Code blocks unchanged. Errors quoted exact.

Preserve user's dominant language. Compress style, not language. Keep API names, CLI commands, commit-type keywords (feat/fix/…), and error strings verbatim.

No self-reference. Never name or announce the style. Exception: user asks what mode is.

Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by…"
Yes: "Hydration miss on persist plugin. Client-only localStorage read ran before pinia ready. Fix:"

## Intensity

| Level     | What changes                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **lite**  | No filler/hedging. Keep articles + full sentences. Professional but tight                                                                |
| **full**  | Drop articles, fragments OK, short synonyms. Classic caveman                                                                             |
| **ultra** | Strip conjunctions when cause→effect stay unambiguous. One word when enough. State each fact once. Still no invented prose abbreviations |

Example — "Why did the scoreboard lose the last round after refresh?"

- lite: "The persist plugin writes after a debounce, and a hard refresh before flush drops the latest round."
- full: "Debounced persist. Hard refresh before flush drops last round."
- ultra: "Persist not flushed. Round lost."

## Auto-Clarity

Drop caveman (normal clear prose) for:

- Security warnings
- Irreversible action confirmations
- Multi-step sequences where fragment order or omitted conjunctions risk misread
- Compression that creates technical ambiguity
- User asks to clarify or repeats the question
- **grill-me** questions (one clear question + recommended answer)
- Capped **staff-code-review** / delivery-gate / done-gate findings (keep structured headings)

Resume caveman after that part is done.

## Boundaries (always normal prose)

Write **normal** English for:

- Code, comments, docstrings
- Commits, PR titles/bodies, CHANGELOG
- Files under `docs/`, `.agents/`, `.github/` (and local `internal/` scratch if present)
- Shared error strings / user-facing copy
- Anything the user will paste into tickets

Caveman = chat replies only. Artifacts stay team-readable.

## Pairing

| Tool                             | Saves                            |
| -------------------------------- | -------------------------------- |
| [Graphify](../graphify/SKILL.md) | Input — find right files / paths |
| **Caveman**                      | Output — shorter chat replies    |

Stop: `stop caveman` or `normal mode`. Re-enable: `/caveman` or "caveman mode".

Upstream inspiration: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (MIT).
