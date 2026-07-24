# Run 2 — Owner Setup: Legitimate Thiago Gibran Professor

**Verdict contribution:** `RUN 2 PREPARATION HOLD — LEGITIMATE THIAGO PROFESSOR IDENTITY REQUIRED`  
**Production probe (2026-07-22):** **0** employees matching Thiago/Gibran; **0** `PROFESSOR` accounts; cohort `TECERP-PILOT-001` has **0** professor memberships.  
**Rule:** Do not fabricate email · do not hardcode Thiago in source/seed · do not invent identity from partial names.

Authoritative runbook: `engineering/v1/remediation/PROFESSOR_ACCOUNT_AND_ASSIGNMENT_RUNBOOK.md`

---

## Exact Admin UI steps (owner)

1. Sign in to production Web as an **ADMIN** of company **TECERP PILOT** (`TECERP-PILOT`).
2. Open **Administration**.
3. Under **Employés / professeurs**, create professor with **real institutional email** supplied by TEC:
   - `employeeNumber` — unique corporate number (owner-chosen)
   - `email` — real address for Thiago Gibran (owner-supplied; not invented here)
   - `displayName` — `Thiago Gibran`
   - `role` — `PROFESSOR`
   - temporary high-entropy password (share out-of-band; never commit)
4. Confirm the account appears with role `PROFESSOR` and same company `TECERP-PILOT`.
5. Under **Cohortes**, select **`TECERP-PILOT-001`**.
6. **Affecter** Thiago as professor.
7. Confirm audit event `admin.cohort.assign_professor`.
8. Sign in as Thiago → **Portail professeur**:
   - sees only authorized cohort/company
   - James Timothy appears on roster
   - no unrelated company access
9. Optionally verify remove/reassign audits in a non-destructive dry-run on a QA cohort — **not** on James progress.

### Equivalent Admin API

1. `POST /api/v1/admin/employees` with `role: "PROFESSOR"` and real email  
2. Resolve cohort id for `TECERP-PILOT-001`  
3. `POST /api/v1/admin/cohorts/:cohortId/assign-professor` with `{ "employeeId": "<thiago-id>" }`

---

## After owner completes setup

Re-run identity probe; record Thiago `employeeId` / `employeeNumber` / email (institutional) in Run 2 evidence **without** passwords.  
Only then may instructor-led execution proceed — and only after versioned pedagogical run support is deployed.
