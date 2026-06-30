# TEC.ERP — AI Context Engine

**Document:** AI Context Engine

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

---

# 1. Purpose

This document defines the official implementation architecture for the **AI Context Engine** — the first implementation-level component of TEC.ERP Enterprise Educational Intelligence.

The Context Engine reconstructs, filters, structures and validates the complete educational and business context of a student before any AI reasoning request is permitted.

The LLM never queries the database directly.

PostgreSQL + Prisma store institutional learning data.

The Context Engine is the sole authorized gateway between institutional persistence and the Reasoning Engine.

This document is the authoritative reference for Context Engine engineering, data retrieval, pedagogical binding, security controls, testing and deployment.

---

# 2. Context Engine Mission

The mission of the AI Context Engine is to ensure that every AI reasoning request operates on complete, accurate, mission-bound and privacy-safe institutional context.

The Context Engine shall:

- reconstruct full student learning context from PostgreSQL via Prisma;
- bind every context package to an active Business Mission;
- integrate KPI outcomes, competency state and recurring error patterns;
- apply role-based context filtering before context leaves TEC.ERP boundaries;
- produce a validated **AI Context Package** for the Reasoning Engine;
- persist context snapshots for audit and professor review;
- never expose raw database access to external providers;
- operate reliably on Railway production infrastructure.

Context quality determines AI quality.

Incomplete context produces unreliable guidance.

---

# 3. Context Engine Philosophy

TEC.ERP adopts a **Context-Before-Reasoning** philosophy.

Institutional data lives in PostgreSQL.

Institutional intelligence is assembled by TEC.ERP.

External language models receive only approved context packages.

```text
AI Request Received
↓
Identity and Role Validation
↓
Context Reconstruction (Prisma)
↓
Context Filtering and Minimization
↓
Context Package Assembly
↓
Context Validation
↓
Approved Context Package → Reasoning Engine
↓
(OpenAI — replaceable reasoning provider only)
```

The LLM is replaceable.

The intelligence belongs to TEC.ERP.

OpenAI is the Version 1 reasoning provider — not a data access layer.

---

# 4. Context Engine Principles

CTX-001

The LLM never queries the database directly.

CTX-002

All context reconstruction occurs server-side through Prisma.

CTX-003

Every context package shall be mission-bound.

CTX-004

Context minimization shall govern provider-boundary data transfer.

CTX-005

Student history, competencies and recurring errors are mandatory context inputs.

CTX-006

Role-based access controls determine context scope.

CTX-007

Context snapshots shall be persisted for audit.

CTX-008

Failed context validation blocks reasoning requests.

CTX-009

Provider independence shall be preserved — context contracts are provider-agnostic.

CTX-010

Railway-first operational constraints apply to all Context Engine services.

---

# 5. Context Engine Scope

This document defines:

- Context Engine architecture, boundaries and lifecycle;
- AI Context Package schema concept;
- PostgreSQL + Prisma retrieval responsibilities;
- Express service layer and TypeScript interface direction;
- React integration points (request initiation only);
- Business Mission, KPI and competency integration;
- recurring error pattern consumption;
- EduQA signal integration;
- context filtering, security and privacy controls;
- observability, audit logging and failure modes;
- test strategy and Railway deployment considerations;
- Approval Gate requirements.

This document does not redefine:

- Reasoning Engine provider logic (`27_AI_ARCHITECTURE.md` §17);
- Learning Intelligence analysis algorithms (`27` §18);
- AI Coach response delivery (`09_AI_COACH_ARCHITECTURE.md`);
- Simulation Engine KPI calculation (`06_SIMULATION_ENGINE.md`).

---

# 6. Related Documents

| Document | Relationship |
|----------|--------------|
| `09_AI_COACH_ARCHITECTURE.md` | Pedagogical output structure and AI Coach functions |
| `13_SYSTEM_ARCHITECTURE.md` | Layer placement and service boundaries |
| `15_ERP_FUNCTIONAL_SPECIFICATION.md` | Business Mission and AI Coach functional rules |
| `17_DATABASE_SCHEMA.md` | Entity definitions and DB-AI rules |
| `18_API_SPECIFICATION.md` | AI endpoint contracts |
| `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` | Engineering standards |
| `22_QUALITY_ASSURANCE_MANUAL.md` | EduQA validation criteria |
| `23_TESTING_STRATEGY.md` | Context Engine test requirements |
| `24_RELEASE_MANAGEMENT.md` | Approval Gate lifecycle |
| `25_DEPLOYMENT_GUIDE.md` | Railway deployment |
| `26_SECURITY_ARCHITECTURE.md` | Security and privacy controls |
| `27_AI_ARCHITECTURE.md` | Parent AI architecture — Context Engine component |

When conflicts arise, follow the source-of-truth hierarchy defined in `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` §4.

---

# End of Part 01/12
---
# 7. Architecture Overview

The AI Context Engine sits between institutional persistence and the AI Reasoning Orchestrator.

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT PRESENTATION                        │
│         (initiates AI request — never builds context)        │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│                   EXPRESS APPLICATION                        │
│    AI Coach Routes → Context Engine Service                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              AI CONTEXT ENGINE (this document)               │
│  Retrieve → Filter → Structure → Validate → Package          │
└──────────────────────────┬──────────────────────────────────┘
                           │ Prisma ORM
┌──────────────────────────▼──────────────────────────────────┐
│              POSTGRESQL (Railway)                            │
│  Students · Missions · Attempts · KPIs · Competencies · AI   │
└─────────────────────────────────────────────────────────────┘
                           │
              Approved AI Context Package
                           ↓
┌─────────────────────────────────────────────────────────────┐
│           AI REASONING ORCHESTRATOR                          │
│    Reasoning Engine → Provider Abstraction → OpenAI          │
└─────────────────────────────────────────────────────────────┘
```

The Context Engine is the first implementation-level component of Enterprise Educational Intelligence.

No component downstream of the Context Engine may access PostgreSQL for AI context purposes.

---

# 8. Component Responsibilities

## Context Engine Owns

- context reconstruction lifecycle;
- Prisma query orchestration for AI context;
- context filtering and minimization;
- AI Context Package assembly and validation;
- context snapshot persistence;
- role-based context scoping;
- audit log emission for context operations.

## Context Engine Does Not Own

- LLM invocation (Reasoning Engine);
- EduQA response validation (EduQA Validator Service);
- recurring error detection algorithms (Learning Intelligence);
- KPI calculation (Simulation Engine);
- AI Coach response formatting (AI Coach Service);
- frontend context assembly (prohibited).

---

# 9. System Boundaries

| Boundary | Rule |
|----------|------|
| Context Engine ↔ PostgreSQL | Prisma only — no raw SQL in routes |
| Context Engine ↔ Reasoning Engine | Approved AI Context Package only |
| Context Engine ↔ OpenAI | **No direct contact — prohibited** |
| Context Engine ↔ React | No direct contact — API mediated |
| Context Engine ↔ Learning Intelligence | Reads recurring error patterns; does not write insights |
| Context Engine ↔ Simulation Engine | Reads KPI snapshots; does not trigger simulation |

Violating any boundary is an architectural defect.

---

# 10. AI Reasoning Orchestrator Interaction

The AI Reasoning Orchestrator coordinates Context Engine, Reasoning Engine and EduQA Validator.

Interaction sequence:

```text
1. AI Coach Service receives student/professor AI request
2. AI Coach Service invokes Context Engine.buildContext(request)
3. Context Engine reconstructs, filters, validates context
4. Context Engine returns AIContextPackage | ContextEngineError
5. AI Reasoning Orchestrator passes package to Reasoning Engine
6. Reasoning Engine binds package to institutional prompt template
7. Reasoning Engine invokes provider abstraction (OpenAI V1)
8. EduQA Validator validates provider output
9. AI Coach Service delivers validated response
```

The Context Engine exposes a single primary contract:

```typescript
buildContext(input: ContextBuildRequest): Promise<ContextBuildResult>
```

The Reasoning Engine never receives partial or unvalidated context.

---

# 11. Input Contract — ContextBuildRequest

The Context Engine accepts a typed request from the AI Coach Service or AI Reasoning Orchestrator.

Required fields:

| Field | Type | Description |
|-------|------|-------------|
| `requestId` | string | Unique trace identifier |
| `studentId` | string | Authenticated student |
| `moduleId` | string | Active module (M1–M10) |
| `missionId` | string | Active Business Mission |
| `conversationId` | string | AI conversation reference |
| `requestType` | enum | explain \| review-decision \| explain-kpi \| explain-process \| reflection |
| `assistanceLevel` | enum | guidance \| analysis \| recommendation |
| `requestedByRole` | enum | student \| professor \| administrator |
| `triggerDecisionId` | string? | Optional decision that triggered the request |

Missing mandatory fields produce `ContextValidationError` — reasoning is blocked.

---

# 12. Output Contract — AIContextPackage

The Context Engine produces a structured, validated **AI Context Package**.

The package is the only data structure permitted to cross the Context Engine → Reasoning Engine boundary.

Package properties:

- `packageId` — unique identifier;
- `packageVersion` — schema version (e.g., `1.0`);
- `generatedAt` — ISO timestamp;
- `contextHash` — SHA-256 of filtered package for audit;
- `missionContext` — Business Mission situational model;
- `studentHistoryContext` — filtered learning history;
- `kpiContext` — read-only KPI snapshot;
- `competencyContext` — current competency state;
- `recurringErrorContext` — active error patterns;
- `pedagogicalContext` — module rules, assistance level, learning objectives;
- `eduqaSignals` — validation hints for downstream EduQA;
- `professorContext` — professor feedback signals (when applicable);
- `metadata` — trace, role, filtering audit record.

Unvalidated packages are rejected.

---

# 13. Context Engine Rules

CTX-RULE-001

No reasoning request shall bypass context reconstruction.

CTX-RULE-002

No AI Context Package shall cross the provider boundary without validation.

CTX-RULE-003

Context snapshots shall be persisted at package generation time.

CTX-RULE-004

Frontend code shall never assemble or transmit context payloads.

CTX-RULE-005

Professor context requests shall be scoped to assigned cohorts only.

CTX-RULE-006

Context Engine failures shall block reasoning — never degrade to empty context.

---

# End of Part 02/12
---
# 14. Context Reconstruction Lifecycle

Every context reconstruction follows six institutional phases.

```text
Phase 1 — Authorization
Phase 2 — Retrieval
Phase 3 — Enrichment
Phase 4 — Filtering
Phase 5 — Assembly
Phase 6 — Validation
```

Each phase produces audit events.

Failure at any phase terminates the lifecycle with a structured error.

---

# 15. Phase 1 — Authorization

Before any database query:

1. verify authenticated session (`26` §14–19);
2. confirm `requestedByRole` permissions;
3. validate student belongs to requesting user's accessible scope;
4. confirm professor cohort assignment (if professor role);
5. verify `missionId` is active for the student;
6. reject cross-student context requests from student role.

Authorization failure returns `ContextAuthorizationError`.

No retrieval occurs after authorization failure.

---

# 16. Phase 2 — Retrieval

Authorized retrieval executes parallel Prisma queries against institutional entities.

Retrieval groups:

| Group | Entities |
|-------|----------|
| Identity | Student, Cohort, User |
| Mission | Module, Business Mission, Scenario, Mission Attempt |
| Decisions | Mission Decision, decision outcomes |
| Performance | KPI Snapshot, Learning Analytics |
| Competency | Competency, Student Competency |
| History | AI Conversation, AI Message, AI Recommendation |
| Patterns | Recurring Error Pattern, Learning Insight |
| Feedback | Professor feedback records, EduQA signals |

Retrieval uses indexed queries only.

N+1 query patterns are prohibited in production Context Engine code.

---

# 17. Phase 3 — Enrichment

Raw retrieval results are enriched with computed context:

- module progression state (M1–M10 position);
- assistance level constraints from `15` §69;
- progressive guidance tier from `09` AI-004;
- learning objective mapping from `01_LEARNING_BLUEPRINT.md`;
- scenario narrative binding from `03_SCENARIO_LIBRARY.md`;
- cohort-level constraints when professor context is requested;
- active EduQA signal flags from prior validation failures.

Enrichment applies institutional rules — not provider heuristics.

---

# 18. Phase 4 — Filtering

Context filtering applies security, privacy and minimization rules (see Part 06).

Filtering removes:

- credentials, tokens, internal system identifiers;
- other students' data;
- raw PII beyond institutional minimum (see §36);
- assessment scores beyond contextual necessity;
- professor-only notes from student-facing packages;
- database primary keys not required for reasoning;
- full conversation history beyond configured window.

Filtering produces a **Filter Audit Record** attached to package metadata.

---

# 19. Phase 5 — Assembly

Filtered and enriched data is assembled into the AI Context Package schema.

Assembly rules:

- mission context is always the primary anchor;
- KPI context is read-only and timestamped;
- competency context reflects current levels only;
- recurring errors include only active patterns;
- student history includes configurable window (default: current module + prior module summary);
- pedagogical context includes assistance level caps on response depth.

Assembly uses typed TypeScript builders — not string concatenation.

---

# 20. Phase 6 — Validation

Final validation before package release:

✓ `missionId` and `moduleId` present and consistent

✓ mission attempt exists for student

✓ KPI snapshot timestamp within acceptable staleness threshold

✓ competency records present

✓ no unauthorized cross-student data detected

✓ filter audit record complete

✓ package schema version valid

✓ context hash computed

✓ context snapshot queued for persistence

Validation failure returns `ContextValidationError` with diagnostic code.

---

# End of Part 03/12
---
# 21. AI Context Package Schema Concept

The AI Context Package is a versioned, typed institutional contract.

Schema version `1.0` structure:

```typescript
interface AIContextPackage {
  packageId: string;
  packageVersion: '1.0';
  generatedAt: string;
  contextHash: string;
  trace: ContextTrace;
  missionContext: MissionContextBlock;
  studentHistoryContext: StudentHistoryBlock;
  kpiContext: KpiContextBlock;
  competencyContext: CompetencyContextBlock;
  recurringErrorContext: RecurringErrorBlock;
  pedagogicalContext: PedagogicalContextBlock;
  eduqaSignals: EduqaSignalBlock;
  professorContext?: ProfessorContextBlock;
  metadata: ContextMetadata;
}
```

Sub-block definitions follow in subsequent sections.

The schema is provider-agnostic.

OpenAI receives a serialized subset — never the full institutional record.

---

# 22. MissionContextBlock

Anchors AI reasoning to the active Business Mission.

| Field | Source |
|-------|--------|
| `moduleId` | Module entity |
| `moduleCode` | M1–M10 |
| `missionId` | Business Mission entity |
| `missionTitle` | Business Mission |
| `scenarioSummary` | Scenario Library |
| `missionObjective` | Learning Blueprint |
| `attemptId` | Mission Attempt |
| `attemptStatus` | in_progress \| completed |
| `currentPhase` | Mission workflow phase |
| `businessSituation` | Scenario narrative (filtered) |
| `availableDecisions` | Current decision point options |
| `recentDecisions` | Last N decisions in this attempt |

Mission context ensures AI explains business situations — not abstract topics.

---

# 23. StudentHistoryBlock

Filtered learning history for contextual continuity.

| Field | Source |
|-------|--------|
| `priorAttemptsInModule` | Mission Attempt count |
| `priorModuleSummary` | Condensed prior module outcomes |
| `decisionPatterns` | Aggregated decision tendencies |
| `reflectionQuality` | EduQA reflection scores |
| `aiEngagementSummary` | Prior AI Coach usage patterns |
| `certificationStatus` | Current certification level |
| `cohortId` | Student cohort reference |

History window defaults:

- current module: full detail;
- prior modules: summary only;
- configurable via institutional policy.

---

# 24. KpiContextBlock

Read-only KPI snapshot from Simulation Engine.

| Field | Source |
|-------|--------|
| `snapshotId` | KPI Snapshot entity |
| `snapshotAt` | Timestamp |
| `kpis` | Array of `{ code, name, value, previousValue, delta, unit }` |
| `impactedByRecentDecision` | boolean |
| `kpiInterpretationHints` | Institutional hints (not answers) |

Rules:

- AI never recalculates KPIs;
- stale snapshots (> configurable threshold) trigger warning flag in metadata;
- KPI block is immutable within the package lifecycle.

---

# 25. CompetencyContextBlock

Current competency state per `04_COMPETENCY_MATRIX.md`.

| Field | Source |
|-------|--------|
| `dimensions` | Four competency dimensions with levels |
| `moduleCompetencyTargets` | Target competencies for active module |
| `identifiedGaps` | From Learning Intelligence |
| `progressionTrend` | improving \| stable \| declining |
| `guidanceTier` | M1-M2 \| M3-M8 \| M9-M10 |

Competency context determines guidance depth — not assessment scores.

---

# 26. RecurringErrorBlock

Active recurring error patterns from Learning Intelligence.

| Field | Source |
|-------|--------|
| `patterns` | Array of `{ errorType, description, occurrenceCount, lastDetectedAt }` |
| `priorityPattern` | Highest priority active pattern |
| `targetedReviewAreas` | Suggested concept review areas |

Only `active` status patterns are included.

Resolved patterns are excluded from context unless professor explicitly requests history.

---

# 27. PedagogicalContextBlock

Institutional pedagogical rules bound to the request.

| Field | Value |
|-------|-------|
| `assistanceLevel` | guidance \| analysis \| recommendation |
| `requestType` | explain \| review-decision \| explain-kpi \| explain-process \| reflection |
| `learningObjectives` | Module learning objectives |
| `feedbackStructureRequired` | true (always) |
| `answerLeakPrevention` | true (always) |
| `maxGuidanceDepth` | Derived from assistance level and module tier |
| `professorOverride` | Optional professor guidance constraints |

This block encodes TEC.ERP pedagogical authority.

The provider cannot override these constraints.

---

# End of Part 04/12
---
# 28. Data Layer — Conceptual Entity Map

The Context Engine reads from the official Database Schema (`17_DATABASE_SCHEMA.md`).

Entity retrieval map:

```text
Student ──→ Cohort ──→ Module
   │
   ├── Mission Attempt ──→ Business Mission ──→ Scenario
   │         │
   │         └── Mission Decision
   │
   ├── Student Competency ──→ Competency
   │
   ├── KPI Snapshot
   │
   ├── Learning Analytics
   │
   ├── AI Conversation ──→ AI Message
   │         │
   │         └── AI Recommendation
   │
   ├── Learning Insight
   │
   └── Recurring Error Pattern
```

The Context Engine performs read operations only.

Write operations belong to other services (AI Coach persistence, Learning Intelligence).

---

# 29. Prisma Service Responsibilities

The Context Engine delegates retrieval to specialized Prisma repository modules.

| Repository | Responsibility |
|------------|----------------|
| `StudentContextRepository` | Student, cohort, certification status |
| `MissionContextRepository` | Module, mission, scenario, attempt, decisions |
| `KpiContextRepository` | KPI snapshots, staleness check |
| `CompetencyContextRepository` | Competency levels, gaps |
| `AiHistoryRepository` | Prior conversations, messages, recommendations |
| `LearningPatternRepository` | Recurring errors, learning insights |
| `ProfessorContextRepository` | Professor feedback, cohort scoping |

Each repository:

- exposes typed query methods only;
- enforces student/cohort scope at query level;
- uses Prisma `select` to retrieve minimum required fields;
- never returns full entity graphs unnecessarily;
- logs query duration for observability.

---

# 30. Database Retrieval Boundaries

| Rule | Description |
|------|-------------|
| DB-CTX-001 | Context Engine is the only AI component authorized to query learning entities for context |
| DB-CTX-002 | Reasoning Engine shall not import Prisma client |
| DB-CTX-003 | OpenAI shall never receive database connection strings or query results |
| DB-CTX-004 | Retrieval queries shall use parameterized Prisma methods only |
| DB-CTX-005 | Cross-student queries are prohibited except professor cohort scope |
| DB-CTX-006 | Soft-deleted or archived records are excluded by default |
| DB-CTX-007 | Context retrieval timeout shall not exceed configured SLA (default: 3000ms) |

Retrieval boundary violations are security incidents.

---

# 31. Entity Retrieval Specifications

## Student History

Retrieve: profile identifiers, cohort, enrollment status, certification level, module progression.

Exclude: password hashes, auth tokens, internal admin notes.

## Business Missions and Scenarios

Retrieve: mission metadata, scenario narrative, objectives, attempt state, decision history.

Exclude: future mission content, other students' attempts.

## Mission Attempts and Decisions

Retrieve: attempt timeline, decisions, outcomes, consequence flags, aiObservation fields.

Exclude: raw simulation internal state beyond KPI outputs.

## KPIs

Retrieve: latest snapshot per mission attempt, delta values, impacted flags.

Exclude: simulation calculation internals, historical snapshots beyond configured window.

## Competencies

Retrieve: current levels, achievement percentages, identified gaps.

Exclude: competency rubric internals not needed for guidance.

## Feedbacks and AI Interactions

Retrieve: recent AI messages (windowed), recommendations, professor feedback summaries.

Exclude: full historical archive unless professor role with explicit scope.

## Recurring Errors

Retrieve: active patterns with occurrence counts and descriptions.

Exclude: resolved patterns from student-facing packages.

## EduQA Signals

Retrieve: prior validation failure flags, answer-leak incident markers for current module.

Exclude: full EduQA audit logs.

---

# 32. Prisma Query Patterns

Recommended patterns:

```typescript
// Scoped mission attempt retrieval
await prisma.missionAttempt.findFirst({
  where: { id: attemptId, studentId, missionId },
  select: { id: true, completionStatus: true, finalScore: true, /* minimum fields */ },
});

// Parallel retrieval with Promise.all
const [mission, attempt, kpis, competencies, errors] = await Promise.all([
  missionRepo.getMissionContext(missionId),
  missionRepo.getActiveAttempt(studentId, missionId),
  kpiRepo.getLatestSnapshot(attemptId),
  competencyRepo.getStudentCompetencies(studentId, moduleId),
  patternRepo.getActivePatterns(studentId, moduleId),
]);
```

Anti-patterns (prohibited):

- `findMany()` without scope filters;
- loading full entity relations via unbounded `include`;
- sequential queries that can be parallelized;
- Prisma client instantiation outside service singleton.

---

# 33. Context Snapshot Persistence

Every validated AI Context Package generates a context snapshot record.

Snapshot attributes:

- `id`
- `conversationId`
- `packageId`
- `contextHash`
- `packageVersion`
- `filteredPayload` (JSON — post-filter, pre-provider)
- `filterAuditRecord` (JSON)
- `generatedAt`
- `requestedByRole`

Snapshots support:

- professor audit review;
- EduQA incident investigation;
- context reconstruction debugging;
- institutional compliance evidence.

Snapshots never contain provider API keys or unfiltered PII.

---

# 34. Data Layer Rules

DATA-CTX-001

Context retrieval shall use minimum necessary field selection.

DATA-CTX-002

Context snapshots shall be persisted for every validated package.

DATA-CTX-003

Prisma migrations affecting context entities require Approval Gate review.

DATA-CTX-004

Database query timeouts shall fail gracefully with structured errors.

DATA-CTX-005

Read replicas (if configured) may serve context retrieval on Railway PostgreSQL.

---

# End of Part 05/12
---
# 35. Pedagogical Context Integration

The Context Engine encodes pedagogical rules defined across official learning documents.

Pedagogical inputs:

| Source | Context Contribution |
|--------|---------------------|
| `01_LEARNING_BLUEPRINT.md` | Module learning objectives |
| `03_SCENARIO_LIBRARY.md` | Scenario narrative and business situation |
| `04_COMPETENCY_MATRIX.md` | Competency targets and progression |
| `09_AI_COACH_ARCHITECTURE.md` | Feedback structure and guidance tiers |
| `15_ERP_FUNCTIONAL_SPECIFICATION.md` | Assistance levels, activation contexts |
| `22_QUALITY_ASSURANCE_MANUAL.md` | EduQA validation signals |

Pedagogical context ensures AI guidance reinforces institutional learning design.

---

# 36. Business Mission Integration

Every ContextBuildRequest requires an active Business Mission binding.

Integration rules:

- `missionId` must reference a mission assigned to the student's current module;
- mission attempt must exist (auto-create not permitted at context layer);
- scenario narrative is included in filtered form;
- current decision point is included when request type is `review-decision`;
- capstone missions (M10) include cross-module summary in `priorModuleSummary`;
- dashboard AI requests reference the most recent incomplete or completed mission.

Unbound context requests are rejected in production.

Business Mission binding implements `27` §20 and `15` §68.

---

# 37. Module State and Progression

The Context Engine determines module state from institutional records.

Module state signals:

| Signal | Context Effect |
|--------|---------------|
| First attempt in module | Supportive guidance tier (M1-M2 style) |
| Mid-module progression | Process impact emphasis (M3-M8 style) |
| Advanced modules (M9-M10) | Reasoning challenge tier |
| Module completion pending | Reflection-focused context enrichment |
| Certification eligible | Certification review context available |

Module state drives `guidanceTier` in the CompetencyContextBlock.

---

# 38. KPI Integration for Context

KPI context enables the AI Coach to interpret simulation outcomes.

Context Engine KPI responsibilities:

- retrieve latest KPI snapshot for active attempt;
- compute delta from previous snapshot when available;
- flag KPIs impacted by the most recent decision;
- include institutional interpretation hints (not answers);
- mark stale snapshots in metadata when threshold exceeded.

KPI context is read-only.

The Context Engine never triggers simulation recalculation.

---

# 39. Competency Integration for Context

Competency context shapes guidance depth and focus areas.

Context Engine competency responsibilities:

- retrieve current levels across four dimensions;
- include module-specific competency targets;
- attach Learning Intelligence identified gaps;
- compute progression trend from historical levels;
- set `guidanceTier` based on module code and competency maturity.

Competency data never modifies competency scores within the Context Engine.

---

# 40. Professor Feedback Integration

When professor feedback exists for the student-module pair:

- summarized feedback themes are included in `professorContext`;
- professor-flagged review areas take priority in `targetedReviewAreas`;
- professor override constraints may cap assistance level;
- full professor notes are never passed to the provider — only institutional summaries.

Professor context is available for both student-initiated and professor-initiated AI requests.

Professor-initiated requests include cohort-level pattern summaries (scoped to assigned cohort).

---

# 41. Learning Objectives and Progression Signals

Each package includes mapped learning objectives for the active module.

Progression signals:

- missions completed vs. total in module;
- average mission score trend;
- reflection quality scores;
- AI Coach engagement frequency;
- recurring error resolution rate.

Progression signals inform EduQA hints — they do not determine grades.

---

# 42. Pedagogical Flow Rules

PED-CTX-001

Business Mission context shall anchor every package.

PED-CTX-002

Assistance level shall constrain pedagogical context depth.

PED-CTX-003

Guidance tier shall align with module code and competency maturity.

PED-CTX-004

Professor feedback themes shall take priority over generic guidance hints.

PED-CTX-005

Learning objectives shall be present for every module-bound package.

PED-CTX-006

Pedagogical rules are institutional — never delegated to the provider.

---

# End of Part 06/12
---
# 43. Security Architecture Alignment

Context Engine security follows `26_SECURITY_ARCHITECTURE.md`.

Security controls:

- authenticated session required for all context operations;
- RBAC enforced at authorization phase;
- least privilege on database field selection;
- no provider-boundary data transfer without filtering;
- audit logging for all context operations;
- rate limiting on context build requests;
- input validation on ContextBuildRequest fields.

---

# 44. Context Minimization

Context minimization ensures only necessary data reaches the Reasoning Engine and provider.

Minimization layers:

```text
Full Institutional Record (PostgreSQL)
↓
Scope Filter (role + mission + student)
↓
Field Filter (Prisma select minimum)
↓
PII Filter (remove sensitive attributes)
↓
Provider Filter (strip internal identifiers)
↓
Approved Context Package
```

Each layer produces audit metadata.

Minimization is mandatory — not optional optimization.

---

# 45. Role-Based Context Access

| Role | Context Scope |
|------|---------------|
| Student | Own data only — active mission and filtered history |
| Professor | Assigned cohort students — includes cohort pattern summaries |
| Administrator | Institutional audit scope — full snapshots with elevated logging |

Cross-role context access is prohibited.

Student role cannot request professor-level cohort analytics.

Professor role cannot access students outside assigned cohorts.

---

# 46. PII Boundaries

Permitted in provider-bound context:

- student first name (optional — configurable institutional policy);
- module and mission titles;
- business scenario narratives;
- KPI names and values;
- competency dimension names and levels;
- decision descriptions (business language);
- error pattern descriptions (business language).

Prohibited from provider-bound context:

- email addresses;
- student IDs (internal);
- password or auth data;
- full date of birth;
- government identifiers;
- raw database primary keys;
- other students' names or data;
- professor private notes (unfiltered);
- institutional admin metadata.

PII policy violations block package release.

---

# 47. Provider-Boundary Controls

Data crossing to OpenAI (Version 1 reasoning provider):

- receives serialized pedagogical context subset only;
- never receives database credentials;
- never receives API keys;
- never receives unfiltered institutional records;
- never initiates database queries;
- operates on Reasoning Engine-prepared prompt only.

The Context Engine terminates at the Reasoning Engine boundary.

OpenAI is downstream of two institutional gates: Context Validation and EduQA Validation.

---

# 48. Auditability Requirements

Every context operation generates audit events:

| Event | Data |
|-------|------|
| `context.build.started` | requestId, studentId, missionId, role |
| `context.auth.failed` | requestId, reason, role |
| `context.retrieval.completed` | requestId, query count, durationMs |
| `context.filter.applied` | requestId, fieldsRemoved, piiFiltered |
| `context.validation.failed` | requestId, validationCode, details |
| `context.package.released` | packageId, contextHash, durationMs |
| `context.snapshot.persisted` | snapshotId, conversationId |

Audit logs never contain provider credentials or unfiltered PII.

Audit retention follows institutional data retention policy (`26` §33).

---

# 49. Context Filtering Rules

FILTER-001

Remove all data belonging to students outside authorized scope.

FILTER-002

Remove internal system identifiers from provider-bound payload.

FILTER-003

Remove assessment scores unless contextually required for active mission feedback.

FILTER-004

Truncate AI conversation history to configured window (default: last 10 messages).

FILTER-005

Remove resolved recurring error patterns from student-facing packages.

FILTER-006

Remove professor private notes — include summary themes only.

FILTER-007

Remove email, auth tokens and credential fields unconditionally.

FILTER-008

Apply assistance level cap to pedagogical context depth.

---

# 50. Security and Privacy Rules

SEC-CTX-001

Context authorization shall precede any database query.

SEC-CTX-002

PII filtering is mandatory before provider-boundary transfer.

SEC-CTX-003

Context snapshots shall be access-controlled by role.

SEC-CTX-004

Audit events are mandatory for every context lifecycle.

SEC-CTX-005

Security violations shall block context release and trigger incident logging.

SEC-CTX-006

Provider credentials shall never appear in context payloads or snapshots.

---

# End of Part 07/12
---
# 51. Express Service Layer

The Context Engine is implemented as an Express backend service module.

File structure:

```text
src/
  services/
    ai/
      context-engine/
        context-engine.service.ts        # Orchestrator
        context-authorization.service.ts # Phase 1
        context-retrieval.service.ts     # Phase 2
        context-enrichment.service.ts    # Phase 3
        context-filter.service.ts        # Phase 4
        context-assembly.service.ts      # Phase 5
        context-validation.service.ts    # Phase 6
        context-snapshot.service.ts      # Persistence
        repositories/
          student-context.repository.ts
          mission-context.repository.ts
          kpi-context.repository.ts
          competency-context.repository.ts
          ai-history.repository.ts
          learning-pattern.repository.ts
          professor-context.repository.ts
        types/
          context-build-request.ts
          ai-context-package.ts
          context-blocks.ts
          context-errors.ts
```

Routes invoke `ContextEngineService.buildContext()` — never individual phase services directly.

---

# 52. ContextEngineService Orchestration

```typescript
class ContextEngineService {
  async buildContext(input: ContextBuildRequest): Promise<ContextBuildResult> {
    const trace = this.audit.start(input);
    try {
      await this.authorization.verify(input);
      const raw = await this.retrieval.fetchAll(input);
      const enriched = this.enrichment.apply(raw, input);
      const filtered = this.filter.apply(enriched, input);
      const assembled = this.assembly.build(filtered, input);
      const validated = this.validation.verify(assembled);
      await this.snapshot.persist(validated, input);
      this.audit.complete(trace, validated.packageId);
      return { success: true, package: validated };
    } catch (error) {
      this.audit.fail(trace, error);
      return { success: false, error: this.mapError(error) };
    }
  }
}
```

Total context build SLA target: **≤ 3000ms** (P95) on Railway production.

---

# 53. TypeScript Interface Direction

Shared types in `src/services/ai/context-engine/types/`:

```typescript
interface ContextBuildRequest { /* §11 fields */ }
interface ContextBuildResult {
  success: boolean;
  package?: AIContextPackage;
  error?: ContextEngineError;
}
interface AIContextPackage { /* §21 schema */ }
interface MissionContextBlock { /* §22 */ }
interface StudentHistoryBlock { /* §23 */ }
interface KpiContextBlock { /* §24 */ }
interface CompetencyContextBlock { /* §25 */ }
interface RecurringErrorBlock { /* §26 */ }
interface PedagogicalContextBlock { /* §27 */ }
interface EduqaSignalBlock {
  priorValidationFailures: number;
  answerLeakFlags: boolean;
  reflectionQualityScore?: number;
}
interface ContextMetadata {
  buildDurationMs: number;
  queryCount: number;
  filterAudit: FilterAuditRecord;
  staleKpiWarning: boolean;
}
type ContextEngineError =
  | ContextAuthorizationError
  | ContextRetrievalError
  | ContextValidationError
  | ContextTimeoutError;
```

Strict TypeScript mode is mandatory.

No `any` in context contracts.

---

# 54. React Integration Points

The React frontend initiates AI requests — it never constructs context.

Integration flow:

```text
Student clicks "Ask AI Coach"
↓
React sends POST /api/v1/ai/explain (or equivalent)
↓
Request body: { missionId, moduleId, requestType, triggerDecisionId? }
↓
Express AI Coach Route → Context Engine (server-side)
↓
Response: validated AI Coach message (after full orchestration)
```

Frontend responsibilities:

- pass mission and module identifiers from current UI state;
- display loading state during context build + reasoning;
- handle `ContextEngineError` with institutional user messages;
- never include student history, KPIs or competencies in request body;
- never expose context package to browser DevTools logging.

Professor portal: cohort insight views consume Learning Insight API — not raw context packages.

---

# 55. EduQA Integration

The Context Engine prepares EduQA signals — it does not validate responses.

`EduqaSignalBlock` contents:

- count of prior EduQA validation failures in current module;
- answer-leak incident flag for current conversation;
- reflection quality score from prior attempts;
- assistance level compliance hint;
- module tier guidance constraint.

The EduQA Validator Service consumes these signals during post-reasoning validation (`27` §29).

Context Engine + EduQA Validator form a closed quality loop.

---

# 56. Observability and Audit Logs

Operational metrics:

| Metric | Description |
|--------|-------------|
| `context.build.duration_ms` | P50, P95, P99 build latency |
| `context.build.success_rate` | Successful package releases |
| `context.auth.failure_rate` | Authorization rejections |
| `context.validation.failure_rate` | Validation rejections |
| `context.retrieval.query_count` | Queries per build |
| `context.filter.pii_removed_count` | PII fields filtered |
| `context.timeout.rate` | Builds exceeding SLA |

Logs structured as JSON on Railway.

Alert thresholds configured per `21_PLATFORM_OPERATIONS_PLAYBOOK.md`.

---

# 57. Implementation Rules

IMPL-CTX-001

Context Engine logic shall reside exclusively in Express backend services.

IMPL-CTX-002

Prisma repositories shall enforce scope at query level.

IMPL-CTX-003

TypeScript interfaces shall version the AI Context Package schema.

IMPL-CTX-004

React shall not receive unfiltered context packages in production.

IMPL-CTX-005

Context build failures shall return structured errors — never empty packages.

IMPL-CTX-006

All context operations shall emit audit events.

---

# End of Part 08/12
---
# 58. Test Strategy

Context Engine testing follows `23_TESTING_STRATEGY.md`.

Mandatory test categories:

**Unit Tests**

- authorization phase — role and scope enforcement;
- filtering rules — PII removal verification;
- assembly — schema completeness;
- validation — rejection of incomplete packages.

**Integration Tests**

- Prisma repository queries with test database;
- full lifecycle with seeded student/mission/KPI data;
- parallel retrieval performance;
- snapshot persistence verification.

**Contract Tests**

- AIContextPackage schema version compliance;
- Reasoning Engine input contract compatibility.

**Security Tests**

- cross-student access rejection;
- professor out-of-cohort rejection;
- PII field exclusion verification.

**Performance Tests**

- context build latency under Railway-like conditions;
- query count limits per build.

Provider API calls are never required for Context Engine tests.

---

# 59. Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Valid student mission request | Approved AIContextPackage |
| Missing missionId | ContextValidationError |
| Student requests another student's context | ContextAuthorizationError |
| Professor outside cohort scope | ContextAuthorizationError |
| Stale KPI snapshot | Package with staleKpiWarning flag |
| Active recurring errors present | RecurringErrorBlock populated |
| PII fields in retrieval | Filtered before package release |
| Database timeout | ContextTimeoutError |
| All phases succeed | Context snapshot persisted |

Every scenario produces audit event verification.

---

# 60. Failure Modes

| Failure | Behaviour | User Impact |
|---------|-----------|-------------|
| Authorization failure | Block reasoning; log incident | "Unable to access learning context" |
| Database unavailable | Block reasoning; retry once | "Learning context temporarily unavailable" |
| Retrieval timeout | Block reasoning | "Context preparation timed out" |
| Validation failure | Block reasoning; log diagnostic | "Unable to prepare guidance context" |
| Snapshot persistence failure | Block reasoning (data integrity) | "Unable to save learning session" |
| Partial retrieval data | Validation failure — no partial packages | Same as validation failure |
| Filter failure | Block reasoning; security alert | "Unable to prepare safe context" |

The Context Engine never degrades to empty context.

Failed context means no AI response — not unguided AI response.

---

# 61. Failure Mode Rules

FAIL-CTX-001

Never release unvalidated context packages.

FAIL-CTX-002

Never pass empty context to the Reasoning Engine.

FAIL-CTX-003

Never expose internal error details to students.

FAIL-CTX-004

Database failures shall trigger operational alerts.

FAIL-CTX-005

Security-related failures shall trigger security incident logging.

FAIL-CTX-006

Failure rates shall be monitored on Railway production dashboards.

---

# 62. Railway Deployment Considerations

Context Engine deploys as part of the Express application on Railway.

Deployment requirements:

- PostgreSQL connection via Railway Variables (`DATABASE_URL`);
- context build timeout aligned with Railway request timeout limits;
- health check endpoint includes Context Engine database connectivity;
- Prisma migrations applied before AI feature activation;
- connection pooling configured for parallel retrieval queries;
- structured JSON logging to Railway deployment logs;
- no additional Railway service required for Context Engine (embedded in API).

Production validation includes context build smoke test against seeded mission data.

---

# End of Part 09/12
---
# 63. Provider Independence

The AI Context Package schema is provider-agnostic.

Design constraints ensuring provider independence:

- no OpenAI-specific fields in AIContextPackage;
- no provider SDK imports in Context Engine module;
- context serialization format is institutional JSON — not provider prompt format;
- schema versioning allows evolution without provider changes;
- Reasoning Engine handles provider-specific prompt formatting downstream.

Replacing OpenAI requires changes to Reasoning Engine provider module only.

Context Engine contracts remain stable across provider migrations.

---

# 64. OpenAI Boundary Specification

OpenAI (Version 1) interaction boundaries:

| Layer | OpenAI Contact |
|-------|----------------|
| Context Engine | **None — prohibited** |
| Reasoning Engine | Via provider abstraction only |
| React Frontend | **None — prohibited** |
| Prisma / PostgreSQL | **None — prohibited** |

Data OpenAI may receive (via Reasoning Engine prepared prompt):

- filtered mission narrative;
- business decision descriptions;
- KPI names and values;
- competency dimension levels;
- recurring error descriptions;
- pedagogical constraints;
- institutional prompt template with bound context.

Data OpenAI must never receive:

- database records or query results;
- unfiltered PII;
- other students' information;
- authentication credentials;
- raw Prisma entity objects.

---

# 65. Context Engine Validation Checklist

Before Approval Gate, verify:

✓ ContextEngineService orchestrates all six lifecycle phases

✓ Prisma repositories enforce role-based scope

✓ AIContextPackage schema matches §21–27 block definitions

✓ PII filtering verified by automated tests

✓ No provider SDK imports in Context Engine module

✓ Context snapshots persist for every validated package

✓ React integration passes identifiers only — not context payloads

✓ EduQA signal block populated correctly

✓ Recurring error patterns integrated from Learning Intelligence

✓ Failure modes return structured errors — never empty context

✓ Railway deployment smoke test passes

✓ Audit events emit for all lifecycle phases

---

# 66. Context Engine Success Criteria

The Context Engine is successful when:

- every AI reasoning request operates on complete mission-bound context;
- no provider receives unfiltered institutional data;
- context build completes within SLA on Railway production;
- recurring errors and competency gaps appear in context packages;
- professors can audit context snapshots for their cohort students;
- provider replacement requires zero Context Engine code changes;
- zero cross-student context leakage incidents in production.

Context quality is measurable — not assumed.

---

# 67. Continuous Context Engine Improvement

Improvement activities:

- optimize Prisma query patterns for latency reduction;
- refine PII filtering rules based on audit findings;
- expand context snapshot analytics for professor dashboards;
- tune history window policies based on EduQA feedback;
- improve stale KPI detection thresholds;
- add schema version migrations with backward compatibility.

Context Engine maturity increases with every platform release.

---

# 68. Context Engine Evolution Rules

EVOL-CTX-001

Schema changes require version increment and contract tests.

EVOL-CTX-002

New context blocks require Approval Gate evidence.

EVOL-CTX-003

Security filter changes require security review.

EVOL-CTX-004

Provider independence shall be preserved in all evolutions.

EVOL-CTX-005

Performance regressions block release until resolved.

EVOL-CTX-006

Every evolution shall improve context quality or security.

---

# End of Part 10/12
---
# 69. Final Context Engine Governance

Final Context Engine Governance confirms that the first implementation-level component of Enterprise Educational Intelligence is operational, validated and institutionally controlled.

The Context Engine is the foundation of AI quality for TEC.ERP.

Every downstream AI capability depends upon context integrity.

Governance ensures context reconstruction remains authoritative — not delegated to external providers.

---

# 70. Context Engine Closure

Every Context Engine release shall conclude with formal closure.

Context Engine Closure includes:

✓ Authorization Phase Validated

✓ Retrieval Repositories Tested

✓ Filtering Rules Verified

✓ AI Context Package Schema Validated

✓ Snapshot Persistence Confirmed

✓ EduQA Signal Integration Verified

✓ Security Controls Validated

✓ Railway Deployment Confirmed

✓ Audit Logging Operational

✓ Documentation Updated

✓ Approval Gate Completed

Formal closure ensures institutional traceability.

---

# 71. Final Context Engine Principles

CTX-FINAL-001

The LLM never queries the database directly.

CTX-FINAL-002

The Context Engine reconstructs institutional intelligence before any reasoning request.

CTX-FINAL-003

The AI Context Package is the sole authorized boundary between persistence and reasoning.

CTX-FINAL-004

OpenAI is the Version 1 reasoning provider — not a data or intelligence authority.

CTX-FINAL-005

Context minimization and PII filtering are mandatory — not optional.

CTX-FINAL-006

Every context operation requires audit evidence.

---

# End of Part 11/12
---
# 72. VS Code / Cursor Commands

Official engineering commands for Context Engine work.

## Document Review

```powershell
code docs/28_AI_CONTEXT_ENGINE.md
code docs/27_AI_ARCHITECTURE.md
code docs/17_DATABASE_SCHEMA.md
code docs/18_API_SPECIFICATION.md
code docs/26_SECURITY_ARCHITECTURE.md
```

## Cursor Context Activation

When implementing Context Engine features in Cursor, ensure these rules are active:

- `.cursor/rules/tec_erp_ai_architecture.mdc`
- `.cursor/rules/tec_erp_engineering.mdc`
- `.cursor/rules/tec_erp_architecture.mdc`

Reference project context:

```powershell
code .cursor/context/TEC_ERP_PROJECT_CONTEXT.md
```

## Pre-Implementation Checklist (Cursor)

Before writing Context Engine code, Cursor shall confirm:

1. ContextBuildRequest and AIContextPackage interfaces defined
2. Prisma repositories scoped by student/cohort
3. No provider SDK imports in context-engine module
4. PII filtering rules implemented per §49
5. Six-phase lifecycle orchestration planned
6. Audit event emission planned for all phases
7. Approval Gate criteria understood

## Validation Commands

```powershell
npm run build
npm run test -- --grep "context-engine"
npm run lint
npx prisma validate
npx prisma migrate diff
```

All commands must pass before Approval Gate.

---

# 73. Git Closure Package

Official git workflow for Context Engine documentation and implementation closure.

## Status Review

```powershell
git status
git diff
```

## Stage Context Engine Work

```powershell
git add docs/28_AI_CONTEXT_ENGINE.md
git add src/services/ai/context-engine/
git add prisma/schema.prisma
```

Stage only files related to the approved Context Engine scope.

Never stage `.env`, credentials or provider API keys.

## Pre-Commit Verification

```powershell
npm run build
npm run test
git diff --cached
```

## Commit

```powershell
git commit -m "docs: add AI context engine architecture"
```

Commit messages shall follow institutional standards (`19` §13).

**Commit requires external approval before execution.**

## Post-Commit Verification

```powershell
git log --oneline -1
git status
```

Repository must remain in a buildable state (BUILD-006).

## Pull Request Requirements

Context Engine PRs shall include:

- objective and implementation summary;
- impacted repositories and service modules;
- AIContextPackage schema version;
- PII filtering test evidence;
- context build performance metrics;
- Railway deployment readiness;
- Approval Gate status;
- alignment confirmation with `27_AI_ARCHITECTURE.md`.

---

# 74. Approval Gate

Context Engine Approval Gate is mandatory before Context Engine code enters production (`19` §9, `24` §21, `27` §71).

## Gate Checklist

| Domain | Criterion | Status |
|--------|-----------|--------|
| Architecture | Six-phase lifecycle implemented | ☐ |
| Authorization | Role-based scope enforced | ☐ |
| Data Layer | Prisma repositories match `17` entities | ☐ |
| Context Package | Schema v1.0 validated by contract tests | ☐ |
| PII Filtering | Automated tests pass for all FILTER rules | ☐ |
| Business Mission | Mission binding enforced on every request | ☐ |
| KPI Integration | Read-only snapshots with staleness detection | ☐ |
| Competency | Four-dimension context populated | ☐ |
| Recurring Errors | Active patterns included from Learning Intelligence | ☐ |
| EduQA Signals | EduqaSignalBlock populated correctly | ☐ |
| Security | Controls validated per `26` and §43–50 | ☐ |
| Provider Boundary | No OpenAI/Prisma contact from Context Engine | ☐ |
| Testing | Unit, integration, security tests passed | ☐ |
| Observability | Audit events and metrics operational | ☐ |
| Railway | Deployment and smoke test passed | ☐ |
| Documentation | This document and `27` aligned | ☐ |

## Gate Decision

| Decision | Authority |
|----------|-----------|
| Engineering Gate | Solution Architect + QA Engineer |
| Educational Gate | Educational Specialist + Instructor |
| Security Gate | Platform Administrator + Security Review |
| Institutional Gate | Institutional Leadership |

All gates must pass.

Failed gates keep the phase open until deficiencies are corrected.

---

# 75. Document Status

**Document:** AI Context Engine

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard — Complete

**Parts:** 12/12

**Approval Gate:** Pending Institutional Review

**Last Updated:** 2026

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

This document establishes the official implementation architecture for the AI Context Engine — the first implementation-level component of TEC.ERP Enterprise Educational Intelligence.

The LLM never queries the database directly.

The intelligence belongs to TEC.ERP.

---

# End of Part 12/12

# End of Document

**Document Status:** AI Context Engine Complete
