# Audrey — Contextual Communication Companion

A contextual acquisition and scaffolding layer for nonspeaking and minimally speaking children. It is **not** an AAC replacement — it coexists with TD Snap / LAMP / other systems and turns everyday moments (breakfast, play, school…) into communication opportunities with stable core language, scene vocabulary, adult modelling support, and clinician-guided focus.

**Live app:** https://cathyjingwang69.github.io/nonverbal-visual-planner/

## Surfaces

| Surface | Who | What it does |
| --- | --- | --- |
| **Today** | Parent | The day as a quiet timeline of scenes. Current scene shows fixed core words + 3–6 scene words. One tap starts Child Mode. |
| **Child Mode** | Child | Full-screen. Core words never move (rail on tablet, bottom strip on phone). Tap → calm pressed feedback + speech. No scores, rewards, or correctness states. Parent exits with a deliberate 2-second hold. |
| **Scenes** | Parent | Build and reorder the day. Pick scene words from the library or add new ones. Replace any card visual or scene visual with a family photo. |
| **How to model** | Any adult | 3–5 natural opportunities for the focus word in the current scene, "what if she doesn't tap?" branches, and one-tap evidence logging (independent / modelled / prompted / other modality / unclear / stopped). |
| **Therapist Studio** | Speech pathologist | Versioned weekly focus: target concept, rationale, accepted response modalities, wait time, prompt guidance, target scenes, review date. Families see a plain-language translation. |
| **Progress** | Parent + therapist | Communication evidence, not click counts: classification totals, a scene × partner generalisation matrix, and a 14-day rhythm. Ships with clearly-flagged sample data you can clear. |
| **Team share** | School / OT / support | One screen: the focus, how to model it, today's words, and what *not* to do. Copy as text or as a read-only link. |

## Principles encoded in the product

- The product teaches the adult how to listen, not only the child how to press.
- Communication is not a quiz — Child Mode has no correctness state.
- Stable core language + contextual access; core word positions never change.
- A tap alone is never treated as evidence of intent.
- Agency and safety words (stop, no, help) are never hidden.

## Tech

- React 19 + TypeScript + Vite, installable PWA (offline-first once loaded)
- All data stays on-device in IndexedDB — nothing is uploaded
- Web Speech API for speech output (English `en-AU` and 中文 `zh-CN`; full bilingual UI)
- Provider-neutral vocabulary: visuals resolve through a `SymbolProvider` adapter. The default is a built-in pictogram set; **PCS (Tobii Dynavox) is scaffolded as a switchable provider but requires a licence and is not bundled.**

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
```

Deployment is automatic: every push to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.

## Status

Phase 0 "Audrey prototype" per the architecture document: local/PWA, scenes, switchable visuals, Child Mode, modelling coach, therapist focus prototype. No accounts, sync, or backend yet — those are Phase 1+.
