# Learning Intelligence Domain Architecture V1

**Issued by:** Agent D — Learning Intelligence Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 2  
**Status:** Domain Architecture Proposal (pre-document)  
**Target document:** `30_LEARNING_INTELLIGENCE.md` (not authored here)  
**Authority base:** Architecture Brief V1 (Agent A), approved Documents 01–29  
**Constraint:** Extends Brief V1 — does not redefine EEI stack placement, async contract, or AI-ARCH principles

---

## Executive Summary

Learning Intelligence (LI) is the **institutional memory and pattern-recognition layer** of Enterprise Educational Intelligence. It transforms observable learning signals into **persistent, auditable educational insight** that enriches future guidance, professor visibility, and EduQA evidence — without ever substituting for student reasoning or altering academic judgement.

LI operates **asynchronously and continuously** across the student lifecycle. It closes Loop 2 of the EEI architecture:

```text
Learning Signal → LI Analysis → Insight Persistence → Context Enrichment → Improved Guidance
                                                      ↓
                                            Professor & Cohort Intelligence
                                                      ↓
                                            EduQA Evidence & Continuous Improvement
```

Pedagogy precedes technology at every boundary: LI observes, interprets, and advises the institution — it does not decide, score, or certify on behalf of students.

---

## 1. Educational Intelligence Model

### 1.1 Definition

**Educational Intelligence** is TEC.ERP’s capacity to understand *how* students learn ERP reasoning over time — not merely *what* they completed. It synthesizes mission-bound evidence into interpretable patterns that support adaptive guidance and professor intervention.

Educational Intelligence is **institutional**, not provider-derived. The LLM generates language; TEC.ERP owns the learning patterns that inform when, where, and how guidance should deepen.

### 1.2 Signal Layers

LI consumes four signal layers, ordered by pedagogical authority:

| Layer | Source domain | What LI interprets |
|-------|---------------|-------------------|
| **Mission Evidence** | Business Missions, Simulation Engine | Decisions, consequences, KPI deltas, reflection quality |
| **Competency Evidence** | Competency Engine | Declared levels, validation events, dimension trends |
| **Interaction Evidence** | AI Coach, Orchestrator (post-delivery) | Strategy used, validation outcomes, guidance themes |
| **Institutional Evidence** | Professor actions, EduQA findings | Interventions, overrides, validation failures, cohort policies |

### 1.3 Intelligence Products

LI produces four intelligence products — each advisory, each auditable:

1. **Learning Insights** — atomic observations about a student’s reasoning or progress  
2. **Recurring Error Patterns** — institutionalized repetition signals  
3. **Competency Gap Signals** — dimensional weaknesses inferred from evidence  
4. **Progress & Readiness Indicators** — trajectory and certification-adjacent readiness (never certification decisions)

### 1.4 Intelligence Lifecycle

```text
Observe → Correlate → Classify → Prioritize → Persist → Publish (to Context / Professor)
    ↑                                                              ↓
    └──────────── Resolve / Supersede / Expire ← Professor feedback ─┘
```

### 1.5 Pedagogical Guardrails (inherited from Brief V1)

- **LI-EDU-001:** Intelligence supports reasoning; it never replaces it.  
- **LI-EDU-002:** Every insight must trace to mission-bound evidence.  
- **LI-EDU-003:** Insight language remains explanatory, not prescriptive of final answers.  
- **LI-EDU-004:** Progressive complexity (M1–M2 → M3–M8 → M9–M10) governs insight emphasis, aligned with AI-004.  
- **LI-EDU-005:** Reflection quality is a first-class signal — not an optional metadata field.

---

## 2. Learning Insight Model

### 2.1 Purpose

A **Learning Insight** is the smallest unit of institutional learning observation LI persists. Insights are the bridge between raw learning history and actionable enrichment (Context Engine, Professor Dashboard, Student Timeline).

### 2.2 Insight Taxonomy

| Insight type | Pedagogical meaning | Typical trigger |
|--------------|---------------------|-----------------|
| `recurring_error` | Repeated reasoning mistake across attempts | Error pattern threshold crossed |
| `competency_gap` | Observable weakness in a competency dimension | Gap detection rule matched |
| `progress_signal` | Trajectory change (improving, stalling, declining) | Progress model threshold |
| `reflection_weakness` | Shallow or misaligned reflection | Reflection rubric signal |
| `kpi_misinterpretation` | Consistent KPI reading errors | KPI interpretation correlation |
| `cohort_pattern` | Pattern visible at cohort level | Cohort aggregation threshold |
| `intervention_recommendation` | Professor action suggested | Composite risk score |
| `eduqa_signal` | AI guidance quality concern | Hallucination / validation pattern |
| `engagement_anomaly` | Disengagement or abandonment pattern | Engagement model |

### 2.3 Insight Attributes (conceptual)

Each insight carries:

- **Identity & binding:** student, module, mission (when applicable), cohort  
- **Classification:** type, competency dimension(s), business process domain  
- **Evidence reference:** linked decisions, KPI snapshots, conversation references, attempt IDs  
- **Priority:** critical | high | medium | low — based on intervention urgency, not severity of “wrong answer”  
- **Confidence:** institutional confidence in the pattern (not LLM confidence)  
- **Status:** active | superseded | resolved | expired  
- **Pedagogical framing:** description, suggested review areas (hints, not answers)  
- **Temporal markers:** first detected, last reinforced, resolved  
- **Provenance:** originating analysis pass, triggering event, analyst version

### 2.4 Insight Lifecycle Rules

- **LI-INS-001:** Active insights with the same root cause merge — they accumulate evidence, not duplicate noise.  
- **LI-INS-002:** Resolved insights exit Context Engine enrichment unless professor requests historical view.  
- **LI-INS-003:** Supersession occurs when a higher-confidence insight replaces a weaker one.  
- **LI-INS-004:** Insights expire when module certification is achieved and pattern is no longer pedagogically relevant — unless marked persistent by professor.  
- **LI-INS-005:** No insight may imply a grade, score adjustment, or certification outcome.

### 2.5 Insight Consumption Map

| Consumer | What it receives | What it must not do |
|----------|------------------|---------------------|
| Context Engine | Active gaps, active recurring errors, priority pattern | Modify insight state |
| AI Coach (via Context) | Enrichment signals only | Generate insights |
| Professor Dashboard | Full insight set with drill-down | Auto-trigger assessment changes |
| Student Timeline | Student-safe summary of coaching themes | Expose cohort comparisons |
| EduQA | Aggregated quality signals | Override validation decisions |

---

## 3. Recurring Error Intelligence

### 3.1 Purpose

**Recurring Error Intelligence** institutionalizes repeated reasoning failures so the platform learns collectively from student mistakes — turning isolated incidents into durable pedagogical assets (Brief V1, `27` §23).

### 3.2 Error Pattern Definition

A recurring error is **not** a single wrong decision. It is a **pattern** meeting institutional recurrence criteria across one or more of:

- identical or structurally equivalent weak decisions within a mission  
- same error type across multiple mission attempts  
- consistent KPI misinterpretation linked to the same conceptual misunderstanding  
- cohort-level frequency exceeding institutional threshold  

### 3.3 Error Classification Domains

Errors are classified by **business process domain** (aligned with modules M1–M10), not by UI screen:

- ERP foundations & readiness (M1)  
- Master data & organizational structure (M2)  
- Procure-to-Pay (M3)  
- Order-to-Cash (M4)  
- Supply chain & inventory (M5)  
- Finance & accounting impact (M6)  
- CRM & customer service (M7)  
- Governance & approvals (M8)  
- KPI interpretation & BI reasoning (M9)  
- Integrated capstone reasoning (M10)  

Cross-module errors receive explicit **cross-process** tagging for M3–M10 guidance depth.

### 3.4 Recurring Error Registry (conceptual)

The Registry maintains **active patterns** with:

- error type code (institutional taxonomy)  
- human-readable description (professor-reviewable)  
- occurrence count and trend (increasing | stable | decreasing)  
- linked competency dimension(s)  
- linked learning objective(s)  
- priority for Context Engine (`priorityPattern`)  
- targeted review areas (concept hints per `28` RecurringErrorBlock)  
- status: active | monitoring | resolved  

### 3.5 Detection Logic (domain rules, not algorithms)

| Rule ID | Condition | Action |
|---------|-----------|--------|
| LI-ERR-001 | Same error type ≥ N times within one mission attempt series | Register pattern at student level |
| LI-ERR-002 | Same error type across ≥ M distinct missions in one module | Elevate priority; attach to module competency gap |
| LI-ERR-003 | KPI misinterpretation co-occurs with decision error ≥ K times | Classify as `kpi_misinterpretation` compound pattern |
| LI-ERR-004 | Cohort frequency ≥ institutional threshold for same error type | Generate cohort insight; flag mission difficulty |
| LI-ERR-005 | Pattern absent for ≥ retention window after targeted guidance | Mark resolved; remove from active Context enrichment |
| LI-ERR-006 | Professor marks “addressed in class” | Resolve with professor attribution |

### 3.6 Feedback to Guidance

When an active pattern exists, Context Engine receives:

- full active pattern list  
- single `priorityPattern` for Coach emphasis  
- `targetedReviewAreas` for reflection and review prompts  

Coach must **prioritize explanation** of the pattern without revealing assessment answers (AI-001, COACH-RULE-001).

---

## 4. Competency Gap Intelligence

### 4.1 Boundary with Competency Engine

| Competency Engine | Competency Gap Intelligence |
|-------------------|----------------------------|
| Owns competency **scoring and validation** | Owns competency **gap inference** |
| Produces authoritative competency levels | Produces advisory gap signals |
| Triggered by mission completion, assessments, professor validation | Triggered continuously from evidence correlation |
| Feeds certification evaluation | Feeds guidance enrichment and professor analytics |
| **Never modified by LI** | **Never modifies competency scores** |

This boundary is non-negotiable (AI-ARCH-003, Brief V1 boundary §4).

### 4.2 Four-Dimension Gap Model

Aligned with `04_COMPETENCY_MATRIX.md`:

1. **Business Understanding** — context comprehension gaps  
2. **Process Execution** — workflow and transaction reasoning gaps  
3. **Analytical Thinking** — KPI, trend, and cross-module analysis gaps  
4. **Professional Decision-Making** — justification, consequence awareness, recommendation quality gaps  

### 4.3 Gap Signal Types

| Signal | Meaning |
|--------|---------|
| `dimension_below_target` | Student dimension trails module target |
| `dimension_declining` | Negative trend across recent missions |
| `validation_pending` | Evidence suggests gap; formal validation not yet recorded |
| `reflection_mismatch` | Reflection claims understanding; decisions contradict |
| `cross_dimension` | Weakness spans multiple dimensions (capstone-relevant) |

### 4.4 Gap Severity (pedagogical, not punitive)

- **Foundational** — blocks module integration understanding (M1–M2 emphasis)  
- **Process** — affects execution quality within module (M3–M8 emphasis)  
- **Analytical** — affects KPI and cross-module reasoning (M6, M9 emphasis)  
- **Strategic** — affects recommendation and capstone integration (M9–M10 emphasis)  

### 4.5 Gap-to-Guidance Mapping

Gap signals feed Context Engine `identifiedGaps` and `progressionTrend` (`28` §25). They determine:

- guidance depth tier (already set by module, refined by maturity)  
- which dimensions Coach should emphasize in reflection prompts  
- which review areas appear in Student Timeline summaries  

Gap signals **do not** auto-adjust `guidanceTier` beyond institutional rules — they inform emphasis within tier.

---

## 5. Learning Progress Intelligence

### 5.1 Purpose

**Learning Progress Intelligence** interprets the student’s trajectory through the 10-module, 30-mission journey — connecting mission completion, competency evolution, reflection depth, and engagement into a coherent progress narrative.

### 5.2 Progress Dimensions

| Dimension | What LI tracks |
|-----------|----------------|
| **Module progression** | Missions completed, scores trend, reflection completion |
| **Competency trajectory** | Dimension levels over time (read from Competency Engine) |
| **Reasoning maturity** | Decision justification quality trend |
| **Engagement continuity** | Session patterns, Coach usage, abandonment signals |
| **Certification readiness indicators** | Silver/Gold prerequisite signals (advisory only) |

### 5.3 Progress States (student-level)

- **On track** — meeting module learning objectives with stable or improving evidence  
- **At risk** — declining scores, unresolved recurring errors, or engagement anomalies  
- **Accelerating** — above-target competency growth; eligible for increased challenge (M9–M10)  
- **Stalled** — no meaningful progress within institutional window  
- **Intervention active** — professor action recorded; LI adjusts monitoring sensitivity  

### 5.4 Student Timeline Integration

Student Timeline (`12` §Learning Timeline) displays LI-derived **student-safe** summaries:

- mission completion milestones  
- coaching session themes (not raw insight internals)  
- competency progression narrative  
- certification milestones  
- reflection highlights  

Timeline shows **learning story**, not diagnostic labels that could discourage or leak cohort comparisons.

### 5.5 Progress Intelligence Rules

- **LI-PROG-001:** Progress states are advisory; certification remains with Competency Engine and professor validation.  
- **LI-PROG-002:** “At risk” requires ≥ two independent signals — never a single low score alone.  
- **LI-PROG-003:** Post-course 90-day access period continues progress tracking for self-review (`01` LB-18).  
- **LI-PROG-004:** Capstone (M10) progress weighs cross-module integration evidence highest.

---

## 6. Professor Intelligence

### 6.1 Purpose

**Professor Intelligence** transforms LI outputs into **actionable pedagogical visibility** for the Teacher Portal (`11`) — answering: *Who needs attention today, why, and with what evidence?*

Professors remain the central decision-maker (`11` Teacher Philosophy). LI is an advisory lens, not an evaluator.

### 6.2 Professor Intelligence Surfaces

| Surface | LI contribution |
|---------|-----------------|
| Teacher Home Dashboard | Intervention queue, at-risk count, cohort alerts |
| Student Profile | Insight summary, recurring errors, gap dimensions, intervention history |
| Module Management | Common mistakes, mission difficulty signals, competency achievement gaps |
| Business Mission Review | Pattern context for specific attempts |
| Learning Analytics | Module comparison, progression, competency evolution |
| AI Professor Assistant | Cohort-level pattern summaries (advisory prompts for professor, not student answers) |

### 6.3 Intervention Signal Model

An **Intervention Signal** is a professor-facing composite derived from LI:

- **Urgency:** immediate | this week | monitor  
- **Reason categories:** recurring error, competency gap, engagement, reflection quality, certification readiness gap  
- **Evidence bundle:** linked missions, decisions, KPI impacts, insight IDs  
- **Suggested professor actions:** align with `11` (notes, review assignment, follow-up, additional practice) — suggestions only  

### 6.4 Professor Feedback Loop

Professor actions feed back into LI:

- intervention recorded → adjusts monitoring, may resolve or downgrade insights  
- professor override of AI guidance constraints → logged for EduQA and LI calibration  
- professor marks pattern “addressed” → resolves recurring error  
- professor dismisses false positive → suppresses pattern with audit trail  

### 6.5 Professor Intelligence Rules

- **LI-PROF-001:** Professor sees full evidence; students see sanitized summaries (AI-006 scope).  
- **LI-PROF-002:** LI never auto-notifies students of “at risk” status.  
- **LI-PROF-003:** Intervention suggestions must cite business evidence, not generic labels.  
- **LI-PROF-004:** Professor validation of competency supersedes LI gap inference for certification purposes.

---

## 7. Cohort Intelligence

### 7.1 Purpose

**Cohort Intelligence** aggregates individual patterns into **institutional learning visibility** — mission difficulty, common misconceptions, module pacing, and certification readiness distribution — while respecting privacy boundaries.

### 7.2 Cohort Intelligence Products

| Product | Use |
|---------|-----|
| **Cohort error heatmap** | Most frequent recurring errors by module |
| **Mission difficulty index** | Attempt count, average score, error density per mission |
| **Competency distribution** | Dimension level spread across cohort |
| **Progression velocity** | Module completion pace vs. schedule |
| **Certification readiness snapshot** | Counts approaching Silver/Gold thresholds (advisory) |
| **EduQA cohort signal** | AI guidance quality trends for the cohort |

### 7.3 Aggregation Principles

- Minimum cohort size thresholds before surfacing comparative analytics (privacy)  
- Individual student identity visible only to authorized professor roles — never in anonymized cohort exports  
- Cohort patterns generate **mission difficulty feedback** to institutional content owners (EduQA input), not automatic mission changes  

### 7.4 Cohort-to-Mission Feedback

When cohort-level error frequency exceeds threshold:

- LI flags mission for **EduQA review** (learning objective clarity, scenario ambiguity)  
- LI may suggest professor class discussion topics — not student-facing content changes  
- LI does **not** modify Business Mission definitions or Simulation Engine rules  

### 7.5 Cohort Intelligence Rules

- **LI-COH-001:** Cohort analytics require Agent E approval for exposure boundaries.  
- **LI-COH-002:** Cross-cohort comparison is institutional/admin scope — not default professor view.  
- **LI-COH-003:** Cohort intelligence informs **pedagogical planning**, not student ranking displays.

---

## 8. Adaptive Learning Loop

### 8.1 The Three Loops (Brief V1 extension)

LI owns **Loop 2** entirely and contributes evidence to Loops 1 and 3:

```text
LOOP 1 — Mission Feedback (synchronous, mission-bound)
Student Decision → Simulation → KPI → Coach Feedback → Reflection
                              ↓
                    LI observes (async)

LOOP 2 — Learning History (LI-owned, async)
Signals → LI Analysis → Insight/Pattern Persistence → Context Enrichment → Next Coach Interaction

LOOP 3 — EduQA (validation-owned, LI-informed)
Coach Response → EduQA Validate → Deliver → LI records quality signals → Continuous improvement
```

### 8.2 LI Adaptive Cycle

```text
┌─────────────────────────────────────────────────────────────┐
│  TRIGGER: Mission event | Coach delivery | Professor action │
└──────────────────────────────┬──────────────────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Evidence Collection  │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Pattern Analysis     │
                    └──────────┬───────────┘
                               ↓
              ┌────────────────┼────────────────┐
              ↓                ↓                ↓
     Recurring Error    Competency Gap    Progress Update
              └────────────────┼────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Insight Persistence  │
                    └──────────┬───────────┘
                               ↓
         ┌─────────────────────┼─────────────────────┐
         ↓                     ↓                     ↓
  Context Engine         Professor Intel       EduQA Evidence
  (next interaction)     (intervention)        (release quality)
```

### 8.3 Adaptation Boundaries

What adapts:

- Coach **emphasis** and review area suggestions  
- Professor **visibility** and intervention prompts  
- Institutional **EduQA review priorities**  
- Context package **enrichment depth** for known patterns  

What does **not** adapt automatically:

- Assessment scores  
- Competency levels  
- Certification outcomes  
- Simulation Engine rules  
- Business Mission content  

### 8.4 Timing Model

| Trigger | Timing | Blocking? |
|---------|--------|-----------|
| Orchestrator post-delivery dispatch | Async, immediate queue | No |
| Mission attempt completion | Async batch | No |
| Reflection submission | Async | No |
| Professor intervention | Near-real-time | No |
| Cohort aggregation | Scheduled (e.g., daily) | No |
| Module completion summary | Event-driven async | No |

Dispatch failure is **logged only** — never affects delivered Coach response (`29` §51).

---

## 9. Learning Analytics Model

### 9.1 Purpose

The **Learning Analytics Model** defines the calculated educational indicators LI maintains — distinct from business KPIs (Simulation Engine) and distinct from LI operational metrics (§11).

### 9.2 Analytics Layers

| Layer | Scope | Examples |
|-------|-------|----------|
| **Student analytics** | Individual | Average mission score trend, reflection depth index, error recurrence rate |
| **Module analytics** | Module × cohort | Mission difficulty, objective achievement rate, common error types |
| **Program analytics** | Cross-module | Competency dimension growth, certification readiness distribution |
| **AI analytics** | Coach effectiveness | Guidance engagement, post-feedback reflection rate, EduQA correlation |

### 9.3 Core Calculated Indicators (conceptual)

- **Mission Performance Index** — weighted mission scores with decision quality factor  
- **Reflection Depth Index** — rubric-based reflection quality score  
- **Recurring Error Rate** — active patterns / attempts (student and cohort)  
- **Competency Velocity** — rate of dimension level change  
- **Guidance Effectiveness Proxy** — error recurrence reduction after targeted Coach interaction  
- **Engagement Continuity Score** — session regularity and completion patterns  
- **Intervention Response Index** — improvement after professor action  

### 9.4 Analytics Recalculation Rules

- **LI-AN-001:** Analytics recalculate on triggering events; stale analytics carry explicit freshness markers.  
- **LI-AN-002:** Analytics are read-only inputs for Professor Dashboard and EduQA — not write triggers for scores.  
- **LI-AN-003:** Historical analytics remain immutable snapshots for audit; current values may update.

### 9.5 Relationship to Dashboard Architecture

Business dashboards (`08`) show **simulation KPIs** — operational business performance.  
Learning Analytics show **pedagogical performance** — reasoning, competency, engagement.  
LI must never conflate the two in professor or student views (DB-KPI rules, `27` §21).

---

## 10. Educational KPIs

Educational KPIs measure **learning outcome quality** — the pedagogical equivalent of business KPIs.

### 10.1 Student-Facing Educational KPIs (sanitized)

Displayed in Student Portal progress views — motivational, not diagnostic:

| KPI | Meaning |
|-----|---------|
| Mission Completion Rate | Progress through module missions |
| Reflection Completion Rate | Reflection activities submitted |
| Competency Growth Indicator | Directional trend per dimension |
| Certification Progress | Steps toward Silver/Gold (from Competency Engine) |

### 10.2 Professor-Facing Educational KPIs

| KPI | Meaning |
|-----|---------|
| Cohort Module Completion Rate | Schedule adherence |
| Average Mission Score Trend | Cohort performance direction |
| Recurring Error Density | Common mistake frequency |
| Competency Achievement Rate | Validated competencies / enrolled |
| At-Risk Student Count | Students meeting LI at-risk criteria |
| Intervention Success Rate | Improvement after professor action |
| Reflection Quality Index | Cohort reflection depth average |
| Certification Readiness Rate | Advisory Silver/Gold proximity |

### 10.3 Institutional Educational KPIs (EduQA / release)

| KPI | Meaning |
|-----|---------|
| Learning Objective Achievement Rate | Missions meeting objective evidence |
| Mission Difficulty Balance | Score/error distribution across missions |
| AI Guidance Effectiveness | Post-guidance improvement proxy |
| EduQA Pass Rate Correlation | Quality vs. recurring error reduction |
| Professor Insight Utilization | Professor engagement with LI surfaces |

### 10.4 Educational KPI Rules

- **LI-EKPI-001:** Educational KPIs never appear as student rankings within cohort.  
- **LI-EKPI-002:** KPI definitions must map to learning objectives in `01`, `04`, `15`.  
- **LI-EKPI-003:** KPI deterioration triggers EduQA review, not automatic remediation.

---

## 11. Learning Intelligence Metrics

These measure **LI system health and effectiveness** — operational and analytical quality of the domain itself (`27` §31 extended).

| Metric | Purpose |
|--------|---------|
| Recurring Error Detection Rate | Patterns registered / eligible events |
| False Positive Rate | Professor-dismissed patterns / total patterns |
| Competency Gap Detection Accuracy | Gap signals later confirmed by validation |
| Insight Freshness | Age of active insights beyond threshold |
| Async Processing Lag | Time from trigger to persisted insight |
| Dispatch Consumption Rate | Orchestrator events successfully processed |
| Context Enrichment Coverage | Active students with enriched context |
| Professor Insight Utilization Rate | Insights viewed / insights generated |
| Pattern Resolution Rate | Resolved patterns / active patterns |
| Hallucination Pattern Alert Rate | EduQA-correlated AI quality signals |
| Cohort Aggregation Completeness | Cohorts with current analytics |

Metrics support **institutional decisions** — not provider optimization alone (`27` §31).

---

## 12. Learning Intelligence Internal Services

Conceptual domain services — responsibilities only, no implementation.

| Service | Responsibility |
|---------|----------------|
| **Evidence Collector** | Gathers mission, decision, KPI, reflection, and dispatch signals |
| **Pattern Analyzer** | Correlates evidence; applies detection rules |
| **Recurring Error Registry Service** | Maintains pattern lifecycle (register, merge, resolve, expire) |
| **Competency Gap Analyzer** | Infers gap signals from evidence vs. Competency Engine state |
| **Progress Analyzer** | Computes progress states and trajectory indicators |
| **Insight Manager** | Creates, merges, prioritizes, resolves Learning Insights |
| **Professor Intelligence Composer** | Builds intervention signals and evidence bundles |
| **Cohort Aggregator** | Scheduled cohort-level pattern and analytics computation |
| **Analytics Calculator** | Maintains Learning Analytics Model indicators |
| **Context Publisher** | Publishes active patterns and gaps for Context Engine consumption |
| **EduQA Evidence Exporter** | Supplies aggregated signals for EduQA review cycles |
| **Timeline Narrator** | Produces student-safe timeline summaries |
| **Professor Feedback Integrator** | Processes professor actions into LI state changes |

All services operate **asynchronously** except read paths invoked by authorized consumers.

---

## 13. Internal Domain Events

Events LI emits for institutional observability and cross-domain coordination:

| Event | Meaning | Primary consumers |
|-------|---------|-------------------|
| `learning.insight.created` | New insight persisted | Professor Dashboard, audit |
| `learning.insight.updated` | Insight merged or reprioritized | Context Publisher |
| `learning.insight.resolved` | Pattern addressed | Context Engine (de-enrich) |
| `learning.recurring_error.registered` | New recurring pattern | Context Publisher, Professor |
| `learning.recurring_error.elevated` | Priority increased | Professor intervention queue |
| `learning.recurring_error.resolved` | Pattern cleared | Context Engine |
| `learning.competency_gap.detected` | Gap signal created | Context Publisher, Professor |
| `learning.progress.state_changed` | Student progress state transition | Professor Dashboard |
| `learning.intervention.recommended` | Composite intervention signal | Professor Dashboard |
| `learning.cohort.pattern_detected` | Cohort-level pattern | EduQA, Professor module view |
| `learning.analytics.recalculated` | Analytics snapshot updated | Dashboard surfaces |
| `learning.context.enrichment_published` | Active enrichment ready | Context Engine |
| `learning.eduqa.signal_recorded` | AI quality pattern logged | EduQA pipeline |
| `learning.analysis.failed` | Async analysis failure | Operations (logged only) |

Events are **institutional audit artifacts** — aligned with AI-ARCH-007 traceability.

---

## 14. Business Rules

### 14.1 Architectural Rules (from Brief V1 — extended)

| ID | Rule |
|----|------|
| LI-ARCH-001 | LI operates asynchronously; never blocks Coach delivery |
| LI-ARCH-002 | LI never modifies assessment results, scores, or certifications |
| LI-ARCH-003 | LI never generates student-facing Coach responses |
| LI-ARCH-004 | LI never assembles AI Context Packages (Agent C domain) |
| LI-ARCH-005 | LI never queries database on behalf of synchronous Orchestrator reasoning |
| LI-ARCH-006 | All insights and patterns must be auditable with evidence references |
| LI-ARCH-007 | Provider output is input signal only — LI owns pattern taxonomy |
| LI-ARCH-008 | Active enrichment publishes to Context Engine; resolved patterns exclude by default |

### 14.2 Pedagogical Rules

| ID | Rule |
|----|------|
| LI-PED-001 | Every insight must bind to mission or module context |
| LI-PED-002 | Insight descriptions use business language, not technical jargon |
| LI-PED-003 | Targeted review areas suggest concepts, never decision answers |
| LI-PED-004 | Progressive module tier governs insight emphasis (AI-004) |
| LI-PED-005 | Reflection evidence weighs equally with decision evidence |
| LI-PED-006 | At-risk classification requires multiple independent signals |

### 14.3 Data Governance Rules

| ID | Rule |
|----|------|
| LI-GOV-001 | Student-level insight detail restricted to professor and authorized roles |
| LI-GOV-002 | Cohort exports respect minimum aggregation thresholds |
| LI-GOV-003 | Professor dismissals require audit reason |
| LI-GOV-004 | Insight retention follows institutional policy (Agent E) |
| LI-GOV-005 | Post-course access period continues LI read paths for student timeline |

### 14.4 Integration Rules

| ID | Rule |
|----|------|
| LI-INT-001 | Orchestrator dispatch is mandatory input for Coach delivery analysis |
| LI-INT-002 | Context Engine reads LI outputs; LI does not read Context Packages |
| LI-INT-003 | Competency Engine levels are read-only inputs to gap analysis |
| LI-INT-004 | EduQA receives LI signals; LI does not bypass EduQA validation |
| LI-INT-005 | Dispatch failure logged only — no retry impact on student experience |

---

## 15. What Belongs to Learning Intelligence

**In scope:**

- Recurring error detection and registry lifecycle  
- Competency gap **inference** (not scoring)  
- Learning Insight creation, prioritization, resolution  
- Progress state interpretation and trajectory analysis  
- Professor intervention signal composition  
- Cohort pattern aggregation and mission difficulty signals  
- Learning Analytics calculation (pedagogical indicators)  
- Educational KPI computation for professor and institutional views  
- Student Timeline narrative summaries (student-safe)  
- Async consumption of Orchestrator post-delivery signals  
- EduQA evidence export (aggregated learning effectiveness signals)  
- Professor feedback integration into pattern state  
- Adaptive enrichment **signals** for Context Engine  
- LI operational metrics and domain event emission  
- Hallucination **pattern** alerting (from EduQA/Orchestrator signals)  

---

## 16. What Does NOT Belong to Learning Intelligence

**Explicitly out of scope:**

| Domain | Owner |
|--------|-------|
| AI Context Package assembly | Context Engine (Agent C) |
| Synchronous reasoning orchestration | Reasoning Orchestrator (Agent F/B) |
| Prompt template design | LLM Systems (Agent F) |
| Student-facing Coach response generation | AI Coach + Orchestrator |
| EduQA validation execution | EduQA pipeline / Orchestrator |
| Competency scoring and validation | Competency Engine |
| Certification decisions | Certification Evaluation |
| Business Mission content and rules | Business Missions / Functional Spec |
| Simulation and KPI calculation | Simulation Engine |
| Assessment grading | Assessment / Professor |
| Database schema design | Data architecture (reference only) |
| REST API design | Platform integration (Agent B) |
| Frontend rendering | Presentation layer |
| Provider SDK invocation | Provider layer |
| Automatic mission or scenario modification | Content governance / EduQA |
| Student decision submission | Business Mission runtime |
| Direct LLM calls for analysis | Prohibited — LI uses institutional rules on structured evidence |

---

## 17. Dependencies

### 17.1 Context Engine (`28`)

| Direction | Contract |
|-----------|----------|
| LI → Context Engine | Publishes `identifiedGaps`, active `RecurringErrorBlock` patterns, `progressionTrend` |
| Context Engine → LI | **No write** — CE reads only active LI outputs |
| Dependency type | **Downstream consumer** of LI enrichment |

LI must coordinate with Agent C on enrichment field semantics — not package assembly logic.

### 17.2 Reasoning Orchestrator (`29` §51)

| Direction | Contract |
|-----------|----------|
| Orchestrator → LI | Async dispatch after successful delivery: strategy, request type, validation attempts, competency context snapshot, recurring error reference, KPI impact flag, delivery status |
| LI → Orchestrator | **None synchronous** |
| Dependency type | **Upstream event source** |

### 17.3 Competency Engine (`19` §32)

| Direction | Contract |
|-----------|----------|
| Competency Engine → LI | Authoritative competency levels, validation events, certification prerequisite state |
| LI → Competency Engine | **None** — gap signals do not write back |
| Dependency type | **Read-only authority** for competency state |

### 17.4 Business Missions (`15`)

| Direction | Contract |
|-----------|----------|
| Business Missions → LI | Mission attempts, decisions, reflections, completion events, learning objectives |
| LI → Business Missions | **None** — no mission content or rule modification |
| Dependency type | **Primary evidence source** |

### 17.5 EduQA (`22` §24)

| Direction | Contract |
|-----------|----------|
| EduQA → LI | Validation failures, hallucination flags, professor review outcomes |
| LI → EduQA | Aggregated effectiveness signals, cohort pattern alerts, mission difficulty flags |
| Dependency type | **Mutual evidence exchange** — neither overrides the other |

### 17.6 Professor Dashboard (`11`, `08`)

| Direction | Contract |
|-----------|----------|
| LI → Professor Dashboard | Insights, intervention queue, cohort analytics, educational KPIs |
| Professor Dashboard → LI | Intervention actions, dismissals, overrides, notes |
| Dependency type | **Primary human consumer** |

### 17.7 Student Timeline (`12`)

| Direction | Contract |
|-----------|----------|
| LI → Student Timeline | Sanitized progress narrative, coaching themes, milestones |
| Student Timeline → LI | **None** — display only |
| Dependency type | **Student-safe consumer** |

### 17.8 Dependency Diagram

```text
Business Missions ──→ Evidence ──→ LEARNING INTELLIGENCE ──→ Context Enrichment ──→ Context Engine
Simulation Engine ──→ KPI evidence ──→        │                      │
Competency Engine ──→ levels ─────────→        ├──→ Professor Dashboard
Orchestrator ──→ async dispatch ──────→        ├──→ Student Timeline
EduQA ──→ quality signals ────────────→        └──→ EduQA Evidence
Professor Dashboard ──→ feedback ───────→ LEARNING INTELLIGENCE
```

---

## 18. Future Evolution Roadmap

### Phase V1 — Foundation (aligned with MVP)

- Recurring Error Registry with student-level detection  
- Basic competency gap signals (dimension vs. module target)  
- Orchestrator async dispatch consumption  
- Context Engine enrichment publication (active patterns + gaps)  
- Professor Dashboard: student insight summary, at-risk list  
- Core LI metrics and domain events  
- EduQA evidence export (basic aggregates)  

### Phase V2 — Cohort & Analytics Maturity

- Cohort aggregation with privacy thresholds  
- Mission difficulty index  
- Reflection Depth Index  
- Professor intervention feedback loop  
- Guidance effectiveness proxy metrics  
- Student Timeline narrative composer  

### Phase V3 — Adaptive Depth

- Cross-module error correlation (M3–M10)  
- Compound pattern detection (decision + KPI misinterpretation)  
- Capstone integration scoring for progress intelligence  
- Professor AI Assistant cohort summaries (professor-only)  
- EduQA closed-loop: mission difficulty → content review workflow  

### Phase V4 — Institutional Learning Memory

- Longitudinal competency velocity analytics across full program  
- Institutional error taxonomy refinement from cohort data  
- Post-course 90-day learning continuity analytics  
- Predictive at-risk modeling (always advisory, professor-confirmed)  
- Multi-cohort institutional benchmarking (admin scope)  

### Phase V5 — Advanced Educational Intelligence

- Recommendation readiness signals for M9–M10 (support, not answers)  
- Professor pedagogical effectiveness analytics  
- Adaptive mission difficulty **recommendations** to content owners (not auto-change)  
- Integration with certification framework evidence portfolios  
- Continuous EduQA calibration from LI effectiveness metrics  

**Invariant across all phases:** LI never replaces student reasoning, never alters academic judgement, never bypasses professor authority.

---

## Alignment Statement with Architecture Brief V1

This proposal **extends** Agent A’s Brief without redefining:

- LI mission as analytical, async, auditable capability  
- Component boundaries (no Coach responses, no Context assembly, no score modification)  
- Orchestrator async dispatch contract  
- Context Engine enrichment consumption model  
- EduQA and Competency Engine separation  
- AI-ARCH and LI-ARCH principle families  

Document 30 authors may translate this proposal into official standard language, Approval Gate criteria, and cross-references to `27`–`29`.

---

## Questions for Agent B — AI Platform Integration Architect

1. What async job topology on Railway best supports LI triggers (mission completion, Orchestrator dispatch, scheduled cohort aggregation) while guaranteeing dispatch-failure-is-logged-only semantics?  
2. Should LI share a worker queue with Orchestrator post-processing or operate as an isolated service with its own retry/dead-letter policy?  
3. What observability contract should LI domain events expose for platform operations — and how do they integrate with existing Railway monitoring in `21`?  
4. What read-path latency SLA should Context Publisher meet so enrichment is available before the student’s next Coach request in the same session?  
5. How should Professor Dashboard queries against LI analytics be cached or paginated without stale at-risk signals during active class sessions?  
6. What idempotency key strategy applies when Orchestrator dispatches duplicate delivery events for the same interaction?

---

## Questions for Agent C — Data & Knowledge Architect

1. Confirm the authoritative split: LI writes `identifiedGaps` and recurring error state; Context Engine reads and embeds into `CompetencyContextBlock` and `RecurringErrorBlock` — who owns freshness validation at package assembly time?  
2. Should resolved recurring errors ever appear in Context Packages under professor override — and if so, what flag travels in the enrichment contract?  
3. What minimum evidence fields must LI publish so Context Engine can satisfy CTX validation gates without additional LI queries during assembly?  
4. How should `progressionTrend` (improving | stable | declining) be computed — LI-owned exclusively, or joint with Competency Engine trend data?  
5. Does Context Engine need a snapshot version or hash of LI enrichment to detect stale packages when patterns resolve mid-session?  
6. What retention alignment is required between LI insight history and Context Engine conversation snapshot persistence (`DB-AI-004`)?

---

## Questions for Agent E — AI Governance & Security Architect

1. What minimum cohort size and aggregation rules govern cohort pattern exposure to professors vs. administrators?  
2. Which LI insight types may appear in Student Timeline summaries — and what fields must be redacted to prevent discouragement or cohort inference?  
3. What audit retention period applies to professor-dismissed patterns and false-positive records for EduQA calibration?  
4. Should at-risk classification trigger any automated notification — or remain professor-pull-only under AI-006?  
5. What role-based access matrix governs cohort exports, cross-cohort analytics, and individual insight drill-down?  
6. How do LI domain events align with `26` incident logging for hallucination pattern alerts — privacy boundaries on event payloads?

---

## Questions for Agent F — LLM Systems & Prompt Engineering Architect

1. Which Orchestrator dispatch fields (strategy, validation attempt count, fallback flag) should influence **future reasoning strategy selection** vs. remain LI-only analytics?  
2. Should recurring error `targetedReviewAreas` constrain prompt template variables in Orchestrator — or only inform Context block content consumed by existing templates?  
3. How should hallucination pattern alerts from LI feed back into EduQA regeneration constraints without creating provider-specific prompt drift?  
4. For M9–M10 recommendation support, what boundary prevents LI gap signals from leaking into prompts that approximate final capstone answers?  
5. Should guidance tier refinement based on LI `progressionTrend` be handled in Orchestrator strategy matrix or remain Context Engine `guidanceTier` derivation only?  
6. What test scenarios should Agent F prepare to verify that enriched context from LI patterns produces Coach responses that explain without answer-leak (joint EduQA + LI acceptance)?

---

**End of Learning Intelligence Domain Architecture V1**  
*Submitted for Architecture Review Board Phase 2 — pending Agent A consolidation and Document 30 authoring authorization.*

[REDACTED]