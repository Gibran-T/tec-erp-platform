# RC01 Slice D — Mission Center and Enterprise Discovery Plan

## 1. Plan Status

| Field | Value |
|-------|-------|
| Status | **Proposed / Pending approval** |
| Slice | RC01 Slice D |
| Name | Mission Center and Enterprise Discovery |
| Mission | M1-M01 — Découvrir l’entreprise |
| Planning baseline | `33e6924789b965caa5da49e82d8e41dd9c77b77a` |
| Branch | `release/rc01` |
| Main | Unchanged at `49608de08c1527ab1fdbd355e6e0ec349177b69c` |
| Production | Untouched |

This plan is **not** approved until the Project Owner explicitly reviews and approves it.

Owner decisions OD-D1 through OD-D4 are recorded as **Approved** in §26. The Slice D **plan document** itself remains Pending approval.

---

## 2. Slice Objective

Deliver the employee’s first post-Day-1 **enterprise discovery responsibility** at NordHabitat through a minimum Mission Center workplace surface and exactly one thin mission: **Découvrir l’entreprise**.

### Employee outcome

After completing Day 1, the employee:

- discovers that work continues through a Mission Center, not a course menu;
- receives a Claire Fontaine assignment in the Mission Center framed as workplace accountability;
- consults bounded NordHabitat context, including Tom’s 40-versus-36 fragmentation signal;
- maps departments to business problems;
- submits a short required justification;
- receives deterministic Claire/company feedback;
- sees mission evidence and status persist across refresh and re-login.

### Pedagogical outcome

The learner practices:

- organizational awareness (**C-ORG-01**, catalog metadata);
- business-process observation (**C-BUS-01**, catalog metadata);
- justification of a discovery decision without transactional authority.

### Explicit distinctions

| This slice is | This slice is not |
|---------------|-------------------|
| An enterprise discovery mission | Course content / LMS chapter UI |
| A thin vertical for one mission | A generic Mission Engine |
| Analytical Observer-Analyst work | ERP transaction execution |
| Evidence for future review | Scoring, quiz, certification, or AI evaluation |

---

## 3. End-to-End Employee Journey

Precondition frozen by Slice C: Claire message read **and** task `decouvrir-nordhabitat` completed (`terminee`).

| Step | User action | System response | Business meaning | State transition | Validation evidence |
|------|-------------|-----------------|------------------|------------------|---------------------|
| 0 | Completes Day-1 task | Task `decouvrir-nordhabitat` = `terminee` | Day 1 closed | Day-1 complete | Existing First-Day APIs/tests |
| 1 | Opens workspace after Day 1 | Mission Center access becomes available; `GET /me/missions` shows unlocked summary | Work continues beyond onboarding | Derived `available` | UI access + unlocked mission summary |
| 2 | Opens Centre de mission | Sees Claire assignment briefing for Découvrir l’entreprise (Mission Center only; no new Inbox message) | Manager hands off discovery responsibility | `available` visible | Mission list + briefing preview |
| 3 | Starts the mission | `POST …/start` creates attempt | Employee accepts the discovery responsibility | `available` → `in_progress` | Attempt row; `startedAt` |
| 4 | Reads briefing / context | Detail shows context items, departments, problems (no allowed-answer matrix) | Fragmentation is a business problem, not a stock ticket | Remains `in_progress` | Detail payload without server answer hints |
| 5 | Maps departments to problems | Client drafts selections; server validates on submit | Analytical business decision | Remains `in_progress` until submit | Server-side mapping validation |
| 6 | Acknowledges required inputs and enters justification | Client includes `acknowledgedInputKeys` + justification | Professional accountability | Remains `in_progress` until submit | Validation / 400 cases |
| 7 | Submits discovery | Completes mission; returns Claire/company feedback | Responsibility closed | `in_progress` → `completed` | Idempotent submit; feedback persistent |
| 8 | Refreshes / re-logins | Completed state + evidence + feedback remain | Workplace memory | No reset | Remount + API re-fetch smoke |
| 9 | Views Context Panel | Distinct « Mission actuelle » block (not Day-1 checklist items) | Continuity of responsibility | Panel sync | Web shared-state tests |

---

## 4. Unlock and Progression Rules

### Day-1 precondition (exact)

Mission Center and M1-M01 are unlocked only when the authenticated employee has:

1. `EmployeeMessageState` for `premier-message-gestionnaire` with non-null `readAt`; and
2. `EmployeeTaskState` for `decouvrir-nordhabitat` with non-null `completedAt`.

If either is missing: mission remains **locked**.

### States

| State | Meaning | Persistence |
|-------|---------|-------------|
| `locked` | Day-1 incomplete | Derived — no attempt row |
| `available` | Unlocked; not started | Derived — no attempt row |
| `in_progress` | Started; evidence not yet accepted as complete | Attempt row exists; `startedAt` set |
| `completed` | Valid submission accepted; feedback available | Attempt row; `completedAt` + evidence set |

`submitted` is not a durable intermediate for Slice D: submit validates and completes atomically from `in_progress` only (see §8/§10).
`follow_up_required` is **not** used; incomplete structure is rejected with **400**, and the attempt remains `in_progress`.

### Lifecycle behavior

| Behavior | Rule |
|----------|------|
| Refresh / re-login | Backend is source of truth; UI remount re-fetches attempt state; no localStorage mission state |
| Invalid transition | Locked → start/submit → `409`; `available` → submit → `409`; unknown mission → `404`; invalid evidence → `400 VALIDATION` |
| Start | **Mandatory.** Only `POST …/start` creates `EmployeeMissionAttempt`, sets `in_progress` and `startedAt` |
| Submit | Accepted **only** from `in_progress`; never creates an attempt |
| Idempotency | Repeat `start` when already `in_progress`/`completed` returns current state; repeat `submit` when already `completed` returns the same persisted completion/feedback |

No scoring language in any state.

---

## 5. Business Scenario

### Claire’s role

Claire Fontaine assigns Découvrir l’entreprise as the first post-Day-1 responsibility. The **Mission Center is the official assignment surface**. No additional Inbox message is created in Slice D. She expects an informed observation of fragmentation, not a stock correction.

### NordHabitat context (bounded for D)

Minimum mission context (catalog content, not Slice E full ERP):

- company identity (NordHabitat);
- short discovery briefing;
- selected departments for mapping;
- Tom’s inventory discrepancy as a narrative signal.

### Tom’s 40 versus 36

- System shows **40**; shelf shows **36**.
- Business meaning: fragmented information / ownership gaps.
- Employee role: **Observer-Analyst**.
- Explicit non-action: no inventory adjustment, posting, goods movement, or reconciliation transaction.

### Departments (recommended catalog subset for D)

Aligned to Blueprint SCN-M1-M01 naming, adapted to NordHabitat:

1. Direction (Executive)
2. Opérations
3. Finance
4. Ventes
5. Approvisionnement
6. Entrepôt
7. TI

### Business problems / symptoms (recommended)

Examples (final French copy owned by catalog):

- inventaire divergent entre système et réalité;
- délais d’approvisionnement;
- plaintes clients liées au service;
- visibilité financière incomplète;
- dépendances TI / cohérence des données;
- coordination multi-départements insuffisante.

### Expected analytical decision

Employee maps a **valid subset** of department↔problem relationships (server-side allowed table; never exposed to the client), then justifies why fragmentation affects those departments.

### Short justification

Required professional paragraph (French), length-bounded; explains the observation.

### Business feedback

Deterministic Claire/company acknowledgment keyed by completion; may reference that later operational decisions occur outside discovery; never grades, scores, or AI-evaluates.

---

## 6. Mission Content Model

Content stays **in code** (catalog), following Slice C1 principle: *content in code; state in database*.

| Content item | Proposed key / location | Why content, not employee state |
|--------------|-------------------------|---------------------------------|
| Mission identity | `m1-m01-decouvrir-entreprise` | Stable curriculum identity shared by all employees |
| Title (FR UI) | Découvrir l’entreprise | Display catalog; never show internal `M1-M01` as primary UI title |
| Briefing | catalog body | Same Claire Mission Center assignment for all cohorts |
| Context items | e.g. `ctx-nordhabitat-overview`, `ctx-tom-40-36` | Shared discovery inputs |
| Department catalog subset | e.g. `dept-entrepot` … | Shared option list for D (not full org ERP); **sent to client** |
| Problem catalog | e.g. `prob-inventaire-divergent` … | Shared analytical vocabulary; **sent to client** |
| Allowed mappings | relationship table in **server-side** catalog only | Pedagogical validity rules; **never exposed** to web clients or API detail payloads |
| Competency refs | `C-ORG-01`, `C-BUS-01` | Deterministic **catalog metadata only** — not persisted on the attempt |
| Feedback variants | e.g. `fb-discovery-complete` | Deterministic manager response |
| French copy keys | web copy + catalog | Workplace language consistency |

**Must not reuse** frozen Day-1 task key `decouvrir-nordhabitat` as the mission key. Day-1 task = orientation; M1-M01 = enterprise discovery.

Slice E remains the home of richer read-only organizational ERP. Slice D embeds only the **minimum context** required by M1-M01.

**Answer confidentiality:** the frontend receives department and problem options only. Validation of allowed relationships occurs on the server. Tests and server code may inspect the allowed table. User payloads and mission detail responses never reveal accepted mappings (`allowedMappingHints` and equivalents are forbidden).

---

## 7. Persistent State Model

### Recommendation

**New dedicated mission-attempt persistence**, not extension of `EmployeeTaskState`.

Rationale:

- Day-1 task state is intentionally minimal (`taskKey` + `completedAt`) and frozen.
- Mission evidence requires selections, justification, acknowledged inputs, feedback keys, and lifecycle timestamps.
- Extending task state would overload C1 semantics and risk dual-meaning keys.
- A thin `EmployeeMissionAttempt` remains evolvable without a Mission Engine.

### Approved model: `EmployeeMissionAttempt`

| Field | Purpose |
|-------|---------|
| `id` | Surrogate PK |
| `employeeId` | Ownership / scoping |
| `missionKey` | Catalog mission key |
| `status` | Persisted `in_progress` \| `completed` only (`locked`/`available` are derived) |
| `startedAt` | Set by mandatory `POST …/start` |
| `completedAt` | Set by successful `POST …/submit` |
| `acknowledgedInputKeys` | JSON string array of context keys the employee explicitly acknowledged in the submission |
| `departmentProblemMappings` | JSON array of `{ departmentKey, problemKey }` |
| `justification` | Required short text |
| `feedbackKey` | Catalog feedback key applied |
| `createdAt` / `updatedAt` | Audit |

Constraints:

- `@@unique([employeeId, missionKey])`
- FK to `Employee` (RESTRICT), indexed `employeeId`
- Only the owning employee may read/mutate

### Derived vs persisted

- `locked` and `available` are **derived**; **no** `EmployeeMissionAttempt` row exists before `POST …/start`.
- Only `start` creates the attempt (`in_progress` + `startedAt`).
- Only successful `submit` sets `completedAt`, evidence fields, and `feedbackKey`.

### Do not persist

- `assignedAt`
- `unlockedAt`
- `competencyCodes` (remain catalog metadata: `C-ORG-01`, `C-BUS-01`)
- score / percentage
- professor review fields
- AI evaluation fields
- versioned attempt history

### Acknowledged inputs (not analytics)

`acknowledgedInputKeys` represent context the employee **explicitly acknowledged/referenced** in the submission. They are **not** tamper-proof read analytics. No separate read-tracking endpoint is created. Required keys are validated server-side on submit.

### Test isolation

Mirror `first-day-foundation.test.ts`:

- dedicated `#ITEST-…` employee under `NORDHABITAT`;
- synthetic `itest-mission-…` keys **only** in schema/uniques tests if needed;
- route tests may use in-memory repo + demo employee;
- `finally` deletes attempt rows then employee;
- **never** delete demo progress.

### Explicit non-model

Do not create: Mission Engine aggregates, scoring tables, Competency Engine / competency snapshot tables, attempt history multi-row versions, AI evaluation rows, professor review rows.

---

## 8. State Machine

Approved progression: `locked` → `available` → `in_progress` → `completed`.

| From | To | Trigger | Precondition | DB effect | API | Forbidden / notes |
|------|----|---------|--------------|-----------|-----|-------------------|
| *(none)* | `locked` | GET when Day-1 incomplete | Message unread and/or task incomplete | None | 200 with locked summary + unlock explanation | Cannot start/submit; no full tools |
| `locked` | `available` | Day-1 becomes complete | Message read + task completed | None (derived) | Next GET shows available | Unlock is derived |
| `available` | `in_progress` | `POST …/start` (**mandatory**) | Day-1 complete; known mission; no attempt yet (or idempotent if already started) | **Create** attempt; set `status=in_progress`, `startedAt` | 200/201 | Repeat start idempotent |
| `in_progress` | `completed` | `POST …/submit` | Valid evidence; attempt exists | Persist evidence + `completedAt` + `feedbackKey`; `status=completed` | 200 | Incomplete evidence → 400; remains `in_progress` |
| `completed` | `completed` | start/submit repeats | Already complete | No semantic change | 200 same persisted payload | No reopen in D |

Forbidden transitions:

- `available` → `completed` via submit (**forbidden**; submit without start → **409**);
- `locked` → start/submit → **409**;
- `completed` → `in_progress` / `available` (no reopen);
- unknown `missionKey` → **404**;
- cross-employee access → impossible via employee scoping (401 if unauthenticated).

---

## 9. Contract Plan

Location: `packages/contracts/src/mission.ts` (new), re-exported from `packages/contracts/src/index.ts`.

Proposed Zod-backed shapes (names indicative):

| Contract | Purpose |
|----------|---------|
| `MissionKey` | Enum/literal `m1-m01-decouvrir-entreprise` |
| `MissionStatus` | `locked` \| `available` \| `in_progress` \| `completed` |
| `MissionSummary` | key, title, status, short preview; when locked, includes honest unlock explanation |
| `MissionDetail` | summary + (when unlocked) briefing + context items + department options + problem options + attempt evidence if any |
| `MissionAttemptState` | status, `startedAt`, `completedAt`, `acknowledgedInputKeys`, mappings, justification, feedback |
| `DiscoveryContextItem` | key, title, body/signal type |
| `DepartmentOption` / `ProblemOption` | key, label, short description |
| `DepartmentProblemMapping` | `{ departmentKey, problemKey }` |
| `MissionSubmitRequest` | `acknowledgedInputKeys`, mappings, justification |
| `MissionSubmitResponse` | attempt state + feedback content |
| `MissionsResponse` | `{ missions: MissionSummary[] }` |
| Standard API errors | Existing `ApiErrorEnvelope` |

**Forbidden on client contracts / detail payloads:** `allowedMappingHints`, accepted-answer matrices, or any field that reveals the server-side allowed relationship table.

Do not invent parallel pagination/scoring envelopes.

---

## 10. API Plan

Mount under existing authenticated employee surface:

`app.use("/api/v1/me", requireEmployee, …)`

### Approved route set (no additional endpoint)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/v1/me/missions` | List mission summaries for current employee |
| GET | `/api/v1/me/missions/:missionKey` | Mission detail + attempt state + client-safe options |
| POST | `/api/v1/me/missions/:missionKey/start` | Mandatory transition available → in_progress; creates attempt |
| POST | `/api/v1/me/missions/:missionKey/submit` | Validate evidence from in_progress only; complete; return feedback |

### Shared rules for all routes

- Authentication: Bearer JWT via `requireEmployee`
- Scoping: `employee.id` only
- Errors: `401 UNAUTHORIZED`, `404 NOT_FOUND`, `409 CONFLICT`, `400 VALIDATION` (no `422` — not in current DomainError map)
- Response validation: Zod contracts at boundary
- Idempotency: as §4/§8
- No answer-matrix fields in any response

### Route details

#### GET `/api/v1/me/missions`

- Always returns the M1-M01 summary (single mission).
- When Day-1 incomplete: `status: locked` plus an **honest unlock explanation**.
- Does not expose full briefing, mapping options, or submission tools.
- 200.

#### GET `/api/v1/me/missions/:missionKey`

- Known key only.
- When **locked**: status + unlock explanation only; **no** full briefing, mapping options, or submission tools.
- When **unlocked**: briefing, context items, department options, problem options, and attempt state if any.
- Never includes allowed-answer mappings.
- 200 / 404.

#### POST `/api/v1/me/missions/:missionKey/start`

- **Mandatory** before submit.
- Pre: unlocked (`available`) + known key (or already in progress/completed for idempotent replay).
- Effect: create `EmployeeMissionAttempt` if none; set `in_progress` and `startedAt`.
- 200/201; idempotent if already `in_progress` or `completed`.
- 409 if locked; 404 unknown.

#### POST `/api/v1/me/missions/:missionKey/submit`

- Body: `MissionSubmitRequest` (`acknowledgedInputKeys`, mappings, justification).
- Pre: attempt must be `in_progress` (or already `completed` for idempotent return).
- Validates acknowledged required keys + mapping set (server-side allowed table) + justification.
- Effect: persist evidence; set `completed`; attach `feedbackKey`.
- 200; idempotent if already completed — returns persisted result.
- 400 invalid/incomplete evidence; **409** if locked **or** if still `available` (no start); 404 unknown.

No professor/admin mission routes in D. No read-tracking endpoint.

---

## 11. Mission Center UX Plan

### Route and registry

| Item | Plan |
|------|------|
| Route | `/workspace/apps/centre-mission` (existing slug) |
| Registry | Change `centre-mission` from `access: "preparing"` toward a usable Day-1-gated workplace app; **page-level unlock** via `GET /me/missions` (locked summary drives honest locked UI) |
| Page | New `MissionCenterPage` branched from `WorkspaceAppPage` like Inbox/Tasks |
| Assignment surface | Mission Center owns Claire briefing for M1-M01 (OD-D1) |

### Surfaces

- locked: honest workplace unlock explanation from locked summary (no briefing tools);
- unlocked list/summary: Claire assignment card for Découvrir l’entreprise;
- explicit start action before analytical work;
- detail: briefing, company context, Tom signal;
- mapping interaction: department↔problem selectors from **options only** (no answer hints);
- required input acknowledgment + justification textarea;
- submit CTA (enabled only when started);
- feedback / completed confirmation;
- loading / empty / error with French copy;
- quiet refresh after mutations (mirror First Day).

### Terminology (required)

Use: mission, responsabilité, entreprise, **département**, poste de travail, Claire Fontaine.
Forbidden UI vocabulary: cours, module, leçon, quiz, score, apprenant, LMS, certification, badge-récompense.

CSS naming: `workspace-mission` / `workspace-centre-mission` + dedicated mission status/error classes consistent with Inbox/Tasks.

---

## 12. Context Panel Integration

Owner decision OD-D3: **separate mission block**.

| Moment | Panel behavior |
|--------|----------------|
| Before / during Day 1 | Existing Day-1 checklist **unchanged and frozen** |
| Anytime after Day-1 unlock possible | Distinct section **« Mission actuelle »** (not checklist items) |
| Mission locked / not yet available | Section may show locked/unavailable workplace cue |
| Mission available | Section shows mission available / Claire assignment cue |
| Mission in progress | Section shows découverte en cours |
| Mission completed | Section shows découverte complétée |

Rules:

- mission cues are **not** added as Day-1 checklist items;
- Day-1 checklist remains frozen;
- no percentage, score, grade, AI Coach, or LMS progress;
- do not replace Day-1 checklist history.

---

## 13. Relationship to Existing Inbox and Tasks

### Approved integration (smallest safe)

| Concern | Decision |
|---------|----------|
| Claire assignment channel | **Mission Center briefing only** (OD-D1). No additional Inbox message in Slice D. Inbox and First-Day catalog remain frozen. |
| Operational Task bridge | Do **not** create a new First-Day task for M1-M01. Day-1 task `decouvrir-nordhabitat` remains the unlock gate only. |
| FirstDayDataProvider | Remains frozen for inbox/tasks only |
| MissionDataProvider | **New** workspace-scoped provider (mirror First Day pattern): load/list/detail, start/submit, quiet refresh, French errors |
| Context Panel | Separate « Mission actuelle » consumer from MissionDataProvider; does not mutate Day-1 checklist model |
| Duplicate state | Mission attempt is the only M1-M01 source of truth; do not mirror completion into `EmployeeTaskState` |
| Day-1 frozen | No schema/behavior change to message/task rules beyond **read** usage as unlock predicate |

---

## 14. Validation Rules

Deterministic server-side validation on submit:

| Rule | Expectation |
|------|-------------|
| Mission known | Else 404 |
| Attempt `in_progress` (or idempotent completed) | Else 409 if locked or still available (no start) |
| Required `acknowledgedInputKeys` | Must include configured required context keys (e.g. Tom signal + company overview) |
| Mappings | Non-empty; each pair must be in **server-side** allowed catalog relationships |
| Justification | Required; trim; min/max length (propose min 40 / max 1000 chars — finalize in implementation) |
| Duplicate submit | Idempotent success if already completed — return persisted result |
| Employee isolation | Always |

### Pedagogical correctness model

**Allowed-relationship set** (not single canonical answer; not completeness-only).

- Employee must submit a **valid subset** of relationships (minimum N, propose N≥2) drawn from an approved **server-side** mapping table.
- The allowed table is **never** sent to the web client.
- Tests may inspect the allowed table.
- No numeric score; pass = structural/business-rule completeness.

---

## 15. Feedback Model

| Aspect | Plan |
|--------|------|
| Success feedback | Deterministic Claire acknowledgment content key |
| Incomplete structure | Reject with 400 + French field/guidance errors; stay `in_progress` |
| Grade language | Forbidden |
| AI | Forbidden |
| Persistence | `feedbackKey` on attempt; feedback body resolved from catalog on read |
| Replay | Completed detail re-shows feedback and submitted evidence |

---

## 16. Accessibility and Responsive Requirements

Slice D only (do not absorb Slice F hygiene unless blocking D):

- full keyboard path: open mission → start → consult context → acknowledge inputs → map → justify → submit;
- visible `:focus-visible`;
- semantic grouping for mapping fields and justification;
- error summary / `role="alert"` live regions;
- meaning not conveyed by color alone;
- viewports **390 / 480 / 768 / 1280**;
- no document horizontal overflow;
- mapping UI stacks on narrow screens; actions remain usable.

---

## 17. Test Strategy

### Contracts / unit

- Zod schemas including `acknowledgedInputKeys`;
- catalog key/content integrity;
- **server-side** allowed-mapping table consistency (unit/catalog tests only — not client fixtures that leak answers);
- status helper purity if any.

### API module (supertest + in-memory repos)

- auth 401;
- locked list returns locked summary + unlock explanation;
- locked detail hides briefing/tools;
- available after Day-1 complete;
- mandatory start creates attempt;
- submit from `available` → 409;
- submit success from `in_progress`;
- invalid evidence 400 (including missing acknowledged keys / invalid mappings);
- locked mutate 409;
- unknown key 404;
- idempotent start/submit (submit returns persisted completion);
- employee isolation with second employee;
- responses never include allowed-answer matrices.

### Database integration (Railway validation)

- test-owned employee;
- unique `(employeeId, missionKey)`;
- evidence persistence including `acknowledgedInputKeys`;
- no row before start;
- cleanup in `finally`;
- no demo-state cleanup;
- **must execute** (not skip) when `DATABASE_URL` present.

### Web

- Mission Center preparing/locked → available;
- loading/error/empty;
- locked UI from locked summary;
- start required before submit controls;
- briefing + Tom context (when unlocked);
- mapping + justification without answer hints;
- submit + feedback;
- remount persistence;
- Context Panel distinct « Mission actuelle » block;
- Day-1 checklist unchanged;
- French copy;
- forbidden LMS vocabulary regex (extend first-day tests).

### Manual smoke checklist

1. Login as demo with completed Day 1
2. Mission Center available
3. Open Découvrir l’entreprise
4. Start mission
5. Consult context / Tom 40 vs 36; acknowledge required inputs
6. Map departments/problems
7. Submit justification
8. See feedback
9. Refresh persistence
10. Logout/login persistence
11. Confirm Context Panel « Mission actuelle » (not Day-1 checklist pollution)
12. Narrow 390px no overflow
13. Console clean

Do not invent final automated test counts in this plan.

---

## 18. Migration and Data Safety Plan

| Item | Plan |
|------|------|
| Migration required | **Yes** — new `employee_mission_attempt` (name final during impl) matching §7 fields only |
| Environment | Railway **validation** first |
| Production migration | **Not authorized** in D workflow until later Owner decisions |
| Review | Migration SQL reviewed in PR; failed migration blocks deploy discipline retained |
| Seed impact | No mandatory seed of mission attempts; demo may remain incomplete until smoke |
| Demo employee | Do not wipe Day-1 progress |
| Rollback thinking | Additive table; forward-only with safe defaults; no destructive backfills |
| Cleanup | Test-owned rows only |

---

## 19. Security and Privacy Boundaries

- employee ownership on every query/mutation;
- no cross-employee reads;
- no professor/admin routes;
- no AI/LLM calls or student-data egress;
- Zod validation on all writes;
- justification treated as workplace text (no secret logging of full bodies in info logs);
- server-side allowed mappings never leaked to clients;
- no production data access;
- auth middleware unchanged in spirit (`requireEmployee`).

---

## 20. File-Scope Proposal

### Likely added

| Area | Candidates |
|------|------------|
| Contracts | `packages/contracts/src/mission.ts`, contract tests |
| Database | Prisma model + migration `*_rc01_mission_discovery*` |
| API | `apps/api/src/modules/mission/*` (catalog, types, repo, service, handlers, routes, fixtures, tests) |
| Web | `MissionCenterPage`, `MissionDataContext`, `api/mission.ts`, mission copy, CSS, tests |
| Engineering | future Slice D checkpoint (not in implementation PR unless Owner requires) |

### Likely modified

| Area | Candidates |
|------|------------|
| Contracts index | export mission contracts |
| API app/router wiring | mount `/me` mission routes |
| Web App/WorkspaceAppPage | branch `centre-mission` |
| appRegistry / workspaceCopy | access + copy |
| Context panel | distinct « Mission actuelle » section (not Day-1 checklist items) |
| Web shell tests | registry/vocab expectations |

### Must not touch (D)

- frozen First-Day business rules except **read** unlock checks;
- Inbox / First-Day catalog content (OD-D1);
- Slice C checkpoints / rebaseline docs (unless separate docs task);
- professor/AI packages;
- production/WMS;
- `official_documents/site/`;
- `origin/main`;
- unrelated ERP transaction modules;
- broad UX redesign files.

This list is a planning estimate, **not** authorization to edit.

### Proposed file-count estimate

Approximate **25–40** tracked files touched (contracts + migration + API module + web page/provider/tests/CSS). Final PR must stay exact-scope.

---

## 21. Delivery Slices Within D

### Recommendation: **one atomic Slice D**

- single feature branch;
- one implementation PR into `release/rc01`;
- one post-merge validation;
- one Slice D checkpoint.

### Rationale

- Thin vertical is already bounded to one mission.
- Sub-slicing D1/D2 increases governance overhead after C2 merge-method lessons.
- Internal implementation order still sequenced (§27) without separate release checkpoints.

Sub-slices D1/D2 only if mid-implementation risk forces a stop; not preferred.

---

## 22. Acceptance Criteria

1. **Functional:** Full journey §3 works for unlocked employee.
2. **Unlock:** Locked before Day-1 complete; available after.
3. **Single mission only:** M1-M01; no M1-M02/M03.
4. **Architecture:** Content in catalog; state in DB; employee scoped.
5. **No Mission Engine framework** beyond thin module.
6. **Pedagogy:** Discovery/observer framing; departments/problems/justification.
7. **Evidence:** Persists `acknowledgedInputKeys`, mappings, justification, status, `startedAt`/`completedAt`, `feedbackKey`. Competency codes remain catalog-only.
8. **No score/cert/quiz/AI/professor UI.**
9. **Tom 40/36:** Narrative only; no stock transaction.
10. **UX:** Workplace French; no LMS vocabulary.
11. **Accessibility:** Keyboard complete; focus visible; alerts.
12. **Responsive:** 390/480/768/1280; no horizontal overflow.
13. **API:** Auth; mandatory start; submit from in_progress only; `available`→submit is 409; locked summary on list; 400/401/404/409 correct; idempotent start/submit.
14. **Answer confidentiality:** No allowed-answer mapping exposed to clients.
15. **Database:** Migration applied on validation; uniques enforced; no row before start; cleanup-safe tests.
16. **Testing:** Contracts + API + integration + web coverage per §17.
17. **Security:** No cross-employee leakage; no LLM.
18. **Governance:** Feature PR → GitHub merge UI/`gh` → post-merge validation → checkpoint.
19. **Frozen A–C:** Day-1 APIs and Inbox catalog remain behavior-compatible; no new Inbox message.
20. **Context Panel:** Distinct « Mission actuelle »; Day-1 checklist frozen.
21. **Slice E boundary:** No full org ERP/write surface in D.
22. **Persistence:** Refresh and re-login preserve completion; no localStorage mission state.

---

## 23. Definition of Done

Slice D is done only when:

1. implementation complete against this plan (as approved);
2. all automated gates pass;
3. Railway validation passes with mission integration executed;
4. manual smoke passes;
5. PR merged through **GitHub UI or authenticated `gh`/API** (no local FF incorporation as normal method);
6. post-merge validation passes;
7. Slice D checkpoint approved, committed, pushed;
8. Slice D frozen before Slice E begins.

---

## 24. Risks and Controls

| Risk | Control |
|------|---------|
| Mission Engine over-generalization | One mission key; thin module; no framework package |
| LMS regression | Vocabulary tests; UI copy review |
| Evidence becomes assessment engine | No scores; server-side allowed-relationship completeness only |
| Answer key leakage | No `allowedMappingHints`; options-only client payloads |
| Transactional ERP leakage | OD-3 language; no adjustment endpoints |
| Fake company response | Deterministic catalog feedback keys |
| Duplicate task/mission / Inbox expansion | Separate attempt table; OD-D1 Mission Center only |
| Skipping start | Submit from available → 409 |
| Migrating Day-1 checklist into mission UI | OD-D3 separate « Mission actuelle » block |
| Migration/data risk | Validation-first; additive migration; test cleanup only |
| Narrow-screen mapping complexity | Stacked layout; a11y tests; 390px smoke |
| Direct-push recurrence | Mandatory PR merge via GitHub UI/`gh` |

---

## 25. Explicit Non-Goals

Slice D does **not** include:

- generic Mission Engine;
- M1-M02 / M1-M03;
- simulation engine;
- scoring / numeric grade;
- quiz;
- certification;
- professor UI;
- admin UI;
- AI Mentor / Coach / Context Engine / Reasoning Orchestrator;
- LLM calls;
- ERP posting;
- inventory adjustment;
- master-data write;
- PR / PO / GR;
- P2P / O2C;
- vendor-specific ERP clone;
- new Inbox assignment messages;
- Competency Engine / persisted competency snapshots;
- client-exposed allowed-answer matrices;
- read-tracking analytics endpoints;
- UX Polish Wave;
- visual redesign;
- production deployment;
- main merge;
- full Slice E organizational ERP.

---

## 26. Owner Decision Record

OD-1 through OD-8 (RC01 Rebaseline) remain closed and unchanged.

No Project Owner decisions remain open for Slice D planning.

### OD-D1 — Claire assignment channel — Approved

| | |
|--|--|
| Decision | How Claire “assigns” M1-M01 |
| Selected option | **A** — Mission Center briefing only |
| Rationale | Smallest safe integration; avoids expanding frozen Inbox / First-Day catalog semantics |
| Implementation consequence | No additional Inbox message in Slice D; Inbox and First-Day catalog remain frozen; Mission Center is the official assignment surface for M1-M01 |
| Status | **Approved** |

### OD-D2 — Explicit start step — Approved

| | |
|--|--|
| Decision | Require explicit `POST …/start` before submit? |
| Selected option | **A** — Yes; start is mandatory |
| Rationale | Clear lifecycle; attempt created only on acceptance of the responsibility; analytics-ready `startedAt` |
| Implementation consequence | `available` → `completed` directly is forbidden; start creates `EmployeeMissionAttempt` and sets `in_progress` + `startedAt`; submit accepted only from `in_progress`; submit from `available` returns 409; repeated start is idempotent; repeated submit after completion returns persisted result |
| Status | **Approved** |

### OD-D3 — Context Panel mission cues — Approved

| | |
|--|--|
| Decision | How Context Panel presents mission state |
| Selected option | **B** — Separate mission block |
| Rationale | Preserves frozen Day-1 checklist; avoids LMS-like checklist pollution |
| Implementation consequence | Existing Day-1 checklist remains frozen; mission cues are not added as Day-1 checklist items; Context Panel gains distinct « Mission actuelle » section showing available / in-progress / completed context; no percentage, score, grade, AI Coach, or LMS progress |
| Status | **Approved** |

### OD-D4 — Locked mission list presentation — Approved

| | |
|--|--|
| Decision | `GET /me/missions` while locked |
| Selected option | **A** — Return locked summary |
| Rationale | Honest workplace unlock messaging; distinguishes locked from missing |
| Implementation consequence | `GET /me/missions` returns M1-M01 summary with `status: locked` and an honest unlock explanation; full briefing, mapping options, and submission tools are not exposed while locked |
| Status | **Approved** |

---

## 27. Proposed Implementation Sequence

1. Owner approves this amended plan document.
2. Confirm authenticated GitHub merge capability or GitHub UI merge path.
3. Create feature branch from `release/rc01` @ `33e6924789b965caa5da49e82d8e41dd9c77b77a` (**only after plan approval**).
4. Contracts + catalog content model (server-side allowed mappings; catalog competency metadata).
5. Prisma model + validation migration (§7 fields only).
6. API module (repo/service/handlers/routes/tests) with mandatory start.
7. Wire `/api/v1/me` mission routes (four approved routes only).
8. Web `MissionDataProvider` + Mission Center page + CSS.
9. Registry/copy + Context Panel « Mission actuelle » block.
10. Web tests + API integration tests on Railway validation.
11. Manual smoke.
12. Exact-scope commit(s) on feature branch.
13. Push feature branch; open PR into `release/rc01`.
14. Formal review; merge via GitHub UI / authenticated `gh`.
15. Post-merge validation.
16. Slice D checkpoint → approve → commit → push → freeze.
17. Only then Slice E planning/implementation.

---

## 28. Approval Record

| Field | Value |
|-------|-------|
| Plan status | **Approved** |
| Prepared by | Agent 0 / Release Captain |
| Amended by | Agent 0 / Release Captain (Owner decisions OD-D1–OD-D4 + architectural amendments) |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-10 |
| Date amended | 2026-07-13 |
| Date approved | 2026-07-10 |

This Slice D plan was explicitly reviewed and approved on 2026-07-10. It authorizes planning closure only and defines the implementation boundaries for RC01 Slice D — Mission Center and Enterprise Discovery. Implementation may begin only after this plan is committed, pushed, remotely verified, frozen, and a separate implementation authorization is issued.
