# RC01 — Production Deployment Evidence

> Engineering evidence note. No secrets. Not an official `docs/` specification.

## 1. Verdict

**RC01 PRODUCTION GREEN**

Main SHA `1de000746e3bd98f0b57987c42899acb7a555488` is deployed to Railway production. Migrations, health, non-destructive smoke, and authenticated Slice D/E/F smoke (via owner-authorized temporary QA identity) all passed. Temporary QA residue after cleanup: **0**.

## 2. Pre-deploy / deploy baseline (unchanged)

| Item | Result |
|------|--------|
| Approved / deployed SHA | `1de000746e3bd98f0b57987c42899acb7a555488` |
| PR #14 | Merged |
| CI on PR head `17397f31` | Success |
| JWT secrets on `tec-erp-api` | PRESENT / VALID / DIFFERENT (configured prior; values never disclosed) |
| API deployment ID | `5dcd7902-8a11-4759-a1d7-e792abd2ca76` (SUCCESS) |
| Web deployment ID | `be8460cc-855d-4471-98c9-9c817d0f2026` (SUCCESS) |
| Migration | PASS — RC01 additive migrations applied; seed not run |
| API/Web health | PASS / PASS |

## 3. Temporary production QA identity

Owner authorization: temporary QA identity creation with total cleanup after validation.

| Item | Result |
|------|--------|
| Identities created | Exactly **1** |
| Display name | QA RC01 Production Smoke |
| Employee number pattern | `#QA-RC01-PROD-*` |
| Company | NordHabitat (`NORDHABITAT`) — company row created only because production DB had zero companies post-migrate (seed never run); **not** a full seed; **no** `#NHE-DEMO` created |
| Password | Strong temporary (never printed / not stored in git) |
| Real-user changes | None (pre-smoke employee count = 0) |
| Credentials in docs/git | None |

Recorded for cleanup (IDs only): employee id captured in session state; deleted after smoke.

## 4. Authenticated production smoke — Slice D

| Check | Result |
|-------|--------|
| Login | PASS |
| Protected inbox | PASS |
| Logout effect (401 without token) | PASS |
| Re-login | PASS |
| First Day inbox + mark read | PASS |
| First Day task complete | PASS |
| Mission available after Day 1 | PASS |
| Mission start | PASS (201) |
| Mission interaction/detail | PASS (`in_progress`) |
| Mission submit / completion | PASS |
| Refresh persistence (`completed`) | PASS |
| Logout/login persistence (`completed`) | PASS |
| No restart CTA (API + UI) | PASS |
| No duplicate completion row | PASS (single mission attempt for QA) |

**API matrix:** 27/27 PASS (includes Slice E + security checks below).

## 5. Authenticated production smoke — Slice E

| Check | Result |
|-------|--------|
| Org available for unlocked QA | PASS |
| Exactly seven departments | PASS |
| Tom expected 40 / actual 36 | PASS (API + UI) |
| Repeated GET stable / read-only | PASS |
| Unsupported writes POST/PUT/PATCH/DELETE | PASS (404) |
| No score/attempt progress fields on org payload | PASS |
| ERP page UI French | PASS |
| Mission Center soft status `Terminée` | PASS |

## 6. Slice F / accessibility / responsive (production)

| Check | Result |
|-------|--------|
| Skip-link present | PASS (`Passer au contenu principal`) |
| Landmarks header/nav/main | PASS |
| Desktop workspace coherent | PASS |
| 320px ERP page overflow | PASS (`overflowX=false`) |
| Missing / invalid token → 401 | PASS |
| Safe errors (no stack/SQL/secret in reviewed paths) | PASS |

## 7. Data integrity (before → after smoke → after cleanup)

| Phase | Companies | Employees | Messages | Tasks | Missions |
|-------|-----------|-----------|----------|-------|----------|
| Before QA create | 0 | 0 | 0 | 0 | 0 |
| After authenticated smoke | 1 | 1 (QA only) | 1 (QA) | 1 (QA) | 1 (QA) |
| After QA cleanup | 1 (NordHabitat preserved) | **0** | **0** | **0** | **0** |

| Check | Result |
|-------|--------|
| Only temporary QA records mutated during smoke | PASS |
| Non-QA mission attempts | 0 |
| Real employee records | None existed; none created beyond QA |
| Unintended score / org progress persistence | None |
| Seed rerun | No |
| **QA RESIDUE** | **0** |

## 8. Post-cleanup health

| Check | Result |
|-------|--------|
| API `/health` | PASS (`ok`) |
| Web HTTP 200 | PASS |
| Deployments still SUCCESS | Yes |

## 9. Rollback

Not required — production healthy; QA fully removed.

## 10. Remaining MINOR / advisory (non-blocking)

- Automated 320px pixel-regression suite not in CI
- Production fail-closed for `DATABASE_URL` / `CORS_ORIGIN` deferred
- Unreachable HomePage/health English strings
- Bilingual session-restore copy hygiene

## 11. Security boundaries honored

- No secret values in documentation or git
- No seed / migrate reset / db push / truncate / drop / recreate
- No product source changes
- `official_documents/site/` untouched
- Temporary scripts/state removed after use

---

*Engineering evidence · RC01 production deployment · updated after authenticated smoke*
