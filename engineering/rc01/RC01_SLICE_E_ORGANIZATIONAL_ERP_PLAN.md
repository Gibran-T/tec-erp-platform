# RC01 Slice E — Organizational ERP Read-Only Plan

## 1. Plan Status

| Field | Value |
|-------|-------|
| Status | **Approved** |
| Slice | RC01 Slice E |
| Canonical name | Organizational ERP Read-Only |
| Planning baseline | `9bd188d4519e5245002d85b908f9af36db0607e4` |
| Branch | `release/rc01` |
| Slice D checkpoint | `engineering/rc01/RC01_SLICE_D_MISSION_DISCOVERY_CHECKPOINT.md` (merged via PR #6) |
| Slice D status | **CONDITIONALLY CLOSED / CODE FROZEN** (not POST-MERGE GREEN) |
| Main | Unchanged at `49608de08c1527ab1fdbd355e6e0ec349177b69c` |
| Production | Untouched |

This plan was explicitly reviewed and **approved** by the Project Owner.

Owner decisions OD-E1 through OD-E7 are recorded as **Approved** in §4.

Canonical sources consulted for this plan:

- `engineering/rc01/RC01_REBASELINE_DECISION.md` (OD-3, OD-6, Slice E section)
- `engineering/rc01/RC01_SLICE_D_MISSION_DISCOVERY_PLAN.md`
- `engineering/rc01/RC01_SLICE_D_MISSION_DISCOVERY_CHECKPOINT.md` (§5 smoke debt; §10 Slice E readiness)
- Slice C / C1 checkpoints and First-Day / Mission Discovery implementation
- `docs/01`–`docs/09`, `docs/13`, `docs/15`–`docs/18`, `docs/22` (read-only alignment; no silent `docs/` edits)

Future AI architecture (`docs/09` and related) is **not** RC01 runtime scope.

---

## 2. Objective

Make NordHabitat’s **organizational and process context** accessible inside the ERP workplace application **without transactional scope**.

Slice E establishes the organizational and process layer of the pedagogical chain:

> process → transaction → document → data → control → KPI → analysis → decision → action

Slice E delivers **organizational and process context** only. It does **not** implement the advanced dashboard platform, transactional ERP, or KPI analytics runtime.

### Employee outcome

After Day 1 completion, the employee can open the workplace **ERP** app and consult:

- NordHabitat company profile;
- seven departments with functions and responsibilities;
- department relationships;
- lightweight process awareness;
- fragmentation signals;
- Tom’s 40 versus 36 as **narrative analytical context only**.

The employee may consult ERP while M1-M01 is available, in progress, or completed. Consultation is evergreen — there is no Slice E attempt, score, restart, or artificial progress.

---

## 3. Pedagogical Outcome

The learner practices:

- organizational awareness (**C-ORG-01**, catalog metadata / framing only);
- process-context observation before transactions (**C-BUS-01** framing);
- honest distinction between **consultation** and **transactional authority**.

Slice E teaches that ERP begins with understanding the organization and process landscape — not with posting.

| This slice is | This slice is not |
|---------------|-------------------|
| Read-only organizational ERP context | Transactional ERP / posting surface |
| Evergreen workplace consultation | Mission attempt / scored activity |
| Soft support for Mission Discovery | Modification of M1-M01 semantics |
| Future-ready org keys for dashboards | Advanced dashboard / KPI Builder |

---

## 4. Business Outcome

NordHabitat’s organizational vocabulary becomes a first-class workplace reference inside TEC.ERP:

- one coherent company profile;
- one stable seven-department model shared with Slice D;
- visible process and fragmentation signals that explain why discovery (M1-M01) matters;
- clear access boundary: consult yes, write no.

Business meaning of Tom 40 versus 36 remains: fragmented information / ownership gaps — **Observer-Analyst** context only. No inventory adjustment.

---

## 5. Approved Owner Decisions OD-E1 through OD-E7

OD-1 through OD-8 (RC01 Rebaseline) remain closed and unchanged. Slice E specializes OD-6 (read-only ERP) and OD-3 (business-process boundary).

### OD-E1 — Unlock — Approved

| | |
|--|--|
| Decision | When ERP organizational view unlocks |
| Selected | Unlock after **First Day completion** (same Day-1 predicate as Mission Center: manager message read **and** task `decouvrir-nordhabitat` completed) |
| Consequence | ERP remains accessible while M1-M01 is `available`, `in_progress`, or `completed` |
| Status | **Approved** |

### OD-E2 — Completion — Approved

| | |
|--|--|
| Decision | Slice E progress / completion model |
| Selected | **Evergreen consultation** |
| Forbidden | Slice E attempt; completed status; score; restart; artificial progress |
| Status | **Approved** |

### OD-E3 — Mission Discovery connection — Approved

| | |
|--|--|
| Decision | Relationship to M1-M01 |
| Selected | **Soft contextual link only** |
| Forbidden changes | `EmployeeMissionAttempt`; submitted mappings; justification; mission scoring; mission completion semantics |
| Status | **Approved** |

### OD-E4 — Content — Approved

| | |
|--|--|
| Included | Company profile; seven departments; functions/responsibilities; relationships; lightweight process awareness; fragmentation signals; Tom 40 vs 36 as narrative analytical context only |
| Forbidden | Interactive process engine; M1-M02; transactional operation; inventory adjustment |
| Status | **Approved** |

### OD-E5 — Claire — Approved

| | |
|--|--|
| Decision | Claire involvement in Slice E |
| Selected | **None** |
| Forbidden | New Claire message, task, assignment, feedback, or evaluation |
| Status | **Approved** |

### OD-E6 — Departments — Approved

| | |
|--|--|
| Decision | Department vocabulary |
| Selected | Reuse **exactly** the seven department keys and labels established by Slice D |
| Forbidden | Divergent organizational vocabulary |
| Status | **Approved** |

### OD-E7 — Mission support — Approved

| | |
|--|--|
| Decision | Concurrent use with Mission Discovery |
| Selected | ERP **may be consulted** while the Mission Discovery journey is active |
| Status | **Approved** |

---

## 6. In-Scope Content

### 6.1 Company profile

Bounded NordHabitat identity suitable for workplace consultation (name, activity framing, transformation/context cue consistent with existing First-Day / Mission Discovery language). No master-data CRUD.

### 6.2 Seven departments (exact Slice D keys/labels)

| Key | Label |
|-----|-------|
| `dept-direction` | Direction |
| `dept-operations` | Opérations |
| `dept-finance` | Finance |
| `dept-ventes` | Ventes |
| `dept-approvisionnement` | Approvisionnement |
| `dept-entrepot` | Entrepôt |
| `dept-ti` | TI |

Source of truth for keys/labels today: `MISSION_DEPARTMENT_CATALOG` in `apps/api/src/modules/mission/mission.catalog.ts`. Slice E must not invent alternate keys or labels.

### 6.3 Functions and responsibilities

Per-department short function/responsibility text for organizational understanding (catalog content). Extends Slice D’s short `description` with read-only responsibility framing without changing mission mapping options.

### 6.4 Department relationships

Lightweight relationship graph / adjacency narrative (e.g. who depends on whom for stock truth, customer promise, financial visibility). Not a workflow engine.

### 6.5 Process awareness

Introductory process awareness only (e.g. that inventory, replenishment, sales promise, and reporting depend on shared data). Not an interactive process modeler or Process Mining lab.

### 6.6 Fragmentation signals

Catalogued signals that make fragmentation visible as a business problem (including Tom 40 versus 36 as narrative analytical context). No posting or adjustment action.

### 6.7 Soft Mission Center link

Contextual navigation cue to Centre de mission / M1-M01 for employees who are exploring organization while discovery is relevant. Soft link only — no mission state mutation.

---

## 7. Explicit Exclusions

Slice E does **not** include:

| Exclusion | Notes |
|-----------|-------|
| Prisma models / migrations / seed changes | Preferred architecture: in-code catalog only |
| New database persistence for organization | No org attempt / progress tables |
| POST / PUT / PATCH / DELETE organization routes | Zero write routes |
| Master-data CRUD | |
| Procurement / inventory / sales / finance posting | |
| Approvals / workflow engine | |
| Interactive process engine | |
| M1-M02 / M1-M03 | |
| Inventory adjustment | Tom 40 vs 36 is narrative only |
| Power BI / Tableau clone | |
| Configurable dashboards | |
| KPI Builder / Analytics Studio | |
| Process Mining / Automation Lab | |
| AI Coach / Mentor / runtime prompts | OD-7 |
| Scoring / quiz / certification | |
| Professor interface | |
| New Claire message / task / feedback | OD-E5 |
| Slice F UX Polish Wave | |
| Modification of frozen Slice D mission behavior | OD-E3 |
| Silent official `docs/` updates | List as documentation debt only |
| Production deploy / `main` merge | |

---

## 8. Architecture

### Preferred architecture (smallest coherent vertical)

```
Presentation (web ERP page)
  → Application (GET organization client)
    → Authenticated read-only API GET /api/v1/me/organization
      → Organization service (unlock check + catalog assembly)
        → In-code organizational catalog
        → First-Day state reads (unlock predicate only)
```

| Layer | Decision |
|-------|----------|
| Content | Organizational catalog **in code** |
| Persistence | **None** for organization |
| Prisma | **No** new models |
| Migration | **None** |
| Seed | **No** modification |
| API | Authenticated **GET only** |
| Web | Workplace ERP page (`appId: erp`) |
| Unlock | First-Day completion |
| Writes | **Zero** organizational write routes |

### Why no Prisma (default)

Repository evidence for Slice E content is static NordHabitat teaching context already modeled as catalogs in Slice D. There is no employee-specific organizational write or progress requirement (OD-E2). Therefore persistence is unnecessary unless Owner later proves a durability requirement — not in Slice E.

### Slice D freeze rule

Do **not** modify mission attempt lifecycle, allowed mappings, submit validation, Mission Center briefing, Claire feedback keys, or First-Day catalogs. Soft link and department-key parity only.

---

## 9. Catalog Ownership and Reuse of Slice D Department Keys

### Ownership

| Concern | Owner in Slice E |
|---------|------------------|
| Company profile, relationships, process awareness, fragmentation signals, functions/responsibilities | New `organization` catalog module |
| Seven department **keys and labels** | Must match Slice D exactly (OD-E6) |
| Mission mapping options / allowed pairs / problems | Remain Slice D owned; **frozen** |

### Reuse strategy (preferred)

1. Define organization department entries using the **exact** seven keys and labels from §6.2.
2. Add an automated **parity test** that asserts organization department keys/labels equal `MISSION_DEPARTMENT_CATALOG` keys/labels (order-stable or set-equal as specified in tests).
3. Do **not** change Slice D catalog content or mission API payloads as part of Slice E.

### Optional later refactor (not required for E)

A shared department-constant module used by both mission and organization catalogs may be proposed only with explicit Slice D reopen approval. Default path: **no Slice D product-file edits**.

### Future-readiness keys

Department keys (`dept-*`), signal keys, and process-awareness keys must be stable string identifiers suitable for later process-dashboard filters and KPI dimensional slicing. Do not use display labels as identifiers.

---

## 10. Contract Design

Add organization contracts under `packages/contracts` (mirroring mission/first-day patterns).

### Proposed response envelope

```ts
// Conceptual shape — finalize Zod names in implementation
OrganizationAccessResponse = {
  access: "locked" | "available";
  unlockExplanation: string | null;
  organization: OrganizationCatalogPayload | null;
}

OrganizationCatalogPayload = {
  companyProfile: CompanyProfile;
  departments: DepartmentOrganizationalView[];
  relationships: DepartmentRelationship[];
  processAwareness: ProcessAwarenessItem[];
  fragmentationSignals: FragmentationSignal[];
}
```

### Field expectations

| Area | Contents |
|------|----------|
| `companyProfile` | Stable identity fields (name, summary, context) |
| `departments` | `key`, `label`, functions/responsibilities text; optional short description |
| `relationships` | Structured edges or narrative pairs between department keys |
| `processAwareness` | Lightweight items with stable keys |
| `fragmentationSignals` | Includes Tom 40 vs 36 narrative signal with stable key; no action CTA that posts |

### Explicit contract prohibitions

- No attempt/status/score/progress fields for Slice E.
- No write request schemas for organization.
- No allowed-answer mission matrices.
- No AI evaluation payloads.

---

## 11. GET API Behavior

### Endpoint

`GET /api/v1/me/organization`

### Auth

Requires authenticated employee (`requireEmployee`), same `/api/v1/me` pattern as First Day and Mission Discovery.

### Behavior

| Condition | HTTP | Body behavior |
|-----------|------|---------------|
| Unauthenticated | 401 | Standard auth error |
| Day-1 incomplete | 200 | `access: "locked"`; honest French unlock explanation; `organization: null` (or equivalent omit of catalog body) |
| Day-1 complete | 200 | `access: "available"`; full read-only catalog payload |
| Server/catalog failure | 500 | French-safe error path consistent with existing modules |

### Rules

- **GET only** for organization in Slice E.
- Idempotent and cache-safe from a product perspective (static catalog + derived unlock).
- Employee isolation still applies to unlock reads (First-Day state is per employee).
- Do not call or mutate mission repositories for organization assembly (OD-E3).
- Do not create Claire/Inbox side effects (OD-E5).

### Mounting

Wire beside existing me routers in `apps/api/src/app.ts` without changing First-Day or Mission route contracts.

---

## 12. Authentication and Unlock Rules

### Unlock predicate (exact)

ERP organization unlocks only when the authenticated employee has:

1. `EmployeeMessageState` for `premier-message-gestionnaire` with non-null `readAt`; and
2. `EmployeeTaskState` for `decouvrir-nordhabitat` with non-null `completedAt`.

This matches Slice D Mission unlock (`mission.unlock.ts` / First-Day catalog keys). Implementation may mirror that reader pattern in the organization module **without** modifying mission unlock behavior.

### Concurrent mission states (OD-E1 / OD-E7)

Once unlocked, organization remains available regardless of M1-M01 being:

- `available`;
- `in_progress`;
- `completed`.

No lock when mission starts. No lock when mission completes. No “ERP completed” state.

---

## 13. Web Information Architecture

### Registry

Today `erp` is `access: "preparing"` in `apps/web/src/workspace/appRegistry.ts`. Slice E promotes ERP to a real Day-1-gated workplace app:

| App id | Label | Slice E access model |
|--------|-------|----------------------|
| `erp` | ERP | Authenticated route; server-driven locked vs available content |

`tableaux-bord` and other preparing apps remain preparing (out of scope).

### Routing

- Path: `/workspace/apps/erp` via existing `WorkspaceAppPage` branching (mirror `centre-mission`).
- New page component for organizational read-only consultation.
- Optional thin provider for fetch/loading/error (mirror First Day / Mission patterns) — no localStorage org progress.

### Workplace vocabulary

Use: entreprise, département, processus, consultation, poste de travail, NordHabitat, ERP (as workplace system name).

Forbidden UI vocabulary: cours, module, leçon, quiz, score, apprenant, LMS, certification, badge-récompense, “terminer l’ERP”, “recommencer”.

CSS naming: `workspace-erp` (or equivalent) consistent with Inbox / Tasks / Mission.

---

## 14. UI States

| State | Meaning | UI expectation |
|-------|---------|----------------|
| **locked** | Day-1 incomplete | Honest unlock explanation; no catalog body; no fake progress |
| **loading** | Fetch in flight | Non-blocking status; French copy |
| **available / read-only** | Day-1 complete; catalog loaded | Full consultation; explicit read-only framing; no write controls |
| **empty** | Defensive: unlock ok but catalog unexpectedly empty | Honest empty message; no inventing data client-side |
| **error** | Network/API failure | `role="alert"`; retry affordance; French error |
| **revisit** | Returning to ERP after prior consultation | Same as available/read-only (evergreen); **no** completion ceremony, restart CTA, or progress bar |

There is no “completed ERP” state (OD-E2).

---

## 15. Contextual Navigation to Mission Center

Soft link only (OD-E3 / OD-E7):

- While unlocked, ERP may show a contextual cue such as consulting Mission Center / Découvrir l’entreprise for discovery responsibility.
- Link navigates to `/workspace/apps/centre-mission` (and optionally deep-links only if already supported without new mission APIs).
- Must **not**:
  - start/submit mission;
  - patch attempt evidence;
  - imply ERP consultation completes M1-M01;
  - create Claire assignment/feedback.

If mission is locked, ERP locked explanation remains Day-1-focused; do not invent a second unlock story that conflicts with Mission Center messaging.

---

## 16. Expected Packages and Files

Planning estimate only — not edit authorization.

### Likely added

| Area | Candidates |
|------|------------|
| Contracts | `packages/contracts/src/organization.ts` + contract tests |
| API | `apps/api/src/modules/organization/*` (catalog, unlock reader mirror, service, handlers, routes, tests) |
| Web | `OrganizationErpPage` (name finalize), `api/organization.ts`, copy, CSS, page tests |
| Engineering | future Slice E checkpoint (separate task after merge) |

### Likely modified

| Area | Candidates |
|------|------------|
| Contracts index | export organization contracts |
| API `app.ts` | mount GET organization route |
| Web `WorkspaceAppPage` | branch `erp` |
| `appRegistry` / workspace copy / shell tests | ERP access + French copy expectations |

### Must not touch (E)

- Slice D mission product behavior/files except **read-only import** for parity tests if needed;
- First-Day business rules except **read** unlock checks;
- Prisma schema / migrations / seed;
- `docs/` official specifications (debt list only);
- `official_documents/site/`;
- AI packages;
- `tableaux-bord` advanced dashboards;
- production / `main`.

### Approximate file-count

About **15–30** tracked files for a thin vertical (contracts + API module + web page/tests/CSS + registry wiring). Prefer the low end.

---

## 17. Automated Test Matrix

### Contracts / unit

- Zod schemas for locked vs available envelopes;
- catalog key integrity (departments, signals, process items);
- **department key/label parity** with `MISSION_DEPARTMENT_CATALOG`;
- Tom 40 vs 36 present as narrative signal (not action/posting).

### API module (supertest + in-memory / existing unlock fixtures)

- auth 401;
- locked before Day-1 complete;
- available after Day-1 complete;
- payload areas present when available;
- no write routes registered for organization (see §18);
- employee isolation on unlock derivation;
- mission attempt state does not gate organization once Day-1 complete (available / in_progress / completed fixtures).

### Database integration

- **No new organization tables** → no new org persistence suite required.
- Existing First-Day / Mission integration suites remain regression (must still pass).
- Do not add org rows to seed.

### Web

- registry: ERP no longer perpetual preparing-only dead-end for unlocked employees;
- locked / loading / available / error / revisit (remount) states;
- read-only framing; absence of submit/post controls;
- soft link to Mission Center without mutating mission UI state unexpectedly;
- French copy; forbidden LMS vocabulary extension;
- viewport smoke hooks as feasible in component tests.

Do not invent final automated test counts in this plan.

---

## 18. Explicit No-Write Verification

Mandatory verification before Approval Gate:

1. Route table / router tests: organization module exports **GET only**.
2. Grep/CI assertion candidates: no `app.post/put/patch/delete` for `/organization` paths.
3. Contract package: no organization write schemas exported.
4. Web UI: no forms that POST organization mutations.
5. Prisma diff: **zero** schema change in the Slice E PR.
6. Seed diff: **zero** required seed change.

Any write path fails the gate.

---

## 19. Regression Coverage

Must remain green / behavior-compatible:

| Area | Expectation |
|------|-------------|
| Auth | Unchanged |
| First Day | Inbox/Tasks unlock semantics unchanged |
| Mission Discovery | Attempt lifecycle, mappings, justification, feedback unchanged |
| Workspace shell | Other preparing apps unchanged |
| CI quality job | lint / typecheck / unit / build / env:check |
| CI integration job | existing migration + seed + First-Day + Mission discovery suites |

Slice E must not reopen Slice D product code to “fix” mission behavior. If a blocker appears, stop and escalate — do not silently amend frozen D.

---

## 20. CI Implications

| Item | Slice E impact |
|------|----------------|
| Quality job | Must cover new unit/contract/API/web tests via existing `pnpm test` |
| Integration job | No new migration expected; existing DB suites still run |
| New DB integration file | **Not required** by default (no org persistence) |
| Seed step | Unchanged |
| Workflow YAML | Change only if a new test path must be explicitly listed; prefer convention already used by unit discovery |

If implementation accidentally introduces Prisma changes, that is a **plan violation** — stop and re-approve architecture.

---

## 21. Functional Smoke Plan

When an approved non-production runtime is available:

1. Login as demo employee with incomplete Day 1 → ERP locked explanation.
2. Complete Day 1 → ERP available; catalog visible.
3. Confirm seven departments with Slice D labels.
4. Confirm Tom 40 vs 36 narrative signal; confirm **no** adjustment CTA.
5. Confirm soft link opens Mission Center.
6. Start M1-M01 → return to ERP → still available (OD-E7).
7. Complete M1-M01 → ERP still available; no ERP “completed” state.
8. Refresh / remount → same consultation (revisit).
9. Logout / login → still available if Day 1 complete.
10. Confirm no organization write network calls.
11. Narrow 390px: no horizontal overflow; sections stack.
12. Console clean of Slice E errors.

Note: Slice D runtime smoke debt (§24) remains open for RC01 final GREEN and is tracked separately.

---

## 22. Accessibility and Responsive Requirements

Slice E only (do not absorb Slice F hygiene unless blocking E):

- keyboard path through ERP sections and Mission Center soft link;
- visible `:focus-visible`;
- semantic headings/landmarks for company / departments / relationships / signals;
- error `role="alert"` live regions;
- meaning not by color alone;
- viewports **390 / 480 / 768 / 1280**;
- no document horizontal overflow;
- department lists stack on narrow screens.

---

## 23. Dashboard / Analytics Future-Readiness Note

Architectural alignment only — **do not implement** advanced dashboards in Slice E.

### Future TEC.ERP analytics loop

> monitor → detect → compare → investigate → explain → recommend → act

### Future dashboard hierarchy

1. Executive Overview
2. Process Dashboard
3. Operational Monitor
4. Analytical Detail

### Future KPI visual contract (later slices)

Current value · target · variance · trend · period · source · freshness · owner · expected action · drill-down to source documents/events.

### Slice E contribution

Expose stable organizational keys and structures (`dept-*`, process-awareness keys, fragmentation signal keys, relationship endpoints) so later process dashboards and KPI dimensional filters can attach without renaming NordHabitat’s organizational vocabulary.

`tableaux-bord` remains **preparing** in RC01 Slice E.

Official `docs/08_DASHBOARD_ARCHITECTURE.md` describes a broader Version-1 dashboard set (student/professor/etc.). Slice E does **not** implement that set. Any official-doc alignment of the monitor→act loop and hierarchy above is **documentation debt** (see §26), not a silent `docs/` edit in this slice.

---

## 24. Release and Checkpoint Sequence

Mandatory flow (rebaseline §14):

1. Owner approves this Slice E plan.
2. Commit **only** this plan file when authorized; push via PR into `release/rc01` (or Owner-directed path consistent with governance).
3. Freeze plan; create feature branch from updated `release/rc01`.
4. Implement exact scope; automated gates; smoke as available.
5. PR into `release/rc01`; review; merge via GitHub UI or authenticated `gh` (**no direct-push** as normal method).
6. Post-merge validation.
7. Slice E checkpoint → approve → commit → push → freeze.
8. Only then Slice F hygiene/closure work.

### Slice E exit criteria (summary)

- Read-only organizational view usable and tested;
- no write path exists;
- department key/label parity with Slice D;
- automated gates pass;
- PR-based merge;
- post-merge validation;
- checkpoint approved and frozen before Slice F.

---

## 25. Slice D Smoke-Debt Acknowledgment

From `RC01_SLICE_D_MISSION_DISCOVERY_CHECKPOINT.md`:

- Slice D is **CONDITIONALLY CLOSED / CODE FROZEN** under **GO WITH CONDITIONS**.
- Slice D is **not** POST-MERGE GREEN.
- Runtime functional smoke debt remains **OPEN** and blocks **RC01 final release GREEN**.
- Slice E planning/implementation **may begin** under checkpoint §10.
- Clearing Slice D smoke debt is **not** a Slice E implementation prerequisite, but remains mandatory before RC01 final GREEN.

Slice E must not claim that Slice D or RC01 is fully GREEN.

---

## 26. Official Documentation Debt (non-blocking)

Do **not** silently update `docs/` during Slice E implementation. Record for later Owner-authorized documentation work:

| Debt | Why |
|------|-----|
| Align `docs/08` with monitor→act loop and 4-level process/ops dashboard hierarchy | Future analytics architecture |
| Align `docs/15` / `docs/16` / `docs/18` with read-only `GET /me/organization` workplace ERP | Spec drift vs implementation |
| Confirm competency framing C-ORG-01 / process context wording vs `docs/01`–`docs/04` | Pedagogy consistency |
| Explicit RC01 boundary note that advanced dashboards are post-E | Prevent scope confusion |

Research/market notes remain outside official product docs.

---

## 27. Approval Gate Checklist

Before commit of implementation (and again before merge), validate:

| Gate | Slice E expectation |
|------|---------------------|
| Business Rules | OD-E1–E7 honored; OD-3/OD-6 intact |
| UI | Locked/loading/available/empty/error/revisit; French workplace copy; soft Mission Center link |
| Backend | GET-only organization; unlock predicate; no mission mutation |
| Simulation | N/A — no simulation engine work |
| Database | No new models/migrations/seed changes |
| API | Contract + 401/locked/available behaviors |
| Testing | Matrix §17–§19 green |
| Documentation | Plan/checkpoint engineering notes; official `docs/` debt listed not silently patched |
| Production Readiness | No production deploy; Railway remain deployable; no secrets |

If any item fails, the phase stays open (BUILD-005).

---

## 28. Risks and Controls

| Risk | Control |
|------|---------|
| Divergent department vocabulary | OD-E6 + parity tests vs Slice D catalog |
| Accidental mission mutation | OD-E3; no mission repo writes from organization module |
| Fake ERP progress/completion | OD-E2; no attempt model; revisit = available |
| Transactional leakage | Explicit exclusions; no-write verification |
| Dashboard scope creep | §23 alignment-only; `tableaux-bord` stays preparing |
| Claire/Inbox expansion | OD-E5 absolute |
| Prisma “just in case” | Architecture §8; gate fails on schema diff |
| Claiming POST-MERGE GREEN / RC01 GREEN | §25 smoke-debt acknowledgment |
| Direct-push recurrence | PR merge via GitHub UI / authenticated `gh` |

---

## 29. Proposed Implementation Sequence

1. Owner approves this plan document.
2. Commit/push plan per governance; freeze.
3. Feature branch from `release/rc01`.
4. Contracts + organization catalog + department parity tests.
5. API GET module + unlock reader mirror + route tests + no-write checks.
6. Web ERP page + registry wiring + soft Mission Center link + UI state tests.
7. Regression: First Day + Mission Discovery suites.
8. Manual smoke when runtime available.
9. Exact-scope PR → merge → post-merge validation → Slice E checkpoint → freeze.
10. Slice F only after E checkpoint freeze.

Do not begin application implementation until this plan is approved and a separate implementation authorization is issued.

---

## 30. Approval Record

| Field | Value |
|-------|-------|
| Plan status | **Approved** |
| Prepared by | Primary implementation agent — RC01 Slice E preparation gate |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-18 |
| Date approved | 2026-07-18 |

This document defines the implementation boundaries for **RC01 Slice E — Organizational ERP Read-Only**. Application implementation starts only after this approved plan is committed, pushed, and merged into `release/rc01`, and a separate implementation authorization is issued. It does not claim Slice D POST-MERGE GREEN or RC01 final GREEN.

---

*Engineering plan note · RC01 · Not an official `docs/` specification.*
