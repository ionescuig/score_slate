# Caveman (agent reply style)

**Default-on** **output** compression for AI assistants. Cuts chat verbosity; keeps technical accuracy. Applies to **assistant replies in chat**, not to committed artifacts.

This document is the **canonical policy**. Skill: [`.agents/skills/caveman/SKILL.md`](../../.agents/skills/caveman/SKILL.md).

## Why Caveman

Agents often pad replies (hedging, pleasantries, restating the task). That burns **output** tokens without adding substance. Caveman forces terse replies so the same technical content costs less.

**Not a substitute for Graphify.** Graphify reduces **input** cost (orient + query before wide search). Caveman reduces **output** cost (shorter chat). Use together when both apply.

## When to use

| Situation                                                   | Approach                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| Any Score Slate agent chat (default)                        | Caveman **on**, intensity **full**                         |
| User wants softer compression                               | `/caveman lite`                                            |
| User wants maximum compression                              | `/caveman ultra`                                           |
| Security warning, destructive confirm, ambiguous multi-step | **Auto-Clarity** — normal prose for that part, then resume |
| `grill-me`, capped staff review, delivery-gate findings     | Normal structured prose (skill Auto-Clarity)               |
| Writing code, docs, commits, PRs, CHANGELOG                 | **Always normal** — Caveman never rewrites artifacts       |
| User says `stop caveman` / `normal mode`                    | Off until `/caveman` or "caveman mode" again               |

**Bias:** prefer Caveman for chat. Opt **out** only when the user asks for normal prose.

## Intensity

| Level   | Effect                                       |
| ------- | -------------------------------------------- |
| `lite`  | Drop filler/hedging; full sentences          |
| `full`  | Default — fragments OK, drop articles        |
| `ultra` | Maximum compression; still exact code/errors |

```text
/caveman           # full (also re-enables after stop)
/caveman lite
/caveman ultra
stop caveman       # off until re-enabled
```

## Boundaries

| Stay caveman (chat)                            | Stay normal (artifacts)                         |
| ---------------------------------------------- | ----------------------------------------------- |
| Explanations, status, next steps in the thread | Source code, comments, docstrings               |
| Short error quotes in chat                     | `docs/`, `.agents/`, `.github/` (local `internal/` scratch OK) |
|                                                | Commits, PR bodies, CHANGELOG, user-facing copy |

## Related

- Graphify: [`.cursor/rules/graphify.mdc`](../../.cursor/rules/graphify.mdc) · [`.agents/skills/graphify/SKILL.md`](../../.agents/skills/graphify/SKILL.md)
- Agent entry: [`.agents/README.md`](../../.agents/README.md)
- Upstream idea: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)
