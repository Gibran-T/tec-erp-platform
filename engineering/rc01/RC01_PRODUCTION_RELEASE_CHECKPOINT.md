# RC01 — Production Release Checkpoint

## 1. Final verdict

**RC01 DEPLOYED — POST-DEPLOY DEBT REMAINS**

RC01 is merged to `main` and deployed to Railway production at SHA `1de000746e3bd98f0b57987c42899acb7a555488`. Migrations and public health checks passed. Authenticated Slice D/E production smoke remains open pending an approved production QA identity.

This checkpoint does **not** claim `RC01 PRODUCTION GREEN`.

## 2. Release identity

| Item | Value |
|------|-------|
| Main merge PR | [#14](https://github.com/Gibran-T/tec-erp-platform/pull/14) |
| Main merge SHA | `1de000746e3bd98f0b57987c42899acb7a555488` |
| Deployed SHA (source tree) | `1de000746e3bd98f0b57987c42899acb7a555488` |
| CI (PR #14 head) | Success |
| Railway project / env | `tec-erp` / `production` |
| API deployment ID | `5dcd7902-8a11-4759-a1d7-e792abd2ca76` (SUCCESS) |
| Web deployment ID | `be8460cc-855d-4471-98c9-9c817d0f2026` (SUCCESS) |
| Migration result | PASS (3 RC01 migrations applied; additive) |
| API health | PASS |
| Web health | PASS |

## 3. Gate results summary

| Gate | Result |
|------|--------|
| JWT production secrets | PRESENT / VALID / DIFFERENT |
| Production config (core) | PASS after JWT fix |
| Database safety | PASS (migrate deploy only; no seed) |
| Non-destructive smoke | PASS |
| Slice D production smoke | **BLOCKED** — no approved QA identity |
| Slice E production smoke | **BLOCKED** — no approved QA identity |
| Slice F (public surfaces) | PASS (login French / 320px / landmarks on login) |
| Security (401 / CORS / no secret leak in logs) | PASS for exercised paths |
| Data integrity | PASS for deploy scope (no authenticated mutations) |

## 4. Owner action required

**USER ACTION REQUIRED — APPROVED PRODUCTION QA IDENTITY NEEDED**

Provide or authorize an approved production demo/QA employee identity (canonical demo preferred). Do **not** request an automated undocumented seed unless explicitly approved as a separate controlled operation.

After identity exists, re-run authenticated Slice D/E smoke and update this checkpoint to `RC01 PRODUCTION GREEN` only if all mandatory items pass.

## 5. Remaining MINOR / advisory debt

- Automated 320px pixel-regression suite (not in CI)
- Production fail-closed for `DATABASE_URL` / `CORS_ORIGIN` (deferred)
- Unreachable HomePage/health English strings
- Bilingual session-restore copy hygiene

## 6. Operational handoff

| Item | Status |
|------|--------|
| Production URLs live | Yes |
| Rollback required now | No |
| Next development wave | **Do not start** until owner clears identity + authenticated smoke (or explicitly accepts remaining debt) |

Evidence companion: `engineering/rc01/RC01_PRODUCTION_DEPLOYMENT_EVIDENCE.md`

---

*Engineering checkpoint · RC01 production release · Not an official `docs/` specification.*
