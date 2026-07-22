# TEC.ERP V2 Capstone Architecture

Capstone is a **separate domain** from the 30 regular missions.

## Lifecycle
LOCKED → AVAILABLE → IN_PROGRESS → SUBMITTED → UNDER_REVIEW → REVISION_REQUESTED | APPROVED | REJECTED

## Stages (V2)
1. Prise en charge du mandat
2. Diagnostic transversal
3. Analyse des données et des processus
4. Gestion de la crise intégrée
5. Recommandation exécutive
6. Présentation au professeur
7. Révision et décision finale

## Eligibility
- Run ACTIVE/COMPLETED eligible
- All 30 regular missions of the run curriculum version completed
- Submission + professor review (no auto-approval)
- Gold additionally requires GOLD_M7_M10 + professor issue flag

## Storage
Additive columns: `lifecycleStatus`, `currentStage` on `capstone_submission`.
