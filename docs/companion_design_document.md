# Contextual Communication Companion — Design Document

Design reset v1.0 · Parent = quiet life planner · Child = stable communication surface · Therapist = professional prescription layer

> Design thesis Reduce the adult’s cognitive load while increasing the child’s agency. The product should feel like a calm family utility, not a therapy dashboard, AI demo, or preschool game.

## 1. Product surfaces

| Surface | User | Job | Character |
| --- | --- | --- | --- |
| Parent Home | Parent / caregiver | See today, start a scene, get modelling help | Quiet planner; warm, sparse, editorial |
| Child Mode | Child | Access useful language now | Predictable, motor-stable, low sensory load |
| Therapist Studio | Speech pathologist / AAC clinician | Set weekly focus and review evidence | Professional, concise, evidence-led |
| Team Share | School / OT / support worker | Know what to model now | One-screen, zero-admin handoff |

## 2. UI taste

- Use whitespace, alignment and type scale before cards, shadows or decorative colour.
- Parent UI: off-white canvas, dark warm text, one restrained accent, subtle separators. Avoid the generic pastel SaaS dashboard look.
- Child UI: visual predictability outranks novelty. No gradients, celebration animations, badges, streaks, scores or gamified success.
- Use icons sparingly in adult UI. Child communication cards use visual + word with consistent geometry.
- iPad landscape is the reference Child Mode; iPad portrait and phone adapt without changing core word order.
- Use humanist system typography (SF Pro / Inter fallback). Avoid oversized bold headings and excessive semi-bold labels.
## 3. Symbols and visual cards

> Initial default: TD Snap / PCS Use a licensed PCS integration consistent with TD Snap as the initial symbol provider, but keep the provider switchable. Tobii Dynavox states PCS is proprietary and commercial software/products generally require licensing.

| Layer | Initial | Rule |
| --- | --- | --- |
| Symbol provider | PCS (licensed) | Provider adapter allows future alternatives |
| Per-card visual | PCS symbol | Family photo or custom image override |
| Per-child setting | Preferred provider | Global switch without changing vocabulary IDs/grid positions |
| Per-word visual | Stable visual | Only deliberate changes; no silent AI rotation |

## 4. Child Mode

- Core vocabulary is persistent and position-stable across scenes. The exact core set is clinician-configurable; prototype words are examples, not a universal prescription.
- Contextual vocabulary changes with the scene and occupies a separate region.
- iPad landscape: fixed core rail left, contextual grid right. Phone: fixed core strip at bottom, same order.
- Tap gives calm pressed feedback and speech output. There is no correctness state.
- Parent exit requires a deliberate hold/lock gesture.
- Preserve refusal, stopping and help access; low frequency is not a reason to hide an agency/safety word.
## 5. Parent Home

- Default view is the day, not analytics: Wake up → Breakfast → School → Play → Dinner.
- Each scene has visual, time and contextual vocabulary preview. Scene visual can be PCS by default or a family photo.
- Primary action is Start with Audrey. Secondary actions: Edit scene and How to model.
- Progress is second-level. The home screen should not feel like another project-management system.
## 6. Modelling Coach

| Situation | Support |
| --- | --- |
| I don’t know how to model HELP | Offer 3–5 natural opportunities in the selected scene with one-step instructions. |
| Audrey doesn’t tap | Model once, wait, accept other clear communication, continue life; do not repeatedly demand a tap. |
| Audrey taps another word | Do not mark wrong automatically; consider whether it is meaningful, then model target if useful. |
| Audrey taps many buttons | Reduce pressure; check scene/visual complexity; record as unclear rather than failure. |
| Audrey walks away / becomes distressed | End the attempt; do not make completion a requirement. |
| She gestures / gazes / pulls a hand | Acknowledge communication; optionally model the corresponding symbol alongside it. |

## 7. Therapist Studio

- Therapist owns the weekly professional focus; parents see it but do not casually overwrite it.
- Therapist sets target concept, rationale, accepted response modalities, wait time, prompt guidance, suggested scenes and review date.
- The product translates the plan into plain-language family instructions and a lightweight school/team view.
- Therapist reviews evidence by scene and communication partner, not raw click totals alone.
## 8. Accessibility and safety

- Touch targets ≥44pt; child cards materially larger.
- Respect Reduce Motion. No auto-moving vocabulary.
- Colour is never the sole carrier of meaning.
- Uploaded child/family photos need explicit privacy controls in production.
- Do not infer diagnosis, intelligence, emotion or intent from a tap alone.
## 9. Licensing reference

Tobii Dynavox describes PCS as its Picture Communication Symbols library integrated into TD Snap and available for licensing. Commercial software/tools using PCS should obtain the appropriate licence. Official references: https://www.tobiidynavox.com/pages/td-snap and https://us.tobiidynavox.com/pages/pcs-picture-communication-symbols
