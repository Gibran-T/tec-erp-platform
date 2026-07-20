# RC01 Slice E — Organizational ERP Read-Only Checkpoint

## 1. Checkpoint Status

**SLICE E CONDITIONALLY CLOSED — RUNTIME SMOKE DEBT OPEN**

Code, automated tests, CI (including Postgres integration), merged-scope audit, and post-merge code gate are all green. Full interactive runtime functional smoke (live API + Web + database) could **not** be executed in this environment because no approved non-production Postgres runtime is configured. Runtime smoke debt therefore remains **OPEN** and must be cleared before any RC01 final-GREEN claim.

This checkpoint does **not** claim Slice E fully closed, does **not** claim RC01 final GREEN, and does **not** claim local DB integration coverage.

## 2. Slice Identity and Purpose

| Field | Value |
|-------|-------|
| Slice | RC01 Slice E |
| Canonical name | Organizational ERP Read-Only |
| Purpose | Make NordHabitat's organizational and process context consultable inside the workplace ERP app, read-only, without transactional scope |
| Approved plan | `engineering/rc01/RC01_SLICE_E_ORGANIZATIONAL_ERP_PLAN.md` (merged via PR #7) |
| Plan approval | Thiago Gibran — Project Owner (2026-07-18) |

## 3. Governance References

| Item | Value |
|------|-------|
| Approved plan PR | **#7** — RC01 Slice E — Organizational ERP read-only plan |
| Plan merge commit | `85c48335ef60631a62d4a7c2de79c89ffdccd321` |
| Implementation PR | **#8** — RC01 Slice E — Organizational ERP Read-Only |
| Feature head | `b06fdadae5b086ab6e678de0f8faf9a9361bf2d8` |
| Merge commit | `f86c05d1388fd98de7d4c3d43aa3bf85ea83cf4d` |
| Release branch | `release/rc01` |
| Merge method | GitHub merge commit (base `release/rc01`, head `feature/rc01-slice-e-organizational-erp`) |

### Implementation commit chain (7 commits + merge)

```
f86c05d Merge pull request #8 (release/rc01)
b06fdad fix(rc01): sanitize Slice E organization errors
03b9766 chore(rc01): wire Slice E organizational ERP workspace
d3f0b59 feat(rc01): add Slice E organizational ERP web experience
422c098 chore(rc01): mount Slice E organization API
70fb6c4 feat(rc01): add Slice E organization read-only API
6d57ca0 chore(rc01): export Slice E organization contracts
9a55ac0 feat(rc01): add Slice E organization domain catalog
```

## 4. Delivered Capabilities

After First Day completion, an authenticated employee can open the workplace **ERP** app (`/workspace/apps/erp`) and consult, read-only:

- NordHabitat company profile;
- seven departments with functions and responsibilities;
- department relationships (coordination edges and risks);
- lightweight process awareness (promise client, reapprovisionnement, contrôle d'inventaire, pilotage transverse);
- fragmentation signals;
- Tom's narrative analytical context (system expected **40** vs physical observed **36**) — observation framing only;
- soft contextual link to the Mission Center.

Consultation is **evergreen**: available while M1-M01 is available, in progress, or completed. There is no Slice E attempt, score, progress, completion, or restart.

## 5. Architecture Boundary

| Layer | Decision |
|-------|----------|
| Content | Organizational catalog **in code** (`apps/api/src/modules/organization/organization.catalog.ts`) |
| Contracts | `packages/contracts/src/organization.ts` (Zod discriminated `locked` / `available`) |
| Persistence | **None** for organization |
| Prisma / migration / seed | **None** |
| API | Authenticated **GET only** — `GET /api/v1/me/organization` |
| Web | Workplace ERP page (`appId: erp`) using existing `day1` access model |
| Writes | **Zero** organization write routes and **zero** write client methods |

## 6. Authentication and First-Day Gating

- Endpoint requires an authenticated employee (`requireEmployee`), mounted under `/api/v1/me`.
- Unlock predicate mirrors Slice D First-Day completion **read-only** (no First-Day mutation): `EmployeeMessageState.readAt != null` for `premier-message-gestionnaire` **and** `EmployeeTaskState.completedAt != null` for `decouvrir-nordhabitat`.
- Day-1 incomplete → HTTP 200 `access: "locked"`, `organization: null`, French unlock explanation.
- Day-1 complete → HTTP 200 `access: "available"` with full read-only catalog.
- ERP access is **not** coupled to mission completion (OD-E1 / OD-E7).

## 7. Read-Only Guarantee

- Organization API write routes: **0** (route tests assert POST/PUT/PATCH/DELETE → 404; recursive grep = none).
- Organization web client write methods: **0** (GET-only client; grep = none).
- Repeated GET is idempotent (static catalog + derived unlock); no organization persistence exists to mutate.
- ERP browsing does not read or mutate mission repositories.

## 8. Seven Canonical Departments

Exact parity with Slice D `MISSION_DEPARTMENT_CATALOG` (OD-E6), asserted by automated parity tests:

| Key | Label |
|-----|-------|
| `dept-direction` | Direction |
| `dept-operations` | Opérations |
| `dept-finance` | Finance |
| `dept-ventes` | Ventes |
| `dept-approvisionnement` | Approvisionnement |
| `dept-entrepot` | Entrepôt |
| `dept-ti` | TI |

## 9. Validation Evidence

### 9.1 Local automated tests (post-merge, release/rc01 @ `f86c05d`)

- `pnpm test`: **190 passed / 6 skipped** (196 total).
- Skipped = 3 erp-api DB-backed integration suites (`first-day-foundation`, `mission-discovery`, `database`), 2 tests each — skipped due to no local Postgres. **No local DB coverage claimed.**
- `pnpm typecheck`: 14/14 · `pnpm lint`: 9/9 · `pnpm build`: 9/9 · `pnpm env:check`: pass · `git diff --check`: clean.
- Organization-specific: contracts 29/29 (incl. department parity, Tom 40/36 narrative), erp-api organization catalog 9/9 + routes 9/9, erp-web organization page 13/13 + client 7/7, workspace-shell 10/10 (incl. Day-1 ERP routing).

### 9.2 CI (PR #8)

- Workflow `CI` run `29781605084`, event `pull_request`, run_attempt 1, conclusion **success**.
- Job `Lint · Typecheck · Test · Build · Env` (quality): **success**.
- Job `Database migration · Integration` (Postgres): **success**.

### 9.3 Postgres integration

- Executed in CI (integration job) against Postgres: migrations + seed + DB-backed regression suites passed.
- This CI evidence **supersedes** the 6 locally-skipped DB tests for regression purposes. It is **not** an interactive Slice E end-to-end runtime smoke.

### 9.4 Post-merge runtime smoke

- Classified **PARTIAL**. Automated route/component/contract smoke (page UX states, GET client, `organization.routes` supertest, workspace routing) is green.
- Full interactive runtime smoke (live API + Web + DB session across locked/available/evergreen/error/read-only) was **not executed** — no approved non-production Postgres runtime available (no `.env`, `DATABASE_URL` unset, Docker daemon down).
- No runtime evidence fabricated. Items not directly observed are not claimed.

## 10. QA Verdict

| Metric | Value |
|--------|-------|
| Blockers | **0** |
| Majors | **0** (error-sanitization MAJOR closed) |
| Minors | **4** — deferred, non-blocking, advisory |

### Error-sanitization MAJOR closure

The QA MAJOR (unsafe error leakage to the UI) was closed by commit `b06fdad` (`fix(rc01): sanitize Slice E organization errors`):

- API client never relays raw server error-envelope text or raw fetch/browser exception messages; all failure paths throw fixed safe French messages.
- `network` / non-ok / malformed / schema / auth failures each map to controlled copy; the response body is deliberately not surfaced.
- A whitelist (`ORGANIZATION_SAFE_ERROR_MESSAGES`) + `toSafeOrganizationErrorMessage()` is the single source of truth, enforced in both the client and the page-local hook (defense in depth).
- Verified: "Failed to fetch", "An unexpected error occurred.", "database connection refused", and parser/schema details never reach the UI; retry issues a fresh GET and renders the available state.

## 11. Explicit Exclusions (unchanged from plan)

No Prisma / migration / seed; no organization persistence; no write routes; no master-data CRUD; no transactional posting; no workflow engine; no interactive process engine; no M1-M02/M1-M03; no inventory adjustment (Tom 40/36 is narrative only); no dashboards / KPI Builder / analytics runtime; no Process Mining; no AI Coach runtime; no scoring / quiz / certification; no professor interface; no new Claire message/task/feedback; no Slice D mission behavior change; no First-Day behavior change; no CI / dependency / lockfile change; no official `docs/` edits; no `official_documents/site/` changes; no production deploy / `main` merge.

## 12. Remaining Runtime Debt

- **Slice E runtime smoke debt: OPEN** — interactive live smoke pending an approved non-production Postgres runtime.
- **Slice D runtime smoke debt: OPEN** (separate, pre-existing) — remains a distinct RC01 final-GREEN prerequisite.
- Four QA MINOR findings deferred (non-blocking).
- RC01 is **not** final GREEN.

## 13. Final Slice E Status

**SLICE E CONDITIONALLY CLOSED — RUNTIME SMOKE DEBT OPEN**

Implementation is merged to `release/rc01` at `f86c05d` with green code, tests, and CI (including Postgres integration). Full interactive runtime functional smoke remains required before Slice E can be declared fully closed and before any RC01 final-GREEN decision.

---

*Engineering checkpoint note · RC01 · Not an official `docs/` specification.*
