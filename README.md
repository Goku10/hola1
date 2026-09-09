# Utdanningssti Norge

Visual education-path planner for the Norwegian system (10. trinn → VGS → higher education / vocational careers). Built for ages 15–20: timelines, chips, and status colours first — short text second.

> **Eksempeldatasett.** This is a guidance demo, not official live data. Always verify requirements for the applicable admission year with [Samordna opptak](https://www.samordnaopptak.no/), [Udir](https://www.udir.no/), [Vilbli](https://www.vilbli.no/), [Utdanning.no](https://utdanning.no/), and the school.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + Radix/shadcn-style UI + Lucide
- Recharts-ready (stats use CSS rings)
- Local seed repository (swap-ready for Supabase)
- Vitest for the rules engine

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # rules engine
npm run build
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/onboarding` | Tap-first profile wizard |
| `/karrierer` | Career explorer + goals |
| `/dashboard` | Personal plan (default demo: lege + ingeniør) |
| `/sammenlign` | Compare up to 3 careers + scenarios |
| `/admin` | Demo data tables (no real auth) |

## Sample scenarios

Load from the dashboard buttons, or via profile `scenarioId`:

1. **doctor-engineer-g10** — 10. trinn, doctor + engineer  
2. **psych-law-vg2** — Vg2, psychology + law  
3. **software-vg1** — Vg1, software  
4. **electrician-he** — vocational electrician with later HE options  

## Data & rules

- Seed files: `src/lib/data/seeds/`
- Repository interface: `src/lib/data/index.ts` (`LocalJsonRepository`)
- Engine: `src/lib/engine/index.ts` (AND/OR requirements, prerequisites, S/R mix ban, recommendations)
- Docs: [docs/dataset.md](docs/dataset.md), [docs/rules-engine.md](docs/rules-engine.md)

Historical **poenggrenser** on institution cards are labelled examples for a sample year — not guarantees and not live Samordna sync.

## Doctor + engineer advisory

- Vg1: **1T**
- Vg2: **R1 + Fysikk 1 + Kjemi 1**
- Vg3: **R2 + Kjemi 2**

Demanding route; confirm timetable/offerings with the school.

## Licence

Private demo project.
