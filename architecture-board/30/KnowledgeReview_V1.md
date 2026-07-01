# Data & Knowledge Review V1

**Issued by:** Agent C — Data & Knowledge Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 3B  
**Status:** Data & Knowledge Review (pre-document)  
**Inputs reviewed:** Architecture Brief V1 (Agent A), Learning Intelligence Domain Architecture V1 (Agent D), Platform Integration Review V1 (Agent B), approved Documents 01–29  
**Scope:** Institutional data, persistence, retrieval, historical evolution, Context Engine enrichment — no pedagogy, platform integration, API, or implementation redesign  

**Overall verdict:** The Learning Intelligence knowledge architecture is **sound in principle** and aligns with the Context-Before-Reasoning model. It is **conditionally ready** for Document 30 authoring, subject to resolution of **three blocking data issues** (including B-01), **twelve concerns**, and targeted schema alignment with `docs/17`.

---

## Review Summary

| Classification | Count |
|----------------|-------|
| Approved | 8 areas |
| Concern | 12 items |
| Blocking Issue | 3 items (includes B-01 resolution) |

---

## 1. Knowledge Ownership Model

**Classification: Approved**

**Findings**

Institutional knowledge ownership is correctly partitioned across authoritative domains:

| Domain | Owner | Persistence role |
|--------|-------|-------------------|
| Business learning evidence | Business Missions / Simulation | Mission Attempt, Decision, Reflection, KPI Result |
| Authoritative competency state | Competency Engine | Student Competency (read-only to LI) |
| Adaptive insight & patterns | Learning Intelligence | Learning Insight, Recurring Error Pattern |
| Context assembly | Context Engine | Read-only consumer; snapshot writer |
| Reasoning delivery | Orchestrator / Coach | No direct DB access (ORCH-001) |
| Audit & compliance | Platform governance | Audit Log (append-only) |

Agent A Brief V1 §3.2–3.3 and Agent D §14–16 preserve this separation. LI owns **pattern interpretation and insight persistence**; it does not own scores, KPIs, or context packages.

**Concerns**

- **C-DK-01:** Agent D’s expanded insight taxonomy (nine types vs. three in `docs/17` §49 and `docs/27` §39) requires a formal ownership declaration: LI owns the taxonomy; Competency Engine and EduQA remain authoritative for scores and validation.

---

## 2. Institutional Source of Truth

**Classification: Approved with Concern**

**Findings**

PostgreSQL via Prisma is the sole institutional source of truth (`docs/28` CTX-001/002, Brief V1 §5.2). The hierarchy in `docs/19` §4 is respected: functional and learning specs precede schema; AI layer entities in `docs/27` §35–40 extend but do not override `docs/17`.

Core learning truth remains in immutable business learning records (DB-LEARN-005, `docs/17` §68). LI-derived insights are **interpretive overlays**, not replacements for authoritative competency or assessment data.

**Concerns**

- **C-DK-02:** `Recurring Error Pattern` is defined in `docs/27` §40 as an implementation entity but is **absent from `docs/17` §45–49**. Until aligned, Prisma cannot be the single schema authority — this is a spec drift risk, not an architectural rejection.

---

## 3. Learning History Persistence

**Classification: Approved**

**Findings**

Learning history persistence follows established institutional rules:

- Mission Attempt → Decision chain is the primary evidence spine (`docs/17` §35–35, DB-LEARN-001/002).
- Reflections persist permanently with AI and professor feedback (`docs/17` §19).
- AI Conversation / Message / Recommendation form the interaction history layer (`docs/17` §46–48).
- Business learning records never support deletion (`docs/17` §67, §68).

Agent D’s Evidence Collector correctly treats this chain as read-only analytical input. LI analysis is append/update on insight entities only — never mutation of attempt or decision records.

**Concerns**

- **C-DK-03:** `docs/27` §36 mandates `contextSnapshot` on AI Conversation (DB-AI-004); `docs/17` §46 omits it. Conversation-start snapshots are essential for audit reconstruction and LI correlation — schema alignment required.

---

## 4. Recurring Error Persistence

**Classification: Concern**

**Findings**

The Recurring Error Registry model (Agent D §3, Brief V1 §3.1, `docs/27` §23, §40) is architecturally coherent:

- Pattern lifecycle: `active` → `resolved` with occurrence metadata.
- Only active patterns enrich Context Engine (`docs/28` §26, LI-ARCH-008).
- Patterns accumulate across missions (DB-AI-005).
- Merge-on-same-root-cause (LI-INS-001) prevents registry noise.

**Concerns**

- **C-DK-04:** No formal **evidence junction model** is defined for linking patterns to Decision IDs, Attempt IDs, and KPI snapshot references. Agent D §2.3 requires evidence references; `docs/17` and `docs/27` §40 do not specify storage shape (normalized junction vs. structured JSON with integrity constraints).
- **C-DK-05:** Concurrent async triggers (Orchestrator dispatch, mission completion, professor resolve — Agent B C-02/C-08) require **idempotent merge semantics** and sequence ordering on pattern updates. Domain architecture assumes this; persistence model does not yet define it.

**Blocking Issue**

- **B-DK-02:** `Recurring Error Pattern` entity must be formally admitted to the institutional schema (`docs/17` alignment) before Document 30 or Prisma migration work. Operating on `docs/27` §40 alone violates source-of-truth hierarchy.

---

## 5. Competency History Model

**Classification: Blocking Issue**

**Findings**

Competency **current state** is owned by Competency Engine via Student Competency (`docs/17` §38). LI reads this authoritatively and must never write competency scores (AI-ARCH-003, LI-INT-003).

Context Engine requires `progressionTrend` (`docs/28` §25, §39) computed from **historical levels**. Agent D assigns trend interpretation to LI with CE as consumer.

**Blocking Issue**

- **B-DK-03:** **`docs/17` defines only current Student Competency state — no competency history / level-event entity.** Without append-only competency level events (or an approved derivation rule from immutable assessment evidence), `progressionTrend` cannot be historically consistent or auditable. Agent D and `docs/28` assume history that the schema does not yet model.

**Concerns**

- **C-DK-06:** LI “competency gap inference” must remain strictly distinguished from Competency Engine validation. Gap records are LI-owned; levels are CE-owned. Field naming and foreign-key boundaries must enforce this in schema design.

---

## 6. KPI Historical Strategy

**Classification: Approved**

**Findings**

KPI persistence strategy is institutionally clear and LI-compatible:

- KPI Results are simulation-generated, never manually edited (DB-KPI-001).
- Historical KPI values are immutable (DB-KPI-002, `docs/17` §43).
- Context Engine reads latest snapshot per attempt; AI never recalculates (`docs/28` §24, `docs/27` §21).
- Stale snapshot handling is defined (`docs/28` §59 — `staleKpiWarning` flag).

LI uses KPI history for misinterpretation pattern detection only — no write path to KPI Result. Agent D §9.5 correctly separates simulation KPIs from educational analytics.

**Concerns**

- **C-DK-07:** Agent D’s **Guidance Effectiveness Proxy** (error recurrence reduction post-Coach) requires correlating KPI snapshots, Coach sessions, and pattern registration timestamps. No persisted **correlation window metadata** is defined — analytics queries may become expensive without indexed temporal joins.

---

## 7. Learning Intelligence Persistence Boundaries

**Classification: Approved**

**Findings**

LI persistence boundaries are correctly drawn across all three input documents:

**LI MAY write:** Recurring Error Pattern, Learning Insight, Learning Analytics recalculations (derived), domain-event audit records.

**LI MAY read (analytical):** Mission Attempt, Decision, KPI Snapshot, Student Competency, AI Conversation/Message/Recommendation, Context snapshots, Reflection, professor feedback sources.

**LI MUST NOT write:** Scores, certifications, competency levels, KPI Results, Business Mission content, Context Packages.

**Context Engine MAY read:** All enrichment sources; **write** context snapshots only.

**Orchestrator:** No Prisma access (ORCH-001).

Agent B C-03 is resolved at the data layer: **pull-at-assembly is the authoritative V1 read model.** Context Publisher (Agent D §12) means “persist enrichment state to PostgreSQL”; Context Engine reads at Phase 2 Retrieval. LI does not push into packages.

---

## 8. Context Engine Enrichment Strategy

**Classification: Approved with Concern**

**Findings**

Enrichment strategy follows Context-Before-Reasoning (`docs/28` §3):

```text
Phase 2 Retrieval (parallel)
  ├── Core groups: Identity, Mission, Decisions, Competency, KPI
  └── Subsidiary group: Patterns (Recurring Error, Learning Insight)
Phase 3 Enrichment (institutional rules)
Phase 4–6 Filter → Assemble → Validate
```

LI supplies `identifiedGaps`, `RecurringErrorBlock`, and (via LI computation) `progressionTrend` — consumed read-only by CE.

**Concerns**

- **C-DK-08:** `Learning Analytics` entity (`docs/17` §39) overlaps Agent D §9 analytics layers. CE retrieval map (`docs/28` §28) includes Learning Analytics in Performance group — ownership of **current vs. historical analytics snapshots** must be clarified to avoid dual-write between generic Learning Analytics and LI Analytics Calculator.
- **C-DK-09:** Enrichment freshness contract (Agent B C-12): Context Package metadata must carry `enrichmentSnapshotAt`, `enrichmentReadStatus`, and optional `enrichmentVersion` so mid-session pattern resolution does not produce ambiguous packages.

---

## 9. Knowledge Versioning

**Classification: Concern**

**Findings**

Versioning exists at multiple layers:

- Context Package: `packageVersion`, `contextHash` (`docs/28`).
- AI Message: `promptTemplateVersion` (`docs/27` §37 — not yet in `docs/17` §47).
- Insight provenance: “analyst version” (Agent D §2.3).
- Immutable history: new versions appended, not overwritten (`docs/17` §68).

**Concerns**

- **C-DK-10:** No unified **institutional versioning policy** links insight analyst version, context package version, and enrichment snapshot version for audit reconstruction. Professor review of “what did the Coach know at session start?” requires traceable version chain across Conversation.contextSnapshot → packageVersion → enrichmentSnapshotAt.
- **C-DK-11:** Agent D insight lifecycle (`active | superseded | resolved | expired`) exceeds `docs/17` §49 fields. Status transitions need versioned audit entries, not silent overwrites.

---

## 10. Snapshot Strategy

**Classification: Approved with Concern**

**Findings**

Three snapshot layers are architecturally defined:

| Snapshot type | Purpose | Authority |
|---------------|---------|-----------|
| KPI Snapshot | Simulation state at decision time | Simulation Engine |
| Context snapshot (package) | Audit of filtered context at Coach session start | Context Engine (DATA-CTX-002) |
| Dashboard Snapshot | UI historical comparison | Dashboard layer |
| Learning Analytics snapshots | Pedagogical indicators over time | LI (LI-AN-003) |

DB-AI-004 requires conversation-start context persistence. `docs/28` §33 defines filtered post-filter payload storage — correct for compliance and professor audit.

**Concerns**

- **C-DK-12:** Snapshot **retention and storage growth policy** is undefined for high-volume Coach sessions. Agent E must set retention; Agent C confirms snapshot schema supports archival without breaking audit queries.

---

## 11. Knowledge Evolution

**Classification: Approved**

**Findings**

Knowledge evolution follows append-only institutional history:

- Learning history immutable (DB-LEARN-005).
- KPI history immutable (DB-KPI-002).
- Insights merge and supersede — they do not erase evidence (LI-INS-001/003).
- Resolved patterns exit default enrichment (LI-ARCH-008, `docs/28` §26).
- Module completion may expire insights (LI-INS-004) — evolution without deletion of underlying learning evidence.

The closed loop (Brief V1 Loop 2, Agent D §8) is evolution-compatible: new signals → updated patterns → future context reads reflect new state.

---

## 12. Audit Persistence

**Classification: Approved with Concern**

**Findings**

Audit persistence aligns with institutional rules:

- Audit Log entity is append-only, never deleted (`docs/17` §58, §66).
- Context operations emit mandatory audit events (`docs/28` §61, FAIL-CTX-*).
- LI domain events (Agent D §13) are institutional audit artifacts (AI-ARCH-007).
- Professor dismissals require audit reason (LI-GOV-003).

**Concerns**

- **C-DK-13:** LI domain events (`learning.insight.created`, etc.) need explicit mapping to Audit Log vs. operational metrics stream — avoid duplicate or divergent audit trails (Agent B C-04 overlap).

---

## 13. Professor Feedback Persistence

**Classification: Concern**

**Findings**

Professor feedback enters the knowledge layer through multiple paths:

- Reflection.professorFeedback (`docs/17` §19).
- Context Engine professorContext block (`docs/28` §40, §951–963).
- Agent D Professor Feedback Integrator (pattern dismiss, resolve, override constraints).

**Concerns**

- **C-DK-14:** No dedicated **Professor Feedback / Intervention** entity exists in `docs/17` for dismiss-resolve-override actions described in Agent D §6.4. Without normalized persistence, professor actions on LI patterns cannot be fully auditable or replayable for LI calibration.
- Professor feedback themes in context packages must remain **summarized** — full notes never cross provider boundary (`docs/28` §40). Data model must support summary derivation without storing redundant PII.

---

## 14. Student Timeline Persistence

**Classification: Approved with Concern**

**Findings**

Student Timeline is a **read projection**, not a write domain:

- Brief V1 §8.8: V1 timeline integration is indirect.
- Agent D §5.4: Timeline Narrator produces student-safe summaries from persisted learning history and LI state.
- LI-GOV-001/005: student sees sanitized narrative; professor sees full evidence.

Timeline does not require separate mutable storage — it materializes from Mission Attempt milestones, certification records, sanitized insight summaries, and reflection highlights.

**Concerns**

- **C-DK-15:** Timeline Narrator output must be **computed at read time or cached as denormalized read models** — architecture must prohibit storing diagnostic labels in student-visible persistent fields. Agent E must approve field allowlist before any timeline cache entity is introduced.

---

## 15. Context Reconstruction Performance

**Classification: Approved with Concern**

**Findings**

Performance architecture is defined in `docs/28`:

- Parallel Phase 2 retrieval (§32).
- 3000ms SLA default (DB-CTX-007).
- Indexed queries only; N+1 prohibited (§16, §30).
- Minimum field selection (DATA-CTX-001).
- Read replicas permitted for context retrieval (DATA-CTX-005).

Adding LI pattern reads to parallel retrieval is architecturally sound.

**Concerns**

- **C-DK-16:** Agent B C-06: CE and LI both read overlapping entities. **Shared retrieval indexes** on `(studentId, moduleId, status)` for patterns and `(studentId, moduleId, missionId)` for attempts are required before production — not yet specified in `docs/17` §70.
- Capstone M10 cross-module `priorModuleSummary` (`docs/28` §23) increases retrieval fan-out — P95 latency budget must account for summary aggregation queries.

---

## 16. Prisma Retrieval Strategy

**Classification: Approved**

**Findings**

`docs/28` §29–32 defines the correct V1 retrieval strategy:

- Repository decomposition by domain (Student, Mission, KPI, Competency, AiHistory, LearningPattern, Professor).
- Scoped queries with mandatory `studentId` filters.
- `select`-minimum field retrieval.
- Parallel `Promise.all` for independent groups.
- Context Engine singleton Prisma access; Orchestrator excluded.

LI analytical reads may use separate repository modules within LearningIntelligenceService but **must not duplicate enrichment queries** CE runs synchronously — LI writes; CE reads published state.

Agent B recommendation #2 (pull-at-assembly) is **Approved** as institutional read model.

---

## 17. Historical Consistency

**Classification: Concern**

**Findings**

Historical consistency rules are strong for core learning data:

- Immutable attempts, decisions, KPI results, certificates, audit logs.
- Insight merge accumulates evidence rather than replacing history.
- Context snapshots preserve point-in-time context for Coach sessions.

**Concerns**

- **B-DK-03 (recurrence):** Competency history gap undermines trend consistency.
- **C-DK-17:** Async LI analysis means enrichment at Coach request **T** may not include dispatch from session **T−1** until processing completes. Metadata must expose `enrichmentSnapshotAt` so reasoning and audit understand temporal lag — not inconsistency, but must be visible.

---

## 18. Future Scalability

**Classification: Approved**

**Findings**

Architecture supports progressive scale without redesign:

- V1: embedded LI in Express monolith; async in-process queue (Agent B §6, §11).
- V2+: extract LI worker; read replicas for CE retrieval; cohort aggregation scheduler.
- Event-sourced insight history compatible with Agent D §13 domain events.
- Microservice readiness preserved by pull-at-assembly and PostgreSQL as shared SoT.

LI write volume (insights, pattern merges) is bounded per student lifecycle — not provider-scale.

---

## 19. Data Governance

**Classification: Approved with Concern**

**Findings**

Agent D §14.3 (LI-GOV-001–005) aligns with `docs/26` and `docs/28` filtering:

- Role-based context scope (CTX-006, DB-CTX-005).
- Cohort minimum-N thresholds before comparative analytics.
- Professor-only detail on student insights.
- No student auto-notification of at-risk status (LI-PROF-002).
- Post-course 90-day read continuity (LI-GOV-005, `docs/01` LB-18).

**Concerns**

- **C-DK-18:** Insight retention policy (LI-GOV-004) deferred to Agent E — must align with Context snapshot retention and Audit Log permanence rules before schema finalization.

---

## 20. Data Risks

**Classification: Concern**

| Risk | Severity | Mitigation direction |
|------|----------|---------------------|
| Schema drift (`docs/17` vs `docs/27` §40, Agent D taxonomy) | High | Formal `docs/17` amendment before Prisma |
| Competency history absence | High | Append-only level events or approved derivation rule |
| LI retrieval failure vs empty enrichment ambiguity | High | B-01 policy (below) |
| Pattern merge race under concurrent async triggers | Medium | Idempotency keys, optimistic locking on pattern records |
| Dual analytics write paths | Medium | Single owner for Learning Analytics recalculation |
| Professor feedback audit gap | Medium | Normalized intervention entity |
| Snapshot storage growth | Medium | Retention policy + archival strategy |
| Stale enrichment mid-session | Low | enrichmentSnapshotAt metadata |
| Cross-student query leakage | High (security) | Repository-level scope enforcement (existing DB-CTX-005) |
| Timeline diagnostic leakage to students | Medium | Agent E field allowlist |

---

## SPECIAL TASK — Platform Blocking Issue B-01

### Decision: **Option B — Learning Intelligence enrichment is optional for availability**

Context reconstruction **continues** when LI-specific retrieval fails. Context metadata indicates **degraded enrichment**. Coach delivery is **not** stopped solely because LI tables are unavailable.

### Architectural Justification

1. **Semantic distinction required.** Three enrichment states must be institutionally distinguished:
   - **`enriched`** — LI retrieval succeeded; blocks may contain zero or more active patterns/gaps.
   - **`empty_valid`** — LI retrieval succeeded; no active patterns/gaps exist (new student, resolved patterns, or async lag).
   - **`degraded_unavailable`** — LI-specific retrieval failed (timeout, DB error on Pattern/Insight queries); blocks present as empty structures with metadata flag.

2. **CTX-RULE-006 is preserved.** The rule prohibits degrading to **empty context packages** — not empty enrichment arrays within a fully assembled package. Core retrieval groups (Identity, Mission, Decisions, Competency, KPI) remain **mandatory and blocking**. Failure in core groups still terminates context build per `docs/28` §60.

3. **CTX-005 is satisfied structurally.** “Student history, competencies and recurring errors are mandatory context inputs” means **mandatory blocks** in every validated package — not mandatory non-empty LI data. A student with no detected patterns still receives valid `RecurringErrorBlock` and `identifiedGaps` arrays.

4. **LI async contract requires it.** LI operates Analyze-After-Deliver (Brief V1 §9, LI-ARCH-001). First and early Coach sessions legitimately have no enrichment data. Blocking Coach on LI unavailability would violate the principle that LI never blocks synchronous delivery — including when LI persistence is temporarily unavailable.

5. **Pedagogical minimum context is non-LI.** Mission-bound coaching remains valid with Business Mission context, KPI snapshot, competency levels, and decision history — Loop 1 operates without Loop 2 enrichment. LI improves adaptive emphasis; it does not define minimum institutional context.

6. **Operational resilience on Railway.** LI and CE share PostgreSQL but LI retrieval is a subsidiary parallel query group. Isolated LI query failure should not cascade to total Coach outage when core learning context is intact.

### Institutional Standard (B-01 Resolution)

| Retrieval group | Availability policy | On failure |
|-------------------|---------------------|------------|
| Identity, Mission, Decisions, Competency, KPI (latest) | **Mandatory** | Block context build; Coach stops |
| Recurring Error Pattern, Learning Insight (enrichment) | **Optional (best-effort)** | Continue; set `metadata.enrichmentStatus = degraded_unavailable` |
| Learning Analytics (derived) | **Optional (best-effort)** | Continue; omit or mark stale |
| AI History (windowed) | **Mandatory with configurable window reduction** | Concern — separate Agent E review if full failure |

**Required metadata fields on every validated package:**

- `enrichmentStatus`: `enriched | empty_valid | degraded_unavailable`
- `enrichmentSnapshotAt`: timestamp of successful LI read (null if degraded)
- `enrichmentVersion`: institutional enrichment schema version

**Audit requirement:** Every `degraded_unavailable` event emits `context.enrichment.degraded` audit event and operational alert (extends FAIL-CTX-004).

**Spec gap flag:** `docs/28` §60 currently lists “Partial retrieval → validation failure” without distinguishing core vs. subsidiary groups. Document 30 / targeted `docs/28` clarification must codify this tiered policy — proposed here, not silently assumed.

**B-01 status:** **Resolved** by Agent C — Option B becomes institutional standard.

---

## Recommendations to Agent E — AI Governance & Security Architect

1. **Approve subsidiary retrieval degradation policy (B-01)** and confirm it does not weaken security filtering or PII minimization requirements.
2. **Define insight and context snapshot retention schedules** aligned with Audit Log permanence and post-course 90-day access (LI-GOV-004, C-DK-12).
3. **Publish Student Timeline field allowlist** — which LI-derived fields may appear in student-safe read projections (C-DK-15).
4. **Set cohort minimum-N thresholds** before cohort_pattern insights are persisted or exposed (LI-COH-001, LI-GOV-002).
5. **RBAC matrix for insight evidence bundles** — professor sees linked Decision/Attempt IDs; students never receive cross-student or diagnostic cohort data.
6. **Audit mapping for professor dismiss/resolve actions** — require reason capture and retention when patterns are suppressed (LI-GOV-003, C-DK-14).
7. **Review `degraded_unavailable` alerting** as operational vs. security incident — failed LI reads may indicate DB compromise or misconfiguration.

---

## Recommendations to Agent F — LLM Systems & Prompt Engineering Architect

1. **Treat empty enrichment blocks identically to populated blocks for prompt structure** — templates must not assume `identifiedGaps` or `priorityPattern` are non-empty; degraded metadata is for audit and optional Orchestrator telemetry, not prompt branching that weakens EduQA guards.
2. **`targetedReviewAreas` and `priorityPattern`** must bind strictly to Context block content already validated by CE — no supplemental LI fields injected at Orchestrator layer (Agent B rec #2).
3. **EduQA regression suite must cover three enrichment states** — enriched, empty_valid, degraded_unavailable — to confirm no answer-leak regression when enrichment is absent.
4. **`progressionTrend` is LI-owned computation** consumed by CE; `guidanceTier` remains CE-owned derivation from module code — Orchestrator must not override strategy based on degraded enrichment metadata alone.
5. **Hallucination pattern alerts from LI** are audit signals for EduQA constraint review — not automatic prompt mutation without Approval Gate evidence.

---

## Questions for Agent G — Principal Engineering Reviewer

1. Does tiered retrieval failure policy (B-01 Option B) satisfy BUILD-005 Approval Gate expectations for Context Engine, or does `docs/28` §60 require explicit document amendment before implementation proceeds?
2. Should competency history (B-DK-03) be a **blocking gate for Document 30** or deferrable to first Prisma migration phase with explicit `progressionTrend: stable` fallback?
3. Is a dedicated **Professor Intervention** entity in scope for MVP (`docs/20`) or post-MVP — affects schema slice completeness?
4. What evidence will Approval Gate require for idempotent pattern merge under concurrent async triggers (C-DK-05)?
5. Should Learning Analytics (`docs/17` §39) be consolidated under LI ownership in schema design, or remain a shared derived entity with single recalculation owner?
6. Confirm index requirements `(studentId, moduleId, status)` on pattern tables are in scope for initial AI vertical slice migration.

---

## Architecture Decision Recommendation (ADR)

**ADR-DK-001: Tiered Context Retrieval with Optional LI Enrichment**

| Field | Value |
|-------|-------|
| **Status** | Recommended for institutional adoption |
| **Context** | Agent B B-01 — LI availability during Context Engine assembly |
| **Decision** | Adopt Option B. LI enrichment retrieval is best-effort; core learning context retrieval is mandatory and blocking. |
| **Consequences** | Coach remains available during LI outages; adaptive guidance quality may reduce; audit metadata exposes degradation; `docs/28` §60 requires clarification for subsidiary group failure. |
| **Alternatives rejected** | Option A — fails Coach on LI unavailability; contradicts LI async model and first-session scenarios; increases Railway outage blast radius. |

**ADR-DK-002: Pull-at-Assembly LI Read Model**

| Field | Value |
|-------|-------|
| **Status** | Recommended for institutional adoption |
| **Context** | Agent B C-03 — Context Publisher vs CE push/pull |
| **Decision** | LI persists enrichment to PostgreSQL; Context Engine reads active state at assembly. No package push from LI. |
| **Consequences** | Single read path; no dual-write drift; temporal lag between LI write and CE read is normal and metadata-visible. |

**ADR-DK-003: Competency History Required for Progression Trend**

| Field | Value |
|-------|-------|
| **Status** | Recommended — blocking for accurate enrichment |
| **Context** | B-DK-03 — `progressionTrend` without historical competency records |
| **Decision** | Introduce append-only **Student Competency History** (or equivalent level-event entity) owned by Competency Engine, read by LI and CE. |
| **Alternatives rejected** | Derive trend solely from LI analytics snapshots — duplicates authoritative competency state and breaks Competency Engine as SoT. |

---

## Knowledge Layer Readiness

| Dimension | Readiness |
|-----------|-----------|
| Ownership model | **Ready** |
| Core learning history persistence | **Ready** |
| LI insight/pattern model (conceptual) | **Ready** |
| Context Engine enrichment contract | **Ready** (with B-01 policy) |
| Schema authority (`docs/17` alignment) | **Not ready** — B-DK-02 |
| Competency history for trends | **Not ready** — B-DK-03 |
| Professor intervention persistence | **Partial** — C-DK-14 |
| Index/performance specification | **Partial** — C-DK-16 |
| Governance/retention | **Pending Agent E** |

**Knowledge Layer Readiness: Conditionally Ready (≈75%)**

Document 30 may proceed on domain architecture. **Prisma implementation and Approval Gate must not proceed** until B-DK-02 and B-DK-03 are resolved in official schema alignment.

---

## Overall Verdict

**Approved in principle — conditional on schema alignment and B-01 institutional adoption.**

The Learning Intelligence knowledge architecture correctly implements institutional memory as PostgreSQL-backed, read-enriched, async-written insight persistence within the EEI stack. Agent A, Agent D, and Agent B inputs are **compatible at the data layer** once:

1. **B-01 is adopted** — Option B (optional LI availability, mandatory structural blocks, degraded metadata).
2. **B-DK-02 is resolved** — Recurring Error Pattern and expanded Learning Insight fields enter schema authority.
3. **B-DK-03 is resolved** — Competency history model enables auditable `progressionTrend`.

Twelve concerns (C-DK-01 through C-DK-18) should be tracked into Document 30 and targeted `docs/17` amendment proposals — flagged to the user, not silently implemented.

**Agent C sign-off:** Data & Knowledge architecture **validated**. Proceed to Document 30 authoring with the ADRs above as binding data-layer decisions.

[REDACTED]