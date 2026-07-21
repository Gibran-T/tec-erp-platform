# RC01 Slice C1 — First-Day Foundation Checkpoint

## 1. Checkpoint Status

| Field | Value |
|-------|-------|
| Slice | RC01 Slice C1 |
| Name | First-Day Foundation |
| Status | **CLOSED / GREEN** |
| Technical decision | **GO** |
| Governance decision | Accepted with recorded governance exception |
| Checkpoint date | 2026-07-10 |
| Release branch | `release/rc01` |
| C1 implementation commit | `2670a68e5361e39e6bd97056726135dc26f65dff` |
| Governance exception commit | `35d09f6acd2bab907f57cebe6cdc7830d94389cf` |
| Main branch | Unchanged at `49608de08c1527ab1fdbd355e6e0ec349177b69c` |
| Production | Untouched |

Clarifications:

- C1 is **technically closed**.
- The governance deviation is **permanently recorded**.
- The exception does **not** establish a precedent.
- Future slices must return to the standard PR workflow.

---

## 2. Slice Objective

Slice C1 created the **backend and persistence foundation** for the employee’s first-day experience at NordHabitat.

The objective was to support:

- employee inbox state;
- message read state;
- employee task state;
- task unlocking after message reading;
- task completion;
- authenticated employee scoping;
- deterministic first-day content;
- persistent employee state.

**Architectural principle:**

> Content in code.  
> State in database.

Static first-day content (Claire Fontaine’s manager message; first operational task) lives in API catalog code. The database stores only per-employee progress state.

---

## 3. Delivered Scope

### API

- First-day module under `apps/api`
- Authenticated employee resolution through `requireEmployee`
- Inbox and task routes
- Employee-scoped state handling
- Integration tests

### Contracts

- Shared first-day contracts (`packages/contracts/src/first-day.ts`)
- Contract validation tests

### Database

- `EmployeeMessageState`
- `EmployeeTaskState`
- Prisma schema updates
- Migration:  
  `packages/database-erp/prisma/migrations/20260709120000_rc01_first_day_foundation/migration.sql`

### Public routes

| Method | Path |
|--------|------|
| GET | `/api/v1/me/inbox` |
| POST | `/api/v1/me/inbox/:messageKey/read` |
| GET | `/api/v1/me/tasks` |
| POST | `/api/v1/me/tasks/:taskKey/complete` |

Public routes use `/api/v1/me/...` (not `/api/v1/first-day/*`).

---

## 4. Functional Rules

Confirmed behavior:

1. All routes require authentication.
2. Employee state is scoped by authenticated `employeeId`.
3. GET routes do not create database rows.
4. Inbox returns the Claire message with `readAt` null before it is read.
5. POST read creates the employee state.
6. POST read is idempotent.
7. GET tasks returns an empty array before the Claire message is read.
8. Reading the Claire message unlocks the first-day task.
9. POST complete returns **409** if the message prerequisite was not completed.
10. POST complete is idempotent.
11. Unknown message or task keys return **404**.
12. No real student data is embedded in the implementation.
13. Content remains deterministic in code while employee progress remains persistent in the database.

---

## 5. Scope Exclusions

C1 did **not** include:

- `apps/web` implementation;
- C2 user interface;
- `docs/` changes as part of the C1 implementation commit;
- seed changes;
- TEC.WMS changes;
- `official_documents` changes;
- production deployment;
- production database migration;
- `main` branch changes;
- UX Polish;
- professor console;
- Mission Center;
- AI Mentor implementation.

The governance exception note (`engineering/rc01/RC01_SLICE_C1_GOVERNANCE_EXCEPTION.md`) was added afterward as a **recovery artifact** and is **not** part of the original C1 implementation scope (`2670a68`).

---

## 6. Validation Evidence

| Gate / check | Result |
|--------------|--------|
| `pnpm turbo lint typecheck test build --force` | **36/36** tasks successful |
| `pnpm env:check` | Passed |
| `pnpm --filter erp-api test` | **48** passed, **0** failed |
| Railway validation PostgreSQL | Migration applied successfully; **3** migrations applied; schema up to date |
| Seed | Idempotent; executed twice successfully |
| Secret sweep | Clean |
| Post-merge validation | Passed |
| `official_documents/site/` | Remained untracked and excluded |
| `origin/main` | Unchanged |
| Production | Untouched |

---

## 7. Database and Migration Record

| Field | Value |
|-------|-------|
| Migration name | `20260709120000_rc01_first_day_foundation` |
| Applied to | Railway **validation** PostgreSQL only |
| Not applied to | Production PostgreSQL |
| Validation result | Schema up to date with three migrations applied |
| Data classification | No real student data; no production data; no secrets |
| Rollback | Not required |
| Production migration | Not authorized and not performed |

---

## 8. Governance Record

Reference: `engineering/rc01/RC01_SLICE_C1_GOVERNANCE_EXCEPTION.md`

Recorded facts:

- C1 was incorporated into `release/rc01` by **direct fast-forward push**.
- A GitHub PR was **not** created.
- Formal PR review and approval were **absent**.
- The technical implementation was accepted **retroactively**.
- The process deviation was formally approved and recorded on **2026-07-10**.
- The original direct merge remains **non-compliant** with the standard workflow.
- No further direct release pushes or merges are permitted without explicit prior approval.
- C2 must return to the **real PR workflow**.

This checkpoint does **not** state that the exception makes the original merge governance-compliant.

---

## 9. Risk Assessment

| Risk | Assessment |
|------|------------|
| Technical risk | **Low** |
| Governance risk | **Contained** through formal exception record |
| Production risk | **None observed** |
| Data risk | **None observed** |
| Regression risk | **Low** based on full gate and API test evidence |
| Future process risk | Controlled only if PR governance is enforced going forward |

---

## 10. Closure Decision

**RC01 Slice C1 — First-Day Foundation is CLOSED / GREEN.**

- The technical implementation is accepted.
- The governance deviation is recorded and contained.
- No rollback is required.
- C1 is now eligible to serve as the stable backend foundation for C2.

---

## 11. Next Authorized Step

Exact sequence:

1. Review this proposed checkpoint.
2. Receive explicit approval.
3. Commit **only** this checkpoint file.
4. Push the checkpoint commit to `release/rc01`.
5. Verify the remote branch.
6. Freeze Agent 0 writing activity on C2.
7. Launch read-only C2 reviews in parallel:
   - Agent A — Architecture
   - Agent D — Learning Intelligence
   - Agent F — Enterprise UX
   - Agent G — QA and Smoke
8. Consolidate findings.
9. Authorize one controlled C2 correction round.
10. Run automated gates.
11. Run manual smoke.
12. Issue GO or HOLD.
13. Commit C2 only after GO.
14. Push `feature/rc01-first-day-web`.
15. Open a real GitHub PR into `release/rc01`.
16. Review, approve, merge, validate, and checkpoint C2.

---

## 12. Approval Record

| Field | Value |
|-------|-------|
| Checkpoint status | **Approved** |
| Prepared by | Agent 0 / Release Captain |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-10 |
| Date approved | 2026-07-10 |

This checkpoint was explicitly reviewed and approved on 2026-07-10. Its approval formally closes RC01 Slice C1 as the stable backend and persistence foundation for the first-day web experience.
