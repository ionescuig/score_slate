# Agent Docs

## Skill Resolution Notes

### `graphify`

This repository keeps a project-local `graphify` skill at `.agents/skills/graphify/SKILL.md` as the stable contract for outputs and response shape.

Resolution order:
1. Prefer the **global `graphify` skill** when the environment exposes one (discover via your skill pack / available skills — do not assume a fixed filesystem path).
2. If unavailable, use the local fallback in this repo.
3. Always preserve repo contract expectations (notably `graphify-out/` output location, report structure, and **Failure contract** messaging in `.agents/skills/graphify/SKILL.md`).

Why this exists:
- Global skill provides richer capabilities on this machine.
- Local skill preserves reproducibility for this project and future contributors.
