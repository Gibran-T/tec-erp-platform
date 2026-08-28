# Production ops runbook — Teaching Gate (Wave 8)

**Do not execute** until the owner names a SHA and writes approval. This is the procedure, not a completed deploy.

Cross-links: [PROFESSOR_ACCOUNT_AND_ASSIGNMENT_RUNBOOK.md](../../v1/remediation/PROFESSOR_ACCOUNT_AND_ASSIGNMENT_RUNBOOK.md), [TEC_ERP_V2_MIGRATION_PLAN.md](../curriculum/TEC_ERP_V2_MIGRATION_PLAN.md).

## Hard gates

1. Owner written approval (name, UTC, SHA).  
2. PostgreSQL backup taken and restore path known.  
3. James integrity hash checked **read-only** (expected `83dea106…571da4` unless owner accepts a new baseline).  
4. No James Run 2 creation.  
5. No fabricated professor emails in seed.  
6. Railway: no auto-deploy from merge; manual deploy after migrate success.

## Sequence

1. Freeze non-essential admin writes if practical.  
2. Backup production Postgres.  
3. Deploy **API** image containing this branch’s migrations:
   - existing V2 curriculum migration if still absent on prod
   - `20260820160000_sap_iee2e_self_report`
   - `20260820170000_sap_iee2e_semaine_zero`
   - `20260828200000_course_edition_progress`  
4. Confirm `pnpm migrate:deploy` success in API logs.  
5. SQL check: James Run 1 intact; `runSequence >= 2` still 0 unless owner authorized.  
6. Deploy **Web**.  
7. Smoke:
   - `GET /health` API 200  
   - `/` academic portal dual doors  
   - `/login`  
   - James login read-only (no writes)  
   - Unauthenticated `/playback/v2/portal` still isolated  
8. Create professor (institutional email) via Admin UI/API — [professor runbook](../../v1/remediation/PROFESSOR_ACCOUNT_AND_ASSIGNMENT_RUNBOOK.md).  
9. Create cohort; enroll students (individual accounts).  
10. Record deployment IDs under a new evidence file (do not put secrets).

## Rollback

- Web/API: redeploy previous known-good Railway deployments.  
- Database: restore pre-migrate backup. Do not hand-roll reverse uniqueness DDL.

## After deploy (still not “start class” until smoke + Teaching Gate production boxes)

- Semaine Zéro: every student Hub account  
- Professor opens Teaching Deck **S1** projector (`/workspace/teaching-deck/S1?professor=1`)  
- Session 1 pack: SAP unité 1 + optional M1 cushion (not “M1 = séance 1 as the course”)  
