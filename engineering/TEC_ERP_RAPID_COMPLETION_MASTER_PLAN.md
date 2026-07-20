# TEC.ERP — Rapid Completion Master Plan

> Authoritative completion command-center plan. This document **references** existing specifications; it does not duplicate them and does not change any approved product decision. It does not modify `docs/` or `official_documents/site/`.

## 1. Executive Status

TEC.ERP is a **business-mission-driven educational ERP platform** (NordHabitat universe). The current release line **RC01** is governed by `engineering/rc01/RC01_REBASELINE_DECISION.md` (approved 2026-07-10), which bounds RC01 to a **first-day + discovery + read-only organizational** experience.

- **RC01 progress: ~90%** — Slices A, B, C1, C2, C, D, E delivered; only **Slice F** (refinement & closure) remains.
- **Full Version-1 progress: ~10–15%** — the complete course (10 modules, 30 missions, simulation, dashboards/KPI, assessment/scoring, Silver+Gold certification, professor/admin portals, AI coach, production) is a **multi-release program** (RC01 → RC12 per `docs/02` §13.7).
- **Slice E status:** CONDITIONALLY CLOSED — RUNTIME SMOKE DEBT OPEN (`engineering/rc01/RC01_SLICE_E_ORGANIZATIONAL_ERP_CHECKPOINT.md`).
- **Open runtime debt:** Slice D and Slice E runtime functional smoke (no approved non-production DB runtime executed yet).
- **Open engineering debt:** intermittent Mission Center async test flake.

Baseline for this plan: `release/rc01` @ `aebae61156f9fd09472b6de521366c0cd3b30f83` (PR #8 implementation + PR #9 checkpoint merged).

**Honesty statement:** "Finishing the complete course" is not a single sprint. This plan gives the **shortest safe path**: close RC01 first (Wave 0 debt + Wave 1 Slice F), then deliver the teachable course capability-by-capability in coherent release waves, with runtime evidence and governance at each step. No RC01 final-GREEN or production claim is made here.

## 2. Authoritative Baseline

| Anchor | Source |
|--------|--------|
| RC01 scope & owner decisions OD-1..OD-8 | `engineering/rc01/RC01_REBASELINE_DECISION.md` §4–§9 |
| Product vision / V1 scope | `docs/00_PRODUCT_VISION.md`; `docs/13_SYSTEM_ARCHITECTURE.md` §Version 1 Scope |
| Ten modules / 30 missions | `docs/15_ERP_FUNCTIONAL_SPECIFICATION.md` §5, §6, §18; `docs/04_COMPETENCY_MATRIX.md` |
| Mission canon (M1) | `docs/03_SCENARIO_LIBRARY.md` §M1 |
| Student journey | `docs/02_ENTERPRISE_EXPERIENCE_BLUEPRINT.md` §0.1; `docs/15` §8, §15, §20 |
| Certification (Silver/Gold) | `docs/10_CERTIFICATION_FRAMEWORK.md` |
| Professor/Admin | `docs/11_TEACHER_PORTAL.md`; `docs/15` §11 |
| Target DB schema | `docs/17_DATABASE_SCHEMA.md` |
| Release/Deploy governance | `docs/24_RELEASE_MANAGEMENT.md`; `docs/25_DEPLOYMENT_GUIDE.md`; `docs/26_SECURITY_ARCHITECTURE.md` |
| Long-term backlog | `docs/20_MVP_IMPLEMENTATION_BACKLOG.md` |
| Engineering process | `docs/19_CURSOR_MASTER_BUILD_SPECIFICATION.md` |

## 3. Completed Capabilities (COMPLETE AND VALIDATED)

| Capability | Location | Evidence |
|-----------|----------|----------|
| Authentication (JWT login/refresh/logout/session) | `apps/api/src/modules/auth/*`, `apps/web/src/auth/*` | Tests green; bearer middleware on `/api/v1/me` |
| Employee identity (student-as-employee) | Prisma `Employee`,`Company`; `auth.repository.ts` | Demo seed `#NHE-DEMO` |
| First Day (inbox + tasks) | `apps/api/src/modules/first-day/*`; web Inbox/Tasks pages | Persisted read/complete state |
| Mission Center M1-M01 (Découvrir l'entreprise) | `apps/api/src/modules/mission/*`; `MissionCenterPage.tsx` | Start/submit + evidence persistence |
| Organizational ERP read-only (Slice E) | `apps/api/src/modules/organization/*`; `OrganizationalErpPage.tsx` | GET `/api/v1/me/organization`; 7 departments; Day-1 gated |
| Enterprise workspace shell + app registry | `apps/web/src/workspace/*`; `WorkspaceAppPage.tsx` | 10 apps; launcher + sidebar |
| Observability / structured logging | `apps/api/src/logger.ts`, `request-id.ts` | JSON logs + request IDs |
| Error handling (domain→HTTP envelope; React boundary) | `middleware/error-handler.ts`; `contracts/errors.ts`; `ErrorBoundary.tsx` | Tests green |
| Database foundation (Prisma + 4 migrations + seed) | `packages/database-erp/*` | CI Postgres integration green |
| CI (quality + Postgres integration) | `.github/workflows/ci.yml` | 2 required jobs |
| Shared contracts | `packages/contracts/*` | auth/first-day/mission/organization/errors/health/pagination/version |

Automated tests: **~203 cases / ~37 files**; last full run **190 passed / 6 skipped (DB-only)**.

## 4. Conditional Capabilities & Debt

| Item | State | Debt |
|------|-------|------|
| Slice E organizational ERP | CONDITIONALLY CLOSED | Interactive runtime smoke not executed (no approved DB runtime) |
| Slice D mission discovery | CONDITIONALLY CLOSED (prior) | Runtime smoke debt OPEN (separate) |
| Security | CONDITIONAL | Single role `JR_BUSINESS_ANALYST`; dev JWT fallbacks; formal auth/scoping security review is a Slice F item |
| Deployment / Railway | CONDITIONAL | `railway.toml` present; no production validation; deploy workflow skips without secrets |
| Runtime smoke | PARTIAL | Automated route/component smoke only; no live end-to-end run |
| Mission Center async test | FLAKY | `mission-center.test.tsx > "runs the available start-map-submit journey with feedback"` intermittently fails on `waitFor([data-testid="mission-feedback"])` |
| Localization / a11y / responsive | PARTIAL | Hardcoded French, ad-hoc a11y — Slice F hygiene targets |

## 5. Ten-Module Traceability Matrix

Modules and objectives per `docs/15` §18 / `docs/04`. Missions per `docs/03` (canon) / `docs/15` §6 (3 per module = 30). Status reflects **code**.

| Module | Objective | Competency | Missions (target) | Implemented | Status | Code / gap |
|--------|-----------|------------|-------------------|-------------|--------|-----------|
| **M1 — ERP Foundations** | Understand how an enterprise operates | Business Understanding | M1-M01, M1-M02, M1-M03 | M1-M01 only | **PARTIAL** | `modules/mission/*` (M1-M01); M1-M02/M03 PLANNED (`docs/03`) |
| **M2 — Master Data & Org Structure** | Prepare reliable enterprise information | Data Quality | 3 | 0 | **NOT STARTED** | Read-only org catalog exists (Slice E); no master-data model/CRUD |
| **M3 — Procure-to-Pay** | Manage purchasing | Procurement | 3 | 0 | **NOT STARTED** | Forbidden in RC01 (OD-3) |
| **M4 — Order-to-Cash** | Manage customer demand | Sales Operations | 3 | 0 | **NOT STARTED** | — |
| **M5 — Supply Chain & Inventory** | Maintain inventory performance | Supply Chain | 3 | 0 | **NOT STARTED** | Tom 40/36 is narrative only today (OD-3) |
| **M6 — Finance & Accounting** | Understand financial consequences | Financial Analysis | 3 | 0 | **NOT STARTED** | — |
| **M7 — CRM & Customer Service** | Improve customer relationships | Customer Experience | 3 | 0 | **NOT STARTED** | — |
| **M8 — HR & Governance** | Apply organizational governance | Governance | 3 | 0 | **NOT STARTED** | — |
| **M9 — BI, KPI & AI** | Interpret business performance | Business Intelligence | 3 | 0 | **NOT STARTED** | `tableaux-bord` app = preparing; AI forbidden in RC01 (OD-7) |
| **M10 — ERP Capstone** | Integrate enterprise knowledge | Enterprise Integration | 3 | 0 | **NOT STARTED** | — |

**Journey readiness:** the code supports a coherent **beginning of the journey** (onboarding → first day → first discovery mission → organizational context) but **not** progressive competency across modules, transactional learning, scoring feedback, professor oversight, or certification. Those are post-RC01 program scope.

## 6. Platform Capability Matrix (condensed)

COMPLETE: auth, employee identity, first-day, mission M1-M01, org ERP read-only, workspace shell, logging, error handling, DB foundation, CI, contracts.
PARTIAL: content delivery (static catalogs), business-process awareness, master data (read-only), controls (descriptive), KPIs/dashboards (placeholder), progress (state only), localization, a11y, responsive, QA automation (no e2e), documentation.
CONDITIONAL: releases/unlocks, security, Railway deploy, runtime smoke.
NOT STARTED: course/modules engine, ERP transactions, assessments, scoring, professor/admin, cohorts, reports, certification, analytics, AI coach (feature-flagged off).

## 7. Definition of Done — "TEC.ERP Finished" (full V1)

| # | Category | Objective pass/fail criteria |
|---|----------|------------------------------|
| A | Course content complete | 10 modules × 3 missions (30) authored to `docs/03` canon; competency mapping per `docs/04`; EduQA passed (`docs/22`) |
| B | Student experience complete | End-to-end career journey (`docs/02` §0.1) navigable; progressive unlocks; feedback at each mission; French + a11y + responsive |
| C | ERP functional experience complete | Transactional processes P2P/O2C/SCM/Finance/CRM/HR operable through simulation engine (`docs/06`) with cross-module consequences |
| D | Professor/admin complete | Teacher Portal (`docs/11`) cohorts/monitoring/review/analytics; Admin portal (users/cohorts/config/audit) usable |
| E | Assessment complete | Assessment engine (`docs/20` §25): mission evaluation, competency scoring, reflection; professor validation path |
| F | Certification complete | Silver (M1–M2) + Gold (M3–M10+Capstone) per `docs/10`; certificate IDs, QR verification, public portal |
| G | Technical quality complete | TS strict; full test pyramid incl. e2e; CI green; security review (`docs/26`); performance acceptable |
| H | Deployment complete | Railway production deploy validated (`docs/25` §22–§25); migrations applied; health verified |
| I | Runtime validation complete | Interactive runtime smoke per release with recorded evidence; zero skipped integration tests at release (`RC01_REBASELINE_DECISION.md` §15) |
| J | Documentation & operations complete | Specs aligned; release + checkpoint records; ops/monitoring/runbooks |

A capability is **not done because code exists** — it requires approved content + working implementation + tests + integration + runtime evidence + documentation + professor & student usability.

## 8. Remaining Gap Register (severity)

Severity: BLOCKER / CRITICAL / REQUIRED / HARDENING / POST-LAUNCH. Size: XS/S/M/L/XL. Risk: LOW/MED/HIGH.

| # | Gap | Sev | Size | Risk | Source | Owner input? | Parallel? |
|---|-----|-----|------|------|--------|--------------|-----------|
| G1 | Slice D + E runtime smoke debt (approved non-prod DB + live smoke) | CRITICAL | M | MED | `RC01_REBASELINE_DECISION.md` §15; checkpoints | Env choice only | Yes |
| G2 | Mission Center async test flake hardening | REQUIRED | XS | LOW | this session (2× occurrence) | No | Yes |
| G3 | Slice F — French consistency + a11y + error/fallback hygiene | REQUIRED | M | LOW | `RC01_REBASELINE_DECISION.md` §9 (OD-8) | No | Yes (web) |
| G4 | Slice F — auth/employee-scoping security review | CRITICAL | S | MED | §9; `docs/26` | No | Yes (api) |
| G5 | Slice F — full regression + Railway validation + migration inventory + governance audit + final RC01 checkpoint | CRITICAL | M | MED | §9, §15 | Merge/deploy approval | Sheriff |
| G6 | RC01 → `main` merge + Railway production deploy | BLOCKER (for launch) | S | HIGH | §16; `docs/25` | **Yes** (owner) | No |
| G7 | Mission Engine generalization (beyond M1-M01) + M1-M02, M1-M03 | CRITICAL | L | MED | `docs/02` RC02; `docs/03` | Scope confirm | Partially |
| G8 | Module 2 (Master Data) + persistence models (`docs/17`) | CRITICAL | L | MED | `docs/15`; `docs/17` | No | Yes |
| G9 | Assessment + scoring engine | CRITICAL | L | MED | `docs/20` §25; `docs/04` | Pedagogy | Yes |
| G10 | Silver certification (M1–M2) | REQUIRED | M | MED | `docs/10` | No | After G8/G9 |
| G11 | Simulation engine + transactional modules M3–M8 | CRITICAL | XL | HIGH | `docs/06`; `docs/15` | Pedagogy | Yes (per module) |
| G12 | Dashboards/KPI/analytics (M9 + platform) | REQUIRED | XL | MED | `docs/08`; `docs/15` | No | Yes |
| G13 | Professor + Admin portals + cohorts | REQUIRED | XL | MED | `docs/11`; `docs/20` | No | Yes |
| G14 | AI Coach (governed) | POST-LAUNCH | L | HIGH | `docs/09`; OD-7 | **Yes** | Yes |
| G15 | Module 10 Capstone + Gold certification | REQUIRED | L | MED | `docs/10`,`docs/15` | No | Late |
| G16 | e2e browser test automation (Playwright) | HARDENING | M | LOW | `docs/23` | No | Yes |

## 9. Critical Path (to a deployable, teachable TEC.ERP)

```
G1 runtime debt closure ─┐
G2 flake fix ────────────┼─► Wave 0 (debt closed, RC01 truly green-able)
                         │
G3 web hygiene ─┐        │
G4 api security ┼─► Wave 1 = Slice F ─► RC01 exit criteria met ─► G6 owner: main-merge + Railway prod
G5 sheriff close┘                                                   (first TEACHABLE increment: onboarding+discovery+org ERP)
                                                                     │
                                     G7 Mission Engine + M1-M02/03 ──► Module 1 complete (RC02)
                                     G8 Module 2 + G9 assessment ────► Silver track (RC03) = first CERTIFIABLE unit
                                     G11 sim + M3..M8 (RC04..RC10) + G12 dashboards + G13 portals
                                     G15 Capstone + Gold (RC12) ─────► FULL COURSE
```

Critical path to **first teachable release** = G1 → G2 → (G3‖G4) → G5 → G6.
Critical path to **first certifiable unit (Silver)** = above → G7 → G8 → G9 → G10.
Advisory polish (visual redesign, AI coach) is **not** on the teaching critical path.

## 10. Advanced Parallel Execution Model

Principles: freeze contracts before parallel API/Web work; one owner per file; agents test+commit in their own worktrees; Sheriff integrates via cherry-pick; narrow tests during dev, full suite once per integrated wave, CI once per PR; QA proportional to risk; owner approval only for scope/pedagogy/destructive/merge/deploy.

**Optimal concurrency per wave: 2–3 workstreams** (more only when file ownership is genuinely disjoint). Wave 0 is best run as 1–2 focused streams (runtime env + flake fix) because it is low-file-count and evidence-driven.

Standard workstream template:

| Field | Convention |
|-------|-----------|
| Branch | `feature/<rc>-<slice>-<domain>` |
| Worktree | `C:\Projetos\TEC_ERP_WORKTREES\<slice>-<domain>` |
| Ownership | disjoint dirs per §13 tables |
| Test gate | narrow suite green + `git diff --check` before Sheriff handoff |
| Integration | Sheriff cherry-picks in dependency order; full suite after each |

## 11. Wave Roadmap

| Wave | Objective | Scope | Concurrency | QA | Exit / debt after |
|------|-----------|-------|-------------|----|-------------------|
| **WAVE 0 — Baseline & Debt Closure** | Clear runtime smoke debt (D+E) + fix Mission Center flake + stand up runtime smoke env | G1, G2 | 2 streams (Runtime/QA, Flake) | Runtime smoke + narrow | RC01 becomes truly green-able; flake closed |
| **WAVE 1 — Slice F (RC01 Closure)** | French/a11y/error hygiene + security review + full regression + Railway validation + governance audit + final RC01 checkpoint | G3, G4, G5 | 3 streams (Web, API, Sheriff) | Full suite + CI + runtime | RC01 exit criteria met; awaiting owner main-merge |
| **MILESTONE — RC01 Launch** | Owner-gated: merge `release/rc01`→`main`; Railway production deploy; production smoke | G6 | Sheriff + owner | Prod smoke | First teachable increment live |
| **WAVE 2 — RC02: Module 1 Complete** | Mission Engine generalization + M1-M02, M1-M03 | G7 | 3 streams (contracts+domain, api, web) | Full + CI + runtime | Module 1 teachable end-to-end |
| **WAVE 3 — RC03: Module 2 + Assessment + Silver** | Master Data model + M2 missions + assessment/scoring foundation + Silver certification | G8, G9, G10 | 3–4 streams | Full + CI + runtime + EduQA | First certifiable unit (Silver) |
| **WAVE 4–9 — RC04..RC10: Transactional Modules** | Simulation engine + P2P/O2C/SCM/Finance/CRM/HR (M3–M8) + dashboards/KPI (incremental) | G11, G12 | per-module streams | Full + CI + runtime + EduQA | Progressive Gold coverage |
| **WAVE 10 — RC11: Professor/Admin + Cohorts** | Teacher Portal + Admin + cohort management | G13 | 2–3 streams | Full + CI + runtime | Institutional operability |
| **WAVE 11 — RC-BI: Module 9 BI/AI (+ governed AI Coach)** | BI/KPI/analytics; AI coach behind governance | G12, G14 | 2 streams | Full + CI + AI governance review | Analytics + optional AI |
| **FINAL WAVE — RC12: Capstone + Gold + Launch Readiness** | Module 10 Capstone + Gold certification + full QA + production certification readiness | G15, G16 | 2–3 streams | Full pyramid incl. e2e + prod smoke | FULL COURSE complete |

Wave names/counts follow `docs/02` §13.7 RC waves; refine as evidence dictates.

## 12. Runtime Debt Resolution

Goal: clear Slice D + Slice E runtime smoke debt with a real DB + live smoke, in parallel with Wave 1.

| Option | Feasibility | Recommendation |
|--------|-------------|----------------|
| Local Docker Postgres | Docker installed (20.10.12) but **daemon down**; start Docker Desktop → `docker run postgres:16` | **Preferred** if daemon can start |
| Dedicated local PostgreSQL | A listener already answers on `localhost:5432` (unverified DB) | Fallback: create isolated DB `tec_erp_smoke` + scoped `DATABASE_URL` |
| Railway non-production | Requires Railway env + secrets | Use if local blocked (owner enables) |
| CI-backed smoke | CI already runs Postgres integration | Extend for headless browser (Playwright) smoke |

Procedure (no production, no fabricated secrets):
1. Provision non-prod Postgres; set `DATABASE_URL` in a local `.env` (never committed; `.env` is git-ignored per catalog).
2. `pnpm migrate:deploy` + `pnpm --filter @tec-platform/database-erp seed`.
3. Start API + Web; authenticate demo employee (`#NHE-DEMO`).
4. Execute Slice D + E functional smoke scripts (`docs/`-aligned): auth → locked → complete Day 1 → mission discovery → org available (7 depts, Tom 40/36) → evergreen revisit → safe error/retry → read-only/no-write → regression.
5. Record evidence (HTTP responses, screenshots/log excerpts); QA fixtures only; delete any temp QA data after.
6. Security boundaries: non-prod only; no production connection; secrets via env, never git.

Runtime debt **can run in parallel** with Wave 1 (separate ownership: QA/Runtime stream).

## 13. QA and CI Strategy

- Narrow suites during development; **one** full `pnpm test` per integrated wave; **one** CI run per implementation PR.
- CI stays: quality (lint/typecheck/test/build/env:check) + integration (Postgres). Add Playwright e2e job at Wave 3+ (`docs/23`).
- QA proportional to risk: contracts/parity/no-write/no-score assertions for read paths; transactional correctness + simulation consequence tests for write paths.
- Every implementation PR: green CI incl. Postgres integration before owner merge approval.

## 14. Deployment Strategy

Per `docs/24`/`docs/25`: Approved RC → Railway build → deploy → migrate → health verify → smoke → operational validation → monitoring. RC01 closure (Slice F) does **not** auto-merge to `main` or deploy — **owner-gated** (`RC01_REBASELINE_DECISION.md` §16). Railway config present (`apps/api/railway.toml`, `apps/web/railway.toml`, `deploy-staging.yml`); production requires owner-provided secrets and an Operational Approval Gate.

## 15. Product-Owner Decision Register (minimized)

Only these need owner input; everything else is resolved by authoritative docs.

| # | Decision | Recommendation | Blocks |
|---|----------|----------------|--------|
| PO-1 | Runtime smoke environment for debt closure | Local Docker Postgres (fallback: local PG `tec_erp_smoke`) | Wave 0 |
| PO-2 | Confirm post-RC01 sequencing follows `docs/02` §13.7 (Mission Engine → M1 complete → M2/Silver → transactional → portals → Capstone/Gold) | Approve as-is | Wave 2+ |
| PO-3 | After Slice F, authorize `main` merge + Railway production deploy | Owner decision at milestone | RC01 launch |
| PO-4 | AI Coach activation timing (currently OD-7 forbidden in RC01) | Defer to post-launch (G14) | Wave 11 |

No owner decision is required to begin **Wave 0**.

## 16. First Execution Wave Specification — WAVE 0 (ready to run)

**Objective:** Clear RC01 runtime smoke debt (Slice D + E) and eliminate the Mission Center async flake, standing up a reusable non-production runtime smoke capability — so RC01 can be declared truly green-able before Slice F.

**Business/pedagogical outcome:** Confirms the onboarding → discovery → organizational-context experience actually works interactively for a real employee session; removes CI noise that masks real regressions.

**Contract decisions:** None required — Wave 0 changes **no** API/web contracts. (Contract freeze not needed.)

**Workstreams:**

| Stream | Role | Branch | Worktree | Owns | Forbidden |
|--------|------|--------|----------|------|-----------|
| W0-A | Runtime/QA | `chore/rc01-runtime-smoke` | `C:\Projetos\TEC_ERP_WORKTREES\rc01-runtime-smoke` | non-prod DB setup notes, smoke scripts under `scripts/` or `engineering/rc01/` evidence, `.env` local (uncommitted) | product source, contracts, migrations, `docs/`, `official_documents/site/` |
| W0-B | Flake hardening | `fix/mission-center-flake` | `C:\Projetos\TEC_ERP_WORKTREES\mission-center-flake` | `apps/web/src/__tests__/mission-center.test.tsx` (test-only) | any non-test source, other test files, contracts |
| Sheriff | Integration | `feature/rc01-wave0-debt` (integration) | main repo | cherry-pick + full suite + CI + runtime evidence + checkpoint | — |

**Mission Center flake — minimum robust correction (W0-B):** replace brittle post-submit lookup with an async-aware query — use `await screen.findByTestId("mission-feedback")` (with adequate timeout) instead of a synchronous `getByTestId` after the submit action, and ensure the submit fetch mock resolves before assertion (await the pending microtask / `waitFor` the network call). Do **not** change component behavior; test-only change. Classification: **Wave 0** (recurred ≥2×; cheap; unblocks reliable CI).

**Implementation order:** W0-B (flake, XS) and W0-A (runtime env, M) in parallel → Sheriff integrates W0-B first (fast) → run runtime smoke (W0-A) against non-prod DB → record evidence → Wave 0 checkpoint.

**Test strategy:** W0-B narrow `mission-center.test.tsx` ×3 consecutive green; W0-A live smoke evidence; Sheriff full `pnpm test` + CI on integration PR.

**Merge sequence:** flake fix PR → (CI green) → owner merge; runtime evidence recorded in a Wave 0 checkpoint doc (engineering note, not `docs/`).

**Expected user-visible result:** none (no product change); internal: reliable CI + documented runtime evidence closing D/E smoke debt.

**Owner decisions required before coding:** only **PO-1** (runtime environment choice). Recommendation: local Docker Postgres.

## 17. Final Completion Checklist

- [ ] Wave 0: Slice D + E runtime smoke evidence recorded; Mission Center flake fixed (3× green); Wave 0 checkpoint.
- [ ] Wave 1 (Slice F): French/a11y/error hygiene; security review; full regression; Railway validation; governance audit; final RC01 checkpoint.
- [ ] RC01 launch (owner): `main` merge + Railway production deploy + production smoke.
- [ ] RC02: Mission Engine + M1-M02/M03 (Module 1 complete).
- [ ] RC03: Module 2 + assessment/scoring + Silver certification.
- [ ] RC04–RC10: Simulation engine + transactional modules M3–M8 + dashboards/KPI.
- [ ] RC11: Professor + Admin portals + cohorts.
- [ ] RC-BI: Module 9 BI/AI (+ governed AI coach).
- [ ] RC12: Module 10 Capstone + Gold certification + full QA + production certification readiness.
- [ ] Definition of Done categories A–J all pass.

---

*Engineering planning note · Completion command center · References authoritative specs; not itself an official `docs/` specification. Governed by `engineering/rc01/RC01_REBASELINE_DECISION.md` for RC01 and `docs/20`/`docs/02` for the full program.*
