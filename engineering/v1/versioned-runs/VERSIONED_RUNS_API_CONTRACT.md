# TEC.ERP — Versioned Pedagogical Runs · API Contract

**Contracts package:** `packages/contracts/src/pedagogical-run.ts`  
**Routes:** `apps/api/src/modules/pedagogical-run/pedagogical-run.routes.ts`  
**Mounted in:** `apps/api/src/app.ts` under `/api/v1/me`, `/api/v1/professor`, `/api/v1/admin`  
**Auth:** Bearer employee session; role gates via `requireEmployee` / `requireProfessor` / `requireAdmin`

---

## 1. Enums (persistence / request ASCII)

**runType:** `AUTONOMOUS` | `INSTRUCTOR_LED` | `REMEDIATION` | `DEMONSTRATION`  
**status:** `PLANNED` | `ACTIVE` | `PAUSED` | `COMPLETED` | `CANCELLED` | `ARCHIVED`

**French labels (response projection only):**

| Enum | `runTypeLabel` / `statusLabel` |
|------|--------------------------------|
| AUTONOMOUS | Parcours autonome |
| INSTRUCTOR_LED | Parcours accompagné par le professeur |
| REMEDIATION | Parcours de remédiation |
| DEMONSTRATION | Parcours de démonstration |
| PLANNED | Planifié |
| ACTIVE | En cours |
| PAUSED | En pause |
| COMPLETED | Terminé |
| CANCELLED | Annulé |
| ARCHIVED | Archivé |

---

## 2. Resource shape — `PedagogicalCourseRun`

```ts
{
  id, companyId, cohortId, employeeId, professorId, courseId,
  runCode, runSequence, runType, runLabel, language, status, sourceRunId,
  startedAt, pausedAt, completedAt, cancelledAt, // ISO datetime | null
  completionPercent,
  runTypeLabel, statusLabel, // FR presentation
  isWritable,   // status === ACTIVE
  isHistorical  // COMPLETED | ARCHIVED | CANCELLED
}
```

---

## 3. Endpoints

### Student (`/api/v1/me`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/pedagogical-course-runs` | List runs for authenticated employee |

### Professor (`/api/v1/professor`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/pedagogical-course-runs` | Company list; filters: `employeeId`, `cohortId`, `status`, `runType` (scoped with `professorId = actor`) |
| `POST` | `/pedagogical-course-runs` | Create run (`PLANNED`) |
| `POST` | `/pedagogical-course-runs/:runId/transition` | Lifecycle transition |
| `GET` | `/pedagogical-course-runs/compare?leftRunId&rightRunId` | Same-student comparison |
| `POST` | `/pedagogical-course-runs/:runId/interventions` | Log professor intervention |

### Admin (`/api/v1/admin`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/pedagogical-course-runs` | Company list; filters include optional `professorId` |
| `POST` | `/pedagogical-course-runs` | Create run |
| `POST` | `/pedagogical-course-runs/:runId/transition` | Lifecycle transition |
| `GET` | `/pedagogical-course-runs/compare?leftRunId&rightRunId` | Comparison |
| `GET` | `/pedagogical-course-runs/metrics/unique-students` | Institutional unique-student count |

---

## 4. Create body — `CreatePedagogicalCourseRunRequest`

| Field | Required | Notes |
|-------|----------|-------|
| `employeeId` | yes | Same company as actor |
| `runType` | yes | Enum |
| `runLabel` | yes | ≤ 200 |
| `reason` | yes | ≤ 500; stored in metadata + audit |
| `language` | default `fr` | |
| `cohortId` | optional | Must include student membership |
| `professorId` | optional | PROFESSOR role; professor may only assign self |
| `sourceRunId` | optional | Same student |
| `plannedStartAt` | optional | ISO datetime → metadata |
| `runCode` | optional | Else `{cohort\|company}-{employeeNumber}-RUN{n}` |

Response: `201` + run. Conflict on duplicate `runCode`.

---

## 5. Transition body — `TransitionPedagogicalCourseRunRequest`

```json
{ "action": "start|pause|resume|complete|cancel|archive", "reason": "optional" }
```

See architecture doc for allowed matrix. Errors: `400` validation, `403` forbidden, `404` not found, `409` conflict (other ACTIVE / not writable).

---

## 6. Run selection on learning APIs

Mission / assessment / course / capstone handlers accept explicit run via (first match):

1. Query `runId`  
2. Header `X-Tec-Run-Id`  
3. Body `runId`

Otherwise resolution precedence applies (ACTIVE → PAUSED → historical). Writes require ACTIVE.

---

## 7. Compare response — `PedagogicalRunComparison`

Includes both mapped runs, completed mission counts, averages, attempt counts, assessment summaries, capstone statuses, certificate provenance, per-mission score deltas.  
Placeholder nulls (not yet computed): `professorInterventionRate`, `confidenceGain`, `noSlidesScore`.

---

## 8. Unique-student metric response

```json
{ "mode": "unique-student-latest-or-active", "studentCount": <number> }
```

See analytics policy for mode definitions beyond this endpoint.
