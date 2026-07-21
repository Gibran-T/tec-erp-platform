# RC01 Slice B — Enterprise Workspace Shell — Checkpoint

**Release:** RC01  
**Slice:** B — Enterprise Workspace Shell  
**Branch:** `release/rc01`  
**Date:** 2026-07-09  
**Decision:** **CHECKPOINT GREEN**

---

## 1. Scope Delivered

RC01 Slice B delivers the **Enterprise Workspace Shell** — a presentation and composition layer on top of Slice A session data. The student-employee arrives at a NordHabitat digital workplace, not a course platform.

| Deliverable | Status |
|-------------|--------|
| Protected workspace layout after login | Delivered |
| NordHabitat topbar | Delivered |
| Employee badge from session data (initials avatar) | Delivered |
| Sidebar / app navigation from centralized registry | Delivered |
| App launcher on workspace home (Day 1 vs preparing access) | Delivered |
| `/workspace` landing page | Delivered |
| `/workspace/apps/:appId` placeholder pages | Delivered |
| Employee profile page (session fields only) | Delivered |
| Contextual right panel — « Votre première journée » | Delivered |
| Honest French empty states | Delivered |
| Logout preserved | Delivered |
| Auth / session restore preserved (Slice A) | Delivered |
| Forbidden vocabulary tests extended to workspace UI | Delivered |

**Hard boundaries respected:** no new migration, no `schema.prisma` changes, no new API endpoints, no contracts changes, no real Inbox/Tasks/Mission Center/ERP/dashboard/KPI logic, no AI Coach, no hardcoded employee identity in JSX.

---

## 2. Branch / PR / Commit References

| Reference | Value |
|-----------|-------|
| Base branch | `release/rc01` |
| Feature branch | `feature/rc01-workspace-shell` |
| Pull request | **#2** — merged into `release/rc01` |
| Merge commit | `e9a6b24` — Merge pull request #2 from Gibran-T/feature/rc01-workspace-shell |
| Slice B commit | `808fd89` — feat(rc01): implement Slice B enterprise workspace shell |
| Slice A (prior) | `a62ce43`, `961f5a2`, `8f9495b` (PR #1) |
| `main` (untouched) | `49608de` |

**Files changed (Slice B):** 22 files under `apps/web/src/` only (+1079 / −100 lines).

---

## 3. Automated Validation Evidence

### Pre-merge gate (feature branch)

```
pnpm turbo lint typecheck test build --force  →  36/36 tasks passed
pnpm env:check                                →  passed
```

### Post-merge gate (`release/rc01` @ `e9a6b24`)

```
pnpm turbo lint typecheck test build --force  →  36/36 tasks passed
pnpm env:check                                →  passed
```

### Test highlights

| Package | Result |
|---------|--------|
| `erp-web` | 18 tests passed (`workspace-shell.test.tsx`: 9, `auth.test.tsx`: 4, `App.test.tsx`: 4) |
| `erp-api` | 27/27 passed when `DATABASE_URL` pointed at Railway validation PostgreSQL (including DB integration) |

### Scope sweeps (pre-merge PR review)

| Pattern | Result |
|---------|--------|
| `wms` | Clean |
| `official_documents` | Clean |
| `^docs/` | Clean |
| `prisma/migrations` | Clean |
| Secret sweep (`postgresql://`, `DATABASE_URL=`, Railway hosts) | Clean |

---

## 4. Manual Smoke Evidence

**Environment:** Local dev (`localhost:5173` + `localhost:3000`) backed by **Railway validation PostgreSQL** (not production).

**Operator:** Human manual smoke (no browser credential automation).

| Check | Result |
|-------|--------|
| Login page loads | Pass |
| Demo employee login | Pass |
| Redirect to `/workspace` after login | Pass |
| NordHabitat workspace shell renders | Pass |
| Topbar renders | Pass |
| Employee badge renders (session data) | Pass |
| Sidebar renders | Pass |
| Workspace home renders | Pass |
| App launcher renders | Pass |
| Placeholder app pages render honest empty states | Pass |
| Mon profil renders session fields | Pass |
| Logout works | Pass |
| `/workspace` protected after logout (redirect to login) | Pass |

**API health (automated curl):** `/health` → `ok`, `/ready` → `database: up`.

**Local smoke note:** CORS required using `http://localhost:5173` (not `127.0.0.1`) to match API `CORS_ORIGIN=http://localhost:5173`.

---

## 5. Safety Confirmations

| Rule | Status |
|------|--------|
| `main` untouched | Confirmed — `49608de` |
| Production untouched | Confirmed — no production deploy, DB, or migrations |
| TEC.WMS untouched | Confirmed |
| `official_documents/site/` excluded | Confirmed — remains untracked |
| Railway validation environment | Active — Postgres-OoGo; not deleted |
| No secrets committed | Confirmed |
| Diff baseline | `origin/release/rc01` (not `main`) |

---

## 6. Known Non-Blocking Follow-Ups

1. **Orphaned Slice A UI files** — `HomePage.tsx` and `FirstDayWelcome.tsx` are no longer routed; safe to remove in a future hygiene slice.
2. **Railway validation app services** — Validation environment has PostgreSQL only; full hosted smoke on Railway URLs deferred (local dev + validation DB used for Slice B checkpoint).
3. **CORS / local dev ergonomics** — `localhost` vs `127.0.0.1` mismatch documented; consider dev note or dual-origin CORS in a future slice (not blocking).
4. **Feature branches** — `feature/rc01-auth` and `feature/rc01-workspace-shell` retained for audit; may be archived after RC01 release closure.

---

## 7. Decision

## **CHECKPOINT GREEN**

RC01 Slice B — Enterprise Workspace Shell is validated on `release/rc01` and approved as a checkpoint. Slice A + Slice B together establish authenticated first-day entry and the NordHabitat enterprise workspace composition layer.

---

## 8. Next Recommended Slice

**RC01 Slice C — Premier message du gestionnaire / Boîte de réception & Première responsabilité**

First manager message in the inbox, first operational responsibility framing, building on the workspace shell and Slice A session — without implementing full Mission Center or ERP logic.

---

*Engineering checkpoint note · RC01 · Not an official `docs/` specification.*
