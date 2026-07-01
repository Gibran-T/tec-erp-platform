# Architecture Brief V1

**Document target:** `30_LEARNING_INTELLIGENCE.md`  
**Issued by:** Agent A — Chief AI Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 1  
**Status:** Architecture Brief (pre-document)  
**Authority base:** Approved Documents 01–29, with primary anchors in `27` §18, `28`, `29` §51, `09`, `17` §49–50, `22` §24  

---

## 1. Mission of Learning Intelligence

Learning Intelligence is the **analytical capability** of TEC.ERP Enterprise Educational Intelligence (EEI). Its mission is to transform institutional learning signals — AI interactions, mission decisions, KPI outcomes, and competency state — into **persistent, auditable learning insight** that improves future guidance without altering academic judgement.

Learning Intelligence shall:

- detect recurring error patterns across missions, modules, and cohorts;
- identify competency gaps from decision, KPI, and interaction history;
- generate and persist **Learning Insight** records for professor analytics;
- maintain the **Recurring Error Registry** and feed active patterns back to the Context Engine;
- support cohort-level difficulty and at-risk-student signals;
- supply measurable learning signals to EduQA and institutional quality review;
- operate **continuously and asynchronously** across the student lifecycle — not only at mission completion.

**Institutional statement:** Learning Intelligence owns **pattern interpretation and insight persistence**. It does not own reasoning, context assembly, or student-facing delivery.

---

## 2. Why This Component Exists

Enterprise Educational Intelligence without Learning Intelligence is **static**. The Context Engine and Reasoning Orchestrator can deliver mission-bound, EduQA-validated coaching — but they cannot adapt institutionally over time without an analytical layer that closes the feedback loop.

Learning Intelligence exists because:

| Gap without LI | What LI closes |
|----------------|----------------|
| Each coaching session starts from current context only | Patterns accumulate; repeated mistakes receive targeted explanation |
| Professors lack systematic cohort error visibility | Cohort recurring-error and competency-gap analytics support classroom decisions |
| EduQA validates individual responses but lacks longitudinal signals | LI informs whether guidance quality improves learning outcomes over time |
| Competency Engine records authoritative scores; AI must not modify them | LI **observes** gaps advisory-only and enriches future context — it does not score |
| Orchestrator must remain synchronous and DB-free (ORCH-001) | LI absorbs post-delivery analysis without blocking student responses |

Learning Intelligence implements **Loop 2 — Learning History Loop** (`27` §24):

```text
AI Interaction → Learning Intelligence Analysis → Recurring Error Detection
→ Context Engine Enrichment → Improved Future Guidance
```

Without Document 30, `27` §18 remains a summary placeholder. Document 30 becomes the **authoritative component standard** for this loop — equivalent in standing to `28` (Context Engine) and `29` (Reasoning Orchestrator).

---

## 3. Architectural Responsibilities

Learning Intelligence owns the following responsibilities exclusively within the EEI stack:

### 3.1 Pattern Analysis
- Correlate weak decisions, KPI misinterpretations, and repeated AI Coach interaction patterns.
- Detect recurring errors at student, module, and cohort granularity.
- Detect competency gap signals by comparing decision/KPI behaviour against competency targets (`04`, `17` §37–38).
- Detect hallucination recurrence alerts when Orchestrator/EduQA signals repeat failure patterns (`29` §52).

### 3.2 Insight Persistence
- Create, update, and resolve **Recurring Error Pattern** records (`27` §40, `17`).
- Create **Learning Insight** records with typed insight categories: `recurring_error`, `competency_gap`, `cohort_pattern` (`27` §39).
- Maintain pattern lifecycle: `active` → `resolved` with occurrence counts and timestamps.
- Ensure all writes are auditable by student, module, and cohort (DB-AI-006).

### 3.3 Context Enrichment Supply
- Publish **active** recurring error patterns and **identified competency gaps** for Context Engine consumption (`28` — read-only from CE perspective).
- Never assemble AI Context Packages — supply signals only.

### 3.4 Professor and Cohort Analytics
- Generate module-level and cohort-level insight summaries for Professor Dashboard consumption (`08`, `11`, `15` §53, `16`).
- Support at-risk indicators and common-error summaries without replacing professor assessment authority.

### 3.5 Institutional Metrics
- Monitor and report Learning Intelligence metrics defined in `27` §31 (recurring error rate, gap detection accuracy, engagement, EduQA pass rate, professor insight utilization, etc.).

### 3.6 Async Event Processing
- Accept post-delivery dispatch events from the Reasoning Orchestrator (`29` §51).
- Process mission completion, decision outcome, and simulation signals independently of the synchronous coach path.

### 3.7 EduQA Signal Contribution
- Inform EduQA with measurable learning signals — not replace EduQA per-response validation.
- Support professor review channels for AI pattern audit (EDU-AI-006).

---

## 4. Component Boundaries

### 4.1 Learning Intelligence MAY

| Action | Constraint |
|--------|------------|
| Query PostgreSQL via Prisma | Authorized analytical persistence layer alongside Context Engine |
| Write Recurring Error Pattern and Learning Insight entities | Per `17` AI Layer |
| Read Mission Attempt, Decision, KPI Snapshot, Student Competency, AI Conversation/Message entities | Read-only for analysis |
| Receive async dispatch from Orchestrator | Post successful EduQA-validated delivery only |
| Expose insight APIs for Professor Dashboard | Business-oriented endpoints per `18` (to be specified in Doc 30) |
| Trigger resolution of error patterns when evidence supports it | Status transition only — no score impact |

### 4.2 Learning Intelligence MUST NEVER

| Prohibition | Authority |
|-------------|-----------|
| Generate student-facing AI Coach responses | `09`, Orchestrator/Coach boundary |
| Assemble or validate AI Context Packages | `28` — Context Engine exclusive |
| Invoke LLM providers or bind prompt templates | `29`, Agent F domain |
| Modify assessment results, scores, certifications, or competency scores | AI-ARCH-003, DB-AI-001/002 |
| Block or delay synchronous coach delivery | `29` — async only; dispatch failure logged only |
| Recalculate KPIs | Simulation Engine owns KPI calculation (`06`, DB-KPI-001) |
| Bypass EduQA validation on any student-facing pathway | ORCH-005 |
| Expose raw insight data to external providers | CTX-001, provider boundary |

### 4.3 Placement in Six-Layer Model (`13`)

Learning Intelligence resides in the **Application Layer** as `LearningIntelligenceService` — a peer of Context Engine, Reasoning Orchestrator, and AI Coach delivery services. It consumes **Business Services** and **Simulation Engine** outcomes. It does not live in Presentation Layer logic.

```text
┌─────────────────────────────────────────────────────────┐
│  Presentation: Professor Dashboard · Student Timeline    │
├─────────────────────────────────────────────────────────┤
│  Application:                                            │
│    Context Engine ←── reads ── Learning Intelligence   │
│    Reasoning Orchestrator ──async──→ Learning Intelligence │
│    AI Coach Delivery (reads validated responses only)  │
├─────────────────────────────────────────────────────────┤
│  Simulation Engine · Business Services · Competency Engine │
├─────────────────────────────────────────────────────────┤
│  Data: PostgreSQL + Prisma (AI Layer + Learning entities)│
└─────────────────────────────────────────────────────────┘
```

---

## 5. Inputs

Learning Intelligence consumes **institutional signals only** — never raw provider output as primary analytical input.

### 5.1 Primary — Orchestrator Async Dispatch (`29` §51)

After successful Phase 8 delivery:

- `orchestrationId`, strategy used, request type
- validation attempt count
- competency context snapshot at time of request
- recurring error pattern reference (if active)
- KPI impact flag
- delivery success / institutional fallback flag

### 5.2 Institutional Learning Data (Prisma read)

| Source | Data consumed |
|--------|---------------|
| Mission Attempt / Decision | Weak decisions, repeated decision types, outcome flags |
| Simulation Engine / KPI Snapshot | KPI misinterpretation patterns, consequence correlation |
| Student Competency (Competency Engine output) | Current levels vs. module targets — **read only** |
| AI Conversation / AI Message | Interaction history, EduQA validation outcomes, abandonment |
| AI Recommendation | Advisory recommendation patterns |
| Context snapshots (stored at conversation start) | Historical context for pattern correlation |
| Professor feedback (where persisted) | Optional enrichment per `27` §57 |

### 5.3 Configuration and Thresholds

- Module-specific error thresholds
- Cohort size minimums for cohort_pattern insights
- Competency dimension mapping per `04`
- Mission binding metadata (`missionId`, `moduleId` mandatory)

### 5.4 Explicit Non-Inputs

- Unvalidated raw provider responses (stored for audit elsewhere — not analytical primary)
- Client-constructed context or prompts
- Unbound AI conversations (prohibited in production per `27` §20)

---

## 6. Outputs

### 6.1 Persistence Outputs

| Output entity | Purpose | Consumer |
|---------------|---------|----------|
| **Recurring Error Pattern** | Active/resolved error patterns with occurrence metadata | Context Engine (read), Professor Dashboard |
| **Learning Insight** | Typed educational observations with priority | Professor Dashboard, EduQA review, audit |

### 6.2 Context Enrichment Outputs (read by Context Engine)

| Output field / block | Package location (`28`) |
|----------------------|-------------------------|
| Active recurring error patterns | `recurringErrorContext` |
| Identified competency gaps | `competencyContext.identifiedGaps` |

Context Engine **reads** these; Learning Intelligence **writes** them. No direct Context Package mutation.

### 6.3 Analytics Outputs

- Cohort recurring error summaries
- Module difficulty indicators
- Competency gap aggregates (advisory)
- At-risk student signals for Professor Dashboard widgets (`08` §2)
- Learning Intelligence operational metrics (`27` §31)

### 6.4 Operational Outputs

- Audit events for every analysis cycle
- Alert signals for repeated hallucination patterns (`29` §52)
- Async processing success/failure logs (failure does not affect delivered coach response)

### 6.5 Explicit Non-Outputs

- Student-facing coach language
- Modified competency scores or certification status
- Recalculated KPIs
- Unvalidated insight exposure to students (insights are professor/analytics-facing unless explicitly surfaced through approved UI patterns)

---

## 7. Dependencies

### 7.1 Upstream Dependencies (Learning Intelligence depends on)

| Dependency | Nature | Document |
|------------|--------|----------|
| Reasoning Orchestrator | Async dispatch contract after delivery | `29` §51 |
| AI Coach / Conversation persistence | Interaction history | `27` §35–38, `17` |
| Simulation Engine | Decision outcomes, KPI snapshots | `06` |
| Competency Engine | Authoritative competency records (read-only) | `19` §32, `04`, `17` |
| Business Missions | Mission binding, attempt history | `15`, `17` |
| PostgreSQL + Prisma | Persistence and analytical queries | `17`, `25` |
| EduQA framework | Validation outcome signals, insight quality rules | `22` §24 |
| Security / RBAC | Professor vs. student data access | `26` |

### 7.2 Downstream Dependents (depend on Learning Intelligence)

| Dependent | Dependency type |
|-----------|-----------------|
| AI Context Engine | Reads active patterns and identified gaps |
| Professor Dashboard | Consumes Learning Insight and cohort analytics APIs |
| EduQA / institutional QA | Longitudinal learning quality signals |
| Platform operations | Metrics, async job monitoring | `21` |

### 7.3 Infrastructure Dependencies

- Railway-compatible async processing (worker, queue, or deferred job pattern — to be defined in Doc 30 architecture, not implementation)
- Express Application Layer hosting
- Observability compatible with `21` operations playbook

### 7.4 Document Dependencies

Document 30 must cross-reference and not redefine:

- `27` §18, §23–25, §31, §39–40 — master EEI authority
- `28` — context consumption contract
- `29` §51 — async dispatch contract
- `17` §49–50 — entity definitions
- `09` AI-006 — professor visibility
- `04` — competency dimensions
- `08`, `11`, `16` — dashboard and portal surfaces

---

## 8. Relationships

### 8.1 AI Context Engine (`28`)

| Direction | Contract |
|-----------|----------|
| LI → CE | Supplies active Recurring Error Patterns and identified competency gaps |
| CE → LI | Does not write insights; reads patterns only |
| Coupling | Loose — schema contract on `recurringErrorContext` and `competencyContext.identifiedGaps` |
| Gate | Failed context validation blocks reasoning; LI does not participate in synchronous path |

**Rule:** Context Engine is the sole gateway between persistence and reasoning. Learning Intelligence enriches what Context Engine **reads** — it never bypasses Context Engine to reach the Orchestrator.

### 8.2 AI Reasoning Orchestrator (`29`)

| Direction | Contract |
|-----------|----------|
| Orchestrator → LI | Async dispatch after successful EduQA-validated delivery |
| LI → Orchestrator | None — no reverse synchronous calls |
| Timing | Post Phase 8 only; dispatch failure logged, response already delivered |
| Shared context | Orchestrator may **read** recurring error references from Context Package; LI **updates** patterns after delivery |

**Rule:** ORCH-001 preserved — Orchestrator never queries DB for LI analysis. LI receives dispatched events and performs its own Prisma reads.

### 8.3 AI Coach (`09`)

| Direction | Contract |
|-----------|----------|
| Coach → LI | Indirect — via persisted conversations, messages, recommendations |
| LI → Coach | Indirect — via Context Engine enrichment on **future** requests |
| Pedagogy | LI supports AI-004 progressive guidance by supplying gap/error signals; Coach phrasing remains Orchestrator + EduQA domain |

**Rule:** AI Coach never reads Learning Intelligence directly at runtime. The enrichment path is **LI → Context Engine → Orchestrator → EduQA → Coach**.

### 8.4 EduQA (`22`)

| Direction | Contract |
|-----------|----------|
| EduQA → LI | Per-response validation outcomes stored in AI Message records |
| LI → EduQA | Longitudinal signals: recurring error rates, validation pass trends, engagement metrics |
| Governance | LI insights about error feedback must remain pedagogically appropriate (`27` §23 step 5) |
| Boundary | LI does not replace per-response EduQA validation (ORCH-005) |

### 8.5 Competency Engine (`19` §32, `04`, `17`)

| Direction | Contract |
|-----------|----------|
| Competency Engine → LI | Authoritative Student Competency records |
| LI → Competency Engine | **None** — LI must never write competency scores |
| Analysis | LI compares behaviour and competency state to **detect gaps** advisory-only |
| Context path | Identified gaps flow to Context Engine → future guidance depth per AI-004 |

**Rule:** Competency Engine owns scoring. Learning Intelligence owns **gap observation**. This preserves AI-ARCH-003 and DB-AI-002.

### 8.6 Business Missions (`15`, `27` §20)

| Direction | Contract |
|-----------|----------|
| Missions → LI | Mission Attempts, decisions, module binding |
| LI → Missions | None — no mission state mutation |
| Binding | Every analysis cycle must be traceable to `missionId` and `moduleId` |
| Capstone | M10 cross-mission pattern analysis across integrated history |

**Rule:** Business before software — patterns are classified by business process domain, not by technical error codes alone.

### 8.7 Professor Dashboard (`08`, `11`, `15` §53, `16` §45)

| Direction | Contract |
|-----------|----------|
| LI → Dashboard | Learning Insight summaries, cohort error reports, gap analytics, at-risk indicators |
| Dashboard → LI | Read-only API consumption — no insight authoring by professors in V1 |
| Privacy | Cohort views must respect RBAC and minimum cohort size rules (Agent E review) |
| Authority | Insights are advisory inputs; professor retains assessment and certification authority |

Professor portal consumes **Learning Insight API** — not raw Context Packages (`28`).

### 8.8 Student Timeline (`12` §Learning Timeline, `16` §24)

| Direction | Contract |
|-----------|----------|
| Timeline → LI | Source data: mission completion, AI coaching sessions, feedback history |
| LI → Timeline | Indirect — LI does not write timeline entries directly in V1 |
| Display | Student Timeline shows coaching sessions and feedback; **internal** error patterns and professor-only insights remain off the student surface unless explicitly approved in UI spec |

**Rule:** Student Timeline is a **read presentation** of learning history. Learning Intelligence feeds professor analytics first; student-facing surfacing of gap/error classification requires explicit UI and governance approval in Doc 30 scope discussion.

---

## 9. Architectural Principles

Document 30 shall establish a dedicated **LI-xxx** principle family, consistent with CTX (`28`) and ORCH (`29`) families.

| ID | Principle |
|----|-----------|
| **LI-001** | Learning Intelligence operates asynchronously — never on the synchronous coach delivery critical path. |
| **LI-002** | Learning Intelligence may access PostgreSQL via Prisma for analysis and insight persistence — it is an authorized analytical persistence consumer alongside Context Engine. |
| **LI-003** | Learning Intelligence never modifies assessment results, scores, certifications, or competency scores. |
| **LI-004** | Every insight and recurring error pattern shall be mission-bound and traceable to `studentId`, `moduleId`, and where applicable `missionId`. |
| **LI-005** | Recurring error patterns are institutional learning assets — accumulated across the student lifecycle (DB-AI-005). |
| **LI-006** | Context Engine enrichment flows through persisted patterns and gaps — Learning Intelligence never bypasses Context Engine. |
| **LI-007** | Orchestrator dispatch failure shall not affect already-delivered coach responses — log only. |
| **LI-008** | Insight generation shall align with progressive guidance tiers M1–M10 (`09` AI-004). |
| **LI-009** | Cohort-level insights shall enforce privacy and minimum aggregation thresholds before exposure. |
| **LI-010** | All Learning Intelligence operations shall produce audit events compatible with institutional governance (`26`, `27` §56). |
| **LI-011** | Learning Intelligence analysis algorithms are institutional assets — not provider-dependent. |
| **LI-012** | Railway-first operational constraints govern async processing, monitoring, and failure recovery. |

**Inherited principles (non-negotiable):** AI-ARCH-003, AI-ARCH-007, AI-ARCH-009, AI-006, DB-AI-001 through DB-AI-006, EDU-AI-006.

**Philosophy statement for Doc 30:** TEC.ERP adopts an **Analyze-After-Deliver** philosophy. Coaching is delivered under EduQA governance first; institutional learning adapts second — without retroactive modification of delivered responses.

---

## 10. Risks

| ID | Risk | Impact | Mitigation direction (architecture only) |
|----|------|--------|------------------------------------------|
| **R-LI-01** | Async dispatch loss or delay | Patterns not updated; guidance fails to adapt | Idempotent event processing; dead-letter logging; reconciliation jobs; explicit failure severity = logged only |
| **R-LI-02** | False positive recurring error detection | Over-targeted coaching; student frustration | Threshold tuning per module; pattern deduplication; resolution lifecycle; professor override visibility |
| **R-LI-03** | False negative gap detection | Missed support for struggling students | Multi-signal correlation (decisions + KPIs + interactions); cohort alerting; EduQA trend monitoring |
| **R-LI-04** | Boundary erosion — LI generates coach text | Ungoverned student-facing output | Strict service boundary; no LLM invocation in LI; Agent F/G review |
| **R-LI-05** | Competency score contamination | Academic integrity breach | Read-only competency access; explicit LI-003; separate persistence entities |
| **R-LI-06** | Professor analytics expose identifiable cohort data in small classes | Privacy violation | Minimum cohort thresholds; aggregation rules; Agent E approval |
| **R-LI-07** | Context Engine schema drift | Enrichment breaks silently | Versioned contract between LI output and CE input blocks; Agent C approval gate |
| **R-LI-08** | Analysis latency exceeds student session gap | Stale patterns in next coach request | Define acceptable freshness SLA; active pattern query at context assembly time |
| **R-LI-09** | Insight overload on Professor Dashboard | Signal noise; professor disengagement | Priority scoring; module filtering; utilization metrics (`27` §31) |
| **R-LI-10** | Circular feedback — error patterns reinforce biased guidance | Institutional drift | EduQA longitudinal review; professor audit channel; pattern resolution criteria |
| **R-LI-11** | Duplicate analysis on retried Orchestrator deliveries | Inflated occurrence counts | Idempotency key on `orchestrationId`; deduplication rules |
| **R-LI-12** | Document 30 redefines Context or Orchestrator contracts | Spec conflict across 28–30 | Doc 30 references, does not redefine; Agent A cross-doc consistency review |

---

## 11. Success Criteria

Document 30 and the Learning Intelligence component are architecturally successful when:

### 11.1 Loop Closure
- Loop 2 (Learning History Loop) is fully specified with named inputs, outputs, timing, and failure modes.
- Active recurring error patterns appear in subsequent AI Context Packages within defined freshness bounds.
- Identified competency gaps appear in `competencyContext.identifiedGaps` for eligible students.

### 11.2 Boundary Integrity
- No Learning Intelligence code path invokes LLM providers or delivers student-facing responses.
- No Learning Intelligence write path modifies competency scores, mission scores, or certification records.
- Orchestrator synchronous path remains DB-free (ORCH-001 verified under LI integration).

### 11.3 Persistence Alignment
- Recurring Error Pattern and Learning Insight entities align with `17` §49 and `27` §39–40.
- All insights support audit queries by student, module, and cohort (DB-AI-006).

### 11.4 Integration Contracts
- Async dispatch payload from Orchestrator (`29` §51) is fully specified with idempotency and retry semantics.
- Context Engine consumption contract (`28`) for `recurringErrorContext` and `identifiedGaps` is confirmed by Agent C.

### 11.5 Professor Value
- Professor Dashboard can answer: who needs support, which missions are difficult, what errors are common (`08` §2).
- Insights remain advisory; professor authority over assessment is preserved (`09` AI-006).

### 11.6 Quality and Governance
- Learning Intelligence metrics (`27` §31) are defined with institutional (not provider-only) purpose.
- EduQA can consume longitudinal learning signals without replacing per-response validation.
- Security and cohort privacy controls approved by Agent E.

### 11.7 Operational Readiness
- Async processing failure modes documented with Railway-compatible monitoring expectations.
- Approval Gate checklist for Learning Intelligence included in Doc 30 (consistent with `27` §71, `29` gate pattern).

### 11.8 Document Quality
- Doc 30 is a standalone Official Enterprise AI Component Standard — same structural authority as `28` and `29`.
- Doc 30 explicitly lists what it does **not** redefine (algorithms delegated from `27` §18 become fully specified **in** Doc 30).

---

## 12. What Other Agents Must Review

| Agent | Role | Mandatory review scope for Doc 30 | Approval authority |
|-------|------|-----------------------------------|-------------------|
| **Agent D** — Learning Intelligence Architect | Primary domain owner | Recurring Error Registry design, gap detection model, analysis algorithms, metrics, async flow, test matrix | **Primary author** of Doc 30 content under Agent A brief |
| **Agent C** — Data & Knowledge Architect | Context consumption | `recurringErrorContext` and `identifiedGaps` contract; read patterns at context assembly; no write overlap with CE | **Required approval** — context package field changes |
| **Agent B** — AI Platform Integration Architect | Platform hosting | Async job integration, Express service boundary, Railway worker/queue topology, insight API endpoints, observability | **Required approval** — integration and deployment architecture |
| **Agent E** — AI Governance & Security Architect | Governance & privacy | Cohort aggregation thresholds, professor RBAC, insight retention, audit completeness, student vs. professor data boundaries | **Required approval** — any cohort/student data exposure |
| **Agent F** — LLM Systems & Prompt Engineering Architect | Orchestrator seam | Async dispatch payload completeness; confirm LI does not encroach on strategy/prompt domain; hallucination alert handoff | **Required review** — dispatch contract alignment |
| **Agent G** — Principal Engineering Reviewer | Approval Gate | Vertical slice completeness, BUILD rules, test evidence requirements, Doc 30 Approval Gate checklist | **Final sign-off** before Doc 30 declared production-ready |

### Cross-functional review inputs (non-agent stakeholders via specs)

| Domain | Review against | Why |
|--------|----------------|-----|
| Pedagogy | `01`, `09`, `22` EduQA | Progressive guidance alignment, insight pedagogical appropriateness |
| Competency model | `04`, `17` | Gap detection dimensions and advisory boundary |
| Simulation | `06` | Decision-KPI correlation inputs |
| Professor UX | `08`, `11`, `16` | Dashboard widget and insight presentation |
| Student UX | `12`, `16` | Timeline boundaries — what LI data may surface to students |
| Database | `17` | Entity completeness, migration impact |
| API | `18` | Business-first insight endpoints |
| MVP sequencing | `20` | Delivery phasing relative to Context Engine and Orchestrator |

### Review sequencing (recommended)

```text
Agent A — Architecture Brief V1 (this document)
    ↓
Agent D — Doc 30 draft architecture (component standard)
    ↓
Parallel review: Agent C · Agent B · Agent E · Agent F
    ↓
Agent A — Cross-document consistency audit (27–30)
    ↓
Agent G — Approval Gate
    ↓
Institutional Review Board — Doc 30 approval
```

---

## Architecture Summary Diagram

```text
                    BUSINESS MISSIONS + SIMULATION
                    (Attempts · Decisions · KPIs)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  LEARNING INTELLIGENCE (30)                  │
│  Analyze · Detect · Persist · Aggregate · Metricize        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  Recurring  │  │  Learning    │  │  Cohort / Professor │ │
│  │  Error      │  │  Insight     │  │  Analytics Signals  │ │
│  │  Registry   │  │  Records     │  │                     │ │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │ read           │ read                 │ read
          ▼                │                      ▼
   AI CONTEXT ENGINE (28)   │              PROFESSOR DASHBOARD
          │                │                      ▲
          ▼                │                      │
   AI REASONING ORCH (29)───┘ async dispatch       │
          │                                        │
          ▼                                        │
      EDUQA (22)                                   │
          │                                        │
          ▼                                        │
      AI COACH (09) ──── persists ────────────────┘
                              │
                              ▼
                      STUDENT TIMELINE (12)
                      (history presentation)
```

---

**Architecture Brief V1 — End**

*Prepared for Architecture Review Board Phase 1. This brief defines architecture only. Document 30 authoring is assigned to Agent D under Agent A authority. No implementation, code, git, or official documentation changes are authorized by this brief alone.*

[REDACTED]