# RC01 Slice C1 — Governance Exception

## 1. Summary

RC01 Slice C1 was incorporated into `release/rc01` through a **direct fast-forward push** rather than through the required GitHub PR, review, approval, and merge workflow.

| Item | Value |
|------|-------|
| C1 commit | `2670a68` |
| Target branch | `release/rc01` |
| GitHub PR audit trail | **Absent** |

Slices A and B used the proper PR workflow (PR #1 and PR #2 merge commits on `release/rc01`). This record exists to document and formally contain the C1 exception. It does not amend TEC.ERP governance.

## 2. Reason

During the C1 release sequence:

- GitHub CLI (`gh`) was unavailable on the engineering workstation.
- A manual GitHub PR was **not** opened before the local fast-forward merge.
- The release branch was pushed directly afterward (`origin/release/rc01` → `2670a68`).

This was a **process deviation**, not an approved change to the governance model. Unavailability of the CLI is **not** sufficient justification for bypassing the required PR, review, and explicit merge-approval controls.

## 3. Technical Evidence

| Evidence | Result |
|----------|--------|
| Commit | `2670a68` — `feat(rc01): implement Slice C1 first-day foundation` |
| Parent / checkpoint base | `563688d` |
| `origin/release/rc01` HEAD | `2670a68` |
| `origin/main` HEAD | `49608de` (untouched) |
| Scope | `apps/api`, `packages/contracts`, `packages/database-erp`, Prisma migration `20260709120000_rc01_first_day_foundation` |
| `apps/web` in C1 | None |
| `docs/` in C1 | None |
| Seed changes | None |
| TEC.WMS changes | None |
| `official_documents` changes | None |
| Real student data | None |
| Secrets in diff | None (secret sweep clean) |
| Production database access / migration | None |
| Migration target | Railway **validation** PostgreSQL only |
| Validation DB migrate status | 3 migrations applied; schema up to date |
| `pnpm turbo lint typecheck test build --force` | **36/36** successful |
| `pnpm env:check` | Passed |
| `pnpm --filter erp-api test` | **48** passed, **0** failed |
| `official_documents/site/` | Remained untracked and excluded |
| Production deployment | Not performed |

## 4. Governance Deviation

### Expected sequence

Implement → QA/Gate → GO → Commit → Push feature branch → GitHub PR → Review → Explicit merge approval → Merge into `release/rc01` → Post-merge validation → Checkpoint

### What occurred

1. Feature branch `feature/rc01-first-day-foundation` was pushed to origin.
2. A GitHub PR into `release/rc01` was **not** created.
3. Formal PR review and explicit merge approval did **not** occur.
4. A local fast-forward merge of C1 into `release/rc01` was performed.
5. `release/rc01` was pushed directly to origin (`563688d` → `2670a68`).
6. No GitHub merge commit or PR record exists for C1.

## 5. Risk Assessment

| Risk | Level | Notes |
|------|-------|-------|
| Technical risk | **Low** | Supported by scope isolation, full validation gate, API tests, migration validation, and post-merge verification |
| Governance risk | **Moderate** | The required PR review and approval audit trail is missing |
| Production risk | **None observed** | Production was not deployed or migrated |
| Data risk | **None observed** | Only the Railway validation database was migrated; no real student data was involved |
| Future process risk | **Material if repeated** | Repetition would weaken release traceability and approval controls |

## 6. Corrective Actions

The following actions are mandatory:

1. This exception is formally documented under `engineering/rc01`.
2. No further direct push or direct merge to `release/rc01` is permitted without explicit prior approval.
3. All future slices must return to the standard PR workflow.
4. GitHub CLI must be installed/configured, or PRs must be opened manually in GitHub before any future merge.
5. C2 must remain uncommitted, unpushed, and unmerged until this exception record is reviewed, approved, committed, and pushed.
6. C2 must use a real PR from `feature/rc01-first-day-web` into `release/rc01`.
7. `official_documents/site/` must remain untracked and excluded.
8. Production and `main` remain protected.
9. A Slice C1 checkpoint may be created only after this governance exception is approved and committed.
10. The direct merge must not be treated as a precedent or as an amendment to the TEC.ERP governance process.

## 7. Decision

RC01 Slice C1 is accepted retroactively as a **technical GO**, subject to this formally recorded governance exception.

Clarifications:

- Technical acceptance does **not** mean the original merge was governance-compliant.
- The governance deviation remains part of the permanent engineering audit record.
- No rollback is required because no technical or production defect was identified.
- Future work must resume under the normal release workflow.

## 8. Approval Record

| Field | Value |
|-------|-------|
| Exception status | **Approved** |
| Prepared by | Agent 0 / Release Captain |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-10 |
| Date approved | 2026-07-10 |

This governance exception was explicitly reviewed and approved on 2026-07-10. Its approval records the process deviation and technical acceptance of C1; it does not make the original direct merge governance-compliant.

## 9. Next Step

Exact sequence to close this exception and resume RC01:

1. Review the proposed exception note.
2. Receive explicit approval.
3. Commit **only** the governance exception file.
4. Push the exception commit to `release/rc01`.
5. Verify the remote branch and clean staging state.
6. Create the Slice C1 checkpoint under a separate controlled task.
7. Resume formal C2 review and manual smoke.
8. Authorize C2 commit only after all preceding gates are closed.
9. Push the C2 feature branch.
10. Open a GitHub PR into `release/rc01`.
11. Review, approve, merge, validate, and checkpoint C2.
