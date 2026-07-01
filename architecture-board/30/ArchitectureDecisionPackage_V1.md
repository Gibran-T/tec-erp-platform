# Architecture Decision Package V1

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  
**Board:** Official TEC.ERP Architecture Review Board — Document 30  
**Package Author:** Architecture Review Board Secretary (Agent G)  
**Status:** Approved / Completed  
**Branch:** `main`

---

## Document Target

| Field | Value |
|-------|-------|
| **Official document** | `docs/30_LEARNING_INTELLIGENCE.md` |
| **Title** | Learning Intelligence — Official Enterprise AI Component Standard |
| **Component** | Learning Intelligence (LI) — fourth Enterprise Educational Intelligence (EEI) component |
| **Standing** | Equivalent to `docs/28_AI_CONTEXT_ENGINE.md` and `docs/29_AI_REASONING_ORCHESTRATOR.md` |
| **Document 30 commit** | `3f6456c` — `docs: add learning intelligence architecture` |

---

## ACR Reference

| Field | Value |
|-------|-------|
| **Source artifact** | `architecture-board/30/ArchitectureConsensusReport_V1.md` |
| **ACR commit** | `38de1b8` — `chore: add ARB consensus report for Document 30` |
| **Phase** | Architecture Review Board Phases 1–4 (Brief, Domain, Platform, Knowledge, Governance, LLM, Consensus) |
| **Agent G recommendation** | AUTHORIZED WITH CONDITIONS |
| **Overall enterprise readiness** | 80% — authorized for Document 30; not authorized for production |

**Input artifacts consolidated:** `ArchitectureBrief_V1.md`, `DomainArchitecture_V1.md`, `PlatformReview_V1.md`, `KnowledgeReview_V1.md`, `GovernanceReview_V1.md`, `LLMReview_V1.md`.

---

## Program Director Decision

**Decision:** **APPROVED — Document 30 authorized and completed.**

The Program Director confirms that:

1. Learning Intelligence architecture is **architecturally sound**, **enterprise-compatible**, and **approved** as the institutional standard for Loop 2 — Learning History Loop (Analyze-After-Deliver).
2. Document 30 authoring was **authorized** under ACR §11 and **completed** per commit `3f6456c`.
3. All **Accepted ADRs** and **Resolved DARs** listed below are **ratified as binding** for Document 30, Context Engine, Reasoning Orchestrator, and Learning Intelligence implementation.
4. **Production activation** of Learning Intelligence remains **not authorized** until BUILD-005 Approval Gate and Section 7 production blockers (BP-01 through BP-10) are closed with evidence.

No architectural redesign is required. No agent dissent on core boundaries.

---

## Accepted ADRs

| ID | Title | Board Status |
|----|-------|--------------|
| **ADR-DK-001** | Tiered Context Retrieval with Optional LI Enrichment | Accepted with Conditions |
| **ADR-DK-002** | Pull-at-Assembly LI Read Model | Accepted |
| **ADR-DK-003** | Competency History Required for Progression Trend | Accepted with Conditions |
| **ADR-GOV-001** | Cohort Minimum Aggregation Thresholds (N≥5 professor / N≥10 exports) | Accepted — Program Director Confirmed |
| **ADR-GOV-002** | Learning Intelligence Retention Schedule | Accepted — Program Director Confirmed |
| **ADR-GOV-003** | Student Timeline Field Allowlist | Accepted with Conditions |
| **ADR-GOV-004** | Professor Intervention Audit Requirements | Accepted with Conditions |
| **ADR-LLM-001** | Enrichment Metadata Non-Influence on Reasoning Path | Accepted with Conditions |

**Rejected (ADR level):** None  
**Deferred (ADR level):** None

---

## Accepted DARs

| ID | Title | Status |
|----|-------|--------|
| **DAR-GOV-001** | Degraded Enrichment Incident Classification | Resolved — isolated LI failure = operational (Medium); sustained degradation = High; data integrity/auth = Critical; Coach not blocked |
| **DAR-GOV-002** | LI Domain Events to Audit Log Mapping | Resolved — dual emission (operational metrics + append-only Audit Log); professor dismiss/resolve → permanent audit class |

---

## Conditions Acknowledged

The following conditions from ACR §11 and §12 are **acknowledged and incorporated** in Document 30 (`3f6456c`):

1. All Accepted ADRs embedded normatively in Document 30 — not appendix-only.
2. Governance policies B-GOV-01 through B-GOV-04 codified (retention, RBAC, intervention audit, cohort N).
3. Approval Gate checklist includes explicit **Security Gate** (Agent E criteria).
4. **Document Alignment Dependencies** section lists required amendments to `docs/17`, `docs/18`, and `docs/28` §60 before implementation merge.
5. **Implementation blockers** BI-01 through BI-10 must close before implementation merge (BUILD-005).
6. **Production blockers** BP-01 through BP-10 must close before production activation.
7. Cohort minimum-N values **N=5 / N=10** and retention schedule per ADR-GOV-002 **confirmed** by Program Director.
8. Targeted official document amendments (`docs/28` §60, `docs/17`, `docs/18`) require user-approved updates before BUILD-005 implementation gate — Document 30 references only; does not substitute schema authority.

---

## Items Deferred

| Item | Defer to | Rationale |
|------|----------|-----------|
| **DAR-LLM-001** — Context subset trimming under token pressure | Build-time / V1 profiling | `docs/29` §38 sufficient for V1 |
| Timeline Narrator / V2 student LI surface | V2 | ADR-GOV-003; V1 indirect timeline sufficient |
| LI reconciliation backfill job | V1.1 | Idempotency keys acceptable; logged gap documented |
| LI microservice extraction | V2+ | Monolith V1 approved |
| Scheduled cohort aggregation cron | V2 | Platform concern C-09 |
| Unified observability schema in `docs/21` | Implementation phase | BP-07 before production |
| Expanded insight taxonomy EduQA language review | Doc 30 gate / parallel | Governance C-GOV-01 — low severity |

---

## Authorization Statement

By approval of this Architecture Decision Package, the Program Director **authorizes and confirms completion** of:

- **Document 30** — `docs/30_LEARNING_INTELLIGENCE.md` (commit `3f6456c`) as the **Official Enterprise AI Component Standard** for Learning Intelligence;
- **Institutional standards** effective upon this package approval: Analyze-After-Deliver; pull-at-assembly enrichment (ADR-DK-002); tiered context retrieval with three enrichment states (ADR-DK-001); enrichment metadata non-influence (ADR-LLM-001); cohort minimum-N and retention schedule (ADR-GOV-001, ADR-GOV-002); Student Timeline allowlist (ADR-GOV-003); professor intervention audit (ADR-GOV-004); LI principle family LI-001–LI-012; DAR-GOV-001 incident classification; DAR-GOV-002 audit mapping.

Implementation and production release remain subject to BUILD-005 Approval Gate, Agent G institutional review, and closure of BI/BP registers per Document 30 §59–§60.

---

## Package Status

| Field | Value |
|-------|-------|
| **Status** | **Approved / Completed** |
| **Document 30** | Complete — `3f6456c` |
| **Architecture Review Board** | Completed |
| **Program Director** | Approved |
| **Production activation** | Not authorized — pending BUILD-005 and BP-01–BP-10 |
| **Linked ACR** | `architecture-board/30/ArchitectureConsensusReport_V1.md` |

---

**Architecture Decision Package V1 — End**

*Program Director approval package for Document 30. Derived exclusively from Architecture Consensus Report V1. No new architecture introduced.*
