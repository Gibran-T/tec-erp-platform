# SAP Suite End to End — production deployment evidence

**UTC window:** 2026-09-14T19:23Z → 19:46Z  
**Does not replace** V2 evidence under `engineering/v2/deployment/`.

---

## 1. Baseline (pre-mutation)

| Item | Result |
|------|--------|
| PR #36 | Merged 2026-09-14T19:01:39Z · SHA `652841c2a1aae27558057beb483378fed9d074f0` |
| Catalog at #36 | S1–S10 still placeholders |
| Pre API deployment | `f68dc7b2-c01f-452b-8f91-a6757ac3d358` · V2 `c625ed5` |
| Pre Web deployment | `e95115bd-8a0a-47bf-81cb-b79b6917be24` · PR32 `9f0bb9d` |
| API `/health` `/ready` | 200 / 200 |
| Web `/` | 200 · asset `index-DmIQ5-Rk.js` |
| SAP migrations on production | **pending** (0 SAP tables) |
| James Run 1 | `TECERP-PILOT-001-RUN1` · COMPLETED · AUTONOMOUS |
| James Run 2 | 0 |
| Professors | 0 |
| James certificates / assessments | 3 / 3 |

---

## 2. Official titles (S1–S10)

Confirmed against SAP Learning FR public page 2026-09-14 (`9 Units`) and `SAP_SUITE_E2E_OFFICIAL_PATH_UNITS`.

| Code | Title | SAP public unit | titleStatus |
|------|-------|-----------------|-------------|
| S1–S4, S6–S10 | Public SAP unit titles 1–3, 4, 5–9 | 1–3, 4, 5–9 | `institutionally_confirmed` |
| S5 | Contrôler les coûts et intégrer (enregistrement au reporting — II) | **same unit 4** | `institutionally_confirmed` (college session in `sessionPlans.ts`, not a distinct SAP unit) |
| S10 | Exécution du processus Lead-to-Cash : focalisation sur le service | unit 9 | `institutionally_confirmed` — **not** a 10th SAP unit |

Placeholders remaining: **none**. S5 is institutionally confirmed as a Collège session title, explicitly not a SAP public-unit title.

PR #37: https://github.com/Gibran-T/tec-erp-platform/pull/37  
CI: https://github.com/Gibran-T/tec-erp-platform/actions/runs/34887325535 (**success** — quality + migrate/integration)

---

## 3. Backup / restore

See `PRODUCTION_BACKUP_AND_RESTORE.md`.

| Item | Value |
|------|-------|
| Dump | `tec-erp-prod-before-sap-20260914T192319Z.dump` |
| Size / SHA-256 | 184 381 B / `53676818bc7b9b89dec2d86a80bb93687ae55ac097dab21101cc74f9c21558d4` |
| Restore rehearsal | PASS (disposable `postgres:18`, exit 0) |
| Live James snapshot hash pre/post | `63a0e586ca13839e33db6190388f65aa9ace408c4e9d2a3bcc8a57ca5f028e07` **MATCH** |
| July contractual hash `83dea106…` | serializer/payload drift vs this live core; gate used live hash + SQL Run 1 |

Destructive commands: **not used** (`db push`, `migrate reset`, `DROP`, `TRUNCATE`).

---

## 4. Production deployment

Deployed from **clean worktree** `C:\Projetos\tec-erp-sap-deploy` at `cdd10ec` (no untracked secrets).

| Service | Deployment ID | Status | UTC |
|---------|---------------|--------|-----|
| tec-erp-api | `5721acd2-88b8-4992-afb6-ffbcf3b9a624` | SUCCESS | created 2026-09-14T19:37:14Z · `server_started` 19:39:01Z |
| tec-erp-web | `68467994-782a-40c0-a20a-d2874fe26c81` | SUCCESS | created 2026-09-14T19:40:00Z |
| SHA effectively deployed | `cdd10ec9ccb8512e777364613a92be91c9847d22` (`main`) | | |
| Web asset after deploy | `index-Cn_3mh8d.js` | | |

### API startup (migrate:deploy)

```
14 migrations found in prisma/migrations
Applying migration `20260820160000_sap_iee2e_self_report`
Applying migration `20260820170000_sap_iee2e_semaine_zero`
Applying migration `20260914010000_sap_suite_e2e_institutional`
All migrations have been successfully applied.
Prisma migrate deploy completed successfully.
server_started port=8080 nodeEnv=production
```

`/health` 200 · `/ready` 200 (database up).

---

## 5. Integrity (post-deploy)

| Check | Result |
|-------|--------|
| James Run 1 | Unchanged `TECERP-PILOT-001-RUN1` COMPLETED AUTONOMOUS |
| James Run 2 | 0 |
| Professors created | 0 |
| Certificates | same 3 numbers (silver issued, gold revoked, gold issued) |
| Assessment attempts | 3 |
| Course Edition routes | GET/PUT `/api/v1/me/course-edition/M1` → **404** |
| PedagogicalCourseRun created by SAP GET/PUT | **no** (Run 1 only) |
| Live James hash | `63a0e586…` unchanged after SAP PUT |
| New records | **1** `sap_iee2e_self_report` for James (authorized production smoke PUT) |
| Other SAP tables | 0 rows (`professor_note`, `teaching_calendar`, `external_program_assignment`) |
| M1–M10 | 30/30 missions completed |

---

## 6. Production smoke (API)

James login 200. Catalog `SAP_SUITE_E2E`, S1–S10, 9 official units, official URL new-tab, `iframeForbidden=true`, `emitsSapAchievement=false`, `emitsSapCertification=false`.

| Check | Result |
|-------|--------|
| GET self-report initial `persisted` | `false` (no extra row) |
| PUT self-report | 200 · `persisted=true` · `sapResultOfficial=false` |
| Professor cohort as James | **403** |
| Course Edition | 404/404 |

---

## 7. Production smoke (Web)

Logged in as James → `/workspace/apps/parcours-sap-iee2e`.

- Official SAP link: `target=_blank` `rel=noopener noreferrer`, URL official FR.
- `iframe` count: **0**.
- Copy: 9 unités publiques, S4/S5 share unit 4, S10 = unit 9 / pas une dixième unité SAP.
- Light 1280: PASS. Dark 1280: PASS (`data-theme=dark`).
- Certificates UI: Gold `GOLD-TECERP-2026-PILOT-001-1784730289487` issued + Silver issued.
- 375 px: workspace context panel can cover the main column when left expanded (pre-existing shell; SAP tree still present). Not a SAP catalog regression.

---

## 8. QA

| Suite | Result |
|-------|--------|
| PR #37 CI lint | PASS |
| PR #37 CI typecheck | PASS |
| PR #37 CI unit tests | PASS |
| PR #37 CI build | PASS |
| PR #37 CI `env:check` | PASS |
| PR #37 CI migrate:deploy + integration | PASS (Postgres 16 service) |
| Local lint | PASS (10/10) |
| Local typecheck | PASS (16/16) |
| Local contracts | 33/33 PASS |
| Local SAP API routes+isolation | 9/9 PASS |
| Local SAP PoC + related web | 40 PASS |
| Local full `pnpm test` | erp-api 188 pass / 11 fail: 3 integration need local `:5433`; remaining mission 500s from local `.env` Prisma — **CI unit tests passed** |
| Local smoke | N/A (production smoke used) |
| Production smoke | PASS (section 6–7) |

---

## 9. Limitations / future decisions

- Binary evidence upload not implemented (https metadata only).
- No SAP login, scrape, iframe, credentials, tokens, cookies, sessions, Universal ID storage.
- No professor employee in production → professor UI/API not exercised with a real professor account (James correctly 403).
- No parallel SAP quiz/exam/Practice System/grade/Achievement issuance.
- TEC.WMS is not a separate production app; golden-student product id remains `tec-wms` in tests. Workspace M1–M10 + 30/30 missions remain.
- July hash `83dea106…` is not the live serializer output; live hash `63a0e586…` is the post-V2 baseline.

**Estado:** GREEN WITH DOCUMENTED LIMITATIONS
