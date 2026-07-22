# TEC.ERP — Zero1 Remediation Production Evidence

**Role:** Sheriff / Zero1 Remediation Production Deployment Lead  
**Date (UTC):** 2026-07-22  
**Repository:** Gibran-T/tec-erp-platform  
**Environment:** Railway `tec-erp` / `production`  
**Rule:** Deployment + focused validation only · no James mutation · no PR #21 merge · no production seed · no Thiago identity fabrication

---

## 1. Baseline

| Item | Result |
|------|--------|
| Local `main` | `2378b2b04cd1241855c1ed7a8de823ff6c2cd2fd` |
| `origin/main` | Same SHA (local = remote) |
| PR #22 | Merged (`merge_commit_sha` = above) |
| PR #21 | Open, unmerged |
| Working tree product changes | None pending on `main` (approved noise: `official_documents/site/`; local helper scripts under `.manus-logs/` / `apps/api/scripts/` not product commits) |
| Prisma migrations in PR #22 | **None** (no destructive schema change) |

---

## 2. Local pre-deploy validation

Executed on exact main SHA before deploy:

| Gate | Result |
|------|--------|
| `pnpm install --frozen-lockfile` | PASS |
| lint | PASS (1 pre-existing react-hooks warning) |
| typecheck | PASS |
| API tests | **164 / 164** |
| Web tests | **82 / 82** |
| mission catalog tests | **4 / 4** |
| build | PASS |
| `env:check` | PASS |
| empty-DB migrate | PASS (7 already applied) |
| migration upgrade path | PASS |
| database integration | PASS |
| Zero1 remediation smoke | PASS · `qaResidue=0` |
| `git diff --check` | PASS |
| secret scan | PASS (no product secrets) |

---

## 3. James Timothy pre-deploy snapshot (read-only)

| Field | Value |
|-------|-------|
| employeeId | `cmrw5vjk10008wow872j1diu1` |
| displayName | James Timothy |
| employeeNumber | `TECERP-2026-PILOT-001` |
| company | TECERP PILOT (`TECERP-PILOT`) |
| cohort | TECERP-PILOT-001 |
| role | `JR_BUSINESS_ANALYST` |
| missions | 30/30 completed |
| course percentComplete | 100 |
| mission attempts | 30 |
| assessments | SILVER_M1_M2 / INTEGRATED_M3_M6 / GOLD_M7_M10 — all passed @ 100 |
| Silver | issued |
| Capstone | submitted · review approved |
| Gold | revoked history + one active issued |
| AI interactions | 1 |
| professor assignment | none (0) |
| login | success (password never printed) |
| integrityHash | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |

Artifacts (local, not committed): `.manus-logs/james-zero1-pre-snapshot.json`

---

## 4. Production configuration / safety (redacted)

| Check | Result |
|-------|--------|
| Railway project / env | `tec-erp` / `production` |
| Services | `tec-erp-api` Online · `tec-erp-web` Online · Postgres Online |
| `NODE_ENV` | production |
| `DATABASE_URL` | points to production Postgres (value not printed) |
| JWT access ≠ refresh | present and different |
| CORS | allows production Web origin |
| `VITE_API_BASE_URL` | production API |
| AI provider | optional; deterministic fallback enabled |
| Seed command | not run |
| Mock adapter | not unexpectedly active |
| Pending migrations | none expected (no new migration in #22) |
| Backup/restore | Railway Postgres volume present (online) |

---

## 5. Deployment

**Method note:** Initial `railway redeploy --from-source` reported SUCCESS but still served stale course payload (11 modules / duplicate M2). Corrected by deploying from exact local SHA via `railway up`.

| Service | Deployment ID | Result |
|---------|---------------|--------|
| tec-erp-api | `9b67ce14-4b05-4a05-974a-3190095cf2a0` | SUCCESS |
| tec-erp-web | `33a7bab8-1236-439d-8246-b149db0f9398` | SUCCESS |
| Deployed product SHA | `2378b2b04cd1241855c1ed7a8de823ff6c2cd2fd` | Confirmed by remediation behavior |
| migrate deploy | via API startCommand `pnpm migrate:deploy` | SUCCESS / no pending |

Superseded from-source IDs (not authoritative): API `68f91d4b…`, Web `27ac276b…`.

---

## 6. Unauthenticated smoke

| Check | Result | Timing (ms) |
|-------|--------|-------------|
| API `/health` | 200 | ~225–289 |
| API `/ready` | 200 | ~198 |
| Web root | 200 | ~180–236 |
| Login page CSS loaded | PASS (`index-*.css` + computed styles; not raw HTML) | — |
| Invalid login | controlled 401 | ~114 |
| Invalid certificate token | 404 | ~114 |
| Student → professor API | 403 | — |
| Student → admin API | 403 | — |
| Stack traces / secret exposure | none observed | — |
| Unexpected 5xx | none observed | — |

---

## 7. Temporary QA dataset

| Item | Value |
|------|-------|
| Prefix | `#QA-Z1R-*` (emails ASCII without `#`) |
| Structure | Company A/B · Admin · Professor A/B · Student A/B · Cohort A/B |
| James usage | read-only only |
| Cleanup | executed in production smoke |
| QA residue | **0** |

Smoke artifact: `.manus-logs/zero1-remediation-prod-smoke.json` (`ok=true`, `failedChecks=[]`, `qaResidue=0`)

---

## 8. Z1 validation matrix

### Z1-001 — Navigation / RBAC — PASS

- Student sidebar: no Portail professeur / Administration as Accès actif.
- Direct `/workspace/apps/portail-professeur` → reserved message (not functional portal).
- Direct `/workspace/apps/administration` → « Accès réservé aux comptes administrateur. »
- API 403 authoritative for professor/admin routes.
- Logout/login + refresh preserve student navigation (James browser).

### Z1-002 — Course payload — PASS

API `GET /api/v1/me/course` (James):

- modules = 10 · codes `M1…M10` unique · order deterministic
- m2 count = 1 · missions = 30 unique · 3 per module · percentComplete = 100

Browser Centre de mission: 30 « Ouvrir la mission », avancement 100 %.

### Z1-003 / Z1-010 — Professor workflow — PASS

Production smoke: create professor, create cohort, assign / remove / reassign, audit present, company isolation, removed professor empty roster. No Thiago identity.

### Z1-004 — AI Coach depth — PASS

Deterministic fallback (no provider required). Sample answers contextual FR for M3/M6/M9; no answer-key disclosure; interaction path exercised; company isolation covered by smoke.

### Z1-005 — French display — PASS WITH WARNINGS

- Accents present on primary nav and many titles.
- No English `passed` / `unknown` leaks on mission center.
- **Warning:** Certificates active status still renders raw `issued` / verification English fragment.
- **Warning:** Capstone dossier status still shows English `submitted` / `approved`.
- **Warning:** Some catalog mission titles still miss accents (`Creer`, `reference`, …).
- Technical identifiers remain ASCII (routes, JSON keys, module codes).

### Z1-007 — Certificate state — PASS WITH NOTE

- Gold eligibility panel visible (James: 30/30, Or réussie, Capstone soumis/approuvé).
- Active Gold + historical revoked Gold both listed; revoked banner French « RÉVOQUÉ ».
- Public verify: active Gold `valid`; revoked Gold `revoked`; invalid → 404.
- Refresh control present; James certificates **not** mutated in this deploy.
- **Note:** Full issue→revoke→reissue cycle on a fresh temp Gold-eligible student was not re-executed end-to-end in this deploy window (eligibility + UI refresh + public verify + historical revoke/reissue evidence used). Covered by remediation tests + pilot history + eligibility endpoint.

### Z1-008 — Scoring transparency — PASS WITH NOTE

- API/unit: scoring-transparency tests (100 / partial / gap / retryGuidance).
- Web Mission Center UI renders `earnedPoints/maxPoints`, criteria, gap, retry after submit.
- **Note:** Historical completed mission browser view shows Claire feedback without replaying lastScore panel; live re-submit avoided to protect James. No answer-key disclosure observed.

### Z1-009 — Professor M10 / Capstone — PASS

Smoke: professor roster/CSV includes M10 + Capstone columns; student visibility for assigned cohort.

### Z1-012 — Capstone / Gold discovery — PASS

- Student Capstone entry + status + Gold eligibility + certificates link visible.
- Professor Capstone/Gold surfaces covered in smoke.
- Admin system-status discoverable.
- Unauthorized roles do not see actionable admin/professor surfaces.

### Responsive / a11y sample — PASS (focused)

- 320px admin gate page: no horizontal overflow (`scrollWidth === clientWidth`).
- Landmarks: header / nav « Applications » / main present.
- Skip link « Passer au contenu principal » present.
- Labels on login fields present.

---

## 9. James post-deploy integrity

| Check | Result |
|-------|--------|
| integrityHash match pre/post | **YES** (`83dea106…571da4`) |
| identity / code / company / cohort / role | unchanged |
| 30/30 · 100% · attempts · assessments | unchanged |
| Silver / Capstone / Gold history | unchanged |
| AI count | unchanged (1) |
| password hash fingerprint | unchanged |
| professor assignment | still none |
| login | success |

---

## 10. QA cleanup / residue

| Metric | Count |
|--------|-------|
| QA employees | 0 |
| QA companies | 0 |
| QA cohorts | 0 |
| QA certificates | 0 |
| Smoke `qaResidue` | **0** |
| QA login after cleanup | rejected |

---

## 11. Post-cleanup health

| Check | Result |
|-------|--------|
| API health | 200 |
| Web | 200 |
| Invalid verify | 404 |
| Deployments | API/Web SUCCESS, online |
| Deployed remediation behavior | course 10 modules / no dup M2 |
| Real-user mutation | none (James hash stable) |
| Elevated 5xx | none observed |

---

## 12. Warnings

1. Prefer `railway up` from exact SHA until GitHub source sync is proven (stale `--from-source` risk).
2. Residual English status fragments on Certificates / Capstone dossier status (display polish → feed Z1-006 full-UI revalidation).
3. Some mission catalog titles still miss accents.
4. Live temp-student Gold issue/revoke/reissue not re-run in this deploy window (see Z1-007 note).
5. Historical mission score panel not re-shown without resubmit (see Z1-008 note).

## 13. Blockers

**None** for remediation production readiness gate.

## 14. Verdict

**ZERO1 REMEDIATION PRODUCTION GREEN — READY FOR FULL UI REVALIDATION**
