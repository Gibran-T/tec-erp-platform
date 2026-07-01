# Platform Integration Review V1

**Issued by:** Agent B — AI Platform & Integration Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 3  
**Status:** Platform Integration Review (pre-document)  
**Inputs reviewed:** Architecture Brief V1 (Agent A), Learning Intelligence Domain Architecture V1 (Agent D), approved Documents 01–29  
**Scope:** Platform integration only — educational model not redesigned  

**Overall verdict:** Learning Intelligence **can be integrated** into the existing TEC.ERP architecture without violating enterprise principles. Integration is **approved in principle**, subject to resolution of **two blocking issues** and **eleven concerns** documented below.

---

## Review Summary

| Classification | Count |
|----------------|-------|
| Approved | 12 areas (partial or full) |
| Concern | 11 items across areas |
| Blocking Issue | 2 items |

Agent D’s domain proposal **extends** Architecture Brief V1 consistently: async placement, ORCH-001 preservation, Context Engine enrichment path, Competency Engine read-only boundary, and Analyze-After-Deliver philosophy align with `docs/27`–`29`. Platform gaps are **contract and operational**, not architectural rejection.

---

## 1. Component Integration

**Classification: Approved with Concerns**

**Findings**

- LI placement as Application Layer peer (`LearningIntelligenceService`) matches Brief V1 §4.3 and `docs/13` six-layer model.
- Integration topology is coherent:

```text
Orchestrator ──async──▶ LI ──persist──▶ PostgreSQL
                            │
                            ▼ (read at assembly)
                      Context Engine ──▶ Orchestrator ──▶ AI Coach
                            ▲
Professor Dashboard / Student Timeline (read APIs)
```

- Agent D’s twelve internal domain services map cleanly to a single Express-hosted module with internal sub-services — no cross-layer leakage detected.
- Loop 2 closure (LI → Context enrichment → improved guidance) is platform-compatible with existing Context Engine and Orchestrator contracts.

**Concerns**

- **C-01:** Agent D expands Student Timeline to a direct LI consumer (`Timeline Narrator`). Brief V1 §8.8 states V1 timeline integration is **indirect**; student-facing LI surfacing requires explicit governance. Platform must treat Timeline as a **read API consumer**, not a write path into LI.
- **C-02:** Multiple async triggers (Orchestrator dispatch, mission completion, reflection submission, professor action, scheduled cohort aggregation) increase integration surface. Trigger registry and priority ordering are undefined at platform level.

---

## 2. Service Boundaries

**Classification: Approved**

**Findings**

- LI-ARCH-001 through LI-ARCH-008 (Agent D) and LI-001 through LI-012 (Brief V1) reinforce existing boundaries:
  - Orchestrator: no Prisma (ORCH-001) ✓
  - Context Engine: sole reasoning gateway (CTX-RULE-001) ✓
  - AI Coach: no direct LI runtime reads ✓
  - Competency Engine: read-only to LI ✓
- Agent D §16 explicit out-of-scope table correctly delegates Context assembly (C), prompts (F), Coach delivery (Orchestrator/Coach), EduQA execution, and scoring to their owners.
- No boundary violation detected where LI would invoke providers, assemble context packages, or modify scores.

**Concerns**

- **C-03:** `Context Publisher` (Agent D §12) vs Context Engine retrieval responsibility is ambiguous: who initiates enrichment reads — CE at `buildContext()` time or LI push? Both are compatible; platform must pick **one authoritative read model** to avoid dual-write/dual-read drift.

---

## 3. Internal Service Responsibilities

**Classification: Approved with Concerns**

**Findings**

- Agent D’s internal service decomposition (Evidence Collector → Pattern Analyzer → Insight Manager → Context Publisher, etc.) respects single-responsibility and keeps synchronous paths out of LI.
- Separation of Recurring Error Registry, Competency Gap Analyzer, Cohort Aggregator, and Professor Intelligence Composer supports independent testing and future extraction.

**Concerns**

- **C-04:** `EduQA Evidence Exporter` and `Analytics Calculator` overlap with `docs/27` §31 metrics and EduQA pipeline. Platform should define a **single metrics emission point** to avoid duplicate observability streams.
- **C-05:** `Professor Feedback Integrator` receives write events from Professor Dashboard — requires Express route ownership clarification (Coach module vs LI module vs shared application facade).

---

## 4. Dependency Graph

**Classification: Approved with one Blocking Issue**

**Findings**

- Dependency direction is acyclic for synchronous paths:

```text
Business Missions / Simulation / Competency Engine
         │ (read)
         ▼
   Learning Intelligence ──write──▶ Insight / Pattern entities
         │ (read at CE assembly)
         ▼
   Context Engine ──▶ Orchestrator (no reverse sync to LI)
```

- LI → Orchestrator: none (correct).
- Orchestrator → LI: async only (matches `docs/29` §51).
- LI → Context Engine: enrichment supply via persisted state, not package mutation (matches `docs/28` §249).

**Blocking Issue**

- **B-01: Context Engine enrichment failure policy undefined.**  
  `docs/28` mandates context build failure blocks reasoning (CTX-RULE-006). If LI read fails during Context Engine assembly (timeout, DB error, schema mismatch), platform must define:
  - **Option A:** Fail context build (strict — blocks Coach).
  - **Option B:** Degrade gracefully — assemble package without LI blocks, flag `metadata.liEnrichmentUnavailable`.  
  Brief V1 and Agent D assume enrichment is valuable but not explicitly classified as mandatory vs optional. **This must be decided before implementation** — it affects Express error handling, React UX, and SLA design.

**Concerns**

- **C-06:** LI and Context Engine both perform heavy Prisma reads against overlapping entities (Mission Attempt, Decision, KPI, AI Message). Platform should coordinate query patterns to avoid N+1 duplication and connection pool pressure.

---

## 5. Event Flow

**Classification: Approved with Concerns**

**Findings**

- Primary sync path unchanged: React → Express routes → AiCoachService → Context Engine → Orchestrator → EduQA → persist → response.
- Post-delivery async path matches `docs/29` §51 Phase 8: Orchestrator `FeedbackDispatcher` → LI Evidence Collector.
- Agent D §13 domain events (`learning.insight.created`, `learning.recurring_error.registered`, etc.) provide institutional audit continuity (AI-ARCH-007).

**Concerns**

- **C-07:** Two event layers proposed — Orchestrator platform events (`orchestration.feedback.dispatched`) and LI domain events (`learning.*`). Platform must define **event ownership**: platform bus carries transport; LI emits domain events after persistence — not before.
- **C-08:** Event ordering across triggers (Orchestrator dispatch vs mission completion batch) can produce race conditions on pattern merge. Idempotency and sequence numbers required (Brief R-LI-11).

---

## 6. Railway Deployment Compatibility

**Classification: Approved with Concerns**

**Findings**

- V1 LI deploys embedded in Express monolith on Railway — consistent with `docs/29` §60 (no separate Railway service required for Orchestrator) and Brief V1 §7.3.
- LI-012 / Analyze-After-Deliver aligns with Railway HTTP timeout constraints (Coach response not blocked by analysis).
- Async work via in-process queue + `setImmediate`/worker thread or deferred job table is Railway-compatible for MVP scale.

**Concerns**

- **C-09:** `docs/25` contains no background worker guidance. Scheduled cohort aggregation (Agent D §8.4) needs a **Railway-cron or internal scheduler** decision before V2 cohort features.
- **C-10:** Process crash between Orchestrator dispatch and LI persistence loses events unless queue is durable. V1 in-process bus is acceptable with **logged loss + reconciliation job**; must be documented in operations playbook (`docs/21`).

---

## 7. Express Integration

**Classification: Approved with Concerns**

**Findings**

- `LearningIntelligenceService` registers in Application Layer composition root alongside Context Engine, Orchestrator, AiCoachService — matches `docs/27` §43 structure extended with LI module.
- Routes remain thin: guidance routes delegate to AiCoachService only; LI is not mounted as a direct guidance handler.
- Professor Dashboard consumes **separate read APIs** — correct separation from Coach pipeline.

**Concerns**

- **C-11:** Professor feedback write path (dismiss pattern, mark addressed) needs Express routes under professor RBAC (`docs/26`). Route group not present in `docs/18` — high-level API gap, not a boundary violation.

---

## 8. React Integration Points

**Classification: Approved with Concerns**

**Findings**

- Student Coach UI unchanged: React triggers `/api/v1/ai/*` guidance endpoints only; LI enrichment arrives server-side via Context Engine on subsequent requests — no client LI coupling.
- Professor Portal (`docs/11`, `docs/16`) consumes insight summaries via dedicated APIs — aligns with AI-006.
- Loading states for Coach remain tied to sync pipeline; LI does not extend client wait time.

**Concerns**

- **C-01 (recurrence):** Student Timeline narrative from `Timeline Narrator` requires React components consuming a **sanitized read API** — distinct from professor insight APIs. UI must not expose `occurrenceCount`, cohort comparisons, or diagnostic labels (Agent D §5.4 vs Brief V1 §8.8 tension).

---

## 9. TypeScript Contract Strategy

**Classification: Approved with Concerns**

**Findings**

- Three contract layers remain valid:
  1. **`src/types/ai/`** — cross-boundary: `OrchestratorDispatchPayload`, `LiEnrichmentSnapshot`, `AIContextPackage` blocks (`RecurringErrorBlock`, `identifiedGaps`).
  2. **Service-internal types** — LI analysis models, detection rule configs.
  3. **API DTOs** — professor insight responses, timeline summaries (client-safe subsets).
- Strict mode, no `any`, discriminated unions for insight types — aligned with `docs/19` §36 and `docs/27` §45.

**Concerns**

- **C-12:** Enrichment contract versioning (Brief R-LI-07): `recurringErrorContext` and `competencyContext.identifiedGaps` need a **`enrichmentVersion` or snapshot hash** on Context Engine side so mid-session pattern resolution does not produce stale packages. Agent C must confirm field semantics; platform recommends version stamp on LI enrichment read.

---

## 10. API Implications (High Level)

**Classification: Concern**

**Findings**

- Existing `docs/18` §38–42 covers Coach conversations, messages, and guidance — **sufficient for Loop 1 and Loop 2 enrichment path** (enrichment is server-side, not client-facing).
- LI requires **new endpoint groups** (business-oriented, not in current spec):
  - Professor: student insights, intervention queue, cohort analytics, pattern dismiss/resolve.
  - Optional: student timeline narrative (sanitized).
  - Internal: health/metrics for operations.

**Concerns**

- **C-13:** API spec gap — `docs/18` has no Learning Intelligence section. Not blocking architecture approval; **blocks Doc 30 Approval Gate** until Agent A/C/G align API additions with business-first naming (`/api/v1/insights/*`, `/api/v1/cohorts/{id}/learning-analytics`, etc.).
- All insight endpoints must enforce API-AI-001/002 (AI never changes scores/certifications) at route layer even though LI is read/analytics oriented.

---

## 11. Async Processing Model

**Classification: Approved**

**Findings**

- Analyze-After-Deliver (Brief V1 §9) is the correct async model for Railway monolith V1.
- Trigger taxonomy (Agent D §8.4) correctly marks all LI triggers as non-blocking.
- Dispatch failure = logged only (`docs/29` §51, LI-007, LI-INT-005) — preserves student experience.
- Internal retry for LI analysis is permitted; must not propagate to Coach response path.

**Concerns**

- None at architecture level. Operational retry/backoff policy deferred to implementation under Agent G evidence requirements.

---

## 12. Event Bus Considerations

**Classification: Concern**

**Findings**

- V1 recommendation: **in-process typed event bus** at Application Layer (`AiEventBus`) for Orchestrator → LI handoff; LI emits domain events post-persistence.
- Agent D §13 events align with audit requirements (`docs/27` §56, `docs/29` §55).

**Concerns**

- **C-14:** In-process bus is not durable across Railway restarts. Acceptable for V1 with:
  - Idempotent consumers keyed on `orchestrationId` + trigger type.
  - Periodic reconciliation job (mission completion backfill).
  - Dead-letter log table for failed analysis.
- **C-15:** Shared bus vs isolated LI queue — Brief Agent D Question 2. **Recommendation:** Isolated LI processing queue fed by platform bus adapter; Orchestrator post-processing must not share retry policy with LI analysis failures.

---

## 13. Failure Isolation

**Classification: Approved with one Blocking Issue**

**Findings**

- LI analysis failure does not affect delivered Coach responses — confirmed across Brief, Agent D, `docs/29` §51.
- Orchestrator remains DB-free under LI integration — ORCH-001 preserved.
- EduQA validation path independent of LI — no circular failure dependency.

**Blocking Issue**

- **B-01 (recurrence):** Context Engine behavior when LI enrichment read fails — must be resolved (see §4).

**Additional concern**

- **C-16:** Professor Dashboard read failures should degrade to empty insight state with institutional message — not 500 cascade affecting portal navigation. Separate failure domain from Coach.

---

## 14. Performance Considerations

**Classification: Concern**

**Findings**

- Context Engine SLA ≤ 3000ms P95 (`docs/28`); Orchestrator ≤ 20000ms P95 (`docs/29`). LI must not extend either synchronous path.
- LI async processing lag is a domain metric (Agent D §11) — appropriate.

**Concerns**

- **C-17:** Same-session enrichment freshness (Agent D Question 4, Brief R-LI-08): student may request second Coach interaction before LI completes post-delivery analysis. **Accepted platform behavior** — enrichment applies on next successful analysis cycle; must be documented in UX (not a performance defect).
- **C-18:** Context Engine LI read at every `buildContext()` must use indexed queries + optional enrichment cache (TTL ≤ 30s per student/module) to protect P95 context SLA.
- **C-06 (recurrence):** Duplicate Prisma reads between CE and LI evidence collection — batch or shared read repository recommended at platform level.

---

## 15. Scalability Considerations

**Classification: Approved**

**Findings**

- V1 monolith supports institutional MVP cohort sizes on Railway PostgreSQL.
- LI internal service decomposition and async-only write path allow horizontal scaling path: extract LI to dedicated worker service consuming persistent queue without changing Orchestrator or Context Engine contracts.
- Cohort aggregation (scheduled, batch) scales independently of sync Coach path.

**Concerns**

- **C-19:** High-frequency Coach usage generates proportional async LI jobs. Token budget and rate limits (`docs/29` §39) cap ingress; LI queue depth monitoring required at scale.

---

## 16. Observability Considerations

**Classification: Concern**

**Findings**

- Agent D §11 LI metrics extend `docs/27` §31 appropriately.
- Domain events provide audit trail for insight lifecycle.
- Orchestrator audit chain (`orchestration.feedback.dispatched`) links to LI via `orchestrationId`.

**Concerns**

- **C-20:** Integration with `docs/21` Platform Operations Playbook not specified — need unified log schema: `{ service, event, orchestrationId, studentId, moduleId, insightId, durationMs }`.
- **C-21:** Alert thresholds for async lag, false-positive rate, and dispatch consumption rate must be defined before production Activation Gate — operational concern, not architectural block.

---

## 17. Future Microservice Readiness

**Classification: Approved**

**Findings**

- Clean extraction boundaries identified:
  - **Stays in monolith V1:** Orchestrator, Context Engine, AiCoachService, EduQA.
  - **Extractable V2+:** LearningIntelligenceService + Cohort Aggregator as Railway worker with PostgreSQL queue (e.g., `li_processing_jobs` table).
- Contracts that must remain stable for extraction: `OrchestratorDispatchPayload`, LI enrichment read API (internal), professor insight REST DTOs.
- Agent D phased roadmap (V1–V5) compatible with incremental platform evolution without educational model change.

**Concerns**

- None blocking. Event bus adapter pattern should be chosen now to ease worker extraction later.

---

## 18. Platform Risks

**Classification: Concern (consolidated register)**

| ID | Risk | Source | Classification | Platform mitigation direction |
|----|------|--------|----------------|------------------------------|
| R-PI-01 | CE enrichment failure policy undefined | §4 B-01 | **Blocking** | Define mandatory vs optional LI blocks; implement degrade flag |
| R-PI-02 | Enrichment contract version drift | Brief R-LI-07 | Concern | `enrichmentVersion` on CE read; Agent C gate |
| R-PI-03 | Duplicate Orchestrator dispatch events | Brief R-LI-11 | Concern | Idempotency on `orchestrationId` |
| R-PI-04 | In-process event loss on crash | §12 | Concern | Reconciliation job + dead-letter table |
| R-PI-05 | API spec gap for insight endpoints | §10 | Concern | Doc 18 extension in Doc 30 phase |
| R-PI-06 | Student Timeline vs professor-only insight boundary | C-01 | Concern | Separate sanitized DTOs; Agent E gate |
| R-PI-07 | Context Publisher read model ambiguity | C-03 | Concern | CE pull-at-assembly as V1 standard |
| R-PI-08 | DB read amplification CE + LI | C-06 | Concern | Shared read patterns / indexing review |
| R-PI-09 | Same-session stale enrichment UX | C-17 | Concern | Document expected async delay |
| R-PI-10 | Scheduled cohort jobs on Railway | C-09 | Concern | Cron worker or pg-boss scheduler V2 |

Brief V1 risks R-LI-01 through R-LI-12 are **accepted and tracked**; none additional at platform level beyond R-PI register.

---

## Integration Decision

| Question | Answer |
|----------|--------|
| Can LI integrate without violating enterprise principles? | **Yes** |
| Does integration preserve ORCH-001, CTX boundaries, AI-ARCH-003, EduQA gate? | **Yes** |
| Are Brief V1 and Agent D domain proposal platform-compatible? | **Yes, with noted concerns** |
| Proceed to Document 30 authoring? | **Yes**, after B-01 resolution and Agent C enrichment contract confirmation |

---

## Recommendations to Agent C — Data & Knowledge Architect

1. **Resolve B-01:** Specify whether `recurringErrorContext` and `competencyContext.identifiedGaps` are **mandatory** or **best-effort** blocks during Context Engine assembly, and the exact HTTP/Coach behavior when LI is unavailable.
2. **Adopt pull-at-assembly as V1 read model:** Context Engine queries active LI enrichment state during Phase 2 Retrieval — LI does not push into packages. Context Publisher publishes to PostgreSQL; CE reads.
3. **Define enrichment freshness contract:** Include `enrichmentSnapshotAt` and optional `enrichmentVersion` in Context Package metadata so Orchestrator Phase 2 verification can detect stale enrichment mid-session.
4. **Confirm `progressionTrend` ownership:** Recommend LI-owned computation with Competency Engine levels as read-only inputs — avoid dual computation in CE enrichment phase.
5. **Minimum publish fields from LI:** Ensure persisted pattern records expose all fields required for `RecurringErrorBlock` and `identifiedGaps` without CE issuing secondary LI queries during assembly (Agent D Question 3).
6. **Align retention:** Map LI insight history retention to Context snapshot persistence (`DB-AI-004`) for audit reconstruction.
7. **Indexing review:** Jointly specify indexes on pattern lookup by `(studentId, moduleId, status)` to protect Context Engine P95 SLA.

---

## Recommendations to Agent E — AI Governance & Security Architect

1. **Govern Student Timeline API surface:** Approve which LI insight types and fields may appear in student-safe DTOs before React integration (Agent D §5.4 vs Brief V1 §8.8).
2. **Define cohort minimum-N thresholds** before cohort pattern APIs expose aggregated data to professors (LI-COH-001, Brief R-LI-06).
3. **RBAC matrix for insight endpoints:** Professor cohort scope, administrator cross-cohort access, student self-read boundaries — required before Express route design.
4. **Confirm at-risk signals are professor-pull-only** (LI-PROF-002) — no automated student notification from LI classification.
5. **Audit retention for dismissed patterns** and professor false-positive records — align with `docs/26` incident logging for hallucination pattern alerts (Agent D Question 6).
6. **Event payload privacy:** LI domain events must not include raw provider output or cross-student identifiers in cohort event payloads logged to Railway.

---

## Recommendations to Agent F — LLM Systems & Prompt Engineering Architect

1. **Confirm Orchestrator dispatch fields consumed by strategy selection vs LI-only analytics** — prevent undocumented feedback from LI metrics into strategy matrix without Approval Gate evidence.
2. **`targetedReviewAreas` and `priorityPattern`:** Should bind to Context block content only — not new prompt template variables unless EduQA regression suite covers them.
3. **Hallucination pattern alerts:** Define handoff from LI to EduQA constraint injection without provider-specific prompt drift (Agent D Question 3).
4. **M9–M10 capstone boundary:** Gap signals in context must not enable prompt paths approximating final answers — joint test scenarios with LI-enriched packages required.
5. **`progressionTrend` and `guidanceTier`:** Recommend `guidanceTier` remains Context Engine derivation; LI `progressionTrend` informs emphasis within tier only — not Orchestrator strategy override.
6. **Prepare contract tests:** Enriched context from active recurring errors must pass EduQA answer-leak suite before Doc 30 production gate.

---

## Questions for Agent G — Principal Engineering Reviewer

1. **B-01 gate criteria:** What is the acceptable Approval Gate evidence for Context Engine LI enrichment degrade vs fail-closed policy — unit tests, integration tests, or explicit architectural decision record?
2. **Vertical slice ordering:** Does Sprint 7 (`docs/20`) require LI V1 foundation before Professor Dashboard insight widgets, or can Coach + Context + Orchestrator ship with LI enrichment stub (empty patterns)?
3. **BUILD-004 compliance:** How should shared Prisma read patterns between Context Engine retrieval and LI Evidence Collector be structured to avoid business rule duplication?
4. **Test evidence for async path:** What minimum integration test suite proves dispatch-failure-is-logged-only and idempotent `orchestrationId` processing before merge?
5. **ESLint boundary enforcement:** Should `no-restricted-imports` rules blocking Orchestrator → Prisma and React → `services/ai/*` be part of LI vertical slice Definition of Complete?
6. **Approval Gate checklist:** Will Doc 30 gate mirror `docs/29` §72 structure — and does LI integration block Orchestrator production activation if async dispatch is not yet implemented?
7. **Reconciliation job scope:** Is a periodic LI backfill job required for V1 Approval Gate, or acceptable as V1.1 operational hardening given in-process event bus?

---

**End of Platform Integration Review V1**  
*Submitted for Architecture Review Board Phase 3 — Learning Intelligence platform integration approved in principle, pending resolution of B-01 and Agent C enrichment contract confirmation.*

[REDACTED]