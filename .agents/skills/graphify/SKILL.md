---
name: graphify
description: Thin project-local wrapper for graphify. Prefer the richer global skill when present; otherwise run a stable minimal graph pipeline.
user-invocable: true
argument-hint: "[path] [--mode deep] [--update] [--directed]"
---

# /graphify

Build a project knowledge graph and return key findings, using a reproducible project-level contract.

## Intent

Keep this skill small and stable in-repo, while allowing richer machine-local behavior.

## Resolution Order

1. Prefer the machine's **global `graphify` skill** when available (same skill name lives in editor/user skill packs — discover via your environment's skill index or a `graphify` `SKILL.md`, not a hardcoded path).
2. If no global skill is available, execute the fallback workflow in this file.
3. Regardless of resolution path, keep output paths and user-facing report shape consistent with this repo contract.

## Fallback: flag semantics (pass through to `graphify`)

When using the CLI in fallback mode, forward these flags so behavior matches the tool:

- `--mode deep` — thorough extraction; richer **INFERRED** / semantic edges than default.
- `--update` — incremental run: re-process only new/changed files vs last manifest (when supported).
- `--directed` — build a **directed** graph (preserve source→target on edges).

## Fallback Workflow (Project Contract)

1. If no path is provided, use `.`.
2. Run graphify against the target path (include any flags from **Fallback: flag semantics**).
3. Write outputs to `graphify-out/`.
4. Return:
   - output folder location
   - top "God Nodes"
   - top "Surprising Connections"
   - 3-5 suggested follow-up questions
5. If corpus is too large, warn and ask user to narrow to a subfolder.
6. If no supported files are found, stop and report clearly (see **Failure contract**).

## Failure contract (response shape)

Use these headings and keep copy short so every run looks the same.

### Corpus too large

After detection, if the tool or heuristics indicate an oversized corpus (e.g. very high file/word count):

```text
## Graphify: corpus too large
**Path:** <resolved path>
**Summary:** <file count / word count if known>
**Action:** Narrow to a subfolder and re-run. Suggest: <top 3 subdirs by file count if known; else "pick a package or app/ subtree">
**Question:** Which subfolder should I use?
```

Stop and wait for the user’s subfolder before running a full pipeline.

### No supported files

```text
## Graphify: no supported files
**Path:** <resolved path>
**Result:** No supported files found. Nothing written to graphify-out/.
```

Do not claim success or list God nodes.

## Supported Invocation

```bash
/graphify
/graphify <path>
/graphify <path> --mode deep
/graphify <path> --update
/graphify <path> --directed
```

## Required Artifacts

Always produce:
- `graphify-out/graph.html`
- `graphify-out/graph.json`
- `graphify-out/GRAPH_REPORT.md`

If `--update` is provided, use incremental processing when possible.

## Guardrails

- Do not require machine-specific paths or extras to satisfy this contract.
- Prefer deterministic behavior and concise output over feature sprawl.
- If global and local instructions conflict, prioritize this file for output location and final response format.
