# TEC.ERP V1 Wave 2 Checkpoint — M2–M6 + Professor + Silver

**Date:** 2026-07-21
**Branch:** `integration/v1-wave2-m2-m6-silver`
**Baseline:** `main` @ `fc704833e80c278b9c1624a0a9d0d1c3112cf55a` (PR #16 merged)
**PR:** [#17](https://github.com/Gibran-T/tec-erp-platform/pull/17) — TEC.ERP V1 — Modules 2–6, Professor Portal and Silver
**Pre-fix head:** `b27de81e8c98b06dca326b658e1c65a840738475`
**Deadline:** Friday, 2026-07-24

## Former blockers → fixes

| # | Former blocker | Exact fix |
|---|----------------|-----------|
| 1 | Assessment UI auto-selected first shuffled option | Interactive question UI with radio/checkbox selection by **option key**, review + confirm, draft persistence (`PUT /draft`), resume (`GET /attempt`), stable shuffle stored in attempt presentation JSON; submit requires `confirmFinalSubmission: true`; unanswered + unknown-key rejected server-side |
| 2 | Professor UX minimum-complete | Full portal tabs: cohorts, roster, student detail (modules/missions/scores/competencies/assessments/pending reviews), certificates, audit; actions with mandatory reason + confirm for destructive ops |
| 3 | Certificate revocation not in UI | `POST /api/v1/professor/certificates/:number/revoke` + Professor Certificates tab; student view shows REVOQUÉ banner and blocks print-as-valid; duplicate revoke rejected; students cannot revoke |
| 4 | Thin transactional UI | Shared Documents workspace (`/workspace/apps/documents`) + `/api/v1/me/transactions` (documents, inventory, finance, 12 audited actions) |
| 5 | M4–M6 pedagogy thinner | All 9 missions rewritten to NordHabitat canon depth (French labels, operational context, unique competencies) |
| 6 | Feature worktree sync ambiguity | Documented as **superseded** in ownership map; integration branch is sole authoritative product line; no force-delete |

## Assessment UI

- Phases: list → questions → review → confirm → server result
- Keyboard-focusable inputs; selected option visually indicated
- Timer foundation: server `timeLimitSeconds` displayed; scoring server-only
- No answer key in client responses

## Professor workflow

- Cohort overview, student roster, student detail, certificates, audit, CSV export
- Release / reset / review analytical approve|reject / override score / validate completion / revoke Silver

## Transactional UI

- Tabs: Documents (list+detail+timeline), Inventaire, Finance (trial balance), Actions (full P2P/O2C/Inv/Fin set)
- Server-authoritative posting; blocked supplier / credit / negative stock rejected

## Pedagogical completeness M4–M6

- Registry tests assert French labels ≠ keys and unique `C-O2C-*` / `C-SC-*` / `C-FIN-*`
- Canon aligned to docs/02 SCN-M4/M5/M6 (Sacré-Cœur, DC transfer, S&OP, three-way match, Marc variance)

## Worktree governance

See `engineering/v1/V1_WAVE2_OWNERSHIP_MAP.md` § Feature worktree governance.

## Tests

| Suite | Result |
|-------|--------|
| `erp-api` | **140 passed** |
| `erp-web` | **75 passed** |
| `@tec-platform/mission-catalog` | **3 passed** |
| API / web typecheck | PASS |

## Runtime smoke

Isolated Postgres `:5435/tec_erp_wave2` — `pnpm smoke:wave2 -- --cleanup`
**62/62 PASS** including draft/resume Silver, transactional views, blocked P2P/stock for Student B, professor detail/review/override/revoke/audit, QA cleanup residue 0.

## Final verdict

**V1 WAVE 2 GREEN — M2–M6 + PROFESSOR + SILVER COMPLETE**

Do not merge / deploy until PR #17 CI required checks are green.
