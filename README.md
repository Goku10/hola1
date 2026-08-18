# Español MYP4 — Spanish Practice Dashboard

Supports both **Phase 1–2 (beginner)** and **Phase 3–4 (intermediate)** content via an in-app level toggle.

A home practice dashboard for an IB MYP4 Spanish Acquisition student, covering all four IB criteria. Progress is saved **on this device** (`localStorage`) so practice can continue the next day.

- **Review** — Leitner spaced repetition for vocabulary and grammar
- **Vocabulary** — flashcards + quizzes, 6 topics × ~20 words per phase
- **Grammar** — ser vs. estar, present -ar verbs, possessives (Phase 1–2); preterite vs. imperfect, subjunctive, comparatives (Phase 3–4)
- **Listening** (Criterion A) — audio comprehension via cloud TTS, scored questions, transcript after submit
- **Reading** (Criterion B) — short Spanish texts with main-idea / detail / purpose questions
- **Speaking** (Criterion C) — echo pronunciation + open response prompts
- **Writing** (Criterion D) — prompts with saved drafts, prompt-specific checklists, and model answers
- **Progress** — due cards, weekly accuracy, real streak (practice evidence, not an IB grade)

## Usage

```bash
npm install
npm run dev
```

Then open the local Vite URL (port 5173). For GitHub Pages, run `npm run build` and deploy the `dist/` folder.

Do not open `index.html` as a file — the app is an ES module bundle.

## Notes

- Speech recognition requires Chrome or Edge with microphone permission.
- Progress stays on the browser that was used (no account, no cloud sync).
- Skill bars are practice activity, not predicted IB 1–8 scores.
