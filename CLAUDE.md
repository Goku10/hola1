# Español MYP4 — Project Memory

## Overview
Interactive Spanish practice dashboard for an IB MYP4 Language Acquisition student. Vanilla JS + Vite SPA. Phase 1–2 (beginner) and Phase 3–4 (intermediate) via an in-app toggle.

Purpose: daily home practice that **compounds over time** on one device. It is a practice companion, not a gradebook and not a predicted IB 1–8 score.

GitHub: `Goku10/hola1` (Pages typically from `main`). Live users only open the published URL — they do **not** install Node or this repo on each computer.

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS, no framework
- **Bundler:** Vite 5.4 (`base: './'`, port 5173)
- **Backend:** Supabase **edge functions only** (TTS). No database tables, no Auth
- **TTS:** `POST /functions/v1/tts` (Google Translate TTS proxy), falls back to `speechSynthesis`

## Architecture
- `index.html` — layout + CSS; `<script type="module" src="./src/app.js">`
- `src/data.js` — content banks (vocab, grammar, listening, reading, speaking, writing)
- `src/storage.js` — persist/load `localStorage` key `espanol-myp4-v1`
- `src/srs.js` — Leitner boxes and due dates
- `src/app.js` — UI, TTS, speech recognition, daily plan
- `supabase/functions/tts/index.ts` — TTS proxy (CORS `*`)
- `dist/` — build output for GitHub Pages (commit when publishing from `main`)

Do **not** open `index.html` as a file. Use `npm run dev` or the hosted `dist/`.

## Persistence (device-local)
No login. Progress is **per browser, per device, per origin** (the published domain).

Saved: profile (name, phase `12`/`34`, theme), streak dates, vocab/grammar card records, listening/reading scores, speaking counts, writing drafts + checklists, grammar production sentences, last section (resume), today’s plan flags, activity log (capped at 500).

- Refresh / close tab: progress kept on that browser
- Phone vs laptop, or Chrome vs Safari: **separate** records
- Switching Phase 1–2 ↔ 3–4 does **not** wipe the other phase
- Clearing site data wipes progress
- Streak: a day counts only after real practice (review, quiz, listen, speak, or write), not on page open

Leitner: box 1 = same day, 2 = 1 day, 3 = 3 days, 4 = 7 days, 5 = 14 days. Wrong → box 1. First “I know this” promotes to box 2 (review tomorrow). “Mastered” KPI = box 3+.

## Features
- **Review:** due vocab/grammar first, then a few new items
- **Vocabulary:** 6 topics × 20 words × 2 phases (120/phase). Flashcards + quiz feed SRS
- **Grammar:** Phase 1–2 ser/estar, present -ar, possessives; Phase 3–4 pretérito/imperfecto, subjunctive, comparatives. ~14 items/topic, sets of 10 finish (no infinite wrap). Production textarea per topic
- **Listening (A):** 10 clips/phase, 2 scored questions each, transcript after all answers, cloud TTS
- **Reading (B):** 6 texts/phase + visual caption, MCQs, saved personal response
- **Speaking (C):** Echo (word-overlap %, labeled not an IB grade) + Respond (open prompts, self-check). Chrome/Edge + mic
- **Writing (D):** 8 prompts/phase, autosave, prompt-specific checklist, model answer, word goals 60 (Phase 1–2) / 120 (Phase 3–4)
- **Progress:** due today, learned this week, week vs last week accuracy, resume. Bars = practice evidence, **not** IB grades

Today’s plan auto-checks: 5 listening answers; 15 reviews or a reading submit; 3 recordings; writing word goal.

## Publishing
1. `npm run build` → `dist/`
2. GitHub Pages: Settings → Pages → deploy from **`main`** (root or `/docs` as configured)
3. Custom domain: point at Pages; relative `base: './'` works
4. End users: bookmark the URL. No `npm install` on student machines
5. Prefer one browser (Chrome/Edge) on her main device so SRS and streak stay in one place

TTS still calls the existing Supabase function from the hosted page (anon key in `src/app.js`).

## Important Notes
- TTS URL/anon key are **hardcoded** in `src/app.js` (script is a module; do not switch to `import.meta.env` unless the key is wired in Vite and rebuilt). `.env` exists for local reference; the running app does not read it at runtime in the browser bundle unless you add that.
- No database, no multi-device sync, no AI marking of writing/speaking.
- Do not present skill bars or echo % as Criterion 1–8.

## Known Issues
- Speech recognition: Chrome/Edge + microphone permission only
- Progress does not sync across devices
- Opening the raw HTML file will not load ES modules correctly

## Build
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```
TTS edge function: Supabase MCP (not CLI).

## Out of scope (later)
Supabase tables / cross-device sync, AI feedback, teacher comments, true pronunciation scoring.
