# Agent Memory — Utdanningssti Norge (EduNor)

Persistent project memory for Cloud Agents and local sessions.  
**Update this file on every remote sync and at the end of every session.**

## Current state

| Field | Value |
|-------|--------|
| Product | Utdanningssti Norge |
| Canonical repo (intended) | `git@github.com:Goku10/EduNor.git` |
| Working remote today | `hola1` branch `cursor/utdanningssti-norge-190d` (PR #6) |
| EduNor push status | **Blocked** — Cursor GitHub App installation only lists `Goku10/hola1` |
| Stack | Next.js App Router, TypeScript, Tailwind, Vitest |
| Default demo | Grade 10 · doctor + engineer |
| Language | NO \| EN segmented header toggle; preference in `localStorage` (`utdanningssti-lang`) |
| Dev server | `npm run dev` → port **3000** on Cloud Agent VM (not user's laptop localhost) |
| Last memory update | 2026-09-10 (session sync) |
| Latest commit | `c7b4b70` — agent memory sync 2026-09-10 |

## Sync log

| When (UTC) | Action | Remote | Result |
|------------|--------|--------|--------|
| 2026-09-09 | Initial app commit + PR | `hola1` `cursor/utdanningssti-norge-190d` | OK — PR #6 |
| 2026-09-09 | First push attempt to EduNor `main` | `edunor` | 403 `cursor[bot]` denied |
| 2026-09-09 | Retry after user said access granted | `edunor` | Still 403 — installation repos = only `hola1` |
| 2026-09-09 | Added memory module | `hola1` | OK |
| 2026-09-09 | Full NB/EN language toggle across UI | `hola1` | OK |
| 2026-09-10 | Session memory refresh + push | `hola1` | OK — `c7b4b70` |
| 2026-09-10 | EduNor push retry | `edunor` | Still 403 — App repos = only `hola1` |

## How to unblock EduNor

1. GitHub → **Settings** → **Applications** → **Installed GitHub Apps** → **Cursor** → **Configure**
2. Under **Repository access**, add **`Goku10/EduNor`** (or choose **All repositories**)
3. Save, then ask the agent to sync again

Verify with: `gh api /installation/repositories --jq '.repositories[].full_name'` — must include `Goku10/EduNor`.

## Remotes (this workspace)

- `origin` → `https://github.com/goku10/hola1.git`
- `edunor` → `https://github.com/Goku10/EduNor.git`

When EduNor works: `git push -u edunor HEAD:main` (or current feature branch), then append a sync-log row here.

## Product memory (stable facts)

- Visual-first UI for ages 15–20; Norwegian Bokmål default + full EN toggle (persisted)
- Header **NO \| EN** control wires `src/lib/i18n/index.tsx` through landing, onboarding, careers, dashboard, compare, admin, chips
- Rules engine: AND/OR requirements, S/R maths ban, prerequisites, school offerings
- Doctor+engineer plan: Vg1 **1T** · Vg2 **R1 + Fysikk 1 + Kjemi 1** · Vg3 **R2 + Kjemi 2**
- Historical poenggrenser are **example** data — never claim live Samordna
- Pages: `/`, `/onboarding`, `/karrierer`, `/dashboard`, `/sammenlign`, `/admin`
- Seeds: `src/lib/data/seeds/` · Engine: `src/lib/engine/` · Tests: `tests/engine/`
- Docs: `README.md`, `docs/dataset.md`, `docs/rules-engine.md`
- Agent memory: `MEMORY.md` · helper `scripts/sync-memory.sh`

## Preview / networking note

- App listens on the **Cloud Agent VM**. User laptop `localhost:3000` → `ERR_CONNECTION_REFUSED` unless Cursor **port forward 3000** is used, or the remote/Simple Browser is used.

## Session checklist (agents)

1. Make code changes and commit  
2. Push to available remotes (`origin` and/or `edunor`)  
3. **Update this file**: sync log row + “Current state” table  
4. Commit memory update (`chore: update agent memory`) and push  
5. End of session: refresh “Last memory update” and any open blockers  

## Open blockers

- [ ] Grant Cursor GitHub App write access to `Goku10/EduNor`
- [ ] Push full tree to `EduNor` `main`
- [ ] Prefer `edunor` as canonical remote for future sessions once unblocked
