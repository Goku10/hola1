# Español MYP4 — Project Memory

## Overview
Interactive Spanish practice dashboard for IB MYP4 Spanish Acquisition students. Single-page app built with vanilla JS + Vite. Supports Phase 1–2 (beginner) and Phase 3–4 (intermediate) levels via in-app toggle.

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS, no framework
- **Bundler:** Vite 5.4
- **Backend:** Supabase (edge functions only, no database tables)
- **TTS:** Cloud-based natural Spanish voice via Supabase edge function (`/functions/v1/tts`), falls back to browser SpeechSynthesis if the network call fails

## Architecture
- `index.html` — entire app (HTML + CSS + JS inline, ~580 lines)
- `supabase/functions/tts/index.ts` — edge function that proxies Google Translate TTS for natural Spanish speech
- `vite.config.js` — dev server on port 5173, SPA mode, relative base path

## Key Features
- **Vocabulary:** Flashcards + multiple-choice quizzes, 6 topics per level
- **Grammar:** Ser vs. estar, present tense -ar verbs, possessive adjectives (Phase 1–2); preterite vs. imperfect, subjunctive, comparatives (Phase 3–4)
- **Listening (Criterion A):** Audio comprehension using cloud TTS (natural voice)
- **Speaking (Criterion C):** Pronunciation practice via browser SpeechRecognition (Chrome/Edge only)
- **Writing (Criterion D):** Writing prompts with self-check
- **Progress:** Session-based skill tracking across all four IB criteria

## Important Notes
- The TTS edge function uses `import.meta.env`-free hardcoded Supabase URL/key because the script tag in index.html is NOT a module. Do not switch to `import.meta.env` without also adding `type="module"` to the script tag.
- Supabase env vars (URL + anon key) are in `.env` and are safe to reference directly in this no-auth app.
- No database tables — all progress is session-based (in-memory only).
- No authentication — single-tenant, no sign-in.
- The `dist/` directory is a build artifact.

## Known Issues
- Speech recognition only works in Chrome/Edge with mic permission.
- Progress resets on page reload (no persistence).

## Build & Deploy
- `npm run build` produces `dist/index.html`
- Deploy via GitHub Pages (Settings → Pages → Deploy from branch → main → / root)
- The edge function is deployed via Supabase MCP tools, not the CLI
