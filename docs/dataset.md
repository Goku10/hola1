# Demo dataset

All content under `src/lib/data/seeds/` is an **example dataset** for UI and engine demos. It is **not** an official feed from Samordna opptak or Udir.

## Files

| File | Contents |
|------|----------|
| `subjects.ts` | Fellesfag / programfag / realfag codes |
| `prerequisites.ts` | R2←R1, S2←S1, Kjemi2←1, Fysikk2←1, S/R policy |
| `admissionCodes.ts` | MEROD, HING, VETE, REALFA/NATTEK/MATTEK-style, GSU-only, vocational flags |
| `careers.ts` | 14 careers with icons, competitiveness, institution links |
| `meta.ts` | Counties, VGS schools/offerings, HE institutions, cutoffs, sources, pathways, rule versions |

## Cutoffs

`cutoffs` entries always set `isHistoricalExample: true`. UI shows **Historisk eksempel**. Replace with API/DB later via `DataRepository.getCutoffs()`.

## School offerings

`berg-vgs` intentionally omits R2 and Kjemi 2 so the engine can flag *«Mulig fagkombinasjon må bekreftes med skolen.»*

## Rule version

`rv-2025-demo` — last reviewed `2025-08-01`. Surface this date in admin and when citing requirements.

## Supabase later

Implement the same `DataRepository` methods against Postgres tables mirroring these types (`Career`, `AdmissionCode`, `Subject`, `AdmissionCutoff`, …).
