# RC01 Slice F — Execution Plan (Wave 1)

> Final RC01 product-hardening slice before the RC01 launch gate. References `engineering/rc01/RC01_REBASELINE_DECISION.md` §9 and `engineering/TEC_ERP_RAPID_COMPLETION_MASTER_PLAN.md` (Wave 1, gaps G3–G5). No new product capabilities.

## 1. Authoritative Scope

Source: `RC01_REBASELINE_DECISION.md` §9 (Slice F) + master plan Wave 1.

**Included (RC01 closure hardening only):**
- Mandatory French-language consistency in user-facing copy.
- Minimum accessibility fixes (semantics, labels, focus, keyboard, status messaging).
- Responsive/mobile hygiene down to 320px; no horizontal overflow in core flows.
- Error/fallback presentation consistency (safe French; no technical/English leakage).
- Profile-label / navigation consistency hygiene.
- API auth and employee-scoping **security review + hardening** (fail-closed config, controlled errors, protected routes, GET-only organization).
- Release-readiness consistency: complete regression, migration inventory review, governance audit notes, final RC01 checkpoint, main-merge readiness package.

## 2. Exclusions (must NOT enter Slice F)

Visual redesign / UX Polish Wave; new business domain or module; ERP transactions; scoring/progress/quiz; certification; professor/admin portals; AI coach/runtime; new roles or permission model; Prisma schema/migration/seed changes (unless an existing authoritative requirement absolutely demands it); new runtime dependencies (unless absolutely necessary); Slice D/E semantic changes; production deploy; automatic merge to `main`; `official_documents/site/` edits; `docs/` official edits.

## 3. Workstreams & File Ownership

### W1-Web — `feature/rc01-slice-f-web` (`...\slice-f-web`)
**May own:** `apps/web/src/**` product components/pages/layouts/styles/copy for a11y/responsive/French/error hygiene, and **web tests except** `apps/web/src/__tests__/mission-center.test.tsx` (owned by Wave 0 / PR #11 — do not touch to avoid conflict).
**Must not own:** any `apps/api/**`, `packages/contracts/**`, Prisma/migrations/seed, CI config, dependencies (no new deps), `docs/`, `official_documents/`, Slice E scoring/progress semantics, Mission Center completed-state behavior.
**Commit:** `feat(web): close RC01 accessibility and responsive gaps`

### W1-API — `feature/rc01-slice-f-api-security` (`...\slice-f-api-security`)
**May own:** `apps/api/src/**` (middleware, config, error normalization, logging, route guards), `scripts/validate-env.ts` if needed for fail-closed config, and API tests.
**Must not own:** any `apps/web/**`, `packages/contracts/**` schemas (no contract change), Prisma schema/migrations/seed, new roles/permission model, dependencies, `docs/`, `official_documents/`.
**Commit:** `fix(api): harden RC01 authentication and production configuration`

### Sheriff — `feature/rc01-slice-f-closure` (`...\slice-f-integration`)
Owns: execution plan, integration (cherry-pick Web + API), conflict resolution, full validation, QA gate, Slice F checkpoint, PR. May cherry-pick the Wave 0 flake commit only if required for final validation (report to avoid duplicate merge).

## 4. Validation Matrix

| Layer | Gate |
|-------|------|
| Web | component + a11y-oriented tests; route/nav tests; 320px + desktop evidence; `pnpm --filter erp-web test/typecheck/lint/build` |
| API | auth middleware, env/config fail-closed, protected-route, invalid-token, safe-error tests; `pnpm --filter erp-api test/typecheck/lint/build` |
| Integrated | `pnpm typecheck/lint/test/build/env:check`; `git diff --check`; focused regression (auth, First Day, Mission Center, Organizational ERP, navigation, locked/error states) |
| DB | DB-backed integration only if an approved non-prod DB is available; else rely on CI Postgres integration (no interactive-smoke claim) |

## 5. Launch-Gate Criteria (Slice F)

- All Slice F code + QA green; BLOCKER/MAJOR = 0.
- No scope expansion; no future-module capability; Slice D/E semantics preserved.
- Organizational ERP remains GET-only, read-only (no scoring/progress/restart).
- Production configuration fails closed; protected routes protected; controlled errors; no secret/stack/SQL leakage.
- No Prisma/migration/seed/dependency/CI change (unless explicitly justified).
- Final RC01 checkpoint recorded.
- Runtime debt (Slice D/E interactive smoke) may remain OPEN → status `SLICE F CLOSED — RC01 CODE READY, RUNTIME DEBT OPEN`.
- RC01 `main` merge + production deploy remain owner-gated (not in this slice).

## 6. PR Interaction

- PR #10 (master plan, doc-only) and PR #11 (Wave 0) are open; Slice F does not depend on them. Do not duplicate their files. If PR #11 merges before Slice F integration, sync the integration branch from release and preserve the Mission Center hardening.

---

*Engineering plan note · RC01 Slice F · Not an official `docs/` specification.*
