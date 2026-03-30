---
name: review-to-plan
description: Convert an architectural code review into a practical implementation plan that fixes the issues while preserving the intent and core value of the current change.
---

# Review to Plan

Turn an architectural review into a focused implementation plan. The goal is not to redesign for its own sake. The goal is to address the most important issues while maintaining the core feature intent and minimising disruption.

Use this skill when you already have a review output identifying coupling, complexity, backend leakage, shallow modules, temporary objects, or other architectural concerns, and now need a plan to fix them.

## Core Objective

Create a repair plan that:

- preserves the original purpose of the branch
- addresses the highest-risk architectural issues first
- reduces complexity and coupling
- improves testability and maintainability
- avoids unnecessary rewrites
- keeps delivery practical and staged

## Primary Rule

Do not lose the core focus of the change.

Before proposing any fix, identify:

- what user or business outcome the branch is trying to achieve
- what behaviour must remain intact
- which parts are essential to that goal
- which parts are implementation detail and can change safely

All recommendations must preserve the intended outcome unless the review clearly shows the design is fundamentally unsound.

## Inputs

Expect the following inputs where available:

- overall assessment
- scorecard
- key findings
- hidden coupling and interface risks
- complexity review
- temporary object and smell review
- deep module opportunities
- merge recommendation
- branch or feature summary

If the feature intent is not stated explicitly, infer it from the review and available context before planning.

## Planning Principles

### 1. Preserve intent

Separate:

- essential behaviour that must remain
- implementation choices that can be changed

### 2. Fix risk in order

Prioritise:

- merge blockers
- correctness and interface risks
- structural maintainability issues
- secondary clean-up

### 3. Prefer targeted repair over broad rewrite

Do not propose a rewrite unless:

- the current structure cannot be stabilised incrementally
- the review indicates fundamental design failure
- smaller changes would cost more than replacing the design

### 4. Reduce coupling by introducing clearer boundaries

Prefer:

- explicit adapters
- clearer ownership of logic
- deeper modules
- simpler data flow
- reduced hidden dependencies

### 5. Keep the plan executable

Recommendations must be implementable by a team. Avoid vague advice. Convert findings into concrete work packages.

### 6. Sequence for safe change

Order work to reduce risk:

- stabilise interfaces first
- then simplify flows
- then deepen modules
- then clean up residual smells

## Required Planning Steps

### Step 1. Restate the core intent

Write a brief statement of:

- what the change is trying to achieve
- what must not be broken
- what success still looks like after the fixes

### Step 2. Classify findings

Group findings into:

- merge-blocking issues
- must-fix architectural risks
- follow-up improvements
- optional clean-up

### Step 3. Define repair strategy

Choose one overall strategy:

- targeted stabilisation
- phased refactor
- boundary-first redesign
- selective rollback and rebuild

Explain why this strategy fits the change.

### Step 4. Build the implementation plan

Create an ordered plan with phases. Each phase should have:

- objective
- changes to make
- risks
- dependencies
- expected outcome

### Step 5. Convert the plan into actionable tasks

For each task include:

- title
- why it exists
- scope
- affected areas
- suggested implementation notes
- validation approach

### Step 6. Protect feature intent

Add a section called:
**What must remain unchanged**

List the user-facing behaviours, business rules, workflows, or integration assumptions that the fixes must preserve.

### Step 7. Define validation

Explain how to confirm the repair worked:

- functional validation
- regression checks
- interface validation
- test additions
- manual review points

## Refactor Strategy Guidance

### Use targeted stabilisation when

- the feature is mostly sound
- the problems are localised
- the branch can merge safely with focused changes

### Use phased refactor when

- the feature works but structure is weak
- there are multiple connected issues
- incremental improvement is realistic

### Use boundary-first redesign when

- the main issue is coupling between layers
- backend leakage is widespread
- clear interfaces are missing

### Use selective rollback and rebuild when

- one part of the solution is creating most of the risk
- the rest of the branch is still worth keeping
- replacing a narrow area is safer than patching it

## Output Format

### 1. Core intent to preserve

State:

- feature goal
- critical behaviours to preserve
- non-goals for this repair plan

### 2. Planning summary

Provide:

- chosen strategy
- overall recommendation
- whether the plan is pre-merge or post-merge
- expected level of change: low / medium / high

### 3. Issue triage

Group issues into:

- merge blockers
- must-fix before merge
- can follow after merge
- optional clean-up

### 4. Phased implementation plan

For each phase include:

- phase name
- objective
- key changes
- dependencies
- risk level
- expected result

### 5. Task breakdown

For each task include:

- title
- priority: P0 / P1 / P2
- rationale
- implementation scope
- validation notes

### 6. What must remain unchanged

List the core outcomes and behaviours that should be preserved.

### 7. Test and validation plan

Describe:

- tests to add or update
- regressions to check
- integration seams to verify
- manual review points

### 8. Recommended execution order

Provide the safest order to implement the work.

## Style

- Be concrete and execution-focused
- Do not repeat the review without turning it into action
- Do not recommend broad rewrites by default
- Be opinionated about sequencing
- Optimise for practical delivery and reduced risk
