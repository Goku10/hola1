# Español MYP4 — Project Memory

## Overview
Interactive Spanish practice dashboard for IB MYP4 Spanish Acquisition students. Single-page app built with vanilla JS + Vite. Supports Phase 1–2 (beginner) and Phase 3–4 (intermediate) levels via an in-app toggle. Progress persists in `localStorage` on the current device.

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS, no framework
- **Bundler:** Vite 5.4
- **Backend:** Supabase (edge functions only, no database tables)
- **TTS:** Cloud-based natural Spanish voice via Supabase edge function (`/functions/v1/tts`), falls back to browser SpeechSynthesis if the network call fails

## Architecture
- `index.html` — layout + CSS; loads `src/app.js` as an ES module
- `src/data.js` — vocab, grammar, listening, reading, speaking, writing banks
- `src/storage.js` — `localStorage` key `espanol-myp4-v1`
- `src/srs.js` — Leitner boxes and due-date scheduling
- `src/app.js` — UI wiring
- `supabase/functions/tts/index.ts` — edge function that proxies Google Translate TTS
- `vite.config.js` — dev server on port 5173, SPA mode, relative base path

## Key Features
- **Review:** Due vocab/grammar cards (Leitner) plus a few new items
- **Vocabulary:** Flashcards + quizzes, 6 topics × ~20 words per level
- **Grammar:** Ser vs. estar, present tense -ar verbs, possessive adjectives (Phase 1–2); preterite vs. imperfect, subjunctive, comparatives (Phase 3–4). Sets finish instead of looping; misses return in Review
- **Listening (Criterion A):** Cloud TTS, scored questions, transcript after submit
- **Reading (Criterion B):** Short texts + visual caption + comprehension questions + saved personal response
- **Speaking (Criterion C):** Echo (word-overlap practice) and open Respond prompts
- **Writing (Criterion D):** Autosaved drafts, prompt-specific checklists, model answers
- **Progress:** Real streak, due/learned counts, week-vs-week accuracy. Bars are practice evidence, not IB grades

## Important Notes
- The app script is `type="module"`. TTS still uses a hardcoded Supabase URL/anon key in `src/app.js` (same no-auth pattern as before).
- Supabase env vars (URL + anon key) are in `.env` and are safe to reference directly in this no-auth app.
- No database tables — progress is device-local (`localStorage` only).
- No authentication — single-tenant, no sign-in.
- Switching Phase 1–2 / 3–4 does not wipe the other phase’s records.
- The `dist/` directory is a build artifact.

## Known Issues
- Speech recognition only works in Chrome/Edge with mic permission.
- Progress does not sync across devices.

## Build & Deploy
- `npm run dev` for local development (do not open `index.html` as a file)
- `npm run build` produces `dist/`
- Deploy via GitHub Pages (Settings → Pages → Deploy from branch → main → / root)
- The edge function is deployed via Supabase MCP tools, not the CLI
