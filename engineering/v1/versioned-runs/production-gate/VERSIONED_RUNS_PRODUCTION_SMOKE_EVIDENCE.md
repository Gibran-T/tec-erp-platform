# Versioned Runs — Production Smoke Evidence

## API smoke (James)

- Login OK — role JR_BUSINESS_ANALYST · `TECERP-2026-PILOT-001`
- `GET /me/pedagogical-course-runs` → 1 run `TECERP-PILOT-001-RUN1` COMPLETED · writable=false · reflectionsEnabled=false
- Reflection POST → **409** (historical / not writable)
- Admin unique-students as student → **403**
- Course overview → 10 modules · 100%
- No new James attempt submitted

## Web smoke

- Workspace loads James Timothy identity
- Run banner FR: `TECERP-PILOT-001-RUN1 — Terminé (historique)`
- Navigation: Accueil, Centre de mission, Évaluations, Coach IA, Capstone, Certificats available
- No professor/admin account in production — role denial validated via API 403

## QA lifecycle (`__QA_VR_PROD_`)

Isolated company/student/professor/admin; Run1+Run2; reflection; intervention; pause/resume; official count=1; cleanup.

Result: `qa_residue=0` — see `evidence/smoke/qa-lifecycle.json`

## Certificates / Capstone / AI

Unchanged post-migrate: silver issued, gold revoked+issued, Capstone submitted/approved, AI=1 linked to Run 1.
