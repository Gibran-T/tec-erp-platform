# Runbook — Professor Account Creation & Cohort Assignment

**Audience:** TEC.ERP Admin operators  
**Related:** Z1-003 / Z1-010 Zero1 remediation  
**Rule:** Never invent personal emails in code/seed. Never mutate James Timothy pilot records unless the owner explicitly authorizes a separate ops change.

---

## 1. Prerequisites

- Authenticated **ADMIN** account in the target company  
- Valid institutional email for the professor (provided by TEC, not fabricated)  
- Company already exists (e.g. institutional company or `TECERP-PILOT`)  
- API + Web healthy  

---

## 2. Create a professor (Admin UI or API)

### Required fields

| Field | Notes |
|-------|-------|
| `employeeNumber` | Unique corporate number |
| `email` | Real institutional address |
| `displayName` | Full name |
| `role` | `PROFESSOR` |
| `password` | High-entropy temporary; share out-of-band; force rotation policy |

### Admin API (supported after remediation)

`POST /api/v1/admin/employees`

Body (JSON):
```json
{
  "employeeNumber": "#TEC-PROF-…",
  "email": "professor@institution.example",
  "displayName": "Nom Complet",
  "role": "PROFESSOR",
  "password": "<temporary-high-entropy>"
}
```

Company is taken from the authenticated admin (client cannot choose another company).

### Promote existing employee

`PATCH /api/v1/admin/employees/:employeeId/role` with `{ "role": "PROFESSOR" }`  
Audited as `admin.employee.role_change`.

---

## 3. Create a cohort

`POST /api/v1/admin/cohorts`

```json
{ "code": "TECERP-COHORT-…", "name": "Nom de cohorte" }
```

Created in the admin’s company.

---

## 4. Assign professor to cohort

`POST /api/v1/admin/cohorts/:cohortId/assign-professor`

```json
{ "employeeId": "<professor-employee-id>" }
```

Rules:
- Employee must have role `PROFESSOR`
- Same company as cohort
- Membership `roleInCohort = "professor"`
- Audit: `admin.cohort.assign_professor`

### Remove professor

`POST /api/v1/admin/cohorts/:cohortId/remove-professor`  
```json
{ "employeeId": "<professor-employee-id>" }
```
Audit: `admin.cohort.remove_professor`

### Enroll student

Existing: `POST /api/v1/admin/cohorts/enroll` with `{ cohortId, employeeId }` (student membership).

---

## 5. Verify

1. Professor login → Portail professeur → cohort visible.  
2. Unassigned professor → cohort **not** visible.  
3. Admin → cohort list shows assigned professors.  
4. Audit events present for assign/remove.  
5. Student still cannot call professor APIs (403).

---

## 6. Reassignment

1. Remove previous professor from cohort (audited).  
2. Assign new professor (audited).  
3. Confirm Capstone queue / student roster for the new professor only.

---

## 7. Deactivation

Preferred: remove cohort membership + set employee inactive policy if available; otherwise remove professor role only after membership removal.  
Do not delete historical certificates or student attempts.

---

## 8. What not to do

- Do **not** hardcode Thiago Gibran (or any person) in seed/source.  
- Do **not** reuse QA passwords in production.  
- Do **not** assign professors across companies.  
- Do **not** modify James Timothy Zero1 records during routine assignment unless owner-approved.  
- Do **not** issue Gold without Capstone approval + eligibility.

---

## 9. Zero1 pilot follow-up (owner ops)

When a legitimate Thiago Gibran account exists:
1. Create/promote professor with the real email.  
2. Assign to `TECERP-PILOT-001`.  
3. Optionally re-approve Capstone / confirm Gold audit trail under that identity.  
4. Document in release notes — do **not** rewrite Zero1 evidence files.
