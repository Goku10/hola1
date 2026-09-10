# Rules engine

Pure functions in `src/lib/engine/index.ts`.

## Requirement trees

`RequirementNode` supports nested **AND** (`all`) and **OR** (`any`), plus leaves:

- `subject` — subject id must be in completed ∪ planned
- `gsu` — general study competence
- `flag` — vocational / special flags

### Medicine (MEROD)

```
AND [ GSU, OR[R1, AND[S1,S2]], Physics1, Chemistry1, Chemistry2 ]
```

### Engineering (HING-style)

```
AND [ GSU, OR[R1, AND[S1,S2]], R2, Physics1 ]
```

## Prerequisites

`validatePrerequisites`:

- Enforces listed edges (R2→R1, etc.)
- Rejects mixing **S** and **R** maths tracks on one plan

## Eligibility

`evaluateEligibility(profile, ctx)` returns per-goal status (`complete` | `possible` | `at_risk` | `blocked`), missing/completed labels, warnings, and subject chip kinds (including **unavailable** at selected school).

Never equates formal subject compliance with admission. UI must show both:

- *Formelle fagkrav oppfylt*
- *Opptak avhenger av karakterer*

## Recommendation

`recommendMinimalPlan`:

- Doctor + engineer → fixed advisory plan (1T / R1+Fys1+Kje1 / R2+Kje2), `demanding: true`
- Otherwise unions required subjects into Vg1–Vg3 buckets

## Tests

```bash
npm test
```

Covers AND/OR, prerequisites, S/R mix, doctor+engineer plan, and school-availability warnings.
