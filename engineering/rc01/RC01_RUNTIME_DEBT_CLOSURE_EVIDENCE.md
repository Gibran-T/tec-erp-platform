# RC01 — Runtime Debt Closure Evidence

> Honest runtime evidence record. No secrets. No fabricated results. Closes the interactive runtime smoke debt left open by Wave 0 / Slice E / Slice F checkpoints.

## 1. Status Summary

| Item | Result |
|------|--------|
| Environment type | **Isolated local Docker Postgres 16** (non-production) |
| Container | `tec-erp-rc01-smoke-postgres` · `127.0.0.1:5433→5432` · image `postgres:16` (server **16.14**) · healthy during session |
| Database | `tec_erp_rc01_smoke` · role `tec` |
| Migrations | **4 applied**, no drift |
| Seed | Company=1 (`NORDHABITAT`) · Employee=1 (`#NHE-DEMO`) |
| DB-backed integration suites | **6/6 passed** (`database`, `first-day-foundation`, `mission-discovery`) — executed earlier in this finalization session |
| API | `http://127.0.0.1:3000` (built `dist/`, `pnpm --filter erp-api start`) |
| Web | `http://localhost:5173` (Vite) — host must match `CORS_ORIGIN` (`http://localhost:5173`) |
| Live Slice D API smoke | **EXECUTED — PASS** (see §4) |
| Live Slice E API + UI smoke | **EXECUTED — PASS** (see §5) |
| Slice F a11y / French / security | **EXECUTED — PASS** with deferred MINORs carried forward (see §6) |
| QA temporary data | Created → exercised → **cleaned; residue = 0** |
| Teardown | API/Web stopped · container `tec-erp-rc01-smoke-postgres` removed · no `docker system prune` |

**Decision:** `SLICE D RUNTIME DEBT CLOSED` · `SLICE E RUNTIME DEBT CLOSED` · runtime evidence supports RC01 launch-gate preparation (see companion checkpoint).

## 2. Baseline Preserved (pre-smoke)

| Check | Value |
|-------|-------|
| Companies | 1 |
| Employees | 1 (`#NHE-DEMO` / `demo.analyste@nordhabitat.ca`) |
| Mission attempts | 0 |
| Message / task states | 0 / 0 |
| Migrations | 4 |

Canonical seed employee was **not** mutated for journey exercise. Disposable QA fixtures only.

## 3. Disposable QA Fixtures

| Employee number | Email | Purpose |
|-----------------|-------|---------|
| `#QA-RC01-LOCKED` | `qa.locked.rc01@example.test` | Locked Day-1 / locked org / isolation control |
| `#QA-RC01-UNLOCK` | `qa.unlock.rc01@example.test` | Full unlock → mission → org journey |

Passwords were local-session only (never committed). `#NHE-DEMO` remained loginable with the documented demo credential after the session.

## 4. Slice D — Live API Matrix

Direct HTTP against the running API (25-item suite; **25 PASS / 0 FAIL**).

| Check | Result | Evidence detail |
|-------|--------|-----------------|
| Health | PASS | `GET /health` → `status=ok` |
| Auth bad password | PASS | `401` / `UNAUTHORIZED` |
| Locked employee login | PASS | Access token issued |
| Locked mission summary | PASS | `m1-m01-decouvrir-entreprise` → `locked` |
| Inbox catalog | PASS | Manager message present |
| Mark message read | PASS | `200` |
| Tasks available | PASS | First task `a_faire` |
| Complete first task | PASS | `200` |
| Mission available after Day 1 | PASS | `available` |
| Mission start | PASS | `201` / `in_progress` |
| Mission detail | PASS | `200` / `in_progress` |
| Mission submit | PASS | `200` with valid acknowledgements + mappings + justification |
| Persistence after re-login | PASS | Mission status `completed` |
| Isolation (locked employee unchanged) | PASS | Still `locked` after peer unlock |
| Demo seed intact | PASS | Demo login `200` |

### Persistence evidence (mid-session, before cleanup)

| Table | Count | Note |
|-------|-------|------|
| `employee` | 3 | Demo + 2 QA |
| `employee_message_state` | 1 | Unlock journey |
| `employee_task_state` | 1 | Unlock journey |
| `employee_mission_attempt` | 1 | `completed` / `m1-m01-decouvrir-entreprise` |

## 5. Slice E — Live API + UI Matrix

| Check | Result | Evidence detail |
|-------|--------|-----------------|
| Org locked before Day 1 | PASS | Unlock explanation `premiere-journee-requise`; no department payload for locked employee |
| Org available after Day 1 | PASS | 7 departments returned |
| Tom narrative 40 vs 36 | PASS | `expected=40` · `actual=36` |
| GET-only surface | PASS | `POST/PUT/PATCH/DELETE /api/v1/me/organization` → `404` |
| Unauthenticated | PASS | `401` / `UNAUTHORIZED` |
| UI ERP page (browser) | PASS | `/workspace/apps/erp` — French organization content, 7 departments listed, Tom 40/36 present in page text |
| Evergreen / no scoring UI | PASS | No scoring/progress/restart controls observed on org page |

## 6. Slice F — Interactive / Security Closure Evidence

| Check | Result | Evidence detail |
|-------|--------|-----------------|
| French login copy | PASS | Courriel professionnel / Mot de passe / Se connecter |
| Network error sanitization | PASS | `127.0.0.1` host vs `localhost` CORS mismatch surfaced fixed French: *Impossible de contacter le serveur…* (no raw `Failed to fetch`) |
| Skip-link | PASS | `Passer au contenu principal` → `#contenu-principal` (`tabindex=-1`); keyboard focus reaches skip-link |
| Landmarks | PASS | Live DOM: `header`, `nav`, `main`, context `aside` |
| French workspace copy | PASS | Boîte de réception, Centre de mission, Accès en préparation, etc. |
| 320px viewport | PASS | Emulated 320×720; `overflowX=false` on home + ERP; layout usable (sidebar stacks) |
| JWT production fail-closed (unit) | PASS | `config.test.ts` **8/8** |
| JWT production fail-closed (process) | PASS | Short-lived `loadConfig` cases: missing / weak / reused / dev-fallback secrets → `ConfigurationError` **4/4**, secret values not echoed |

### Deferred MINORs (unchanged carry-forward from Slice F)

1. No automated 320px pixel-regression test in suite (manual/browser evidence recorded here).
2. Production fail-closed for `DATABASE_URL` / `CORS_ORIGIN` still deferred.
3. Unreachable `HomePage` / health English strings still deferred.
4. Advisory: transient bilingual auth restore copy *Connexion en cours... / Signing you in...* observed during session restore — not a journey blocker; track as hygiene follow-up.

## 7. QA Cleanup & Residue

| Step | Result |
|------|--------|
| Delete QA mission/message/task rows | 1 / 1 / 1 |
| Delete QA employees | 2 |
| Remaining employees | **1** (`#NHE-DEMO`) |
| Remaining companies | **1** |
| Remaining mission/message/task rows | **0 / 0 / 0** |
| Residue | **0** |

## 8. Teardown

| Asset | Action |
|-------|--------|
| API `:3000` | Stopped |
| Web `:5173` | Stopped |
| `tec-erp-rc01-smoke-postgres` | `docker rm -f` |
| Docker prune | **Not run** |
| Temp smoke scripts under `apps/api/scripts/_tmp_*` | Removed (never committed) |
| Tracked product source | **Unchanged** on evidence branch |

## 9. Security Boundaries Honored

- No production / Railway usage.
- No secrets printed or committed; local `.env` files remain gitignored.
- No fabricated credentials.
- `official_documents/site/` untouched.
- No Prisma / migration / seed / product-source edits to force a pass.

## 10. Debt Disposition

| Debt | Prior status | New status |
|------|--------------|------------|
| Slice D interactive runtime smoke | OPEN (Wave 0) | **CLOSED** |
| Slice E interactive runtime smoke | OPEN (Slice E / F) | **CLOSED** |
| Slice F deferred MINORs | OPEN (hygiene) | **OPEN** (carry forward; not launch blockers) |

---

*Engineering evidence note · RC01 runtime debt closure · Not an official `docs/` specification.*
