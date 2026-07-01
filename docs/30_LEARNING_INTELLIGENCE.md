# TEC.ERP — Learning Intelligence

**Document:** Learning Intelligence

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

**Architecture Review Board:** Completed — Program Director Approved

---

# 1. Purpose

This document defines the official implementation architecture for **Learning Intelligence** — the fourth component of TEC.ERP Enterprise Educational Intelligence (EEI).

Learning Intelligence is the institutional memory and pattern-recognition layer of EEI. It transforms observable learning signals into persistent, auditable educational insight that enriches future guidance, professor visibility, and EduQA evidence — without substituting for student reasoning or altering academic judgement.

This document is the authoritative reference for Learning Intelligence engineering, data persistence, platform integration, governance, testing and deployment.

Learning Intelligence does not invoke LLM providers. Learning Intelligence does not deliver student-facing AI Coach responses. The intelligence belongs to TEC.ERP.

---

# 2. Learning Intelligence Mission

The mission of Learning Intelligence is to close **Loop 2 — Learning History Loop** within Enterprise Educational Intelligence.

Learning Intelligence shall:

- detect recurring error patterns across missions, modules, and cohorts;
- identify competency gaps from decision, KPI, and interaction history;
- generate and persist Learning Insight records for professor analytics;
- maintain the Recurring Error Registry and feed active patterns to the Context Engine;
- support cohort-level difficulty and at-risk-student signals (advisory only);
- supply measurable learning signals to EduQA and institutional quality review;
- operate **asynchronously and continuously** across the student lifecycle.

Learning Intelligence owns **pattern interpretation and insight persistence**. It does not own reasoning, context assembly, or student-facing delivery.

---

# 3. Learning Intelligence Philosophy

TEC.ERP adopts an **Analyze-After-Deliver** philosophy for Learning Intelligence.

Coaching is delivered under EduQA governance first. Institutional learning adapts second — without retroactive modification of delivered responses.

```text
Learning Signal
↓
Learning Intelligence Analysis
↓
Insight / Pattern Persistence
↓
Context Engine Enrichment (read at assembly)
↓
Improved Future Guidance
↓
Professor & Cohort Intelligence
↓
EduQA Evidence
```

Pedagogy precedes technology at every boundary. Learning Intelligence observes, interprets, and advises the institution — it does not decide, score, or certify on behalf of students.

---

# 4. Learning Intelligence Principles

LI-001

Learning Intelligence operates asynchronously — never on the synchronous Coach delivery critical path.

LI-002

Learning Intelligence may access PostgreSQL via Prisma for analysis and insight persistence.

LI-003

Learning Intelligence never modifies assessment results, scores, certifications, or competency scores.

LI-004

Every insight and recurring error pattern shall be mission-bound and traceable to `studentId`, `moduleId`, and where applicable `missionId`.

LI-005

Recurring error patterns are institutional learning assets — accumulated across the student lifecycle.

LI-006

Context Engine enrichment flows through persisted patterns and gaps — Learning Intelligence never bypasses Context Engine.

LI-007

Orchestrator dispatch failure shall not affect already-delivered Coach responses — log only.

LI-008

Insight generation shall align with progressive guidance tiers M1–M10 (`09` AI-004).

LI-009

Cohort-level insights shall enforce privacy and minimum aggregation thresholds before exposure.

LI-010

All Learning Intelligence operations shall produce audit events compatible with institutional governance.

LI-011

Learning Intelligence analysis algorithms are institutional assets — not provider-dependent.

LI-012

Railway-first operational constraints govern async processing, monitoring, and failure recovery.

**Inherited principles (non-negotiable):** AI-ARCH-003, AI-ARCH-007, AI-006, DB-AI-001 through DB-AI-006, EDU-AI-006, ORCH-001.

---

# 5. Learning Intelligence Scope

This document defines:

- Learning Intelligence architecture, boundaries, and async lifecycle;
- Learning Insight and Recurring Error Registry models;
- Competency gap inference and progress intelligence;
- Professor and cohort intelligence surfaces;
- Context Engine enrichment supply contract (pull-at-assembly);
- Reasoning Orchestrator async dispatch consumption;
- institutional ADRs adopted by the Architecture Review Board;
- Express service responsibilities, TypeScript interfaces, and React integration points;
- governance, retention, RBAC, and EduQA integration;
- observability, failure modes, test strategy, and Railway deployment;
- Approval Gate and Document Alignment Dependencies.

This document does **not** redefine:

- AI Context Engine assembly (`28_AI_CONTEXT_ENGINE.md`);
- AI Reasoning Orchestrator reasoning path (`29_AI_REASONING_ORCHESTRATOR.md`);
- parent EEI architecture (`27_AI_ARCHITECTURE.md`);
- AI Coach pedagogical delivery (`09_AI_COACH_ARCHITECTURE.md`);
- Simulation Engine KPI calculation (`06_SIMULATION_ENGINE.md`);
- Competency Engine scoring (`19`, `04`, `17`).

---

# 6. Related Documents

| Document | Relationship |
|----------|--------------|
| `27_AI_ARCHITECTURE.md` | Parent EEI architecture — Loop 2 summary |
| `28_AI_CONTEXT_ENGINE.md` | Enrichment consumer — pull-at-assembly |
| `29_AI_REASONING_ORCHESTRATOR.md` | Async dispatch source — Phase 8 |
| `09_AI_COACH_ARCHITECTURE.md` | Indirect enrichment path via Context Engine |
| `17_DATABASE_SCHEMA.md` | Entity definitions — alignment dependencies |
| `18_API_SPECIFICATION.md` | Insight API endpoints — alignment dependencies |
| `22_QUALITY_ASSURANCE_MANUAL.md` | EduQA validation criteria |
| `26_SECURITY_ARCHITECTURE.md` | RBAC, privacy, audit controls |
| `architecture-board/30/` | Approved ARB artifacts — authoring source |

When conflicts arise, follow the source-of-truth hierarchy defined in `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` §4. **Architecture Review Board Architecture Decision Package** (Consensus Report §12) takes precedence over individual perspective reviews.

---

# End of Part 01/12
---
# 7. Architecture Overview

Learning Intelligence is the fourth implementation-level component of Enterprise Educational Intelligence.

```text
BUSINESS MISSIONS + SIMULATION ENGINE
         │ (read: attempts, decisions, KPIs)
         ▼
┌─────────────────────────────────────────────────────────────┐
│  LEARNING INTELLIGENCE (this document)                         │
│  Analyze · Detect · Persist · Aggregate · Metricize          │
│  Async only · Prisma authorized · No LLM · No Coach text       │
└──────────┬───────────────────────────────┬──────────────────┘
           │ write patterns/gaps            │ async dispatch in
           ▼                                ▲
   AI CONTEXT ENGINE (28)          AI REASONING ORCHESTRATOR (29)
   Pull-at-assembly enrichment    Phase 8 FeedbackDispatcher
           │                                │
           └──────── validated package ─────┘
                        │
                   EDUQA (22) → AI COACH (09)
                        │
           PROFESSOR DASHBOARD (08/11) · STUDENT TIMELINE (12) [read APIs]
```

Learning Intelligence resides in the **Application Layer** as `LearningIntelligenceService` — a peer of Context Engine, Reasoning Orchestrator, and AI Coach delivery services.

---

# 8. Component Responsibilities

## Learning Intelligence Owns

- pattern analysis and recurring error detection;
- Learning Insight and Recurring Error Pattern persistence;
- competency gap **inference** (not scoring);
- progress state interpretation and trajectory indicators;
- professor intervention signal composition;
- cohort pattern aggregation (subject to minimum-N thresholds);
- Learning Analytics calculation (pedagogical indicators);
- async consumption of Orchestrator post-delivery dispatch;
- EduQA evidence export (aggregated signals);
- professor feedback integration into pattern state;
- enrichment **publication** to PostgreSQL for Context Engine read;
- Learning Intelligence operational metrics and domain event emission.

## Learning Intelligence Does Not Own

- AI Context Package assembly (Context Engine);
- synchronous reasoning orchestration (Reasoning Orchestrator);
- prompt template design or provider invocation;
- student-facing Coach response generation;
- EduQA per-response validation execution;
- competency scoring or certification decisions;
- KPI calculation (Simulation Engine);
- assessment grading.

---

# 9. System Boundaries

| Boundary | Rule |
|----------|------|
| LI ↔ PostgreSQL | Prisma read/write on insight entities — authorized |
| LI ↔ Context Engine | LI persists; CE reads at assembly — no package push |
| LI ↔ Reasoning Orchestrator | Async dispatch in only — no synchronous reverse calls |
| LI ↔ OpenAI / providers | **No contact — prohibited** |
| LI ↔ React | Read APIs only — separate professor and student DTOs |
| LI ↔ Competency Engine | Read-only competency state — never write scores |
| LI ↔ Simulation Engine | Read KPI snapshots — never recalculate KPIs |

Boundary violations are architectural defects.

---

# 10. Enterprise Educational Intelligence Placement

Learning Intelligence completes the EEI stack established in `docs/27`–`29`:

| Component | Role | Sync/Async |
|-----------|------|------------|
| Context Engine (`28`) | Reconstructs institutional context | Synchronous |
| Reasoning Orchestrator (`29`) | Coordinates reasoning and EduQA | Synchronous |
| **Learning Intelligence (`30`)** | **Analyzes and persists learning patterns** | **Async** |
| AI Coach (`09`) | Delivers validated responses | Synchronous (downstream) |

Three institutional philosophies govern the stack:

| Philosophy | Component |
|------------|-----------|
| Context-Before-Reasoning | Context Engine |
| Orchestrate-Before-Deliver | Reasoning Orchestrator |
| **Analyze-After-Deliver** | **Learning Intelligence** |

---

# 11. Upstream and Downstream Integration

**Upstream — institutional learning data**

- Business Missions: attempts, decisions, reflections
- Simulation Engine: KPI snapshots (read-only)
- Competency Engine: authoritative competency levels (read-only)
- Reasoning Orchestrator: async dispatch after EduQA-validated delivery
- EduQA: validation outcome signals
- Professor Dashboard: intervention, dismiss, resolve actions

**Downstream — enrichment and analytics consumers**

- Context Engine: reads active patterns and identified gaps at assembly
- Professor Dashboard: insight summaries, intervention queue, cohort analytics
- Student Timeline: V1 indirect; sanitized read projection only
- EduQA: longitudinal learning effectiveness signals

**Enrichment path (mandatory contract):**

```text
LI → persist → PostgreSQL → CE read at assembly → Orchestrator → EduQA → Coach
```

The AI Coach never reads Learning Intelligence directly at runtime.

---

# 12. What Learning Intelligence Does Not Redefine

Document 30 references but does not redefine:

- Context Engine six-phase lifecycle (`28`);
- Orchestrator eight-phase lifecycle and strategy matrix (`29`);
- AI Coach feedback structure (`09`);
- EduQA per-response validation pipeline (`22`, `29`);
- Competency Engine scoring authority (`04`, `17`);
- Simulation KPI immutability rules (`06`, DB-KPI-001/002);
- provider abstraction and OpenAI boundary (`29`).

---

# 13. Learning Intelligence Rules

LI-RULE-001

No Learning Intelligence feature shall invoke LLM providers.

LI-RULE-002

No Learning Intelligence write path shall modify scores, certifications, or competency levels.

LI-RULE-003

Enrichment reaches reasoning only via Context Engine validated packages.

LI-RULE-004

Async analysis failure is logged only — never blocks delivered Coach responses.

LI-RULE-005

Professor insights are advisory; professor authority over assessment is preserved.

LI-RULE-006

Cohort pattern features require ADR-GOV-001 minimum-N thresholds before persistence or API exposure.

---

# End of Part 02/12
---
# 14. Analyze-After-Deliver Lifecycle

Every Learning Intelligence analysis cycle follows five institutional phases.

```text
Phase 1 — Trigger Admission
Phase 2 — Evidence Collection
Phase 3 — Pattern Analysis
Phase 4 — Insight Persistence
Phase 5 — Enrichment Publication
```

Each phase emits audit events. Failure at Phases 1–4 is logged; Phase 5 failure does not affect prior delivered Coach responses.

---

# 15. Phase 1 — Trigger Admission

Authorized async triggers:

| Trigger | Source | Timing |
|---------|--------|--------|
| Orchestrator post-delivery dispatch | `29` §51 Phase 8 | Immediate queue |
| Mission attempt completion | Business Mission runtime | Event-driven async |
| Reflection submission | Mission workflow | Event-driven async |
| Professor intervention action | Professor Dashboard | Near-real-time |
| Cohort aggregation | Internal scheduler | Scheduled batch (V2) |

Admission validates: authenticated context, `studentId`/`moduleId`/`missionId` binding, idempotency key where applicable (`orchestrationId` for dispatch triggers).

---

# 16. Phase 2 — Evidence Collection

Learning Intelligence consumes **institutional signals only** — never raw provider output as primary analytical input.

| Source | Data consumed |
|--------|---------------|
| Orchestrator dispatch | strategy, request type, validation attempts, competency snapshot, KPI impact flag, delivery status |
| Mission Attempt / Decision | weak decisions, outcomes, decision types |
| KPI Snapshot | deltas, misinterpretation correlation (read-only) |
| Student Competency | current levels vs. module targets (read-only) |
| AI Conversation / Message | interaction history, EduQA outcomes |
| Reflection | reflection quality signals |
| Professor feedback | dismiss, resolve, override (when persisted) |

**Explicit non-inputs:** unvalidated raw provider responses; client-constructed context; unbound AI conversations.

---

# 17. Phase 3 — Pattern Analysis

Pattern analysis applies institutional detection rules — not provider heuristics.

Detection domains include:

- recurring weak decisions within and across mission attempts;
- KPI misinterpretation patterns;
- competency dimension gaps vs. module targets;
- reflection quality weaknesses;
- EduQA validation failure patterns;
- engagement and abandonment anomalies;
- cohort-level error frequency (subject to minimum-N).

Analysis algorithms are institutional assets (LI-011).

---

# 18. Phase 4 — Insight Persistence

Learning Intelligence writes:

| Entity | Purpose |
|--------|---------|
| **Learning Insight** | Typed educational observations |
| **Recurring Error Pattern** | Active/resolved error patterns with occurrence metadata |

Learning Intelligence reads (never writes): Mission Attempt, Decision, KPI Snapshot, Student Competency, AI Conversation/Message, Reflection.

All writes are auditable by student, module, and cohort (DB-AI-006).

---

# 19. Phase 5 — Enrichment Publication

Per **ADR-DK-002 (Pull-at-Assembly LI Read Model)**:

- Learning Intelligence **persists** enrichment state to PostgreSQL;
- Context Engine **reads** active state during Phase 2 Retrieval at `buildContext()`;
- Learning Intelligence does **not** push into Context Packages;
- Learning Intelligence does **not** mutate Context Packages.

Published enrichment fields consumed by Context Engine (`28` §25–26):

- `recurringErrorContext` — active patterns, `priorityPattern`, `targetedReviewAreas`
- `competencyContext.identifiedGaps`
- `competencyContext.progressionTrend` (LI-owned computation; Competency Engine levels as read-only input)

---

# 20. Orchestrator Async Dispatch Contract

After successful EduQA-validated delivery (`29` §51 Phase 8), the Reasoning Orchestrator dispatches to Learning Intelligence.

**Dispatch payload (mandatory fields):**

- `orchestrationId` (idempotency key)
- strategy used, request type
- validation attempt count
- competency context snapshot at time of request
- recurring error pattern reference (if active)
- KPI impact flag
- delivery success / institutional fallback flag

**Dispatch rules:**

- one successful delivery → one dispatch event (idempotent on `orchestrationId`);
- dispatch failure → logged only — response already delivered (LI-007);
- LI never calls Orchestrator synchronously;
- Orchestrator never queries PostgreSQL for LI analysis (ORCH-001 preserved).

---

# End of Part 03/12
---
# 21. Learning Insight Model

A **Learning Insight** is the smallest unit of institutional learning observation Learning Intelligence persists.

### Insight Taxonomy (institutional — LI-owned)

| Type | Pedagogical meaning |
|------|---------------------|
| `recurring_error` | Repeated reasoning mistake across attempts |
| `competency_gap` | Observable weakness in a competency dimension |
| `progress_signal` | Trajectory change (improving, stalling, declining) |
| `reflection_weakness` | Shallow or misaligned reflection |
| `kpi_misinterpretation` | Consistent KPI reading errors |
| `cohort_pattern` | Pattern visible at cohort level |
| `intervention_recommendation` | Professor action suggested (professor-facing only) |
| `eduqa_signal` | AI guidance quality concern |
| `engagement_anomaly` | Disengagement or abandonment pattern |

### Insight Lifecycle

- **active** → **superseded** → **resolved** → **expired**
- Active insights with the same root cause merge (LI-INS-001)
- Resolved insights exit default Context Engine enrichment (LI-INS-002)
- No insight may imply grade, score adjustment, or certification outcome (LI-INS-005)

### Insight Attributes (conceptual)

Identity & binding · classification · evidence references · priority · institutional confidence · status · pedagogical framing · temporal markers · provenance.

---

# 22. Recurring Error Intelligence

The **Recurring Error Registry** institutionalizes repeated reasoning failures.

A recurring error is a **pattern** meeting recurrence criteria — not a single wrong decision.

### Error Classification Domains (M1–M10)

ERP foundations · Master data · Procure-to-Pay · Order-to-Cash · Supply Chain · Finance · CRM · Governance · KPI/BI · Capstone.

Cross-module errors receive explicit cross-process tagging for M3–M10.

### Detection Rules

| Rule | Condition | Action |
|------|-----------|--------|
| LI-ERR-001 | Same error type ≥ N times within mission attempt series | Register at student level |
| LI-ERR-002 | Same error type across ≥ M distinct missions in module | Elevate priority; attach competency gap |
| LI-ERR-003 | KPI misinterpretation co-occurs with decision error ≥ K times | Compound `kpi_misinterpretation` pattern |
| LI-ERR-004 | Cohort frequency ≥ threshold | Generate cohort insight (ADR-GOV-001) |
| LI-ERR-005 | Pattern absent after guidance window | Mark resolved |
| LI-ERR-006 | Professor marks addressed | Resolve with professor attribution |

### Registry Lifecycle

`active` → `monitoring` → `resolved` — occurrence count and trend tracked.

Only **active** patterns enrich Context Engine by default.

---

# 23. Competency Gap Intelligence

| Competency Engine | Competency Gap Intelligence |
|-------------------|----------------------------|
| Owns competency **scoring and validation** | Owns competency **gap inference** |
| Produces authoritative levels | Produces advisory gap signals |
| Feeds certification evaluation | Feeds guidance enrichment and professor analytics |
| **Never modified by LI** | **Never modifies competency scores** |

### Four-Dimension Gap Model (`04`)

Business Understanding · Process Execution · Analytical Thinking · Professional Decision-Making.

Gap signals feed Context Engine `identifiedGaps` and inform guidance emphasis within `guidanceTier` (CE-owned derivation from module code).

**ADR-DK-003:** `progressionTrend` (improving | stable | declining) requires append-only **Student Competency History** owned by Competency Engine — read by LI and CE.

---

# 24. Learning Progress Intelligence

Progress dimensions: module progression · competency trajectory · reasoning maturity · engagement continuity · certification readiness indicators (advisory only).

### Progress States (student-level, advisory)

On track · At risk · Accelerating · Stalled · Intervention active.

**LI-PROG-002:** At-risk requires ≥ two independent signals — never a single low score alone.

**V1 Student Timeline:** indirect integration only — coaching themes and milestones via sanitized read APIs. Timeline Narrator deferred to V2 per **ADR-GOV-003**.

---

# 25. Professor Intelligence

Professor Intelligence transforms LI outputs into actionable pedagogical visibility for the Teacher Portal (`11`).

### Surfaces

Teacher Home Dashboard · Student Profile · Module Management · Business Mission Review · Learning Analytics · AI Professor Assistant (cohort summaries — professor-only).

### Intervention Signal Model

Urgency (immediate | this week | monitor) · reason categories · evidence bundle · suggested professor actions (suggestions only).

### Professor Feedback Loop

Professor actions feed back into LI: intervention recorded · pattern dismissed (audit reason required) · pattern marked addressed · guidance constraint override (logged).

**LI-PROF-004:** Professor validation of competency supersedes LI gap inference for certification purposes.

---

# 26. Cohort Intelligence

Cohort products: error heatmap · mission difficulty index · competency distribution · progression velocity · certification readiness snapshot (advisory) · EduQA cohort signal.

**ADR-GOV-001 — Cohort Minimum Aggregation Thresholds:**

- No `cohort_pattern` insight persisted or exposed unless active cohort enrollment ≥ **N=5** (professor views)
- Exports and heatmaps require **N=10**
- Below threshold: student-level insights only; cohort aggregates suppressed

Cross-cohort comparison is institutional/admin scope — not default professor view (LI-COH-002).

---

# 27. Adaptive Learning Loop

### Loop 1 — Mission Feedback (synchronous — not LI-owned)

Student Decision → Simulation → KPI → Coach Feedback → Reflection

### Loop 2 — Learning History (LI-owned)

Signals → LI Analysis → Insight/Pattern Persistence → CE Enrichment → Next Coach Interaction

### Loop 3 — EduQA (validation-owned, LI-informed)

Coach Response → EduQA Validate → Deliver → LI records quality signals → Continuous improvement

### What Adapts Automatically

Coach emphasis · professor visibility · EduQA review priorities · Context enrichment depth for known patterns.

### What Does Not Adapt Automatically

Assessment scores · competency levels · certification outcomes · simulation rules · Business Mission content.

---

# End of Part 04/12
---
# 28. Learning Analytics Model

Pedagogical performance indicators — distinct from business KPIs (Simulation Engine) and LI operational metrics.

### Core Calculated Indicators

Mission Performance Index · Reflection Depth Index · Recurring Error Rate · Competency Velocity · Guidance Effectiveness Proxy · Engagement Continuity Score · Intervention Response Index.

**LI-AN-001:** Analytics recalculate on triggering events; stale analytics carry freshness markers.

**LI-AN-002:** Analytics are read-only inputs — not write triggers for scores.

**LI-AN-003:** Historical analytics remain immutable snapshots for audit.

---

# 29. Educational KPIs

### Student-Facing (sanitized, motivational)

Mission Completion Rate · Reflection Completion Rate · Competency Growth Indicator (direction only) · Certification Progress.

**LI-EKPI-001:** No student rankings within cohort.

### Professor-Facing

Cohort Module Completion Rate · Average Mission Score Trend · Recurring Error Density · Competency Achievement Rate · At-Risk Student Count · Intervention Success Rate · Reflection Quality Index · Certification Readiness Rate.

### Institutional (EduQA / release)

Learning Objective Achievement Rate · Mission Difficulty Balance · AI Guidance Effectiveness · EduQA Pass Rate Correlation · Professor Insight Utilization Rate.

---

# 30. Learning Intelligence Metrics

Operational metrics (`27` §31 extended):

Recurring Error Detection Rate · False Positive Rate · Competency Gap Detection Accuracy · Insight Freshness · Async Processing Lag · Dispatch Consumption Rate · Context Enrichment Coverage · Professor Insight Utilization Rate · Pattern Resolution Rate · Hallucination Pattern Alert Rate · Cohort Aggregation Completeness.

Metrics support **institutional decisions** — not provider optimization alone.

---

# 31. Internal Domain Services

| Service | Responsibility |
|---------|----------------|
| Evidence Collector | Gathers mission, decision, KPI, reflection, dispatch signals |
| Pattern Analyzer | Correlates evidence; applies detection rules |
| Recurring Error Registry Service | Pattern lifecycle (register, merge, resolve, expire) |
| Competency Gap Analyzer | Infers gap signals from evidence vs. Competency Engine state |
| Progress Analyzer | Computes progress states and trajectory indicators |
| Insight Manager | Creates, merges, prioritizes, resolves Learning Insights |
| Professor Intelligence Composer | Builds intervention signals and evidence bundles |
| Cohort Aggregator | Scheduled cohort-level computation (V2) |
| Analytics Calculator | Maintains Learning Analytics indicators |
| Context Publisher | Persists enrichment state for Context Engine read |
| EduQA Evidence Exporter | Supplies aggregated signals for EduQA review |
| Timeline Narrator | Student-safe summaries (V2 — ADR-GOV-003 gated) |
| Professor Feedback Integrator | Processes professor actions into LI state |

All services operate asynchronously except read paths invoked by authorized consumers.

---

# 32. Internal Domain Events

| Event | Primary consumers |
|-------|-------------------|
| `learning.insight.created` | Professor Dashboard, audit |
| `learning.insight.updated` | Context Publisher |
| `learning.insight.resolved` | Context Engine (de-enrich) |
| `learning.recurring_error.registered` | Context Publisher, Professor |
| `learning.recurring_error.elevated` | Professor intervention queue |
| `learning.recurring_error.resolved` | Context Engine |
| `learning.competency_gap.detected` | Context Publisher, Professor |
| `learning.progress.state_changed` | Professor Dashboard |
| `learning.intervention.recommended` | Professor Dashboard |
| `learning.cohort.pattern_detected` | EduQA, Professor module view |
| `learning.analytics.recalculated` | Dashboard surfaces |
| `learning.context.enrichment_published` | Context Engine |
| `learning.eduqa.signal_recorded` | EduQA pipeline |
| `learning.analysis.failed` | Operations (logged only) |

Per **DAR-GOV-002:** domain events emit to operational metrics stream **and** append-only Audit Log with unified schema. Professor dismiss/resolve → Audit Log permanent class.

---

# 33. Business Rules Summary

### Architectural (LI-ARCH-001–008)

Async only · no score modification · no Coach responses · no Context Package assembly · no synchronous Orchestrator DB queries · auditable insights · institutional pattern taxonomy · active enrichment publish · resolved patterns excluded by default.

### Pedagogical (LI-PED-001–006)

Mission-bound insights · business language · concept hints not answers · progressive M1–M10 emphasis · reflection evidence weighted · multi-signal at-risk classification.

### Integration (LI-INT-001–005)

Orchestrator dispatch mandatory for Coach delivery analysis · CE reads LI outputs only · Competency Engine read-only · EduQA receives LI signals without bypass · dispatch failure logged only.

---

# End of Part 05/12
---
# 34. Institutional Architecture Decisions — Data Layer

The Architecture Review Board adopted the following ADRs as binding for Learning Intelligence and its integration partners.

### ADR-DK-001: Tiered Context Retrieval with Optional LI Enrichment

| Field | Value |
|-------|-------|
| **Status** | Accepted with Conditions |
| **Decision** | LI enrichment retrieval is **best-effort**; core learning context retrieval is **mandatory and blocking** |
| **Enrichment states** | `enriched` · `empty_valid` · `degraded_unavailable` |
| **Metadata fields** | `enrichmentStatus`, `enrichmentSnapshotAt`, `enrichmentVersion` on every validated Context Package |
| **On LI failure** | Continue context build; set `degraded_unavailable`; emit `context.enrichment.degraded` audit event |
| **Condition** | `docs/28` §60 requires user-approved amendment before BUILD-005 implementation gate |

Core mandatory retrieval groups: Identity, Mission, Decisions, Competency, KPI (latest).

Optional best-effort groups: Recurring Error Pattern, Learning Insight, Learning Analytics (derived).

### ADR-DK-002: Pull-at-Assembly LI Read Model

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | LI persists enrichment to PostgreSQL; Context Engine reads active state at assembly. No package push from LI. |

### ADR-DK-003: Competency History Required for Progression Trend

| Field | Value |
|-------|-------|
| **Status** | Accepted with Conditions |
| **Decision** | Introduce append-only Student Competency History owned by Competency Engine; LI and CE read only |
| **Condition** | Required before accurate `progressionTrend`; schema alignment in `docs/17` before Prisma migration |

---

# 35. Institutional Architecture Decisions — Governance

### ADR-GOV-001: Cohort Minimum Aggregation Thresholds

| Field | Value |
|-------|-------|
| **Status** | Accepted — Program Director Approved |
| **Decision** | N≥5 professor cohort analytics; N≥10 exports/heatmaps; below N suppress `cohort_pattern` exposure |

### ADR-GOV-002: Learning Intelligence Retention Schedule

| Field | Value |
|-------|-------|
| **Status** | Accepted — Program Director Approved |
| **Data class** | **Retention** |
| Audit Log (LI events) | Permanent |
| Active Recurring Error Patterns | Life of enrollment + 90 days post-course |
| Resolved/superseded insights | 7-year academic record policy window |
| Context snapshots (DB-AI-004) | Align with AI Conversation retention |
| Professor dismiss/intervention records | Permanent (audit class) |
| Operational LI metrics (Railway logs) | 90 days |

### ADR-GOV-003: Student Timeline Field Allowlist

| Field | Value |
|-------|-------|
| **Status** | Accepted — V2 Timeline Narrator gate |
| **Permitted (student-visible)** | Mission milestones · reflection completion · competency growth direction · coaching theme summaries · certification progress |
| **Prohibited** | `at_risk` · `occurrenceCount` · error type codes · `cohort_pattern` · `intervention_recommendation` · cross-student comparisons · professor notes |

Separate API DTOs for professor insights vs. student timeline — no shared types with client-side filtering.

### ADR-GOV-004: Professor Intervention Audit Requirements

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | Every professor action on LI state persists: `actorId`, `timestamp`, `action`, `targetInsightOrPatternId`, **mandatory reason text**, `cohortId`, `studentId` — append-only Audit Log class |
| **Condition** | Required before dismiss/resolve UI ships |

---

# 36. Institutional Architecture Decisions — LLM Layer

### ADR-LLM-001: Enrichment Metadata Non-Influence on Reasoning Path

| Field | Value |
|-------|-------|
| **Status** | Accepted — blocking for Orchestrator implementation |
| **Decision** | (1) `enrichmentStatus`, `enrichmentSnapshotAt`, `enrichmentVersion` are audit/telemetry only — excluded from provider prompts and strategy selection. (2) `priorityPattern.active` evaluates populated block fields only — empty blocks under `empty_valid` or `degraded_unavailable` do not activate competency_guidance via this rule. (3) No Orchestrator-layer LI field injection — all LI-derived prompt variables bind through CE-validated package blocks. |

Learning Intelligence has **no LLM layer responsibility**. ADR-LLM-001 governs Orchestrator and Context Engine consumption of LI enrichment — documented here for integration traceability.

---

# 37. Decision Analysis Records

### DAR-GOV-001: Degraded Enrichment Incident Classification — Resolved

Isolated LI subsidiary failure = operational (Medium). Sustained degradation = High operational. Data integrity or auth anomaly = Critical security. Coach not blocked.

### DAR-GOV-002: LI Domain Events to Audit Log Mapping — Resolved

Dual emission: operational metrics + append-only Audit Log with unified schema `{ service, event, orchestrationId?, studentId, moduleId, insightId?, actorId?, timestamp }`.

### DAR-LLM-001: Context Subset Trimming Under Token Pressure — Deferred

`docs/29` §38 policy sufficient for V1; trim priority order deferred to implementation profiling if needed.

---

# 38. Persistence Model

Learning Intelligence persists via PostgreSQL + Prisma.

### Primary Write Entities

- **Learning Insight** — typed observations (`17` §49 extended taxonomy — Document Alignment Dependency)
- **Recurring Error Pattern** — active/resolved patterns (`27` §40 — Document Alignment Dependency)

### Primary Read Entities

Mission Attempt · Decision · KPI Snapshot · Student Competency · Student Competency History (ADR-DK-003) · AI Conversation/Message · Reflection · Professor intervention records (ADR-GOV-004).

### Persistence Rules

DB-AI-001: AI never modifies assessment results.

DB-AI-002: AI recommendations remain advisory.

DB-AI-003: AI conversations remain associated with learning history.

DB-AI-005: Recurring error patterns accumulate across missions.

DB-AI-006: All AI entities support audit queries by student, module, and cohort.

---

# 39. Context Engine Enrichment Contract

Context Engine reads LI state during Phase 2 Retrieval (`28` §28–29).

| LI publishes (write) | CE consumes (read) | Package block |
|---------------------|-------------------|---------------|
| Active recurring error patterns | `LearningPatternRepository` | `recurringErrorContext` |
| Identified competency gaps | `CompetencyContextRepository` | `competencyContext.identifiedGaps` |
| Progression trend | LI computation | `competencyContext.progressionTrend` |

CE never writes insight records. LI never reads or writes Context Packages.

Freshness: `enrichmentSnapshotAt` on Context Package metadata; temporal lag between LI write and CE read is normal and metadata-visible.

---

# 40. Reasoning Orchestrator Integration

Per `29` §51:

- Phase 8 `FeedbackDispatcher` sends async dispatch to LI after successful delivery;
- dispatch payload fields specified in §20;
- idempotency on `orchestrationId`;
- LI analysis failure does not affect delivered response;
- Orchestrator production may activate with LI enrichment stub (`empty_valid` blocks) if EduQA three-state tests pass and Phase 8 interface is stable;
- full Loop 2 not required for Orchestrator production gate.

Hallucination pattern alerts from LI route to **EduQA constraint review queue** — not automatic prompt mutation.

---

# 41. Data Layer Rules

DATA-LI-001

LI writes insight entities; CE reads enrichment — single read path (ADR-DK-002).

DATA-LI-002

Prisma migrations affecting LI entities require Approval Gate review.

DATA-LI-003

Shared indexes on `(studentId, moduleId, status)` for pattern lookup — required before production.

DATA-LI-004

Professor Intervention entity required before dismiss/resolve features (ADR-GOV-004).

DATA-LI-005

Schema authority gaps in `docs/17` must be resolved before Prisma implementation (BI-02, BI-03).

---

# End of Part 06/12
---
# 42. Express Service Layer

File structure:

```text
src/
  services/
    ai/
      learning-intelligence/
        learning-intelligence.service.ts
        evidence-collector.service.ts
        pattern-analyzer.service.ts
        recurring-error-registry.service.ts
        competency-gap-analyzer.service.ts
        progress-analyzer.service.ts
        insight-manager.service.ts
        professor-intelligence.service.ts
        cohort-aggregator.service.ts
        analytics-calculator.service.ts
        context-publisher.service.ts
        eduqa-evidence-exporter.service.ts
        professor-feedback-integrator.service.ts
        feedback-dispatcher.consumer.ts
        repositories/
          insight.repository.ts
          recurring-error.repository.ts
          evidence.repository.ts
        types/
          learning-insight.ts
          recurring-error-pattern.ts
          orchestrator-dispatch-payload.ts
          intervention-signal.ts
  routes/
    insights/
      professor-insights.routes.ts
      cohort-analytics.routes.ts
```

Routes remain thin. LI is not mounted as a guidance handler — Coach routes delegate to AiCoachService only.

---

# 43. TypeScript Interface Direction

Shared types in `src/services/ai/learning-intelligence/types/`:

```typescript
interface OrchestratorDispatchPayload {
  orchestrationId: string;
  strategyUsed: ReasoningStrategy;
  requestType: string;
  validationAttemptCount: number;
  competencySnapshot: CompetencySnapshotRef;
  recurringErrorRef?: string;
  kpiImpactFlag: boolean;
  deliverySuccess: boolean;
  fallbackUsed: boolean;
}

interface LearningInsightRecord {
  id: string;
  studentId: string;
  moduleId: string;
  missionId?: string;
  insightType: InsightType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'superseded' | 'resolved' | 'expired';
  description: string;
  evidenceRefs: EvidenceRef[];
}

interface RecurringErrorPatternRecord {
  id: string;
  studentId: string;
  moduleId: string;
  errorType: string;
  occurrenceCount: number;
  status: 'active' | 'monitoring' | 'resolved';
  targetedReviewAreas: string[];
}

interface ProfessorInsightDto { /* full evidence — professor RBAC scoped */ }
interface StudentTimelineDto { /* ADR-GOV-003 allowlist only */ }
```

Strict TypeScript mode mandatory. No `any` in LI contracts.

---

# 44. React Integration Points

**Professor Portal:** consumes professor insight APIs — intervention queue, student profile insights, cohort analytics. Never receives Context Packages or raw LI internal records.

**Student Portal:** V1 indirect — mission milestones and coaching themes via sanitized timeline APIs only. No diagnostic labels. No `intervention_recommendation` or `cohort_pattern` types in student APIs.

**AI Coach UI:** unchanged — LI enrichment arrives server-side via Context Engine on subsequent requests. No client LI coupling.

Professor Dashboard read failures degrade to empty insight state — not 500 cascade.

---

# 45. Platform Integration

V1: `LearningIntelligenceService` embedded in Express monolith on Railway.

Async processing: in-process typed event bus (`AiEventBus`) fed by Orchestrator Phase 8; isolated LI processing queue with separate retry policy.

V2+: extract LI worker consuming persistent queue — contracts remain stable.

Event bus V1 is not durable across Railway restarts — mitigated by idempotency keys, dead-letter log table, reconciliation job (V1.1).

Professor feedback routes under professor RBAC — separate from Coach guidance routes.

---

# 46. API Implications

Learning Intelligence requires business-oriented endpoint groups (Document Alignment Dependency — `docs/18`):

- Professor: `/api/v1/insights/student`, `/api/v1/insights/intervention-queue`, `/api/v1/cohorts/{id}/learning-analytics`
- Professor actions: dismiss, resolve, mark addressed (ADR-GOV-004 audit)
- Optional V2: student timeline narrative (ADR-GOV-003 DTO)

All insight endpoints enforce API-AI-001/002 at route layer. RBAC matrix required before Express route implementation (BI-05).

---

# 47. EduQA Integration

EduQA receives from LI:

- aggregated effectiveness signals;
- cohort pattern alerts;
- mission difficulty flags;
- hallucination pattern alert rate.

EduQA per-response validation remains Orchestrator domain — LI does not bypass EduQA (LI-INT-004).

Longitudinal LI signals inform EduQA review cycles — they do not replace per-response validation.

Mandatory regression: three enrichment states (`enriched`, `empty_valid`, `degraded_unavailable`) before Orchestrator production activation (BP-01).

---

# 48. ESLint Boundary Enforcement

Definition of Complete for LI vertical slice includes:

- `no-restricted-imports`: LI module must not import provider layer or Orchestrator internals;
- Orchestrator must not import Prisma (ORCH-001);
- React must not import `services/ai/learning-intelligence/*` internal modules directly.

---

# End of Part 07/12
---
# 49. Security and Privacy Controls

- student-level insight detail restricted to professor and authorized roles (LI-GOV-001);
- cohort exports respect ADR-GOV-001 minimum-N thresholds;
- post-course 90-day read continuity (`01` LB-18, LI-GOV-005);
- cross-student queries prohibited at repository level (DB-CTX-005);
- professor evidence bundles scoped to assigned cohorts;
- LI event payloads exclude email, auth tokens, credentials;
- `intervention_recommendation` insight type blocked from student APIs;
- export endpoints apply minimum-N to all LI aggregates.

Security Gate criteria align with `26_SECURITY_ARCHITECTURE.md` and Agent E Governance Review.

---

# 50. RBAC Matrix (Learning Intelligence Endpoints)

| Role | Insight read | Cohort analytics | Dismiss/resolve | Cross-cohort |
|------|-------------|------------------|-----------------|--------------|
| Student | Own sanitized timeline only (V1 indirect) | Prohibited | Prohibited | Prohibited |
| Professor | Assigned cohort students | Assigned cohort (N≥5) | Assigned cohort | Prohibited |
| Administrator | Institutional audit scope | Admin scope | Audit scope | Permitted (logged) |

Professor access scoped to assigned cohorts — enforced at repository and route layer.

---

# 51. Retention and Audit

Per ADR-GOV-002 (Program Director Approved).

Audit Log entries for LI domain events and professor interventions are **permanent**.

Operational Railway logs: 90 days.

Insight and pattern retention supports EduQA longitudinal review — resolved insights retained per 7-year academic policy window; not deleted on resolve.

---

# 52. Observability and Audit Logs

LI audit events (supplement Orchestrator `orchestration.*` chain):

| Event | Key data |
|-------|----------|
| `learning.analysis.started` | trigger type, studentId, moduleId |
| `learning.analysis.completed` | insightCount, patternCount, durationMs |
| `learning.analysis.failed` | errorCode, phase |
| `learning.enrichment.published` | studentId, moduleId, activePatternCount |
| `learning.dispatch.received` | orchestrationId |
| `learning.dispatch.duplicate` | orchestrationId (idempotency) |

Unified log schema (BP-07): `{ service: 'learning_intelligence', event, orchestrationId?, studentId, moduleId, insightId?, enrichmentStatus?, durationMs, timestamp }`.

Operational metrics: async processing lag · dispatch consumption rate · false positive rate · pattern resolution rate · enrichment coverage.

---

# 53. Failure Modes

| Failure | Behaviour | User impact |
|---------|-----------|-------------|
| LI analysis failure | Logged only | None — Coach response already delivered |
| Dispatch duplicate | Idempotent skip | None |
| Context Publisher write failure | Logged; alert operations | Next CE read may lack fresh enrichment |
| Cohort aggregation below N | Suppress cohort insight | Professor sees student-level only |
| Professor insight API failure | Empty insight state | Dashboard degrades gracefully |
| In-process event loss (Railway restart) | Reconciliation job V1.1 | Delayed enrichment — metadata-visible |

LI failures never block synchronous Coach delivery.

---

# 54. Failure Mode Rules

FAIL-LI-001

Async analysis failure shall never affect delivered Coach responses.

FAIL-LI-002

Dispatch processing shall be idempotent on `orchestrationId`.

FAIL-LI-003

Never expose internal error details to students or professors in API responses.

FAIL-LI-004

Never persist `cohort_pattern` when cohort size below ADR-GOV-001 threshold.

FAIL-LI-005

Never ship professor dismiss/resolve without ADR-GOV-004 audit persistence.

FAIL-LI-006

Sustained LI degradation emits operational alert — not security incident unless data integrity anomaly (DAR-GOV-001).

---

# End of Part 08/12
---
# 55. Test Strategy

Learning Intelligence testing follows `23_TESTING_STRATEGY.md`.

**Unit Tests**

- detection rules (LI-ERR-001–006);
- insight merge and lifecycle;
- gap inference boundary (no competency writes);
- idempotency on dispatch payload;
- cohort minimum-N suppression.

**Integration Tests**

- Orchestrator Phase 8 dispatch → LI persistence;
- LI publish → Context Engine read at assembly;
- three enrichment states in Context Package (`enriched`, `empty_valid`, `degraded_unavailable`);
- professor dismiss with audit record;
- RBAC per role on insight endpoints.

**Contract Tests**

- `OrchestratorDispatchPayload` compatibility with `29` §51;
- CE enrichment block consumption compatibility with `28` §25–26;
- `ProfessorInsightDto` vs `StudentTimelineDto` separation (ADR-GOV-003).

Provider API calls never required for LI tests.

---

# 56. Test Scenarios

| Scenario | Expected result |
|----------|-----------------|
| Valid dispatch after Coach delivery | Insight/pattern analysis persisted |
| Duplicate `orchestrationId` | Idempotent skip — no inflated counts |
| Active recurring error | Appears in next CE `recurringErrorContext` |
| Cohort size below N=5 | No `cohort_pattern` persisted or exposed |
| Professor dismiss with reason | Audit record + pattern suppressed |
| LI analysis failure | Logged; Coach response unaffected |
| Student API request | ADR-GOV-003 allowlist enforced |
| Empty enrichment (`empty_valid`) | CE package valid; Orchestrator strategy per ADR-LLM-001 |
| Degraded enrichment | `degraded_unavailable` metadata; Coach continues |

---

# 57. Railway Deployment Considerations

V1: LI deploys embedded in Express application on Railway — no separate service.

Requirements:

- PostgreSQL connection via Railway Variables;
- async processing compatible with Railway HTTP timeout (Coach path unaffected);
- health check includes LI database connectivity;
- structured JSON logging to Railway deployment logs;
- in-process queue with dead-letter log table;
- monitoring: async lag, dispatch consumption, false positive rate.

V2: optional dedicated worker service — same PostgreSQL queue table.

Production activation requires Approval Gate evidence including Railway smoke test on enrichment path (BP-06).

---

# 58. Phased Delivery Roadmap

### V1 — Foundation (MVP)

Recurring Error Registry · basic competency gap signals · Orchestrator dispatch consumption · Context Engine enrichment publication · Professor Dashboard insight summary · core LI metrics · EduQA evidence export (basic).

### V2 — Cohort & Analytics Maturity

Cohort aggregation (ADR-GOV-001) · mission difficulty index · Reflection Depth Index · professor feedback loop · Timeline Narrator (ADR-GOV-003) · reconciliation job.

### V3–V5

Cross-module error correlation · capstone integration · predictive at-risk modeling (advisory, professor-confirmed) · institutional benchmarking (admin scope).

**Invariant across all phases:** LI never replaces student reasoning, never alters academic judgement, never bypasses professor authority.

---

# 59. Document Alignment Dependencies

The following official document updates are required **before implementation merge** — flagged per Architecture Review Board; not silently assumed.

| Document | Dependency | Blocking item |
|----------|------------|---------------|
| `docs/17` | Recurring Error Pattern entity; expanded Learning Insight taxonomy; Student Competency History; Professor Intervention entity | BI-02, BI-03, BI-08 |
| `docs/18` | Learning Intelligence insight endpoint group | BI-09 |
| `docs/28` §60 | Tiered retrieval failure policy (ADR-DK-001) | BI-01 |

Document 30 authoring is authorized. Implementation and production gates remain blocked until dependencies close under BUILD-005.

---

# 60. Implementation Blocking Register

### Before Implementation Merge

BI-01 through BI-10 per Architecture Consensus Report §7 — schema alignment, ADR-LLM-001 enforcement, RBAC matrix, retention confirmation, intervention audit entity, enrichment metadata contract, `docs/18` extension.

### Before Production Activation

BP-01 through BP-10 — EduQA three-state regression, ADR-LLM-001 evidence, M9–M10 answer-leak matrix, dispatch idempotency tests, RBAC integration tests, Railway smoke test, observability schema, Security Gate sign-off, BUILD-005 Approval Gate, cohort_pattern threshold enforcement.

---

# End of Part 09/12
---
# 61. Learning Intelligence Validation Checklist

Before Approval Gate, verify:

✓ LearningIntelligenceService implements async five-phase lifecycle

✓ No provider SDK imports in learning-intelligence module

✓ No competency score write paths

✓ Orchestrator dispatch consumer idempotent on `orchestrationId`

✓ Context Publisher persists enrichment; CE reads at assembly (ADR-DK-002)

✓ Three enrichment states supported in CE integration tests

✓ ADR-GOV-001 cohort thresholds enforced in code

✓ ADR-GOV-004 audit persistence before dismiss/resolve UI

✓ Professor and student DTOs separated (ADR-GOV-003)

✓ RBAC matrix enforced at repository and route layer

✓ Domain events emit to Audit Log per DAR-GOV-002

✓ Failure modes return logged-only — never block Coach

✓ Railway deployment smoke test passed

✓ Document Alignment Dependencies tracked

---

# 62. Learning Intelligence Success Criteria

Learning Intelligence is successful when:

- Loop 2 is fully operational with named inputs, outputs, timing, and failure modes;
- active recurring error patterns appear in subsequent Context Packages within defined freshness bounds;
- identified competency gaps appear in `competencyContext.identifiedGaps`;
- no LI code path invokes LLM providers or delivers student-facing responses;
- no LI write path modifies competency scores, mission scores, or certification records;
- Orchestrator synchronous path remains DB-free;
- professors can answer who needs support, which missions are difficult, what errors are common;
- insights remain advisory; professor authority over assessment is preserved;
- EduQA consumes longitudinal signals without replacing per-response validation;
- async processing failure never affects delivered Coach responses.

---

# 63. Continuous Learning Intelligence Improvement

Improvement activities:

- refine detection rules based on EduQA findings and professor dismiss patterns;
- expand cohort analytics accuracy;
- optimize async processing latency;
- strengthen idempotency and reconciliation;
- improve Guidance Effectiveness Proxy correlation;
- evaluate Timeline Narrator V2 under ADR-GOV-003;
- institutional error taxonomy refinement from cohort data.

Learning Intelligence maturity increases with every platform release.

---

# 64. Learning Intelligence Evolution Rules

EVOL-LI-001

New insight types require Approval Gate evidence and EduQA language review.

EVOL-LI-002

Detection rule changes require regression test updates.

EVOL-LI-003

Cohort threshold changes require Program Director approval.

EVOL-LI-004

Schema changes require `docs/17` alignment before Prisma migration.

EVOL-LI-005

LI extraction to worker service must preserve Orchestrator and CE contracts.

EVOL-LI-006

Every evolution shall preserve Analyze-After-Deliver and LI-003 boundaries.

---

# 65. Risk Register (Consolidated)

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| R-CR-01 | Schema authority drift (`docs/17`) | Critical | BI-02/03; doc amendments |
| R-CR-02 | Strategy uses enrichment metadata | Critical | ADR-LLM-001; BP-02 |
| R-HI-01 | Small-class re-identification | High | ADR-GOV-001 |
| R-HI-02 | Prompt templates assume non-empty LI blocks | High | BP-01 |
| R-HI-03 | Professor dismiss without audit | High | ADR-GOV-004 |
| R-HI-04 | Student Timeline diagnostic leakage | High | ADR-GOV-003 |
| R-HI-05 | M9–M10 answer-leak with enrichment | High | BP-03 |
| R-ME-01 | In-process event loss | Medium | Idempotency; reconciliation V1.1 |
| R-ME-02 | Dual audit trail divergence | Medium | DAR-GOV-002 |

Brief V1 risks R-LI-01–R-LI-12: accepted and tracked.

---

# 66. Overall Enterprise Readiness

| Dimension | Readiness | Notes |
|-----------|-----------|-------|
| Architecture | 88% | ARB approved in principle |
| Platform | 82% | B-01 resolved via ADR-DK-001 |
| Knowledge | 75% | Schema alignment pending |
| Learning / Domain | 85% | Domain architecture accepted |
| Governance | 72% | Policies codified in this document |
| LLM compatibility | 78% | ADR-LLM-001; B-LLM-01 pending |
| **Overall** | **80%** | Authorized for Doc 30; not authorized for production |

Production activation requires BUILD-005 Approval Gate pass including Security Gate (Agent E criteria).

---

# End of Part 10/12
---
# 67. Final Learning Intelligence Governance

Final Learning Intelligence Governance confirms that the fourth component of Enterprise Educational Intelligence is specified, validated by the Architecture Review Board, and approved for institutional standard status upon Agent G Approval Gate pass.

Learning Intelligence closes Loop 2 without compromising Context-Before-Reasoning or Orchestrate-Before-Deliver governance.

The provider is not and cannot become the source of truth. Learning Intelligence operates entirely within institutional boundaries.

---

# 68. Learning Intelligence Closure

Every Learning Intelligence release shall conclude with formal closure.

Learning Intelligence Closure includes:

✓ Async Lifecycle Validated

✓ Recurring Error Registry Operational

✓ Context Publisher Verified (ADR-DK-002)

✓ Orchestrator Dispatch Consumer Verified

✓ Enrichment Three-State Tests Passed

✓ RBAC Matrix Enforced

✓ Retention Schedule Implemented (ADR-GOV-002)

✓ Cohort Thresholds Enforced (ADR-GOV-001)

✓ Professor Intervention Audit Operational (ADR-GOV-004)

✓ EduQA Longitudinal Integration Verified

✓ Railway Deployment Confirmed

✓ Document Alignment Dependencies Resolved

✓ Approval Gate Completed

Formal closure ensures institutional traceability.

---

# 69. Final Learning Intelligence Principles

LI-FINAL-001

Analyze-After-Deliver is an institutional capability — coaching first, adaptation second.

LI-FINAL-002

Learning Intelligence owns pattern interpretation; Competency Engine owns scoring.

LI-FINAL-003

Enrichment reaches reasoning only through Context Engine pull-at-assembly (ADR-DK-002).

LI-FINAL-004

Tiered retrieval preserves Coach availability when LI enrichment is unavailable (ADR-DK-001).

LI-FINAL-005

Cohort privacy and professor authority are non-negotiable (ADR-GOV-001, LI-PROF-004).

LI-FINAL-006

Every Learning Intelligence capability requires Approval Gate evidence before production release.

---

# End of Part 11/12
---
# 70. VS Code / Cursor Commands

Official engineering commands for Learning Intelligence work.

## Document Review

```powershell
code docs/30_LEARNING_INTELLIGENCE.md
code docs/27_AI_ARCHITECTURE.md
code docs/28_AI_CONTEXT_ENGINE.md
code docs/29_AI_REASONING_ORCHESTRATOR.md
code docs/17_DATABASE_SCHEMA.md
code docs/18_API_SPECIFICATION.md
code architecture-board/30/ArchitectureConsensusReport_V1.md
```

## Cursor Context Activation

When implementing Learning Intelligence features in Cursor, ensure these rules are active:

- `.cursor/rules/tec_erp_ai_architecture.mdc`
- `.cursor/rules/tec_erp_engineering.mdc`
- `.cursor/rules/tec_erp_architecture.mdc`

Reference project context:

```powershell
code .cursor/context/TEC_ERP_PROJECT_CONTEXT.md
```

## Pre-Implementation Checklist (Cursor)

Before writing Learning Intelligence code, Cursor shall confirm:

1. OrchestratorDispatchPayload interface defined and idempotent
2. No provider SDK imports in learning-intelligence module
3. Context Publisher write / CE read separation (ADR-DK-002)
4. ADR-GOV-001 cohort thresholds enforced
5. ADR-GOV-004 audit before dismiss/resolve UI
6. Professor vs student DTO separation (ADR-GOV-003)
7. Document Alignment Dependencies status understood
8. Approval Gate criteria understood

## Validation Commands

```powershell
npm run build
npm run test -- --grep "learning-intelligence"
npm run lint
npx prisma validate
npx prisma migrate diff
```

All commands must pass before Approval Gate.

---

# 71. Git Closure Package

Official git workflow for Learning Intelligence documentation and implementation closure.

## Status Review

```powershell
git status
git diff
```

## Stage Learning Intelligence Work

```powershell
git add docs/30_LEARNING_INTELLIGENCE.md
git add src/services/ai/learning-intelligence/
git add prisma/schema.prisma
```

Stage only files related to the approved Learning Intelligence scope.

Never stage `.env`, credentials or provider API keys.

## Pre-Commit Verification

```powershell
npm run build
npm run test
git diff --cached
```

## Commit

```powershell
git commit -m "docs: add learning intelligence architecture"
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

Learning Intelligence PRs shall include:

- objective and implementation summary;
- impacted internal services and repositories;
- ADR compliance evidence (DK-001/002/003, GOV-001–004);
- Orchestrator dispatch idempotency test results;
- three-state enrichment integration test results;
- RBAC per-role test evidence;
- Railway deployment readiness;
- Approval Gate status;
- Document Alignment Dependencies status.

---

# 72. Approval Gate

Learning Intelligence Approval Gate is mandatory before production activation (`19` §9, `24` §21, `27` §71).

## Gate Checklist

| Domain | Criterion | Status |
|--------|-----------|--------|
| Business Rules | LI aligns with `15`, `09`, ARB Domain Architecture | ☐ |
| UI | Professor insight widgets; student timeline ADR-GOV-003 | ☐ |
| Backend | LearningIntelligenceService async lifecycle | ☐ |
| Simulation | KPI/decision signals consumed read-only | ☐ |
| Database | Prisma entities aligned with `17` (post-amendment) | ☐ |
| API | Insight endpoints per `18` extension | ☐ |
| Context Integration | ADR-DK-001/002 enrichment contract verified | ☐ |
| Orchestrator Integration | Phase 8 dispatch idempotent; ADR-LLM-001 | ☐ |
| Testing | Unit, integration, contract, RBAC tests passed | ☐ |
| Documentation | This document; ADRs embedded; alignment deps tracked | ☐ |
| EduQA | Longitudinal signals; three-state regression (BP-01) | ☐ |
| Security Gate | ADR-GOV-001–004; RBAC; retention; audit (Agent E) | ☐ |
| Railway | Deployment and smoke test passed | ☐ |
| Production Readiness | BP-01–BP-10 evidence archived | ☐ |

## Gate Decision

| Decision | Authority |
|----------|-----------|
| Engineering Gate | Solution Architect + QA Engineer |
| Educational Gate | Educational Specialist + Instructor |
| Security Gate | Platform Administrator + Agent E criteria |
| Data Gate | Data & Knowledge Architect (Agent C criteria) |
| Institutional Gate | Institutional Leadership |

All gates must pass. Failed gates keep the phase open until deficiencies are corrected.

---

# 73. Document Status

**Document:** Learning Intelligence

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard — Complete

**Parts:** 12/12

**Architecture Review Board:** Completed — Program Director Approved

**Approval Gate:** Pending Agent G Institutional Review

**Last Updated:** 2026

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

This document establishes the official Learning Intelligence architecture for TEC.ERP Version 1 — the fourth component of Enterprise Educational Intelligence.

Analyze-After-Deliver.

The intelligence belongs to TEC.ERP.

---

# End of Part 12/12

# End of Document

**Document Status:** Learning Intelligence Complete
