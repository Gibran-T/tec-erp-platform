# RC01 Slice F — Closure Checkpoint

## 1. Status

**SLICE F CLOSED — RC01 CODE READY, RUNTIME DEBT OPEN**

Slice F code and QA are green (0 BLOCKER, 0 MAJOR). Slice D + Slice E interactive runtime smoke debt remains **OPEN** (no approved non-production DB available). This checkpoint does **not** declare RC01 launched or production-deployed.

## 2. Authoritative Scope

Per `RC01_REBASELINE_DECISION.md` §9 + `TEC_ERP_RAPID_COMPLETION_MASTER_PLAN.md` Wave 1 (G3–G5) and `engineering/rc01/RC01_SLICE_F_EXECUTION_PLAN.md`: RC01 closure hardening only — Web accessibility/responsive/French/error hygiene + API auth/production-config security hardening + release-readiness consistency. No new business capability, scoring, professor/admin, AI, certification, or transactional ERP.

## 3. Implementation Branches

| Branch | Worktree | Commit |
|--------|----------|--------|
| `feature/rc01-slice-f-closure` (integration) | `...\slice-f-integration` | `a7b713b` plan · `2d8d004` web · `9278a57` api |
| `feature/rc01-slice-f-web` | `...\slice-f-web` | `916ab43` |
| `feature/rc01-slice-f-api-security` | `...\slice-f-api-security` | `a008361` |

## 4. Web Improvements (a11y / responsive / French / error)

- `lang="fr"` on the document; keyboard-first **skip-link** to a focusable `#contenu-principal` main region.
- Semantic landmarks (banner/nav/main), corrected heading hierarchy (single `h1`; `EmptyStateCard`→h1, `DashboardPreview`→h2).
- `role="status"` for async loading/refresh (inbox/tasks/mission/context panel); `role="alert"` for errors.
- French `ErrorBoundary` fallback and `NotFoundPage` (promoted to h1).
- Shared `safeFetch` (`apps/web/src/api/http.ts`) converts any network-level failure to one safe French message; routed auth/first-day/mission clients through it (Slice E already guarded).
- Visible `:focus-visible` styling; responsive rules in `index.css`.
- Files: 20 (17 modified + 3 added). Tests: **70 passed** (10 files); +4 new (skip-link/landmarks, NotFound, safeFetch). `mission-center.test.tsx` untouched (owned by PR #11).

## 5. API / Security Improvements

- **Production fail-closed config** (`config.ts`): rejects missing/dev-default, weak (<32 char), or reused (access==refresh) JWT secrets in production; dev/test fallbacks intact for non-production.
- Controlled `ConfigurationError` on validation failure — reports field name, **never** the secret value (no raw ZodError leakage).
- **Logger redaction** (`logger.ts`): deep-redacts authorization/cookie/password/secret/token/credential/apikey to `[REDACTED]` without mutating caller input.
- Test lock-in: token-only identity (not spoofable via header/body/query/pre-set `req.employee`); 401 on missing/invalid/expired; non-leaking 500 envelope (no SQL/secret/stack); organization POST/PUT/PATCH/DELETE → 404 (GET-only).
- Files: 6 (config, logger, +3 test files, require-employee test). Tests: **98 passed / 6 skipped** (DB integration, no Postgres).

## 6. Accessibility Evidence

Automated assertions (jsdom/RTL): `lang="fr"`; skip-link presence/href/target + `tabindex=-1`; banner/main/navigation landmarks; single `<h1>` on home; `role="alert"`/`role="status"` regions; French copy in ErrorBoundary/NotFound. Note: full screen-reader + real-browser AT verification is not automated (advisory).

## 7. Responsive Evidence

Responsive rules added to `index.css` (app shell stacks; wrapping cards/forms/actions; readable spacing). Note: automated pixel-level 320px overflow assertions are **not** part of the suite — responsive verified by code review + CSS (MINOR advisory below).

## 8. Validation Totals (integration branch)

- `pnpm typecheck` 14/14 · `pnpm lint` 9/9 · `pnpm build` 9/9 · `pnpm env:check` pass.
- `pnpm test` **215 passed / 6 skipped** (DB integration only; no local DB coverage claimed).
- Focused: erp-api 98 passed / 6 skipped; erp-web 70 passed.
- `git diff --check` clean. No dependency/lockfile/prisma/seed/CI change. Prisma client regenerated (node_modules only; no tracked change).

## 9. Independent QA Findings

| Question | Result |
|----------|--------|
| Full RC01 journey without navigation ambiguity | PASS (automated; landmarks + skip-link + consistent nav) |
| Keyboard + focus functional | PASS (automated) |
| Usable at 320px | PASS by code review + CSS (MINOR: no automated pixel test) |
| All user-facing messages safe + French | PASS (MINOR: unreachable HomePage/health.ts English deferred) |
| Loading/locked/error/available distinguishable | PASS |
| Production config fails closed | PASS (MINOR: DATABASE_URL/CORS_ORIGIN prod fail-closed deferred) |
| Protected API routes protected | PASS |
| Organizational ERP still read-only (GET-only) | PASS |
| Scoring/progress/restart entered Slice E? | NO (confirmed) |
| Future-module capability entered RC01? | NO (confirmed) |
| Slice D + E behavior preserved | PASS (existing suites green unchanged) |

**Counts:** BLOCKER 0 · MAJOR 0 · MINOR 3 · ADVISORY 2.

## 10. Deferred Items (MINOR / justified)

1. Automated 320px viewport-overflow tests (responsive covered by CSS + review) — future hardening.
2. Production fail-closed for `DATABASE_URL` and `CORS_ORIGIN` (behavior-change risk; not in minimal auth/secret scope) — recommend a follow-up.
3. Unreachable `HomePage.tsx` / `api/health.ts` English strings (not in RC01 route graph) — translate if ever mounted.

Advisory: jsdom nested-`banner` landmark nuance (pre-existing); interactive runtime smoke still pending (Slice D/E debt).

## 11. Runtime Debt Status

- Slice D + Slice E interactive runtime smoke debt: **OPEN** (Wave 0 §3 blocker — no approved non-prod DB). Cleared via Docker `postgres:16` / local PG17 (operator password) / Railway non-prod, then live smoke.
- CI Postgres integration remains the code-level DB validation (green on prior PRs).

## 12. PR #10 / #11 Relationship

- PR #10 (master plan, doc-only) and PR #11 (Wave 0: mission-center flake fix + Wave 0 docs) are **open**, not merged. Slice F branched from `aebae61` and does **not** include or duplicate their changes. `mission-center.test.tsx` was intentionally not modified. If PR #11 merges first, sync the Slice F branch from release and preserve the Mission Center hardening (no conflict expected — disjoint files).

## 13. RC01 Readiness

- RC01 **code** is ready pending: (a) Slice D/E runtime smoke debt closure, (b) owner-gated `main` merge + Railway production deploy (`RC01_REBASELINE_DECISION.md` §16).
- RC01 is **not** final GREEN and **not** production-deployed by this slice.

---

*Engineering checkpoint note · RC01 Slice F · Not an official `docs/` specification.*
