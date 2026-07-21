# RC01 — Production Release Checkpoint

## 1. Final verdict

**RC01 PRODUCTION GREEN**

RC01 is merged to `main`, deployed to Railway production at SHA `1de000746e3bd98f0b57987c42899acb7a555488`, migrations applied, public and authenticated production smoke passed, and the owner-authorized temporary QA identity was fully removed (`QA RESIDUE = 0`).

## 2. Release identity

| Item | Value |
|------|-------|
| Main merge PR | [#14](https://github.com/Gibran-T/tec-erp-platform/pull/14) |
| Main / deployed SHA | `1de000746e3bd98f0b57987c42899acb7a555488` |
| CI (PR #14 head) | Success |
| Railway project / env | `tec-erp` / `production` |
| API deployment ID | `5dcd7902-8a11-4759-a1d7-e792abd2ca76` (SUCCESS) |
| Web deployment ID | `be8460cc-855d-4471-98c9-9c817d0f2026` (SUCCESS) |
| Migration result | PASS (additive; seed not run) |
| API health | PASS |
| Web health | PASS |

## 3. Gate results summary

| Gate | Result |
|------|--------|
| JWT production secrets | PRESENT / VALID / DIFFERENT |
| Production config | PASS |
| Database safety | PASS (migrate deploy only) |
| Non-destructive smoke | PASS |
| Temporary QA identity (owner-authorized) | Created → used → deleted |
| Slice D production smoke | **PASS** |
| Slice E production smoke | **PASS** |
| Slice F production smoke | **PASS** (public + authenticated workspace) |
| Security (401 / GET-only / safe errors) | PASS |
| Data integrity | PASS |
| QA residue | **0** |

## 4. QA identity handling

- Owner authorized temporary production QA creation with total cleanup.
- Exactly one QA employee used (`QA RC01 Production Smoke` / `#QA-RC01-PROD-*`).
- NordHabitat company row preserved (required FK; created only because DB was empty post-migrate — not a demo seed).
- All QA message/task/mission/employee rows deleted after validation.

## 5. Remaining MINOR / advisory debt (non-blocking)

- Automated 320px pixel-regression suite
- Production fail-closed for `DATABASE_URL` / `CORS_ORIGIN`
- Unreachable HomePage/health English strings
- Bilingual session-restore copy hygiene

## 6. Operational handoff

| Item | Status |
|------|--------|
| Production URLs live | Yes |
| Rollback required | No |
| Documentation PR | Update existing PR #15 only (do not auto-merge) |
| Next development wave | Owner decision — RC01 production gate complete |

Evidence companion: `engineering/rc01/RC01_PRODUCTION_DEPLOYMENT_EVIDENCE.md`

---

*Engineering checkpoint · RC01 production release · Not an official `docs/` specification.*
