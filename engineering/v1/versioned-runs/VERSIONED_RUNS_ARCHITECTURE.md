# TEC.ERP — Versioned Pedagogical Runs Foundation · Architecture

**Status:** Foundation implemented (worktree `feature/versioned-pedagogical-runs-foundation`)  
**Baseline `main`:** `e8761d8`  
**Authoritative product SHA (pre-foundation):** `2378b2b`  
**Design input:** PR #24 (design only — not an implementation merge source)  
**Official product docs (`docs/`):** not modified

---

## 1. Purpose

Introduce **PedagogicalCourseRun** as the versioning boundary for a learner’s course history so that:

- Legacy Zero1 / Run 1 progress is preserved immutably as sequence `1`
- Future runs (instructor-led, remediation, demonstration) do not overwrite prior evidence
- Analytics and certification can attribute outcomes to a specific run without double-counting students by default

Business before software: a run is a **pedagogical attempt**, not a technical session.

---

## 2. Core entity

| Field | Role |
|-------|------|
| `runCode` | Globally unique institutional code |
| `runSequence` | Per `(employeeId, courseId)` ordinal (`1` = legacy / first) |
| `runType` | `AUTONOMOUS` \| `INSTRUCTOR_LED` \| `REMEDIATION` \| `DEMONSTRATION` |
| `status` | `PLANNED` \| `ACTIVE` \| `PAUSED` \| `COMPLETED` \| `CANCELLED` \| `ARCHIVED` |
| `sourceRunId` | Optional lineage to a prior run |
| `completionPercent` | Snapshot progress for list/banner |
| `reflectionsEnabled` | Typed boolean (default `false`) — enables post-mission reflections for this run only |
| `metadataJson` | Extensible (e.g. `legacyBackfill`, create `reason`, `personaValidation`) |

Supporting entities:

- `PedagogicalCourseRunAudit` — lifecycle / create / backfill audit
- `ProfessorIntervention` — professor support logged against a run
- `StudentMissionReflection` — per-mission learner reflection scoped to a run (`@@unique([runId, missionKey, employeeId])`)

### Student reflection workflow

- Create / read / list / update reflections are **run-scoped**
- Writes only when run is `ACTIVE` **and** `reflectionsEnabled === true`
- Historical / completed / archived / cancelled runs reject writes
- Run 1 backfill keeps `reflectionsEnabled = false`; Run 2 begins with zero reflections (no copy from source)
- All reflection rows belong to `pedagogicalCourseRunId` via `runId`
- Student UI: compact post-mission form when enabled; never blocks mission completion unless separately configured
- Professor / Admin: averages, mission-level rows, qualitative notes, persona-validation indicator when metadata says so — no fabricated analytics when empty

---

## 3. Run-scoped learning surfaces

Required FK `pedagogicalCourseRunId` (NOT NULL after migration):

| Table | Uniqueness becomes |
|-------|--------------------|
| `employee_course_progress` | `(employeeId, courseId, pedagogicalCourseRunId)` |
| `employee_module_progress` | `(employeeId, moduleId, pedagogicalCourseRunId)` |
| `mission_attempt` | `(employeeId, missionDefinitionId, pedagogicalCourseRunId, attemptNumber)` |
| `unlock_state` | `(employeeId, resourceType, resourceKey, pedagogicalCourseRunId)` |
| `assessment_attempt` | `(employeeId, assessmentId, pedagogicalCourseRunId, attemptNumber)` |
| `capstone_submission` | `(employeeId, pedagogicalCourseRunId)` |

Nullable / provenance:

| Table | Column | On delete |
|-------|--------|-----------|
| `ai_interaction` | `pedagogicalCourseRunId` nullable | `SET NULL` |
| `certificate` | `sourceRunId` + `achievementType` | `SET NULL` on source run |

Partial unique index: **at most one `ACTIVE` run** per `(employeeId, courseId)`.

---

## 4. Active run resolution

Module: `apps/api/src/modules/pedagogical-run/pedagogical-run.resolution.ts`

**Precedence (read):**

1. Explicit run id (`?runId=` / `X-Tec-Run-Id` / body `runId`) — must belong to the employee
2. Latest `ACTIVE` by `updatedAt`
3. Latest `PAUSED`
4. Latest among `COMPLETED` \| `ARCHIVED` \| `CANCELLED` \| `PLANNED` by `runSequence` then `updatedAt`

**Write path:** only `ACTIVE` is writable (`requireWritableRun`). Missing ACTIVE → `409 CONFLICT`.

Context propagation: `AsyncLocalStorage` via `run-context.ts` + `withEmployeeRunContext` wraps mission / assessment / course / capstone handlers.

---

## 5. Layering

```
Presentation (web)
  PedagogicalRunBanner — FR labels from contracts; localStorage selected run id
Application (API routes)
  /api/v1/me|professor|admin/pedagogical-course-runs*
Business services
  pedagogical-run.service — create, transition, compare, interventions, unique-student metric
  mission / assessment / capstone / certification — consume resolved run context
Data
  Prisma PedagogicalCourseRun + run-scoped FKs
Infrastructure
  Migration 20260724120000_v1_pedagogical_course_runs
```

French presentation labels live in **contracts** (`PedagogicalRunTypeLabelFr` / `PedagogicalRunStatusLabelFr`) and are attached in `mapRun` — enums remain ASCII in persistence and APIs.

---

## 6. Lifecycle transitions

| From → Action | To |
|---------------|-----|
| `PLANNED` → `start` | `ACTIVE` |
| `ACTIVE` → `pause` | `PAUSED` |
| `PAUSED` → `resume` | `ACTIVE` |
| `ACTIVE` → `complete` | `COMPLETED` (requires 30 completed mission attempts on that run) |
| `PLANNED`\|`PAUSED` → `cancel` | `CANCELLED` |
| `COMPLETED`\|`CANCELLED` → `archive` | `ARCHIVED` |

`start` / `resume` refuse if another ACTIVE exists for the same employee+course.

New runs always create as `PLANNED` (empty progress; no copy of prior attempts).

---

## 7. Legacy Run 1 & James recognition

Migration backfill creates `runSequence = 1` for every employee with learning activity.

James Timothy is recognized **relationally** in SQL only:

- Cohort code `TECERP-PILOT-001` **and** employee number `TECERP-2026-PILOT-001`
- → `runCode = TECERP-PILOT-001-RUN1`
- → label `James Timothy — Run 1 — Autonomous Zero1 Validation`

**Not hardcoded in application TypeScript.** Default pattern for others: `{cohort|company}-{employeeNumber}-RUN1`.

---

## 8. Non-goals (this foundation)

- Creating James Run 2 (or any production Run 2) during this wave
- Auto-deploy to Railway
- Modifying official `docs/` product specifications
- Destructive rewrite of learning history
- Fully reversible “down” migration of uniqueness changes without backup restore
