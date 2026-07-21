# RC01 Wave 0 — Runtime Smoke Evidence

> Honest runtime evidence record. No secrets. No fabricated runtime results. Governed by the Wave 0 execution plan and `engineering/rc01/RC01_REBASELINE_DECISION.md`.

## 1. Status Summary

| Item | Result |
|------|--------|
| Environment type | **NOT ESTABLISHED** (approved local database could not be provisioned) |
| Docker runtime | Daemon **DOWN** (Docker Desktop installed; engine pipe unavailable; could not be started reliably) |
| Local PostgreSQL 17 | Service running on `localhost:5432`, but **requires a password not available**; `trust` auth not enabled (`fe_sendauth: no password supplied`) |
| Isolated DB `tec_erp_wave0_smoke` | **NOT CREATED** (no authorized superuser access; credentials must not be fabricated) |
| Migration (`migrate:deploy`) | **NOT RUN** (no database) |
| Seed | **NOT RUN** |
| DB-backed integration suites (local) | **NOT RUN** locally |
| Live Slice D interactive smoke | **NOT EXECUTED** |
| Live Slice E interactive smoke | **NOT EXECUTED** |
| QA temporary data | **NONE CREATED** (no runtime session) → cleanup not required |

**Decision (Wave 0 §3):** `HOLD — APPROVED LOCAL DATABASE COULD NOT BE ESTABLISHED`. Production and Railway production were **not** used as a fallback. No credentials were fabricated.

## 2. Debt Disposition

- **SLICE D RUNTIME DEBT — OPEN** (unchanged). Interactive Mission Center lifecycle smoke not performed.
- **SLICE E RUNTIME DEBT — OPEN** (unchanged). Interactive organizational ERP smoke not performed.

These debts are **not** cleared by Wave 0. They remain mandatory before any RC01 final-GREEN decision.

## 3. What Was Attempted (evidence, no secrets)

| Step | Attempt | Outcome |
|------|---------|---------|
| Docker daemon | `docker version --format {{.Server.Version}}` | `error during connect: ... //./pipe/docker_engine ... cannot find the file` (daemon down) |
| Local PG auth | `psql -w -U postgres -h localhost -d postgres -c "SELECT 1"` (no password, non-interactive) | `fe_sendauth: no password supplied` — password required, none available |
| Owner-approved DB name | `tec_erp_wave0_smoke` | Could not be created (no authorized connection) |

Execution environment note: the local shell intermittently failed to run `pnpm`/`psql`/env-persistence and multi-statement commands (returned "no exit status"), compounding the DB blocker.

## 4. Compensating Evidence (not a substitute for live smoke)

The Slice D + Slice E behaviors are covered by **automated tests** and by **CI Postgres integration** (external evidence), though **not** by the local interactive runtime smoke Wave 0 targeted:

- Automated unit/route/component suites: 190 passed / 6 skipped at RC01 baseline; organization + mission + first-day suites green.
- CI `Database migration · Integration` job (Postgres 16) passed on PR #8 and PR #9 — migrations + seed + the three DB integration suites (`database`, `first-day-foundation`, `mission-discovery`).

This CI evidence supports regression confidence but does **not** close the interactive runtime smoke debt.

## 5. Recommended Path to Clear the Debt (next opportunity)

When an approved runtime is available, execute in one of:
1. **Docker** (preferred, CI parity): start Docker Desktop → `docker run -d -e POSTGRES_USER=tec -e POSTGRES_PASSWORD=*** -e POSTGRES_DB=tec_erp_wave0_smoke -p 5433:5432 postgres:16-alpine`; `DATABASE_URL=postgresql://tec:***@localhost:5433/tec_erp_wave0_smoke`.
2. **Local PG 17** (needs the instance's superuser password from the operator): create role `tec` + database `tec_erp_wave0_smoke`; `DATABASE_URL=postgresql://tec:***@localhost:5432/tec_erp_wave0_smoke`.
3. **Railway non-production** environment (owner-enabled).

Then: `pnpm migrate:deploy` → `pnpm --filter @tec-platform/database-erp seed` → the 3 integration suites → start API + Web → live Slice D + E smoke → record evidence → clean up QA data. Only then update this document to `SLICE D RUNTIME DEBT CLOSED` / `SLICE E RUNTIME DEBT CLOSED`.

## 6. Security Boundaries Honored

- No production or shared database connection.
- No secrets committed; no `.env` written into tracked files.
- No fabricated credentials.
- `official_documents/site/` untouched.

---

*Engineering evidence note · RC01 Wave 0 · Not an official `docs/` specification.*
