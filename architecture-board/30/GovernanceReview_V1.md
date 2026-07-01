# Governance & Security Review V1

**Issued by:** Agent E — AI Governance & Security Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 3C  
**Status:** Governance & Security Review (pre-document)  
**Inputs reviewed:** Architecture Brief V1 (Agent A), Learning Intelligence Domain Architecture V1 (Agent D), Platform Integration Review V1 (Agent B), Data & Knowledge Review V1 (Agent C), approved Documents 01–29  
**Scope:** Governance, security, privacy, responsible AI, audit, and institutional compliance only — no architecture, pedagogy, platform, or persistence redesign  

**Overall verdict:** Learning Intelligence is **governable in principle** and aligns with Enterprise Educational Intelligence security posture. Governance architecture is **conditionally approved** subject to resolution of **four blocking governance issues**, **fourteen concerns**, and adoption of the ADR validations and new governance artifacts below.

---

## Review Summary

| Classification | Count |
|----------------|-------|
| Approved | 9 areas |
| Concern | 7 areas |
| Blocking Issue | 4 areas |

---

## ADR / DAR Inventory Reviewed

| Artifact | Source | Agent E disposition |
|----------|--------|---------------------|
| **ADR-DK-001** | Agent C — Tiered Context Retrieval | **Approved with governance conditions** (see below) |
| **ADR-DK-002** | Agent C — Pull-at-Assembly LI Read Model | **Approved** |
| **ADR-DK-003** | Agent C — Competency History for Progression Trend | **Approved** |
| ADRs from Agent A | None formalized in Brief V1 | N/A |
| ADRs from Agent B | None formalized | B-01 resolved via ADR-DK-001 |
| ADRs from Agent D | None formalized | LI-GOV rules proposed; retention deferred |
| DARs proposed | None to date | Agent E proposes DAR-GOV-001, DAR-GOV-002 below |

---

## ADR Validation

### ADR-DK-001: Tiered Context Retrieval with Optional LI Enrichment

**Status: Approved with governance conditions**

**Validation**

- Preserves CTX-RULE-006: core context remains mandatory; empty enrichment arrays are valid structural blocks, not degraded packages.
- Aligns with Analyze-After-Deliver (LI-ARCH-001): LI never blocks synchronous Coach delivery.
- Does not weaken PII filtering, RBAC, or provider-boundary controls — degradation applies only to LI subsidiary retrieval, not core identity/mission/decision/competency/KPI groups.
- Required metadata (`enrichmentStatus`, `enrichmentSnapshotAt`, `enrichmentVersion`) supports audit reconstruction.

**Governance conditions (mandatory before implementation)**

1. Every `degraded_unavailable` event must emit `context.enrichment.degraded` audit event with `requestId`, `studentId`, `moduleId`, failure class — no PII beyond institutional minimum.
2. `degraded_unavailable` must **not** weaken Phase 4–6 filtering or authorization — only LI read group is skipped.
3. Operational alerting for sustained degradation must be classified per DAR-GOV-001 (not auto-escalated as security incident unless anomaly pattern detected).
4. `docs/28` §60 tiered failure policy requires explicit amendment before BUILD-005 gate — governance dependency, not rejection of ADR.

**Alternatives rejected by Agent E:** Option A (fail Coach on LI unavailability) — rejected; violates LI async contract and increases outage blast radius without security benefit.

---

### ADR-DK-002: Pull-at-Assembly LI Read Model

**Status: Approved**

**Validation**

- Single read path eliminates dual-write drift — reduces governance surface for unauthorized package mutation.
- LI never reads or writes Context Packages — CTX-RULE-001 preserved.
- Temporal lag between LI write and CE read is visible via `enrichmentSnapshotAt` — supports audit, not hidden inconsistency.
- No additional provider-boundary exposure: enrichment consumed server-side only.

**Governance note:** Professor and student consumers must remain on separate API DTOs — pull-at-assembly does not permit shared response shapes.

---

### ADR-DK-003: Competency History Required for Progression Trend

**Status: Approved**

**Validation**

- `progressionTrend` without historical competency records is not auditable — governance requires traceable derivation.
- Competency Engine must own append-only history; LI and CE read only — preserves AI-ARCH-003 and Competency Engine as scoring authority.
- LI gap inference remains advisory; history entity must not be writable by LI.

**Governance condition:** History entity access RBAC must mirror Student Competency read rules — professor cohort scope only; students see sanitized trend indicators only via approved Timeline fields.

---

## 20-Area Governance Review

### 1. Responsible AI

**Classification: Approved**

**Findings**

- LI never generates student-facing Coach language (LI-ARCH-003, Agent D §16).
- LI never invokes LLM providers — pattern taxonomy is institutional (LI-ARCH-007).
- No pathway for LI to bypass EduQA (LI-INT-004, ORCH-005).
- AI-ARCH-003 preserved: no score, certification, or competency modification.
- Analyze-After-Deliver ensures coaching precedes adaptation — provider is never source of truth.
- At-risk classification requires ≥ two independent signals (LI-PROG-002) — reduces automated labelling harm.

**Concerns:** None at governance architecture level.

---

### 2. Educational Governance

**Classification: Approved**

**Findings**

- Insights are advisory; professor retains assessment and certification authority (Brief V1 §8.7, LI-PROF-004).
- LI does not auto-modify missions, simulation rules, or content (Agent D §8.3).
- Progressive guidance tiers M1–M10 govern insight emphasis (LI-PED-004, AI-004).
- EduQA remains per-response authority; LI supplies longitudinal evidence only.
- Professor validation supersedes LI gap inference for certification (LI-PROF-004).

**Concerns**

- **C-GOV-01:** Expanded insight taxonomy (nine types vs. three in `docs/17` §49) requires EduQA review of professor-facing language for `intervention_recommendation` and `eduqa_signal` types before Doc 30 gate.

---

### 3. Privacy

**Classification: Concern**

**Findings**

- Student-level insight detail restricted to professor and authorized roles (LI-GOV-001).
- LI does not expose raw provider output as analytical primary input (Brief V1 §5.4).
- Post-course 90-day read continuity defined (LI-GOV-005, `docs/01` LB-18).
- Cross-student queries prohibited at repository level (DB-CTX-005).

**Concerns**

- **C-GOV-02:** Cohort minimum-N thresholds referenced but not numerically defined — re-identification risk in small classes.
- **C-GOV-03:** Insight retention policy explicitly deferred (LI-GOV-004) — privacy lifecycle incomplete.

**Blocking Issue**

- **B-GOV-01:** Institutional retention schedule for Learning Insights, Recurring Error Patterns, and context snapshots must be defined before schema finalization and production persistence (LI-GOV-004, C-DK-18).

---

### 4. PII Handling

**Classification: Approved with Concern**

**Findings**

- LI does not cross the provider boundary — Context Engine owns filtering (FILTER-001–008, SEC-CTX-002).
- Professor private notes excluded from provider-bound context (`docs/28` §46, FILTER-006).
- LI event payloads must exclude email, auth tokens, credentials (inherited from `docs/26`, Agent B rec #6).
- Evidence bundles for professors may include business-language decision descriptions — appropriate for authorized roles.

**Concerns**

- **C-GOV-04:** Professor evidence bundles linking Decision/Attempt IDs require explicit PII scrubbing rules for export endpoints (`docs/18` §82–83) — cohort exports must never include student identifiers below minimum-N.
- **C-GOV-05:** Timeline Narrator must not persist diagnostic labels — computed or cached read models require field allowlist (C-DK-15).

---

### 5. RBAC

**Classification: Concern**

**Findings**

- RBAC is institutional authority model (`docs/26` §22, AUTH-002).
- Context authorization precedes retrieval (SEC-CTX-001, CTX-006).
- Professor cohort scope enforced at Context Engine (`docs/28` §45).
- Student role cannot request professor-level cohort analytics.

**Concerns**

- **C-GOV-06:** No RBAC matrix exists for proposed LI insight endpoints — professor cohort scope, administrator cross-cohort access, student self-read boundaries undefined at API layer (Agent B C-11, C-13).
- **C-GOV-07:** Cross-cohort comparison restricted to institutional/admin scope (LI-COH-002) — permission model not mapped to `docs/26` role list.

**Blocking Issue**

- **B-GOV-02:** RBAC matrix for Learning Intelligence endpoints must be published before Express route implementation — required gate item for Professor Dashboard and any student timeline API.

---

### 6. Audit Trail

**Classification: Concern**

**Findings**

- LI-ARCH-006: all insights and patterns auditable with evidence references.
- LI domain events defined (Agent D §13) — institutional audit artifacts (AI-ARCH-007).
- Professor dismissals require audit reason (LI-GOV-003).
- Context operations emit mandatory audit events (`docs/28` §48).
- Orchestrator eight-phase audit chain links via `orchestrationId` (`docs/29` §55).

**Concerns**

- **C-GOV-08:** LI domain events vs. Audit Log entity mapping undefined — risk of duplicate or divergent trails (C-DK-13, Agent B C-04).
- **C-GOV-09:** Professor dismiss/resolve/override actions lack normalized persistence entity — audit replay incomplete (C-DK-14).

**Blocking Issue**

- **B-GOV-03:** Professor intervention audit requirements (reason capture, actor, timestamp, pattern/insight reference, retention class) must be specified before dismiss/resolve features ship — LI-GOV-003 cannot be enforced without persistence contract.

---

### 7. Context Filtering

**Classification: Approved**

**Findings**

- Context Engine remains sole filtering gateway — LI does not assemble packages (LI-ARCH-004).
- FILTER-005: resolved recurring error patterns excluded from student-facing packages.
- FILTER-008: assistance level cap applied at assembly.
- ADR-DK-001 degradation does not bypass filtering phases 4–6.

**Concerns:** None blocking. Enrichment empty state is valid, not unfiltered.

---

### 8. Provider Boundary

**Classification: Approved**

**Findings**

- LI never invokes providers (Agent D §16 explicit prohibition).
- LI never exposes insight data to external providers (Brief V1 §4.2).
- Enrichment reaches Orchestrator only via validated Context Package — no LI → Provider path.
- Orchestrator remains DB-free (ORCH-001) — LI cannot create synchronous provider leakage.

**Concerns:** None.

---

### 9. Prompt Governance

**Classification: Approved**

**Findings**

- Prompt templates are Agent F domain — LI does not bind or mutate templates.
- `targetedReviewAreas` and `priorityPattern` flow through Context blocks only — no supplemental LI fields at Orchestrator layer (Agent B rec #2, Agent C rec #2).
- Institutional prompt assets remain in `prompts/` — not in LI module.
- Hallucination pattern alerts are audit signals — not automatic prompt mutation without Approval Gate (Agent C rec #5).

**Concerns**

- **C-GOV-10:** EduQA regression must cover three enrichment states before production — governance test requirement for Agent F, not architectural block.

---

### 10. Professor Authority

**Classification: Approved**

**Findings**

- Professor is central decision-maker (`docs/11`); LI is advisory lens.
- Professor validation supersedes LI gap inference for certification (LI-PROF-004).
- Professor marks pattern addressed → resolves recurring error (LI-ERR-006).
- Professor dismisses false positive → suppresses with audit trail (Agent D §6.4).
- Insights cite business evidence, not generic labels (LI-PROF-003).

**Concerns:** None at principle level. Implementation depends on B-GOV-03.

---

### 11. Student Protection

**Classification: Concern**

**Findings**

- LI never auto-notifies students of at-risk status (LI-PROF-002) — **Approved**.
- Student-facing educational KPIs are motivational, not diagnostic (Agent D §10.1, LI-EKPI-001).
- No student rankings within cohort (LI-EKPI-001).
- Coach path unchanged for students — enrichment is server-side on subsequent requests.

**Concerns**

- **C-GOV-11:** Agent D §5.4 / §17.7 makes Student Timeline a direct LI consumer; Brief V1 §8.8 states V1 integration is **indirect** — governance must enforce separate sanitized DTOs and defer Timeline Narrator to V2 unless Brief is formally amended (Agent B C-01, R-PI-06).
- **C-GOV-12:** `intervention_recommendation` insight type must never surface in student APIs — type-level blocklist required.

---

### 12. Cohort Privacy

**Classification: Blocking Issue**

**Findings**

- Cohort exports respect minimum aggregation thresholds — principle stated (LI-GOV-002, LI-COH-001).
- Individual identity visible only to authorized professor roles — not in anonymized exports (Agent D §7.3).
- Cross-cohort comparison is admin scope (LI-COH-002).
- Cohort intelligence informs pedagogical planning, not student ranking (LI-COH-003).

**Blocking Issue**

- **B-GOV-04:** Minimum cohort size **N** for `cohort_pattern` insight persistence and API exposure is undefined. Without institutional thresholds, small-class re-identification is a privacy violation. Agent E approval was explicitly required (LI-COH-001, Brief R-LI-06) — **must be set before cohort_pattern insights are persisted or exposed**.

**Recommended thresholds (ADR-GOV-001):** N ≥ 5 for professor-facing cohort analytics; N ≥ 10 for exportable anonymized cohort reports; suppress individual attribution in heatmaps when active cohort size < N.

---

### 13. Professor Dashboard Security

**Classification: Concern**

**Findings**

- Professor Dashboard consumes read-only insight APIs — not Context Packages (Brief V1 §8.7).
- Full evidence visible to professor; students see sanitized summaries (LI-PROF-001, AI-006).
- API-AI-001/002 must enforce at route layer even for analytics endpoints (Agent B §10).

**Concerns**

- **C-GOV-13:** Dashboard read failures should degrade to empty insight state — not 500 cascade (Agent B C-16).
- **C-GOV-14:** Intervention queue exposes composite risk scores — must not be cacheable or loggable with cross-student identifiers in Railway logs.

---

### 14. Student Timeline Security

**Classification: Concern**

**Findings**

- Timeline is read projection — no LI write path (Agent C §14).
- Student-safe summaries: coaching themes, milestones, competency narrative — not diagnostic internals (Agent D §5.4).
- LI-GOV-001/005 govern access during post-course period.

**Concerns**

- **C-GOV-15:** Field allowlist for student-visible LI-derived content not published — blocks safe Timeline Narrator implementation (C-DK-15).
- **C-GOV-16:** Prohibit persistent storage of labels: `at_risk`, `occurrenceCount`, `cohort_pattern`, `intervention_recommendation`, raw error type codes in student-visible fields.

**Governance readiness:** V1 indirect timeline — **Approved**. V2 Timeline Narrator — **Not ready** until ADR-GOV-003 allowlist adopted.

---

### 15. Context Package Governance

**Classification: Approved with Concern**

**Findings**

- Only validated Context Packages enter reasoning pipeline (ORCH-RULE-001).
- LI enriches via persisted state read at CE assembly — no package mutation (ADR-DK-002).
- `contextHash` integrity verified before provider invocation.
- Enrichment versioning proposed (`enrichmentVersion`, C-DK-09).

**Concerns**

- **C-GOV-17:** Mid-session pattern resolution vs. stale package — metadata contract must be enforced at Orchestrator Phase 2 verification when implemented.
- **C-GOV-18:** `docs/28` §60 requires amendment to codify ADR-DK-001 tiered policy — governance traceability gap until doc update approved.

---

### 16. Incident Response

**Classification: Concern**

**Findings**

- Security validation failure blocks delivery and triggers incident log (`docs/29` §57).
- Hallucination spike → tighten validation, review context quality.
- Rate limit abuse → temporary student lock, professor notification.
- LI analysis failure → logged only — no student impact (LI-INT-005).
- Incident response follows `docs/21` and `docs/26` (Brief V1, `docs/27` §54).

**Concerns**

- **C-GOV-19:** `degraded_unavailable` enrichment failure classification (operational vs. security) undefined — Agent C flagged for Agent E review.
- **C-GOV-20:** In-process event loss on Railway restart (Agent B C-14) — operational incident, not security — but reconciliation job absence extends audit gap window.

---

### 17. Operational Governance

**Classification: Concern**

**Findings**

- LI metrics extend `docs/27` §31 — institutional purpose, not provider optimization.
- Async processing failure does not affect delivered responses (LI-007).
- Railway monolith V1 compatible; no separate service required.
- Approval Gate pattern from `docs/29` §72 referenced for Doc 30.

**Concerns**

- **C-GOV-21:** Unified log schema for LI + Orchestrator + CE not specified (Agent B C-20).
- **C-GOV-22:** Alert thresholds for async lag, false-positive rate, dispatch consumption — required before production Activation Gate.
- **C-GOV-23:** Token budget and rate limits apply to Coach ingress (`docs/29` §39) — LI queue depth monitoring needed at scale (Agent B C-19).

---

### 18. Retention Policies

**Classification: Blocking Issue**

**Findings**

- Audit Log append-only, never deleted (`docs/17` §58, §66).
- Business learning records immutable (`docs/17` §68).
- Context snapshot retention follows institutional policy (`docs/28` §48 → `docs/26` §33).
- LI-GOV-004 explicitly deferred to Agent E.

**Blocking Issue**

- **B-GOV-01 (recurrence):** Retention schedules for Learning Insights, Recurring Error Patterns, professor dismiss records, and context snapshots must be defined and aligned before Prisma migration. Audit Log permanence vs. operational log rotation must be distinguished.

**Proposed retention (ADR-GOV-002 — subject to institutional leadership confirmation):**

| Data class | Retention | Rationale |
|------------|-----------|-----------|
| Audit Log (LI events) | Permanent | Institutional accountability |
| Active Recurring Error Patterns | Life of enrollment + 90 days post-course | Enrichment + professor review |
| Resolved/superseded insights | 7 years or institutional academic record policy | EduQA longitudinal review |
| Context snapshots (DB-AI-004) | Align with AI Conversation retention | Audit reconstruction |
| Professor dismiss/intervention records | Permanent (audit class) | LI-GOV-003, calibration evidence |
| Operational LI metrics (Railway logs) | 90 days | Operations playbook alignment |

---

### 19. Compliance

**Classification: Concern**

**Findings**

- AI Governance structure defined (`docs/27` §56–57).
- Security Gate includes Platform Administrator + Security Review (`docs/29` §72).
- BUILD-005: failed gate keeps phase open.
- DATA-004: retention policies shall be formally documented.
- EduQA mandatory before student delivery — LI does not create bypass.

**Concerns**

- **C-GOV-24:** Doc 30 Approval Gate security section not yet pre-filled — Agent G consolidation pending.
- **C-GOV-25:** `docs/18` has no Learning Intelligence endpoint section — compliance gap for API auth documentation before production insight APIs.
- **C-GOV-26:** Schema authority drift (`docs/17` vs. Agent D taxonomy) — compliance with source-of-truth hierarchy blocked until B-DK-02 resolved (Agent C — not governance rejection, but gate dependency).

---

### 20. Governance Risks

**Classification: Concern**

| ID | Risk | Severity | Classification | Mitigation |
|----|------|----------|----------------|------------|
| R-GOV-01 | Undefined cohort minimum-N | High | **Blocking** | ADR-GOV-001 |
| R-GOV-02 | Undefined insight/snapshot retention | High | **Blocking** | ADR-GOV-002, B-GOV-01 |
| R-GOV-03 | Professor dismiss without auditable persistence | High | **Blocking** | B-GOV-03, ADR-GOV-004 |
| R-GOV-04 | LI insight API RBAC undefined | High | **Blocking** | B-GOV-02 |
| R-GOV-05 | Student Timeline diagnostic leakage | Medium | Concern | ADR-GOV-003 |
| R-GOV-06 | Dual audit trail (domain events vs Audit Log) | Medium | Concern | DAR-GOV-002 |
| R-GOV-07 | Small-class re-identification via cohort heatmaps | High | **Blocking** | B-GOV-04 |
| R-GOV-08 | Degraded enrichment masked as empty_valid | Medium | Concern | ADR-DK-001 metadata enforcement |
| R-GOV-09 | Circular feedback reinforcing biased guidance | Medium | Concern | EduQA longitudinal review (Brief R-LI-10) |
| R-GOV-10 | Export endpoints exposing insight PII | Medium | Concern | Export RBAC + minimum-N |
| R-GOV-11 | Async event loss audit gap | Medium | Concern | Reconciliation job (Agent B C-14) |
| R-GOV-12 | Insight taxonomy expansion without EduQA language review | Low | Concern | C-GOV-01 |

Brief V1 risks R-LI-01–R-LI-12: **accepted and tracked** — none additional at governance layer beyond R-GOV register.

---

## New Architecture Decision Records (Proposed)

### ADR-GOV-001: Cohort Minimum Aggregation Thresholds

| Field | Value |
|-------|-------|
| **Status** | Recommended — **blocking for cohort_pattern features** |
| **Context** | B-GOV-04, LI-COH-001, Brief R-LI-06 |
| **Decision** | No `cohort_pattern` insight persisted or exposed via API unless active cohort enrollment ≥ **N=5** (professor views) / **N=10** (exports and heatmaps). Below N: insights stored at student level only; cohort aggregates suppressed. |
| **Consequences** | Small-class privacy protected; professor may see individual student insights within cohort scope; cohort analytics delayed until threshold met. |
| **Alternatives rejected** | N=1 (re-identification risk); admin-only override without audit (governance gap). |

---

### ADR-GOV-002: Learning Intelligence Retention Schedule

| Field | Value |
|-------|-------|
| **Status** | Recommended — **blocking for schema finalization** |
| **Context** | B-GOV-01, LI-GOV-004, C-DK-18 |
| **Decision** | Adopt retention table in §18 above; Audit Log and professor intervention records permanent; active patterns life-of-enrollment + 90 days; resolved insights 7-year academic policy window. |
| **Consequences** | Schema must support status transitions without hard delete of audit evidence; archival strategy required for snapshot volume (C-DK-12). |
| **Alternatives rejected** | Indefinite retention of all insights (storage/privacy); delete on resolve (breaks EduQA longitudinal review). |

---

### ADR-GOV-003: Student Timeline Field Allowlist

| Field | Value |
|-------|-------|
| **Status** | Recommended — **blocking for V2 Timeline Narrator** |
| **Context** | C-GOV-15, C-DK-15, Agent B C-01 |
| **Decision** | Student-visible LI-derived fields limited to: mission milestones, reflection completion flags, competency growth **direction** (improving/stable — not gap labels), coaching **theme summaries** (business language), certification progress from Competency Engine. **Prohibited:** `at_risk`, `occurrenceCount`, error type codes, `cohort_pattern`, `intervention_recommendation`, cross-student comparisons, professor notes. |
| **Consequences** | Timeline Narrator must use dedicated DTO; no shared types with professor insight APIs. |
| **Alternatives rejected** | Shared insight DTO with frontend filtering (unsafe — client-side bypass). |

---

### ADR-GOV-004: Professor Intervention Audit Requirements

| Field | Value |
|-------|-------|
| **Status** | Recommended — **blocking for dismiss/resolve features** |
| **Context** | B-GOV-03, LI-GOV-003, C-DK-14 |
| **Decision** | Every professor action on LI state (dismiss, resolve, mark addressed, override constraint) persists: `actorId`, `timestamp`, `action`, `targetInsightOrPatternId`, **mandatory reason text**, `cohortId`, `studentId`. Records are append-only Audit Log class with permanent retention. |
| **Consequences** | Requires Professor Intervention entity or Audit Log extension; Agent C schema alignment needed — governance requirement, not persistence redesign by Agent E. |
| **Alternatives rejected** | Soft-delete patterns without reason (LI-GOV-003 violation); in-memory dismiss only (non-auditable). |

---

## New Decision Analysis Records (Proposed)

### DAR-GOV-001: Degraded Enrichment Incident Classification

| Field | Value |
|-------|-------|
| **Question** | Is `enrichmentStatus = degraded_unavailable` an operational or security incident? |
| **Analysis** | Isolated LI query timeout/DB error on subsidiary retrieval is **operational (Medium)** — alert operations, do not block Coach. Sustained degradation across cohorts (>15 min) → **High operational**. Cross-student data in enrichment response → **Critical security**. Repeated failures with authorization anomalies → **Critical security**. |
| **Recommendation** | Classify by failure taxonomy in audit event; security incident only on data integrity or auth anomaly — not on LI unavailability alone. |

---

### DAR-GOV-002: LI Domain Events to Audit Log Mapping

| Field | Value |
|-------|-------|
| **Question** | Should LI domain events duplicate Audit Log entries? |
| **Analysis** | Dual streams create divergent trails (C-DK-13). Institutional accountability requires single reconstructable chain. |
| **Recommendation** | LI domain events (`learning.insight.created`, etc.) emit **both** structured operational metrics AND append-only Audit Log record with unified schema `{ service: 'learning_intelligence', event, orchestrationId?, studentId, moduleId, insightId?, actorId?, timestamp }`. Operational stream for dashboards; Audit Log for compliance. Professor dismiss/resolve → Audit Log only (permanent class). |

---

## Governance Recommendations

1. **Adopt ADR-DK-001, ADR-DK-002, ADR-DK-003** as binding with stated governance conditions.
2. **Adopt ADR-GOV-001 through ADR-GOV-004** before Doc 30 Approval Gate security sign-off.
3. **Resolve B-GOV-01 through B-GOV-04** in Document 30 §Governance section — do not defer to implementation.
4. **Amend `docs/28` §60** (user-approved doc change) to codify tiered retrieval failure policy — required for BUILD-005 traceability.
5. **Extend `docs/18`** with Learning Intelligence endpoint group under professor RBAC — security documentation gate.
6. **Separate API DTOs** for professor insights vs. student timeline — enforce at TypeScript contract layer with Agent G boundary lint rules.
7. **EduQA gate:** Add three enrichment state scenarios to mandatory regression before LI production activation.
8. **Export controls:** Apply minimum-N to all `docs/18` export paths touching LI aggregates.
9. **Confirm LI-GOV-003** enforcement via ADR-GOV-004 before Professor Feedback Integrator ships.
10. **Track C-GOV-01** through EduQA specialist review of expanded insight taxonomy language.

---

## Recommendations to Agent F — LLM Systems & Prompt Engineering Architect

1. **EduQA regression suite must cover three enrichment states** (`enriched`, `empty_valid`, `degraded_unavailable`) — confirm no answer-leak regression when enrichment absent (Agent C rec #3).
2. **Prompt templates must not branch on `degraded_unavailable` metadata** to weaken constraints — metadata is audit/telemetry only.
3. **Treat empty `identifiedGaps` and empty `priorityPattern` identically to populated** for structure — no assumption of non-empty enrichment blocks.
4. **`targetedReviewAreas` binds to Context block content only** — no Orchestrator-layer LI field injection.
5. **`guidanceTier` remains CE-owned** — `progressionTrend` informs emphasis within tier only; no strategy override on degraded enrichment.
6. **Hallucination pattern alerts from LI** feed EduQA constraint **review queue** — not automatic prompt mutation without Approval Gate evidence.
7. **M9–M10 capstone scenarios** with active recurring errors must pass answer-leak suite before Doc 30 production gate.
8. **Institutional fallback templates** remain pre-approved — LI failure never triggers provider-generated fallback text.

---

## Questions for Agent G — Principal Engineering Reviewer

1. **BUILD-005 dependency:** Does ADR-DK-001 require explicit `docs/28` amendment before Context Engine implementation merges, or can Doc 30 codify tiered policy pending user-approved doc update?
2. **Governance gate ordering:** Are B-GOV-01 (retention) and B-GOV-04 (cohort N) **blocking for Document 30 approval** or deferrable to first Prisma migration PR with documented interim policy?
3. **Professor Intervention entity:** Is ADR-GOV-004 in MVP scope per `docs/20`, or acceptable as V1.1 gate if dismiss/resolve UI deferred?
4. **ESLint boundary enforcement:** Should `no-restricted-imports` blocking Orchestrator → Prisma and React → `services/ai/learning-intelligence/*` be Definition-of-Complete for LI vertical slice?
5. **Approval Gate evidence:** What test artifacts prove RBAC matrix compliance for insight endpoints — integration tests per role, or security test suite minimum?
6. **Audit Log mapping:** Does DAR-GOV-002 dual-write pattern satisfy BUILD-001 documentation requirements, or is a dedicated audit schema migration required in MVP?
7. **Reconciliation job:** Is LI async backfill required for V1 Approval Gate given in-process event bus (Agent B Q7), or acceptable operational hardening with logged gap acceptance?
8. **Doc 30 gate structure:** Will LI Approval Gate mirror `docs/29` §72 with explicit **Security Gate** row requiring Agent E sign-off before institutional review?

---

## Governance Readiness

| Dimension | Readiness |
|-----------|-----------|
| Responsible AI boundaries | **Ready** |
| Educational governance / professor authority | **Ready** |
| Provider boundary / no LLM in LI | **Ready** |
| Context filtering inheritance | **Ready** |
| Prompt governance separation | **Ready** |
| ADR-DK-001/002/003 governance validation | **Ready** (with conditions on ADR-DK-001) |
| RBAC for insight APIs | **Not ready** — B-GOV-02 |
| Retention policy | **Not ready** — B-GOV-01 |
| Cohort privacy thresholds | **Not ready** — B-GOV-04 |
| Professor intervention audit | **Not ready** — B-GOV-03 |
| Student Timeline allowlist | **Partial** — V1 ready; V2 not ready |
| Audit trail unification | **Partial** — DAR-GOV-002 |
| Incident classification | **Partial** — DAR-GOV-001 |
| API security documentation | **Not ready** — `docs/18` gap |
| Compliance / Approval Gate pre-fill | **Partial** |

**Governance Readiness: Conditionally Ready (~72%)**

Document 30 may proceed on domain architecture. **Governance Approval Gate must not pass** until B-GOV-01 through B-GOV-04 are resolved and ADR-GOV-001 through ADR-GOV-004 are adopted.

---

## Overall Verdict

**Conditionally Approved — governance architecture is sound; four blocking items must resolve before institutional sign-off.**

Learning Intelligence is **safe, auditable, and privacy-preserving in architectural intent**. Agent A, Agent D, Agent B, and Agent C inputs are **compatible with institutional governance** once:

1. **Retention schedules are defined** (B-GOV-01 / ADR-GOV-002).
2. **Cohort minimum-N thresholds are set** (B-GOV-04 / ADR-GOV-001).
3. **RBAC matrix for insight endpoints is published** (B-GOV-02).
4. **Professor intervention audit persistence is specified** (B-GOV-03 / ADR-GOV-004).

**ADR-DK-001:** Approved with governance conditions.  
**ADR-DK-002:** Approved.  
**ADR-DK-003:** Approved.

The provider is not and cannot become the source of truth. LI operates entirely within institutional boundaries — no LLM invocation, no score modification, no Context Package assembly, no EduQA bypass. Governance gaps are **policy and enforcement completeness**, not architectural rejection.

**Agent E sign-off:** Governance & Security architecture **validated**. Proceed to Document 30 authoring with ADR-GOV-001–004 and DAR-GOV-001–002 incorporated. **Production activation blocked** until blocking items close and Agent G consolidates Approval Gate with explicit Security Gate pass.

---

**End of Governance & Security Review V1**  
*Submitted for Architecture Review Board Phase 3C — Learning Intelligence governance conditionally approved, pending resolution of four blocking governance issues.*

[REDACTED]