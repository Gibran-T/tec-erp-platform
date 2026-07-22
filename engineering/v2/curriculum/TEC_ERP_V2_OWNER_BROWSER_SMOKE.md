# TEC.ERP V2 — Owner Browser Smoke Evidence

**Date:** 2026-07-22  
**Branch:** `feature/curriculum-m1-m10-capstone-foundation`  
**PR:** #28  
**Worktree:** `C:\Projetos\tec-erp-wt-curriculum-v2`  
**Verdict target:** owner review readiness (no merge / no production deploy)

## Environment

| Item | Value |
|------|--------|
| Isolated DB | `postgresql://tec:***@127.0.0.1:5435/tec_erp_v2_owner_smoke` |
| Migrations | All 10 applied including `20260725120000_v2_curriculum_version` |
| API | `http://127.0.0.1:3000` |
| Web | `http://localhost:5173` |
| QA prefix | `__QA_V2_OWNER_SMOKE_` |
| Production writes | **None** |

## Fixture design

Scripts (local only):

- `apps/api/scripts/v2-owner-browser-smoke-seed.mjs` — companies A/B, admin, professors A/B, V1/V2 learners, cohorts, pre-pinned runs
- `apps/api/scripts/v2-owner-browser-smoke-prepare-v1.mjs` — API path: first day + 30 V1 missions + Capstone submit
- `apps/api/scripts/v2-owner-browser-smoke-collect.mjs` — structured API smoke + HCM wrong/recovery
- `apps/api/scripts/james-owner-smoke-compare.mjs` — production read-only James integrity

**Fixture-only note:** V1 run `curriculumVersion=V1` is forced at seed time because `createRun` / login bootstrap assign `CURRENT=V2`.

### Accounts (disposable local passwords — not production)

| Role | Employee number |
|------|-----------------|
| Admin | `__QA_V2_OWNER_SMOKE_ADMIN` |
| Professor A | `__QA_V2_OWNER_SMOKE_PROF_A` |
| Professor B (company B) | `__QA_V2_OWNER_SMOKE_PROF_B` |
| V1 learner | `__QA_V2_OWNER_SMOKE_STU_V1` |
| V2 learner | `__QA_V2_OWNER_SMOKE_STU_V2` |

### V1 fixture

- `curriculumVersion = V1`, Run 1 ACTIVE
- 30/30 historical missions completed via supported API submit path
- Historical M8 Governance / M9 BI / M10 Capstone-module keys preserved
- Capstone submitted → `UNDER_REVIEW` / stage S6
- No HCM keys completed; no Run 2

### V2 fixture

- `curriculumVersion = V2`, Run 1 ACTIVE, reflections enabled
- Initial 0/30 then first mission + unlock path for HCM smoke
- M8 = HCM keys; M9 = governance keys with M9 display codes; M10 = BI/KPI/AI keys with M10 display codes
- Capstone separate domain, initially LOCKED

## Browser evidence (screenshots)

Saved under `engineering/v2/curriculum/evidence/owner-browser-smoke/`:

| File | Coverage |
|------|----------|
| `01-v1-workspace.png` | V1 dashboard / run 100% |
| `02-v1-mission-center.png` | Curriculum V1 (historique), 30/30, historical modules |
| `03-v1-capstone.png` | Capstone En revue · S6 |
| `04-v2-workspace.png` | V2 workspace login |
| `05-v2-mission-center.png` | Curriculum V2 label, 10 modules, HCM/Governance/BI titles |
| `06-v2-capstone-locked.png` | Capstone Verrouillé before 30/30 |

Structured JSON:

- `api-dom-evidence.json`
- `api-curriculum-analytics.json`
- `v2-course-structure.json`
- `professor-admin-isolation.json`

## Key validations

### V1

- Login + workspace OK
- Label: **Curriculum V1 (historique)**
- Progress **100 % (30/30)**
- M8 = Gouvernance; M9 = BI; M10 = Capstone module (historical)
- No HCM completion inferred
- Capstone resolvable separately (En revue)
- Unchanged after V2 progression

### V2

- Label: **Curriculum V2 (M1–M10, HCM, Capstone séparé)**
- Exactly **10 modules × 3 = 30** regular missions
- M8 = Ressources humaines et HCM
- M9 = Gouvernance, accès et conformité
- M10 = BI, KPI, IA et conseil
- Capstone **Verrouillé** with French lifecycle; stages S1–S7 available in API
- First mission M1-M01 completed (score 100%, attempt 1) → progress then unlock path for HCM
- HCM wrong action rejected (30%, feedback on cost-center / manager / assignments)
- HCM recovery success (100%)
- Gold not issued; Capstone remains locked with incomplete regulars

### Professor / Admin / Analytics

- Professor A sees both V1 and V2 learners with distinct `curriculumVersion` labels
- Professor B (company B): empty students/runs — no Company A leak
- Admin official unique student count = **2** (`OFFICIAL_COHORT_RESULT`)
- Capstone excluded from regular 30

## Defects found

| ID | Sev | Finding | Disposition |
|----|-----|---------|-------------|
| OBS-1 | P2 | Login validation string sometimes English (“A valid email…”) | Deferred (translation wave) |
| OBS-2 | P2 | Professor route `.../metrics/unique-students` 404; Admin route works | Deferred (wire professor alias or UI use admin path) |
| OBS-3 | P2 | Capstone submit button remains visible while LOCKED (hint explains lock) | Deferred UX polish |
| OBS-4 | — | Collector initially probed wrong `/current` path | Test harness only — not product defect |

**No P0/P1 product defects requiring code fix in this smoke.**

## Fixes applied

- Smoke seed cleanup extended for `business_document` / related company residue (fixture hygiene)
- Read-only James compare script uses JS sort for mission keys (hash parity with historical snapshot)

## Gates

| Gate | Result |
|------|--------|
| mission-catalog | 8/8 PASS |
| API full | 181/181 PASS |
| Web full | 83/83 PASS |
| API/Web typecheck | PASS |
| API/Web lint | PASS |
| API/Web build | PASS |
| env:check | PASS |
| git diff --check | PASS |
| Secret scan | PASS (false positives: `passwordHash` field / disposable QA password constants) |

## QA cleanup

- Local prefix residue after `--cleanup`: **0**
- Production QA residue: **0**

## Production read-only integrity

| Check | Result |
|-------|--------|
| API/Web health | 200 |
| James integrity hash | `83dea106…571da4` **MATCH** |
| James completed | 30/30 · 100% |
| James Run 2 | 0 |
| Professors | 0 |
| V2 migration on prod | **absent** |
| Writes | none |
