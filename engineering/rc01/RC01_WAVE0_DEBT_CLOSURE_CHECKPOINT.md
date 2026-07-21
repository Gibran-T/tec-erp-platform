# RC01 Wave 0 — Debt Closure Checkpoint

## 1. Status

**WAVE 0 PARTIAL — RUNTIME BLOCKER REMAINS**

- Mission Center async test flake: **FIXED and hardened** (deterministic, 20/20 + 10/10 consecutive green).
- Slice D + Slice E runtime smoke debt: **STILL OPEN** — an approved non-production database could not be established in this environment (no fabricated credentials; no production fallback).

This checkpoint does **not** claim RC01 production-ready and does **not** claim Slice D/E runtime debt cleared.

## 2. Objective

Clear RC01 runtime smoke debt (Slice D + E) via an isolated non-production database + live interactive smoke, and eliminate the recurring Mission Center async test flake.

## 3. Approved Runtime Decision

Product Owner approved an **isolated local PostgreSQL** database named `tec_erp_wave0_smoke` (preferred Docker PostgreSQL; allowed dedicated local PostgreSQL). Production and shared databases forbidden.

## 4. Branches & Worktrees

| Branch | Worktree | Base |
|--------|----------|------|
| `feature/rc01-wave0-debt-closure` (integration) | `C:\Projetos\TEC_ERP_WORKTREES\wave0-integration` | `aebae61` |
| `chore/rc01-runtime-smoke` (W0-A) | `C:\Projetos\TEC_ERP_WORKTREES\wave0-runtime` | `aebae61` |
| `fix/mission-center-flake` (W0-B) | `C:\Projetos\TEC_ERP_WORKTREES\wave0-flake` | `aebae61` |

## 5. W0-B — Mission Center Flake Root Cause & Fix

**Root cause:** the two heavy Mission Center journey tests occasionally exceeded Vitest's default **5000ms per-test budget** under load. The tail `waitFor(() => getByTestId(...))` (default 1000ms) then reported the target element (`mission-feedback` / `mission-submit-error`) as missing when the whole `it()` timed out first.

**Fix (test-only, `apps/web/src/__tests__/mission-center.test.tsx`):**
- Replaced brittle `waitFor(() => getByTestId(...))` tails with async-aware `await screen.findByTestId(<id>, undefined, { timeout: 10_000 })` + explicit assertion.
- Raised the per-test budget to `it(..., 20_000)` for both heavy journey tests so the deterministic async chain has headroom.
- No product component changed; behavioral assertions preserved; no arbitrary sleeps; no fake timers.

**Consecutive-run evidence:** target test **20/20**; validation-error test **20/20**; full file **10/10**; web suite **62/62 (8 files)**; typecheck + lint clean; `git diff --check` clean. Commit `4093773` (integrated as `25c0aac`).

## 6. W0-A — Runtime Database Evidence

See `engineering/rc01/RC01_WAVE0_RUNTIME_SMOKE_EVIDENCE.md`.

- Docker daemon **DOWN** (engine pipe unavailable; not startable reliably).
- Local PostgreSQL 17 on `localhost:5432` **requires a password** not available (`fe_sendauth: no password supplied`); no `trust` auth.
- Isolated `tec_erp_wave0_smoke` DB could not be created without authorized superuser access; credentials were **not** fabricated; production/Railway not used.
- Therefore: migrate/seed/DB-integration and **live Slice D + E interactive smoke were not executed**.

## 7. Slice D Result

Interactive runtime smoke **NOT EXECUTED**. Slice D runtime debt **OPEN**. (Automated Slice D suites green; CI Postgres integration green on prior PRs — regression evidence only, not interactive smoke.)

## 8. Slice E Result

Interactive runtime smoke **NOT EXECUTED**. Slice E runtime debt **OPEN**. (Automated Slice E suites green; read-only/no-write proven by unit/route tests.)

## 9. Validation Totals (integration branch)

- Flake reruns: target 20/20 · validation-error 20/20 · full file 10/10.
- Web suite: 62/62 (8 files). Typecheck + lint clean. `git diff --check` clean.
- Integrated diff from `aebae61`: exactly 2 files (`mission-center.test.tsx` [M], `RC01_WAVE0_RUNTIME_SMOKE_EVIDENCE.md` [A]) + this checkpoint.
- Full monorepo `pnpm test` / `pnpm build` / `env:check`: recorded in the Wave 0 stop-gate report (integration validation run).

## 10. QA Cleanup

No temporary QA employees or data created (no runtime DB session). **QA cleanup not required.** Residue count = 0.

## 11. Outstanding Debt

- **Slice D runtime smoke debt — OPEN.**
- **Slice E runtime smoke debt — OPEN.**
- Both must be cleared against an approved non-production runtime before RC01 final GREEN.

## 12. Progression Decision

- **RC01 may proceed to Slice F** (refinement & closure) — Wave 0's flake fix removes CI noise; runtime debt closure is independent and can be executed as soon as an approved DB is available (in parallel with Slice F).
- **RC01 final GREEN is NOT allowed** while Slice D/E runtime smoke debt (and Slice D's pre-existing debt) remain open.
- **No production readiness claim.** RC01 production requires Slice F closure + owner-gated `main` merge + Railway deploy.

---

*Engineering checkpoint note · RC01 Wave 0 · Not an official `docs/` specification.*
