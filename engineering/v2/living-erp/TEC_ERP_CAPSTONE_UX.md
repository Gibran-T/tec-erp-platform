# TEC.ERP Capstone UX

## Surface

`/workspace/apps/capstone` → `CapstonePage` (`living-capstone`).

Capstone is a **separate integrator domain**, not a 31st regular mission.

## Stages S1–S7

Stepper (`capstone-stage-stepper`):

| Code | Label |
|------|-------|
| S1 | Prise en charge du mandat |
| S2 | Diagnostic transversal |
| S3 | Analyse des données et des processus |
| S4 | Gestion de la crise intégrée |
| S5 | Recommandation exécutive |
| S6 | Présentation au professeur |
| S7 | Révision et décision finale |

`currentStage` from API; when locked, no current stage.

## Locked CTA fix (P2-3)

When `lifecycleStatus === "LOCKED"` or missions checklist incomplete:

- Show `capstone-locked-hint` + unmet requirements
- Textareas disabled / read-only
- **Submit button not rendered**
- Show `capstone-submit-unavailable` status instead

Regression: `living-erp-shell.test.tsx` → “hides submit CTA while Capstone is locked”.

## Submission model (learner fields)

Diagnose · Prioritize · Execute · Analyze · Recommend · Executive summary (≥ 40 chars when submitting).

Read-only after APPROVED/REJECTED (or approved/rejected submission status).

## Gold linkage

Panel surfaces gold eligibility next-step hint and reasons; Or issuance remains professor-gated. Link to Certificates app.

## Partial areas

- Stage stepper is lifecycle-aware display; not every S1–S7 transition has a dedicated mini-wizard screen.
- Some status strings still map through local ternary labels in addition to Living `statusLabel`.
