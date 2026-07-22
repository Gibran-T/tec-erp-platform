# TEC.ERP — Zero1 Pre-Cohort Remediation Report

**Branch:** `remediation/zero1-precohort`  
**Base:** `main` @ `63897327ce6a5c1ad7dee4acc8e7960ac7245b29`  
**Evidence (read-only):** PR #21 / `bb52d702a81ab48851ba7976b8fe6434227a3211`  
**Rule:** No James mutation · no merge · no deploy in this wave

---

## Findings disposition

| ID | Severity | Status | Summary of fix |
|----|----------|--------|----------------|
| Z1-001 | P2 | Implemented | Role-gated workspace apps; student no longer sees professor/admin as Accès actif |
| Z1-002 | P2 | Implemented | Removed duplicate Wave-1 placeholder M2 from course overview |
| Z1-003/010 | P1/P2 | Implemented | Admin create professor, create cohort, assign/remove professor + audit + Admin UI + runbook |
| Z1-004 | P2 | Implemented | Contextual deterministic AI Coach fallback (module/category/depth) |
| Z1-005 | P3↑ | Implemented | Display-string accents in catalog + UI pages; terminology map |
| Z1-006 | P2 process | Plan only | `ZERO1_FULL_UI_REVALIDATION_PLAN.md` — execute after merge/deploy |
| Z1-007 | P3↑ | Implemented | Certificates refetch on focus/visibility + refresh; revoked banner; Gold eligibility panel |
| Z1-008 | P2 | Implemented | Criteria + gapExplanation + retryGuidance in submit score + Mission Center UI |
| Z1-009 | P3↑ | Implemented | Professor roster/detail/CSV always M1–M10 + Capstone |
| Z1-012 | P2 | Implemented | Capstone/Gold discovery panels; professor Capstone queue; Admin visibility |

---

## Deferred

| ID | Reason |
|----|--------|
| Z1-006 execution | Must not rerun James during remediation; plan documented for post-deploy |
| Live Thiago Gibran identity | Owner ops only — no fabricated email in code/seed |
| Remaining P3/P4 copy polish in long briefings | Does not block learning/security/scoring for first cohort |
| External LLM provider | Out of scope; deterministic coach remains non-authoritative |

---

## Tests added / targeted

- `course-overview-uniqueness.test.ts` — 10 unique modules / 30 missions
- `appRegistry.rbac.test.tsx` — student/professor/admin nav
- `admin.professor-assignment.test.ts` — create/assign/remove + audit
- `ai-coach.depth.test.ts` — context, refuse, deterministic, sanitize
- `scoring-transparency.test.ts` — 100 / partial gap+retry
- Full API: **40 files / 164 tests passed**
- Full Web: **14 files / 82 tests passed**
- Catalog: **4 tests passed**
- Lint / typecheck / build / env:check: **passed** (1 pre-existing react-hooks warning)
- Migrations: empty DB deploy of 7 migrations on local `tec_erp_test` **passed**
- Local smoke (`apps/api/scripts/zero1-remediation-smoke.ts`): **ok, qaResidue=0**

## Smoke / James

- Local isolated DB smoke: professor create/assign/isolation/reassign/audit + catalog + scoring + AI + cleanup residue 0
- Production James (read-only, post-implementation): TECERP-2026-PILOT-001 intact; 30/30 completed; Silver issued; Gold issued+revoked history; password login OK; **no professor fabricated**; production still shows duplicate M2 until this PR is deployed (expected)

## Residual risk

- Full browser revalidation of 30 missions still pending (Z1-006).
- Professor assignment must be operated with real institutional emails before cohort start.
- Certificate UI refresh relies on focus/visibility — not websocket push.

## Deployment recommendation

**Do not deploy until:** PR merged · owner approval · smoke green · James integrity re-checked · then separate full-UI revalidation.
