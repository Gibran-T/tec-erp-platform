# TEC.ERP — Versioned Pedagogical Runs · Security Model

**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`

---

## 1. Trust boundaries

| Boundary | Rule |
|----------|------|
| Authentication | All non-public routes require employee Bearer session |
| Student self | May list only own runs; may select own run for reads |
| Professor | Company-scoped; create/transition/intervene only for assigned cohort / self as professor |
| Admin | Company-scoped full list/create/transition + unique-student metric |
| Cross-company | Forbidden on student, cohort, professor, source run, and compare operands |

---

## 2. Authorization matrix

| Operation | STUDENT | PROFESSOR | ADMIN |
|-----------|---------|-----------|-------|
| List own runs | yes | n/a (use professor list) | n/a |
| List company runs | no | yes (filter `professorId=self`) | yes |
| Create run | no | yes (validated) | yes |
| Transition | no | yes if professor on run or cohort professor | yes |
| Compare | no | yes (same company + same student) | yes |
| Interventions | no | yes (run company + assignment checks) | via professor role if applicable |
| Unique-student metric | no | no | yes |
| Write learning data | yes only on **own ACTIVE** run | n/a | n/a |

Professor assigning `professorId` ≠ self → `403`. Non-cohort professor (non-admin) → `403`.

---

## 3. Explicit run id safety

`resolvePedagogicalRunForEmployee` with `explicitRunId`:

- Run must exist  
- `run.employeeId` must equal the authenticated learner  

Otherwise `403` *Parcours pédagogique non autorisé.*  
Prevents horizontal access to another student’s run via `runId` / `X-Tec-Run-Id`.

---

## 4. Write protection

| Control | Implementation |
|---------|----------------|
| ACTIVE-only writes | `requireWritableRun` / `WRITE_STATUSES` |
| One ACTIVE per employee+course | Partial unique index + start/resume conflict |
| Context mandatory for repositories | `requireCurrentPedagogicalRunId()` throws if ALS missing |
| Complete gate | 30 completed missions on that run before `complete` |

Historical / paused runs are read-only for mutations.

---

## 5. Audit & forensics

- `pedagogical_course_run_audit`: create, transitions, legacy_backfill  
- Certificate audits unchanged for issue/revoke  
- AI interactions store optional `pedagogicalCourseRunId` (nullable) — no elevation of privilege  

---

## 6. Secrets & PII

- No credentials in migration or run metadata  
- James identity recognized only via relational cohort + employee number in SQL backfill  
- Do not log access tokens or certificate raw verify tokens in run audits  

---

## 7. Production safety flags

- No auto-deploy of this foundation  
- No production creation of James Run 2 in this wave  
- Backup required before migrate (compromised rollback otherwise)  
- Official `docs/` untouched — security narrative lives in `engineering/v1/versioned-runs/`
