# James Run 2 — Versioned Pedagogical Run Architecture

**Verdict contribution:** `RUN 2 PREPARATION HOLD — VERSIONED PEDAGOGICAL RUN SUPPORT REQUIRED`  
**Date:** 2026-07-22  
**Rule:** No destructive reset · no overwrite of Run 1 · no deploy of this wave until owner-authorized product gate

---

## 1. Architectural gap (as of main `e8761d8` / product `2378b2b`)

TEC.ERP does **not** support multiple pedagogical course runs per student.

| Area | Current uniqueness | Effect |
|------|-------------------|--------|
| `EmployeeCourseProgress` | `@@unique([employeeId, courseId])` | One progress row — Run 2 would overwrite Run 1 |
| `EmployeeModuleProgress` | `@@unique([employeeId, moduleId])` | Same |
| `MissionAttempt` | `@@unique([employeeId, missionDefinitionId, attemptNumber])` | Lifetime counter, not run-partitioned |
| `AssessmentAttempt` | `@@unique([employeeId, assessmentId, attemptNumber])` | Same |
| `CapstoneSubmission` | `employeeId @unique` | One Capstone — upsert overwrites |
| `UnlockState` | `@@unique([employeeId, resourceType, resourceKey])` | Global unlock |
| `Certificate` | number unique; active-type guard in service | Not run-scoped; second Silver/Gold blocked while issued |
| Instructor vs autonomous mode | **absent** | No `runType` |
| `CourseRun` / enrollment entity | **absent** | Zero hits in schema/API |

**Forbidden for Run 2 without versioning:** delete attempts, zero progress, professor `reset_attempt` as a substitute for a new run, reusing current progress rows.

---

## 2. Preferred Run 2 model (product requirement)

| Field | Value |
|-------|-------|
| runCode | `TECERP-PILOT-001-RUN2` |
| runType | `INSTRUCTOR_LED` |
| runLabel | James Timothy — Run 2 — Instructor-Led Pedagogical Validation |
| runSequence | 2 |
| status | `PLANNED` → `ACTIVE` → `PAUSED` → `COMPLETED` / `CANCELLED` |
| baselineRun | `RUN1_AUTONOMOUS_ZERO1` |
| student | James Timothy (`TECERP-2026-PILOT-001`) |
| professor | Thiago Gibran (legitimate account — not fabricated) |
| company | `TECERP-PILOT` |
| cohort | `TECERP-PILOT-001` |
| language | FR |

---

## 3. Smallest safe product surface (separate PR — do not deploy here)

### 3.1 Schema (additive)

```text
PedagogicalCourseRun
  id, employeeId, courseId, companyId, cohortId?
  runCode String @unique
  runSequence Int
  runType String          // AUTONOMOUS | INSTRUCTOR_LED
  runLabel String
  status String           // PLANNED | ACTIVE | PAUSED | COMPLETED | CANCELLED
  baselineRunCode String?
  professorEmployeeId String?
  languageCode String @default("fr")
  startedAt DateTime?, pausedAt DateTime?, completedAt DateTime?
  createdAt, updatedAt
  @@unique([employeeId, courseId, runSequence])
```

Add nullable then backfilled `pedagogicalCourseRunId` to:

- `EmployeeCourseProgress`, `EmployeeModuleProgress`
- `MissionAttempt`, `UnlockState`
- `AssessmentAttempt`
- `CapstoneSubmission` (replace `employeeId @unique` with `@@unique([employeeId, pedagogicalCourseRunId])`)
- Optional provenance on `Certificate` (`pedagogicalCourseRunId` nullable; never delete Run 1 certs)

**Backfill:** create Run 1 row `TECERP-PILOT-001-RUN1` / `AUTONOMOUS` / `COMPLETED` and attach all existing James rows.

**Active-run rule:** at most one `ACTIVE` run per employee×course (app-enforced + partial unique index if available).

### 3.2 API (minimal)

- `POST /api/v1/admin/pedagogical-course-runs` — open Run N (close/pause prior ACTIVE)
- `GET /api/v1/me/pedagogical-course-runs` — list history
- `POST /api/v1/me/pedagogical-course-runs/:id/activate` — switch active run (authorized)
- Professor roster shows `runCode` / `runSequence` / `runType`
- All mission/assessment/capstone/course reads/writes resolve **active run only**

### 3.3 Non-goals for smallest slice

- Full Learning Hub content
- Visual excellence / dark mode / bilingual wave
- Destructive “reset James” ops endpoint

### 3.4 Test gates before any deploy

- Run 1 integrity hash unchanged after creating Run 2
- Run 2 starts 0/30 with separate attempts
- Capstone/assessments/certs for Run 2 do not revoke Run 1
- Company isolation unchanged
- Empty-DB migrate + upgrade path + API/Web suites green

### 3.5 Product PR policy

- Separate branch/PR from this pilot documentation PR
- **Do not deploy** until owner authorization
- Run 2 **execution** remains blocked until product gate is green **and** legitimate Thiago identity exists

---

## 4. Why execution is blocked now

Creating Run 2 on the current model would require overwriting James’s single progress/Capstone lifetime — that would violate Run 1 immutability and governance §6/§31.
