# TEC.ERP V1 Wave 2 Checkpoint — M2–M6 + Professor + Silver

**Date:** 2026-07-21  
**Branch:** `integration/v1-wave2-m2-m6-silver`  
**Baseline:** `main` @ `fc704833e80c278b9c1624a0a9d0d1c3112cf55a` (PR #16 merged)  
**Deadline:** Friday, 2026-07-24  

## Baseline

| Check | Result |
|-------|--------|
| Local main = origin/main at start | PASS (`fc70483`) |
| Working tree product source at start | Clean except `official_documents/site/` |
| Integration line created from exact SHA | PASS |
| `official_documents/site/` untouched | PASS (still untracked only) |

## Branch / worktree ownership

See `engineering/v1/V1_WAVE2_OWNERSHIP_MAP.md`.

| Branch | Role |
|--------|------|
| `integration/v1-wave2-m2-m6-silver` | Sheriff integration (all Wave 2 product delivered here) |
| `feature/v1-m2-master-data` | Worktree lineage @ baseline |
| `feature/v1-m3-m4-transactions` | Worktree lineage @ baseline |
| `feature/v1-m5-m6-inventory-finance` | Worktree lineage @ baseline |
| `feature/v1-professor-assessment-silver` | Worktree lineage @ baseline |
| `feature/v1-student-wave2-runtime` | Worktree lineage @ baseline |
| `qa/v1-wave2` | Worktree lineage @ baseline |

## Migration inventory

| Migration | Purpose |
|-----------|---------|
| `20260722140000_v1_wave2_simulation_professor_silver` | Additive Wave 2 schema + M2–M6 mission seed + Silver/Integrated assessments |

Models added (company/employee scoped where applicable):

- Cohort / CohortMembership  
- MasterDataRecord / MasterDataAudit  
- BusinessDocument / DocumentLine / ApprovalDecision  
- InventoryMovement / FinancialPosting / OpenItem  
- TransactionEvent / AuditEvent / SimulationSnapshot  
- AssessmentDefinition / AssessmentQuestion / AssessmentAttempt  
- Certificate / CertificateAudit  
- EmployeeRole `PROFESSOR`

**Note:** Initial migration SQL contained a UTF-8 BOM; stripped before deploy. Empty-DB deploy Wave1→Wave2 verified on isolated Postgres `:5435` / `tec_erp_wave2`.

## Mission matrix M2–M6 (15)

| Module | Mission keys |
|--------|----------------|
| M2 | `m2-m01-structurer-organisation`, `m2-m02-creer-donnees-reference`, `m2-m03-corriger-qualite-donnees` |
| M3 | `m3-m01-identifier-besoin-achat`, `m3-m02-creer-traiter-commande-achat`, `m3-m03-receptionner-analyser-fournisseur` |
| M4 | `m4-m01-saisir-commande-institutionnelle`, `m4-m02-allocation-inter-entrepots`, `m4-m03-confirmer-livraison-cloture` |
| M5 | `m5-m01-analyser-stock-reappro`, `m5-m02-decision-transfert-inter-dc`, `m5-m03-presentation-sop` |
| M6 | `m6-m01-reception-facture`, `m6-m02-exception-rapprochement-trois-voies`, `m6-m03-expliquer-ecart-finance` |

Catalog total with M1: **18 missions / 6 modules**. Unlock chain M1→M6 via `COURSE_MISSION_SEQUENCE` + module_ready unlocks.

## Transaction model

Shared posting kernel: `apps/api/src/modules/simulation/engine/posting-service.ts`

- Idempotent documents / inventory movements / financial postings (`postingKey`)  
- Deterministic transaction event sequence  
- Immutable audit append  
- Cross-module consequences on mission complete (`consequences.ts`): M3 GR→stock in; M4 delivery→stock out + AR/revenue; M6 match→AP/inventory  

Master data API: `/api/v1/me/master-data` (list / upsert / validate) with quality scoring, duplicates, blocked/inactive rules.

## Professor portal

- Routes: `/api/v1/professor/*` gated by `requireProfessor`  
- Cohort list, student list + progress + Silver status  
- Override actions: release, reset, validate completion, override score, review analytical  
- CSV export  
- Web: `Portail professeur` app (role-gated UI)

## Assessment engine

- Definitions seeded: `SILVER_M1_M2`, `INTEGRATED_M3_M6`  
- Start / submit with shuffled options; server-side scoring; 70% / 2 attempts  
- No client answer key in product API responses  
- Student routes: `/api/v1/me/assessments`

## Silver certification

- Eligibility: M1+M2 complete + Silver assessment passed  
- Persisted certificate + unique number + competency summary + audit  
- List + printable view in Assessment Center  
- Revocation API path in service (`revokeCertificate`) for professor/ops follow-on

## Test totals

| Suite | Result |
|-------|--------|
| `@tec-platform/mission-catalog` | 2 passed |
| `erp-api` | **132 passed** / 25 files (with `DATABASE_URL` → `:5435/tec_erp_wave2`) |
| `erp-web` | **72 passed** / 10 files |
| API build / web typecheck | PASS |

## Smoke evidence

Isolated DB: `postgresql://tec:tec@127.0.0.1:5435/tec_erp_wave2`

Scripts:

- `apps/api/scripts/wave2-smoke-seed.mjs`  
- `apps/api/scripts/wave2-runtime-smoke.mjs` (`pnpm smoke:wave2`)

Executed smoke (prior validation in this wave): **50/50 PASS** covering Student A M1–M6 + Silver + simulation postings, Student B blocks/isolation, professor release/reset/CSV, optional cleanup.

Critical fix during smoke: `mission.repository` `findAttempt` now resolves all modules by `missionDefinition.missionKey` (M2–M6 were 409 before).

## QA cleanup

- Seed supports `--cleanup`  
- Smoke supports `--cleanup`  
- Target: QA residue = 0 after cleanup run

## Known blockers

1. Feature worktrees remain at baseline; delivery consolidated on integration (ownership map updated).  
2. Assessment Center UI demo path still selects first shuffled options (smoke uses catalog-correct answers via script).  
3. Professor UX is minimum-complete (list/actions/CSV), not a full analytics console.  
4. Deep transactional screens beyond mission interactions + master-data API remain thin (engine + consequences are server-authoritative).  
5. M4–M6 mission pedagogy is thinner than M2/M3 canon depth in docs/02–03.  
6. Certificate revocation not yet exposed as a professor UI button (service exists).  

## Final verdict

**V1 WAVE 2 PARTIAL — BLOCKERS REMAIN**

Core M2–M6 missions, unlock chain, simulation posting, professor/assessment/Silver paths, tests, and runtime smoke are working and persisted. Remaining blockers are UX depth, parallel worktree sync, and assessment UI answer fidelity — not missing module shells.
