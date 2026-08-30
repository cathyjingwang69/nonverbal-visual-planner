# Contextual Communication Companion — Architecture Document

Reference architecture v1.0 · responsive PWA first · iPad-first Child Mode · provider-agnostic symbols

> Architecture goal Ship a small, reliable family product first while preserving boundaries for clinician collaboration, symbol licensing, privacy and later AI/multimodal features.

## 1. System context

| Actor / system | Responsibilities |
| --- | --- |
| Child | Uses Child Mode to communicate in current scene |
| Parent / caregiver | Creates day/scenes, starts Child Mode, receives modelling support, optionally logs context |
| Speech therapist | Sets weekly focus and clinical parameters; reviews evidence |
| School / other therapists | Consume lightweight shared plan; optionally log observations |
| Symbol Provider Adapter | Resolves vocabulary concept to licensed symbol; PCS initially, alternatives later |
| Speech Engine | On-device/browser speech synthesis initially; pluggable TTS later |

## 2. Recommended stack

| Layer | MVP | Later |
| --- | --- | --- |
| Client | React / Next.js PWA, TypeScript | Native wrapper only if device integration requires it |
| Local state | IndexedDB/local cache | Offline-first sync/conflict resolution |
| Backend | Supabase/Postgres or equivalent | Region-aware deployment + event warehouse |
| Auth | Parent passkey/magic link; therapist account | Clinic/school SSO |
| Storage | Private object storage for custom images | Retention policies and image processing |
| Speech | Web Speech / OS TTS | Offline voice packs / premium voices |
| AI | Server-side coaching over structured context | Personalised ranking under clinician constraints |

## 3. Domain model

| Entity | Key fields |
| --- | --- |
| ChildProfile | id, display_name, language, access_preferences, symbol_provider, core_layout_version |
| VocabularyConcept | concept_id, canonical meaning, multilingual labels, safety/agency flags |
| VisualAsset | concept_id, provider, provider_asset_id, custom_image_id, licence metadata |
| Scene | scene_id, name, visual, schedule slot, contextual_concept_ids |
| DayPlan | date/template, ordered scene_ids, transitions |
| TherapyFocus | concept_ids, therapist_id, dates, accepted modalities, wait_time, prompt rules, target scenes |
| CommunicationEvent | timestamp, scene, concept, modality, classification, partner, latency, notes |
| ModelingSuggestion | scene, concept, scenario, instruction steps, constraints, version |
| TeamShare | child, focus, selected scenes, expiry, permissions |

## 4. Symbol abstraction

> Do not couple vocabulary to PCS asset IDs Store vocabulary as provider-neutral concept IDs. Resolve visuals through a SymbolProvider interface. PCS/TD Snap-compatible assets are an initial licensed provider, not the product data model.

| Interface | Purpose |
| --- | --- |
| getSymbol(conceptId, locale, style) | Return licensed provider asset metadata/URL |
| listAlternatives(conceptId) | Return provider variants or custom photo |
| setChildProvider(providerId) | Switch provider while keeping vocabulary/grid stable |
| setWordOverride(conceptId, assetId) | Apply per-word visual override |

## 5. Measure communication, not clicks

- Retain raw taps as low-level telemetry but never use them alone as success.
- Communication events distinguish opportunity, independent response, modelled response, prompted response, alternative modality, unclear/random interaction and refusal/exit.
- Capture scene, partner and latency where practical without requiring exhaustive parent logging.
- Generalisation is computed across scenes and partners only after minimum evidence thresholds.
## 6. Therapist workflow

- Therapist writes a versioned TherapyFocus object; parent receives a read-only translated plan.
- Parent owns family consent and sharing; therapist edits assigned clinical focus; school/team receives only explicitly shared fields.
- Parent can propose scenes and ask questions, but therapist-authored clinical settings remain visibly distinct.
## 7. Modelling Coach pipeline

| Stage | Implementation |
| --- | --- |
| Retrieve | Current scene + focus + child preferences + recent evidence + clinician constraints |
| Select/generate | Vetted modelling templates first; LLM personalises wording/scenario within constraints |
| Guardrails | No forced compliance, withholding essentials, diagnosis, or claim that a tap proves intent |
| Feedback | Adult selects what happened; save structured evidence |
| Learn | Rank practical suggestions while keeping clinician plan authoritative |

## 8. Offline/device behaviour

- Child Mode must work offline once scenes, symbols and speech assets are cached.
- iPad PWA supports Add to Home Screen and full-screen display; layouts adapt to orientation.
- Queue events locally and sync later.
- Never block communication because analytics or AI services are unavailable.
## 9. Privacy and licensing

- Treat child communication history and photos as sensitive data; encrypt in transit/at rest and use private storage.
- Consent and sharing are explicit, revocable and time-bounded.
- Separate family content from de-identified product analytics.
- Obtain legal review before commercial clinical/health/NDIS claims.
- Obtain the appropriate Tobii Dynavox PCS licence before commercial distribution of PCS assets.
## 10. Delivery phases

| Phase | Scope | Exit criterion |
| --- | --- | --- |
| 0 — Audrey prototype | Local/PWA, scenes, switchable visuals, Child Mode, modelling coach, therapist focus prototype | Natural use at home for 2–4 weeks |
| 1 — Family pilot | Auth, sync, parent accounts, event model, 5–10 families | Use without founder handholding |
| 2 — Therapist pilot | Therapist Studio, focus versioning, team share | Clinicians can set/review without extra admin burden |
| 3 — Evidence pilot | Longitudinal measures, scene/partner generalisation | Useful evidence beyond raw taps |
| 4 — Productisation | Licensing, privacy hardening, support, billing | Ready for controlled market release |
