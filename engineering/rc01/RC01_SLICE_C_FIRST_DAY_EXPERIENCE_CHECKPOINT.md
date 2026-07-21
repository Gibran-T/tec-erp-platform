# RC01 Slice C — First-Day Experience Checkpoint

## 1. Checkpoint Status

| Field | Value |
|-------|-------|
| Slice | RC01 Slice C |
| Name | First-Day Experience |
| Status | **CLOSED / GREEN** |
| Technical decision | **GO** |
| Governance decision | Accepted |
| Checkpoint date | 2026-07-10 |
| Release branch | `release/rc01` |
| Release HEAD | `db621561b85c156b861c72b1b2788bfb3997179c` |
| Main branch | Unchanged at `49608de08c1527ab1fdbd355e6e0ec349177b69c` |
| Production | Untouched |

Clarifications:

- C1 and C2 are both **technically closed**.
- Slice C is eligible to serve as the **complete first-day experience foundation**.
- No rollback is required.
- No production deployment occurred.
- No main merge occurred.

---

## 2. Slice Objective

Slice C delivers the employee’s **first-day journey** at NordHabitat.

The completed journey is:

Login
→ Workspace
→ Boîte de réception
→ Claire Fontaine’s message
→ message acknowledgement
→ Tâches
→ Découvrir NordHabitat
→ responsibility completion
→ persistent state across refresh and re-login

The experience is designed as:

- an enterprise workplace;
- employee identity;
- manager communication;
- operational responsibility;
- progressive access;
- persistent employee state;

and **not**:

- an LMS;
- a generic training dashboard.

---

## 3. C1 — Backend and Persistence Foundation

### Implementation

| Item | Value |
|------|-------|
| Commit | `2670a68e5361e39e6bd97056726135dc26f65dff` |

Delivered:

- employee inbox state;
- employee task state;
- authenticated employee scoping;
- deterministic content;
- persistent database state;
- read/unread;
- locked/unlocked task flow;
- task completion;
- idempotent POST behavior;
- 404/409 behavior;
- Railway validation migration.

### Routes

| Method | Path |
|--------|------|
| GET | `/api/v1/me/inbox` |
| POST | `/api/v1/me/inbox/:messageKey/read` |
| GET | `/api/v1/me/tasks` |
| POST | `/api/v1/me/tasks/:taskKey/complete` |

### Architectural principle

> Content in code.
> State in database.

### C1 status

**CLOSED / GREEN.**

---

## 4. C2 — First-Day Web Experience

| Item | Value |
|------|-------|
| Implementation commit | `db621561b85c156b861c72b1b2788bfb3997179c` |
| Pull request | [#3](https://github.com/Gibran-T/tec-erp-platform/pull/3) |

Delivered:

- Inbox page;
- Claire Fontaine message;
- Tasks page;
- Découvrir NordHabitat task;
- shared `FirstDayDataProvider`;
- shared state across Inbox, Tasks, and Context Panel;
- quiet refresh;
- French loading/error/success feedback;
- persistent state;
- accessibility improvements;
- narrow-screen support;
- deterministic integration test isolation.

### C2 status

**CLOSED / GREEN.**

---

## 5. User Experience Outcome

The learner:

- enters as an employee;
- sees NordHabitat identity;
- recognizes their role;
- receives a message from a manager;
- sees that information leads to responsibility;
- understands progressive access;
- completes a first operational responsibility;
- sees the state persist after refresh and re-login.

**Intended perception:**

> The learner does not begin a course.
> The employee enters a company.

---

## 6. Functional Validation

### Web

| Gate | Result |
|------|--------|
| lint | PASS |
| typecheck | PASS |
| tests | **37/37 PASS** |
| build | PASS |

### API

| Gate | Result |
|------|--------|
| lint | PASS |
| typecheck | PASS |
| tests | **48/48 PASS** |
| skipped | **0** |
| build | PASS |

### Full gate

| Gate | Result |
|------|--------|
| `pnpm turbo lint typecheck test build --force` | **36/36 successful** |
| `pnpm env:check` | PASS |
| `git diff --check` | PASS |

### Test determinism

- integration test uses test-owned data;
- run-unique employee;
- synthetic keys (`itest-message-*`, `itest-task-*`);
- guaranteed cleanup in `finally`;
- no demo/student state cleanup;
- three consecutive API test runs: **48 / 0 / 0** each.

Note: under Turbo, API integration suites may skip when `DATABASE_URL` is not passed through Turbo’s environment model. The authoritative integration proof was executed explicitly via `pnpm --filter erp-api test` with the Railway validation `DATABASE_URL`.

---

## 7. Manual Smoke Validation

| Step | Result |
|------|--------|
| login | PASS |
| `/workspace` | PASS |
| employee identity | PASS |
| Inbox initial state | PASS |
| Claire message | PASS |
| message read | PASS |
| Context Panel synchronization | PASS |
| task unlock | PASS |
| task completion | PASS |
| Context Panel synchronization after completion | PASS |
| refresh persistence | PASS |
| navigation persistence | PASS |
| logout/login persistence | PASS |
| protected route after logout | PASS |
| keyboard/focus | PASS |
| browser console | PASS |
| responsive behavior | PASS |

### Responsive results

| Viewport | Result |
|----------|--------|
| 390px | PASS |
| 480px | PASS |
| 768px | PASS |
| 1280px | PASS |

Recorded outcomes:

- no horizontal overflow;
- desktop layout preserved;
- Inbox and Tasks readable;
- context panel retained.

Post-merge focused runtime spot check (2026-07-10) also confirmed login, workspace, Inbox, Claire persistence, Tasks completion, context panel alignment, 390px overflow-free layout, protected route after logout, and a clean console.

---

## 8. Data and Environment Record

- Railway validation PostgreSQL only;
- no production DB access;
- no production migration;
- no schema change in C2;
- no migration change in C2;
- no seed change;
- no real student data embedded;
- demo state preserved;
- no secrets committed;
- production untouched;
- main untouched;
- TEC.WMS untouched;
- `official_documents/site/` excluded.

---

## 9. Governance Record

C1 and C2 are documented separately.

### C1

- C1 was incorporated by **direct fast-forward push without a PR**.
- A governance exception was formally recorded.
- The exception does **not** establish precedent.

Reference: `engineering/rc01/RC01_SLICE_C1_GOVERNANCE_EXCEPTION.md`

Related commits:

| Item | SHA |
|------|-----|
| C1 implementation | `2670a68e5361e39e6bd97056726135dc26f65dff` |
| Governance exception | `35d09f6acd2bab907f57cebe6cdc7830d94389cf` |
| C1 checkpoint | `407e626599037ad34d46a1ab594e1dc0d03c17e5` |

### C2

- PR **#3** existed.
- Base: `release/rc01`.
- Head: `feature/rc01-first-day-web`.
- One commit.
- Fifteen files.
- Checks passed (2/2).
- Owner GO was given.

GitHub reports:

| Field | Value |
|-------|-------|
| merged | `true` |
| merged_at | `2026-07-10T22:50:35Z` |
| merged_by | `Gibran-T` |
| merge_commit_sha | `db621561b85c156b861c72b1b2788bfb3997179c` |

Honest method note:

- the final incorporation used **local fast-forward + direct push** because GitHub CLI (`gh`) was unavailable;
- GitHub still retained and recognized the **merged PR record**;
- this is a **merge-method deviation**;
- it is **not** equivalent to the missing-PR exception in C1;
- it must **not** become the standard workflow;
- future merges must use the GitHub Merge UI or authenticated `gh`/API.

---

## 10. Risk Assessment

| Risk | Assessment |
|------|------------|
| Technical risk | Low |
| Regression risk | Low |
| Data risk | None observed |
| Production risk | None observed |
| Governance risk | Contained |
| Future process risk | Controlled only if standard PR merge method is enforced |

---

## 11. Scope Exclusions

Slice C does **not** include:

- Mission Center;
- professor console;
- AI Mentor;
- certification;
- scoring;
- ERP transactions;
- UX Polish Wave;
- production deployment;
- main merge;
- final RC01 release;
- rebaseline implementation.

---

## 12. Closure Decision

**RC01 Slice C — First-Day Experience is CLOSED / GREEN.**

- C1 provides the stable backend and persistence foundation.
- C2 provides the complete first-day web experience.
- The full employee journey has passed automated validation, integration tests, responsive validation, runtime smoke, and post-merge validation.
- No rollback is required.

---

## 13. Next Authorized Step

1. Review this checkpoint.
2. Receive explicit approval.
3. Commit only this checkpoint.
4. Push the checkpoint commit to `release/rc01`.
5. Verify the remote branch.
6. Freeze Slice C.
7. Perform RC01 rebaseline.
8. Define the remaining RC01 slices.
9. Plan the Enterprise Workplace Refinement wave.
10. Do not start UX Polish before the rebaseline is approved.
11. Do not merge to main or deploy production without explicit approval.

---

## 14. Approval Record

| Field | Value |
|-------|-------|
| Checkpoint status | **Approved** |
| Prepared by | Agent 0 / Release Captain |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-10 |
| Date approved | 2026-07-10 |

This checkpoint was explicitly reviewed and approved on 2026-07-10. Its approval formally closes RC01 Slice C — First-Day Experience and freezes C1/C2 as the validated first-day foundation for the next RC01 planning gate.
