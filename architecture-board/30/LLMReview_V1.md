# LLM Systems & Prompt Engineering Review V1

**Issued by:** Agent F — LLM Systems & Prompt Engineering Architect  
**Board:** Official TEC.ERP Architecture Review Board — Phase 3D  
**Status:** LLM Systems & Prompt Engineering Review (pre-document)  
**Inputs reviewed:** Architecture Brief V1 (Agent A), Learning Intelligence Domain Architecture V1 (Agent D), Platform Integration Review V1 (Agent B), Data & Knowledge Review V1 (Agent C), Governance & Security Review V1 (Agent E), approved Documents 01–29  
**Scope:** LLM systems, provider layer, prompt engineering, reasoning integration, and AI provider governance only — no architecture, pedagogy, platform, persistence, or governance redesign  

**Overall verdict:** The Learning Intelligence architecture is **fully compatible** with Enterprise Educational Intelligence and the replaceable-reasoning-provider model. LLM systems architecture is **conditionally approved** subject to resolution of **two blocking issues**, **nine concerns**, and adoption of one new ADR (ADR-LLM-001).

---

## Review Summary

| Classification | Count |
|----------------|-------|
| Approved | 11 areas |
| Concern | 9 areas |
| Blocking Issue | 2 areas |

---

## Critical Principle Validation

| Prohibition | Status | Evidence |
|-------------|--------|----------|
| LLM must not become source of truth | **Pass** | `docs/27` §11, `docs/29` §3; LI analysis is institutional rules on structured evidence (Agent D §16) |
| LLM must not access PostgreSQL directly | **Pass** | ORCH-001; provider boundary excludes DB (`docs/29` §36, §836–842); LI never invokes providers |
| LLM must not assemble Context Packages | **Pass** | Context Engine exclusive (`docs/28`); Orchestrator consumes validated packages only |
| LLM must not bypass EduQA | **Pass** | ORCH-005, ORCH-007; LI-INT-004; no LI → student delivery path |
| LLM must not modify competencies | **Pass** | AI-ARCH-003, LI-003; gap signals advisory only |
| LLM must not modify KPIs | **Pass** | Simulation Engine owns KPIs; context KPI block read-only (`docs/28` §24) |
| LLM must not modify scores | **Pass** | LI-ARCH-002; Competency Engine read-only to LI |
| LLM must not modify certifications | **Pass** | `docs/10`, Agent D §16; LI explicit out-of-scope |
| LLM must not replace professor authority | **Pass** | Insights advisory; professor validation supersedes (LI-PROF-004) |
| LLM must not replace student reasoning | **Pass** | AI-001, Coach-not-answer-engine; question_first/hint strategies |

**Critical principle gate: Passed.** No architectural pathway violates the institutional intelligence ownership model.

---

## ADR / DAR Inventory Reviewed

| Artifact | Source | Agent F disposition |
|----------|--------|---------------------|
| **ADR-DK-001** | Agent C — Tiered Context Retrieval | **Approved** — LLM/prompt implications accepted (see validation) |
| **ADR-DK-002** | Agent C — Pull-at-Assembly LI Read Model | **Approved** |
| **ADR-DK-003** | Agent C — Competency History for Progression Trend | **Approved** |
| **ADR-GOV-001** | Agent E — Cohort Minimum-N | **Approved** — no provider/prompt impact |
| **ADR-GOV-002** | Agent E — LI Retention Schedule | **Approved** — audit retention; no prompt impact |
| **ADR-GOV-003** | Agent E — Student Timeline Allowlist | **Approved** — Orchestrator never serves Timeline DTOs |
| **ADR-GOV-004** | Agent E — Professor Intervention Audit | **Approved** — no Orchestrator synchronous path |
| **DAR-GOV-001** | Agent E — Degraded Enrichment Classification | **Approved** — operational default; not prompt-weakening trigger |
| **DAR-GOV-002** | Agent E — LI Domain Events / Audit Log | **Approved** — complements Orchestrator audit chain (`docs/29` §55) |
| **ADR-LLM-001** | Agent F (proposed below) | **Recommended — blocking for Orchestrator implementation** |

No additional DARs required. DAR-LLM-001 (context subset trimming under token pressure) deferred — `docs/29` §38 policy sufficient for V1; implementation detail at build time.

---

## ADR Validation

### ADR-DK-001: Tiered Context Retrieval with Optional LI Enrichment

**Status: Approved**

**Validation**

- Prompt assembly must treat **empty enrichment arrays** (`identifiedGaps: []`, empty `patterns`, null `priorityPattern`) as **valid structural input** — not as signal to reduce EduQA constraints or assistance level caps.
- `enrichmentStatus = degraded_unavailable` is **audit and telemetry metadata** — it must not appear in provider-bound prompts and must not trigger strategy downgrade or constraint relaxation (see ADR-LLM-001).
- Core context blocks (mission, KPI, competency levels, decisions) remain mandatory — provider receives strategy-appropriate subset from validated package regardless of enrichment state.
- Three enrichment states (`enriched`, `empty_valid`, `degraded_unavailable`) must be covered in EduQA regression before Orchestrator production activation (**B-LLM-01**).

**LLM consequence:** All eight prompt templates in `prompts/v1/` must use optional-block binding patterns — never assume non-empty LI-derived fields.

---

### ADR-DK-002: Pull-at-Assembly LI Read Model

**Status: Approved**

**Validation**

- Orchestrator receives enrichment **only** via validated `AIContextPackage` — no supplemental LI fields at ProviderGateway or PromptAssembler layer (Agent B rec #2, Agent C rec #2).
- No reverse synchronous path LI → Orchestrator preserves ORCH-001 and provider isolation.
- Temporal lag between LI write and CE read is normal; Orchestrator Phase 2 verification uses `contextHash` and package age — not LI freshness guarantees on same session.

**LLM consequence:** Prompt variables bind exclusively to package blocks filtered by Context Engine — never to live LI queries.

---

### ADR-DK-003: Competency History Required for Progression Trend

**Status: Approved**

**Validation**

- `progressionTrend` is computed upstream (LI-owned per Agent C rec #4) and consumed via `competencyContext` block — Orchestrator does not compute trends.
- `guidanceTier` remains Context Engine derivation from module code (`docs/28` §25) — Orchestrator strategy matrix uses `guidanceTier`, not raw trend alone.
- `progressionTrend` may inform **emphasis within** a selected strategy (prompt modifier text) — it must not override strategy selection rules (`docs/29` §22) or assistance level caps.

**LLM consequence:** Prompt templates may reference `progressionTrend` for tone/depth emphasis only; strategy selector remains rule-based on requestType, assistanceLevel, guidanceTier, and populated `priorityPattern.active`.

---

### ADR-GOV-001: Cohort Minimum Aggregation Thresholds

**Status: Approved**

No LLM, provider, or prompt template impact. Cohort aggregates never cross provider boundary. Orchestrator never receives cohort-level insight payloads in student-facing packages.

---

### ADR-GOV-002: Learning Intelligence Retention Schedule

**Status: Approved**

Retention governs persistence and audit — not prompt content. Raw provider responses remain audit-class per `docs/29` §37; retention alignment does not change provider generate contract.

---

### ADR-GOV-003: Student Timeline Field Allowlist

**Status: Approved**

Student Timeline is a read projection outside Orchestrator delivery path. Orchestrator output is `ReasoningDeliveryPackage` to AI Coach only — Timeline DTOs are a separate API surface with no provider invocation.

---

### ADR-GOV-004: Professor Intervention Audit Requirements

**Status: Approved**

Professor dismiss/resolve affects future Context Engine reads (pattern de-enrichment) — not current Orchestrator invocation. No synchronous professor action path to ProviderGateway.

---

### DAR-GOV-001: Degraded Enrichment Incident Classification

**Status: Approved**

`degraded_unavailable` is operational (Medium default) — not authorization to weaken prompt safety constraints or skip EduQA. Security escalation applies only to data integrity or auth anomalies — consistent with Orchestrator governance (`docs/29` §57).

**LLM rule:** Degraded enrichment must not trigger provider fallback or institutional fallback templates — Coach continues with core context.

---

### DAR-GOV-002: LI Domain Events to Audit Log Mapping

**Status: Approved**

Orchestrator audit chain (`orchestration.*` events, `docs/29` §55) remains independent. LI domain events link via `orchestrationId` on async path — enables post-hoc correlation without synchronous Orchestrator dependency. Hallucination pattern alerts from LI feed **EduQA constraint review queue** — not automatic prompt mutation (Agent E rec #6, Agent C rec #5).

---

## 20-Area LLM Systems Review

### 1. Provider Independence

**Classification: Approved**

**Findings**

- `ReasoningProvider` interface (`docs/29` §34) isolates all provider specifics.
- ORCH-009, PROV-003: provider replacement requires provider module changes only.
- LI never invokes providers (Agent D §16, LI-ARCH-007) — no second provider dependency path.
- Mock provider mandatory in CI (PROV-004).
- Intelligence ownership model preserved: TEC.ERP selects strategy, binds prompts, validates output; provider generates language only.

**Concerns:** None.

---

### 2. Provider Abstraction Layer

**Classification: Approved**

**Findings**

- Factory pattern at startup via `AI_REASONING_PROVIDER` (`docs/29` §34, §779–781).
- `ProviderGenerateRequest` carries assembled prompt + model config only — no Prisma, no full package (`docs/29` §36).
- `estimateTokens()` supports pre-invocation budget checks (PROV-005).
- `healthCheck()` required for `/health/ai` (PROV-006).

**Concerns:** None at architecture level. Implementation not yet started — contracts in `docs/29` are sufficient for Doc 30 LI integration.

---

### 3. OpenAI Boundary

**Classification: Approved**

**Findings**

- OpenAI is Version 1 reasoning provider only (`docs/29` §35, `docs/27` §10).
- PROV-001: SDK imports restricted to `provider/` directory.
- PROV-002: credentials in Railway Variables only.
- OpenAI explicitly prohibited from: strategy selection, DB access, self-validation, score/competency modification, pedagogical rule definition.
- LI integration adds no OpenAI exposure — enrichment never sent outside CE-filtered subset.

**Concerns:** None.

---

### 4. Prompt Governance

**Classification: Concern**

**Findings**

- Institutional prompt templates in `prompts/v1/` — eight strategies (`docs/29` §23–30, §1032–1040).
- Prompt assembly binds: template version, context subset, strategy instructions, EduQA constraints, output format, assistance level caps (`docs/29` §18).
- Assembled prompt logged as **hash only** in audit — not full content (`docs/29` §458).
- LI-derived content enters prompts **only** through validated package blocks — not LI service calls.
- Agent E §9 Prompt Governance: **Approved** — LI does not bind or mutate templates.

**Concerns**

- **C-LLM-01:** EduQA regression suite for three enrichment states (`enriched`, `empty_valid`, `degraded_unavailable`) is mandated by Agent C, Agent E, and Brief cross-reviews but **not yet specified** in `docs/23` Orchestrator test scenarios — **production gate gap**.
- **C-LLM-02:** Expanded LI insight taxonomy (Agent D nine types) may produce richer `targetedReviewAreas` text — prompt binding must treat these as CE-validated business-language strings only; no raw insight type codes in provider prompts.

**Blocking Issue**

- **B-LLM-01:** Mandatory EduQA regression coverage for all three enrichment states before Orchestrator production Activation Gate — no exceptions.

---

### 5. Prompt Versioning

**Classification: Approved with Concern**

**Findings**

- `promptTemplateVersion` on every delivery package (`docs/29` §42, §987).
- Model version pinned via `AI_REASONING_MODEL` (`docs/29` §40).
- Prompt templates are institutional assets — versioned in repository, not in `docs/` or frontend (IMPL-AI-005, `docs/29` §455).
- Regeneration uses `eduqa_recovery` template with explicit failure reason injection — version tracked per attempt.

**Concerns**

- **C-LLM-03:** Unified audit chain across `promptTemplateVersion`, `enrichmentVersion` (Agent C C-DK-09), and `contextHash` not yet specified in Orchestrator audit events — reconstructability gap for "what prompt context was available at orchestration time?"

---

### 6. Prompt Safety

**Classification: Approved with Concern**

**Findings**

- EduQA constraint injection at assembly (answer-leak prevention, structure requirements) — Phase 6 mandatory (`docs/29` §18, §20).
- Assistance level caps enforced in `pedagogicalContext` block — provider cannot override (`docs/28` §27).
- FILTER rules applied before assembly — professor notes, cross-student data excluded (`docs/28` §18).
- Institutional fallback templates are pre-approved — not provider-generated (`docs/29` §38, §887).
- `degraded_unavailable` must not weaken safety constraints (ADR-LLM-001).

**Concerns**

- **C-LLM-04:** M9–M10 capstone scenarios with **active recurring error enrichment** require dedicated answer-leak test matrix — enriched `priorityPattern` + `targetedReviewAreas` increase hint specificity risk (Agent B rec #4, Agent E rec #7).
- **C-LLM-05:** Prompt injection defense relies on student message sanitization; context package is server-built and trusted (`docs/29` §53) — LI-derived text in blocks must remain business-language and CE-filtered before prompt binding.

---

### 7. Context Package Consumption

**Classification: Approved with Concern**

**Findings**

- Orchestrator depends exclusively on validated `AIContextPackage` (`docs/29` §45).
- Phase 2 context verification: schema version, `contextHash`, mission binding, assistance level, staleness threshold (`docs/29` §16).
- Strategy-specific context subset — not full package sent to provider (`docs/29` §1097).
- LI enrichment consumed via `recurringErrorContext`, `competencyContext.identifiedGaps`, `progressionTrend` (`docs/28` §25–26).

**Concerns**

- **C-LLM-06:** `metadata.enrichmentStatus` semantics (ADR-DK-001) must be excluded from `ProviderGenerateRequest` and prompt text — Orchestrator may log for audit only.
- **C-LLM-07:** Mid-session pattern resolution vs. package staleness (Agent E C-GOV-17): default 60s package age threshold (`docs/29` §417) may serve stale enrichment — acceptable if `contextHash` reflects assembly-time state; strategy must not assume post-delivery LI updates affect current orchestration.

---

### 8. Context Window Strategy

**Classification: Concern**

**Findings**

- Strategy-specific subset reduces token load (`docs/29` §1097).
- `eduqa_recovery` narrows context subset on regeneration (`docs/29` §30).
- Token limit exceeded → regenerate with reduced context subset (`docs/29` §38).
- CE parallel retrieval SLA ≤ 3000ms P95 (`docs/28`) — separate from provider window.

**Concerns**

- **C-LLM-08:** No institutional **trim priority order** when enriched prompts exceed token budget — e.g., whether `patterns[]` truncates before `missionContext`, or `targetedReviewAreas` limits apply first. `docs/29` §38 states policy but not LI block precedence — implementation risk for answer-leak if wrong blocks are dropped silently.
- **C-LLM-09:** AI History window reduction mentioned as configurable (Agent C B-01 table) — interaction with prompt assembly for long conversations undefined at template level.

---

### 9. Reasoning Strategy Compatibility

**Classification: Concern**

**Findings**

- Eight strategies with deterministic rule-based selection (`docs/29` §21–22, EDU-ORCH-001).
- LI-relevant rule: `IF priorityPattern.active → competency_guidance + error modifier` (`docs/29` §536).
- KPI modifier when `impactedByRecentDecision = true` (`docs/29` §31).
- Regeneration overrides to `eduqa_recovery` when `regenerationAttempt > 0`.
- Strategy selection inputs include `recurringErrorContext.priorityPattern` from context package — not live LI metrics (Agent B rec #1).

**Concerns**

- **C-LLM-10:** `priorityPattern.active` evaluation must bind to **populated block field** (`priorityPattern !== null && active === true`) — not inferred from `enrichmentStatus`. Empty structural block under `empty_valid` or `degraded_unavailable` must **not** match this rule; strategy falls through to requestType/assistanceLevel rules.
- **C-LLM-11:** Agent D `intervention_recommendation` and `eduqa_signal` insight types are professor/analytics-facing — must never influence Orchestrator strategy selection (no such pathway in architecture; enforce at CE filtering).

**Blocking Issue**

- **B-LLM-02:** Strategy selection rules must explicitly codify **enrichment metadata non-influence** and **empty-block semantics** for `priorityPattern.active` — proposed as ADR-LLM-001; required before Orchestrator implementation to prevent accidental metadata branching.

---

### 10. Coach Guidance Compatibility

**Classification: Approved**

**Findings**

- Coach functions (mission feedback, reflection, error explanation, KPI/process explanation) map to Orchestrator strategies (`docs/09`, `docs/29` §21).
- AI-001–004 preserved: progressive guidance, context-aware feedback, no final answers.
- LI enrichment improves **emphasis** on recurring errors via `competency_guidance` + error modifier — Coach phrasing remains Orchestrator + EduQA domain (Brief V1 §8.3).
- Feedback structure mandatory: Observation → Business Impact → Process → KPI → Improvement (`docs/29` §18).
- `targetedReviewAreas` suggest concepts — not decision answers (LI-PED-003, Agent D §3.6).

**Concerns:** None at principle level. M9–M10 capstone testing tracked under C-LLM-04.

---

### 11. Learning Intelligence Compatibility

**Classification: Approved with Concern**

**Findings**

- Analyze-After-Deliver: LI async after Phase 8 — never blocks Coach (`docs/29` §51, LI-ARCH-001).
- Orchestrator dispatch payload defined (`docs/29` §51, Brief V1 §5.1): strategy, request type, validation attempts, competency snapshot, recurring error reference, KPI impact flag, delivery status.
- LI consumes institutional signals — not raw provider output as primary analytical input (Brief V1 §5.4, LI-ARCH-007).
- LI never generates Coach responses, never assembles packages, never invokes providers (Agent D §16).
- Loop 2 improves **future** guidance via CE enrichment — Loop 1 (sync Coach) operates without LI enrichment (Agent C B-01 justification #5).

**Concerns**

- **C-LLM-12:** Idempotency on `orchestrationId` (Brief R-LI-11) prevents duplicate dispatch from inflating LI analytics — Orchestrator must emit exactly one Phase 8 dispatch per successful delivery; regeneration attempts link to same `orchestrationId` with attempt metadata.
- **C-LLM-13:** Hallucination pattern alerts from LI (`docs/29` §52, Agent D §15) must route to **EduQA constraint review** — not automatic prompt template mutation without Approval Gate evidence.

---

### 12. Reasoning Orchestrator Compatibility

**Classification: Approved**

**Findings**

- Eight-phase lifecycle unchanged under LI integration (`docs/29` §14–20).
- ORCH-001 preserved: no Prisma in Orchestrator module.
- Phase 8 `FeedbackDispatcher` is async-only — failure logged, response already delivered (`docs/29` §51, FAIL-ORCH-*).
- Total orchestration SLA ≤ 20000ms P95 including one regeneration (`docs/29` §44, §1084).
- Doc 30 must reference, not redefine, Orchestrator contracts (Brief R-LI-12).

**Concerns:** None blocking. Implementation checklist in `docs/29` §63 applies when vertical slice begins.

---

### 13. Context Engine Compatibility

**Classification: Approved with Concern**

**Findings**

- CE is sole gateway between persistence and reasoning (CTX-RULE-001, Brief V1 §8.1).
- LI enrichment read at Phase 2 Retrieval — subsidiary parallel group (Agent C, ADR-DK-002).
- Package schema includes LI blocks (`docs/28` §21, §25–26).
- Provider receives serialized subset — never full institutional record (`docs/28` §529).

**Concerns**

- **C-LLM-14:** `docs/28` §60 "Partial retrieval → validation failure" requires user-approved amendment to codify ADR-DK-001 tiered policy (Agent C, Agent E, Agent B B-01) — Orchestrator Phase 2 verification assumes valid packages; CE must emit consistent metadata semantics before Orchestrator build.
- **C-LLM-15:** `enrichmentSnapshotAt` null under `degraded_unavailable` — Orchestrator audit should record but not fail verification unless core `contextHash` invalid.

---

### 14. Provider Failover

**Classification: Approved**

**Findings**

- Retry policy: 1 retry on timeout, 429, 5xx with bounded backoff (`docs/29` §38, §878–878).
- `AI_REASONING_MODEL_FALLBACK` for primary model unavailability (`docs/29` §40).
- Model change requires EduQA regression + Approval Gate (`docs/29` §916–920).
- LI outage does not trigger provider failover — unrelated failure domains.

**Concerns:** None.

---

### 15. Fallback Strategy

**Classification: Approved**

**Findings**

- Persistent provider failure → institutional fallback message (pre-approved template).
- Persistent EduQA failure → institutional fallback after max regenerations (default 2).
- Security validation failure → block delivery, alert — no fallback to raw provider output.
- Token limit exceeded → regenerate with reduced subset before fallback.
- LI analysis failure → logged only — no impact on delivered response or fallback selection.

**Concerns:** None.

---

### 16. Token Governance

**Classification: Approved**

**Findings**

- Admission-phase enforcement: `AI_REASONING_MAX_TOKENS`, `AI_SESSION_TOKEN_BUDGET`, `AI_COHORT_DAILY_TOKEN_BUDGET` (`docs/29` §39).
- Exceeded budgets return `OrchestratorBudgetError` — not silent truncation (PROV-005).
- `estimateTokens()` before invocation supports admission checks.
- LI adds no provider calls — zero incremental token cost from LI analysis path.

**Concerns**

- **C-LLM-08 (recurrence):** Trim priority under budget pressure remains undefined — see Context Window Strategy.

---

### 17. Latency Strategy

**Classification: Concern**

**Findings**

- Provider timeout default 15000ms (`docs/29` §467).
- Orchestrator P95 ≤ 20000ms including one regeneration (`docs/29` §1084).
- Context Engine P95 ≤ 3000ms (`docs/28`) — precedes Orchestrator in sync path.
- LI async — no extension of client wait time (Agent B §8).

**Concerns**

- **C-LLM-16:** Enriched context packages may increase prompt assembly size and provider latency — P95 budget should assume worst-case active `patterns[]` + full competency block; monitor `orchestration.prompt.assembled` token estimates vs. SLA.
- **C-LLM-17:** Same-session enrichment freshness lag (Agent B C-17) is expected — not a latency defect; UX loading state covers full pipeline (`docs/29` §47).

---

### 18. Cost Governance

**Classification: Approved**

**Findings**

- Token budgets at admission prevent runaway provider cost (`docs/29` §39).
- Rate limiting per student/cohort at Phase 1 (`docs/29` §53).
- Cost alert threshold via Railway monitoring (`docs/29` §898).
- LI operates without provider calls — analysis cost is compute/DB only.
- High Coach frequency caps ingress via rate limits — LI queue depth scales with capped ingress (Agent B C-19).

**Concerns:** None at architecture level.

---

### 19. Observability

**Classification: Concern**

**Findings**

- Eight-phase audit events defined (`docs/29` §55).
- Provider metadata: latency, model, tokens — no PII (`docs/29` §331).
- Prompt hash logged — not full prompt (`docs/29` §457).
- LI metrics extend `docs/27` §31 — institutional purpose.
- Orchestrator ↔ LI link via `orchestrationId` on async dispatch.

**Concerns**

- **C-LLM-18:** Unified log schema across Orchestrator, CE, and LI not specified (Agent B C-20, Agent E C-GOV-21) — recommend `{ service, event, orchestrationId, strategyCode, promptTemplateVersion, enrichmentStatus?, tokenUsage, durationMs }` for correlation.
- **C-LLM-19:** `orchestration.eduqa.first_pass_rate` and enrichment state correlation — operational metric to detect whether empty enrichment increases EduQA failures (false signal if templates assume non-empty blocks).

---

### 20. Future Multi-Provider Readiness

**Classification: Approved**

**Findings**

- `ReasoningProvider` interface supports future providers without Orchestrator logic changes (EVOL-ORCH-002).
- Provider swap procedure defined (`docs/29` §805–812): new implementation, env var, contract tests, Approval Gate.
- LI integration is provider-agnostic — enrichment never crosses provider boundary.
- Mock provider enables CI contract tests (PROV-004).
- Agent B §17: LI extractable to worker without changing Orchestrator or CE contracts.

**Concerns:** None.

---

## New Architecture Decision Record (Required)

### ADR-LLM-001: Enrichment Metadata Non-Influence on Reasoning Path

| Field | Value |
|-------|-------|
| **Status** | Recommended — **blocking for Orchestrator implementation** |
| **Context** | B-LLM-02, Agent B rec #1, Agent C rec #1–2, Agent E rec #2–5, ADR-DK-001 |
| **Decision** | (1) `metadata.enrichmentStatus`, `enrichmentSnapshotAt`, and `enrichmentVersion` are **audit and telemetry only** — they shall not appear in provider-bound prompts, shall not alter strategy selection, and shall not relax EduQA constraints or assistance level caps. (2) Strategy rule `priorityPattern.active` evaluates **only** populated `recurringErrorContext.priorityPattern` fields from the validated package — empty structural blocks under `empty_valid` or `degraded_unavailable` do not activate competency_guidance via this rule. (3) No Orchestrator-layer field injection from LI services — all LI-derived prompt variables bind through CE-validated package blocks exclusively. |
| **Consequences** | Prompt templates must use optional binding; EduQA suite must cover three enrichment states; degraded LI does not reduce coaching safety. |
| **Alternatives rejected** | Branch prompts on `degraded_unavailable` to "simplify" constraints (violates ORCH-005); infer `priorityPattern.active` from enrichment metadata (violates deterministic institutional rules). |

---

## LLM Systems Risks Register

| ID | Risk | Severity | Classification | Mitigation |
|----|------|----------|----------------|------------|
| R-LLM-01 | Prompt templates assume non-empty LI blocks | High | **Blocking** | B-LLM-01 EduQA three-state regression |
| R-LLM-02 | Strategy selection uses enrichment metadata | High | **Blocking** | ADR-LLM-001 |
| R-LLM-03 | M9–M10 answer-leak with active enrichment | High | Concern | C-LLM-04 capstone test matrix |
| R-LLM-04 | Token trim drops safety-critical blocks | Medium | Concern | C-LLM-08 trim priority spec at implementation |
| R-LLM-05 | Automatic prompt mutation from LI hallucination alerts | Medium | Concern | C-LLM-13 review queue only |
| R-LLM-06 | Audit chain gap prompt vs enrichment version | Medium | Concern | C-LLM-03 unified audit fields |
| R-LLM-07 | Duplicate Phase 8 dispatch inflates LI signals | Medium | Concern | C-LLM-12 idempotency |
| R-LLM-08 | docs/28 §60 ambiguity on tiered retrieval | Medium | Concern | C-LLM-14 doc amendment |
| R-LLM-09 | Enriched prompt P95 latency regression | Low | Concern | C-LLM-16 monitoring |
| R-LLM-10 | Insight type codes leak into provider prompts | Low | Concern | C-LLM-02 CE filtering |

Brief V1 R-LI-04 (LI generates coach text) and R-LI-05 (competency contamination): **architecturally prevented** — no LLM pathway in LI.

---

## Recommendations to Agent G — Principal Engineering Reviewer

1. **Gate ADR-LLM-001** as mandatory before Orchestrator vertical slice merge — enforce via ESLint boundary rules and strategy selector unit tests.
2. **Extend `docs/23` Orchestrator test scenarios** with three enrichment states, M9–M10 enriched answer-leak cases, and `priorityPattern.active` empty-block negative tests — evidence for B-LLM-01.
3. **BUILD-005 dependency:** Confirm whether `docs/28` §60 amendment for ADR-DK-001 is required before Context Engine **or** Orchestrator implementation merges — both consume package semantics.
4. **Definition of Complete for AI vertical slice:** Include `no-restricted-imports` blocking Orchestrator → Prisma, React → `services/ai/orchestrator/provider/*`, and live OpenAI in CI (Agent B Q5, Agent E Q4).
5. **Approval Gate ordering:** Orchestrator production activation may proceed with LI enrichment **stub** (empty_valid structural blocks) if EduQA three-state tests pass — full LI Loop 2 not required for Orchestrator gate (align Agent B Q2).
6. **Contract tests:** `ReasoningProvider` mock swap, `AIContextPackage` v1.0 consumption, `OrchestratorDispatchPayload` emission on Phase 8 — minimum integration evidence.
7. **Token trim priority:** Require Agent F specification document (non-official) or implementation ADR at build time if C-LLM-08 emerges in profiling — not blocking Doc 30.
8. **Unified observability schema:** Add Orchestrator log field requirements to Doc 30 operational section or `docs/21` — C-LLM-18.
9. **Doc 30 must not redefine** `docs/29` strategy matrix or provider contracts — reference only (Brief R-LI-12).
10. **LI Approval Gate independence:** Doc 30 LI gate should not block Orchestrator production if async dispatch stub logs-only — but Orchestrator Phase 8 interface must be stable for future LI wiring.

---

## Architecture Readiness

| Dimension | Readiness |
|-----------|-----------|
| EEI philosophy compatibility | **Ready** |
| Replaceable provider model | **Ready** |
| ORCH-001 / provider isolation | **Ready** |
| Context-before-reasoning pipeline | **Ready** |
| Strategy matrix / LI modifier rules | **Partial** — ADR-LLM-001 |
| Eight-phase Orchestrator lifecycle | **Ready** (spec complete) |
| Context Engine package contract | **Ready** (pending §60 clarification) |
| LI async seam (`docs/29` §51) | **Ready** |
| Critical principle gate | **Ready** |
| Official doc cross-reference integrity | **Ready** |

**Architecture Readiness: Conditionally Ready (~88%)**

Learning Intelligence integration does not require Orchestrator architectural redesign. Conditional items are contract precision (ADR-LLM-001) and CE metadata semantics (ADR-DK-001 doc codification).

---

## Provider Readiness

| Dimension | Readiness |
|-----------|-----------|
| `ReasoningProvider` interface spec | **Ready** (`docs/29` §34) |
| OpenAI V1 boundary | **Ready** |
| Mock provider / CI policy | **Ready** (spec) |
| Retry / fallback / model fallback | **Ready** |
| Token / rate governance | **Ready** |
| Health check / Railway deployment | **Ready** (spec) |
| Implementation codebase | **Not started** |
| Contract test suite | **Not started** |
| Production credentials / smoke test | **Not started** |

**Provider Readiness: Specification Ready (~95%) — Implementation Not Started (~0%)**

Provider layer is architecturally complete in `docs/29`. No LI-driven changes to provider contracts required.

---

## Prompt Governance Readiness

| Dimension | Readiness |
|-----------|-----------|
| Template ownership (`prompts/v1/`) | **Ready** (spec) |
| Eight strategy templates defined | **Ready** (spec) |
| EduQA constraint injection model | **Ready** |
| Versioning / audit hash | **Ready** |
| LI block optional binding rules | **Partial** — ADR-LLM-001 |
| Three-state EduQA regression | **Not ready** — B-LLM-01 |
| M9–M10 enriched answer-leak tests | **Not ready** — C-LLM-04 |
| Trim priority under token pressure | **Partial** — C-LLM-08 |
| Template implementation | **Not started** |

**Prompt Governance Readiness: Conditionally Ready (~78%)**

Prompt governance architecture aligns with Agent E §9 approval. Test evidence and ADR-LLM-001 codification required before production.

---

## Overall Verdict

**Conditionally Approved — LLM systems architecture is compatible with Learning Intelligence and EEI philosophy; two blocking items must resolve before Orchestrator implementation and production Activation Gate.**

The Learning Intelligence architecture **does not compromise** provider independence, Orchestrate-Before-Deliver governance, or the principle that TEC.ERP owns intelligence while the LLM performs replaceable reasoning only. Agent A, B, C, D, and E inputs are **compatible at the LLM systems layer** once:

1. **ADR-LLM-001 is adopted** — enrichment metadata non-influence and empty-block strategy semantics (B-LLM-02).
2. **B-LLM-01 is satisfied** — EduQA regression covers `enriched`, `empty_valid`, and `degraded_unavailable` before Orchestrator production activation.

**ADR-DK-001:** Approved — prompt templates must be enrichment-state-agnostic.  
**ADR-DK-002:** Approved — no Orchestrator LI field injection.  
**ADR-DK-003:** Approved — `progressionTrend` emphasis only, not strategy override.  
**ADR-GOV-001 through ADR-GOV-004:** Approved — no LLM layer impact.  
**DAR-GOV-001, DAR-GOV-002:** Approved — consistent with Orchestrator audit and safety model.

Nine concerns (C-LLM-01 through C-LLM-19) should be tracked into Orchestrator implementation, `docs/23` test scenarios, and Doc 30 cross-references — not silently assumed at build time.

The provider shall never become the source of truth. Learning Intelligence shall never invoke the provider. The Orchestrator shall never query PostgreSQL. Every student-facing response shall pass EduQA. These boundaries hold under full LI integration.

**Agent F sign-off:** LLM Systems & Prompt Engineering architecture **validated**. Proceed to Document 30 authoring and Orchestrator vertical slice with ADR-LLM-001 as binding. **Orchestrator production activation blocked** until B-LLM-01 test evidence and ADR-LLM-001 enforcement are demonstrated.

---

**End of LLM Systems & Prompt Engineering Review V1**  
*Submitted for Architecture Review Board Phase 3D — Learning Intelligence LLM compatibility conditionally approved, pending ADR-LLM-001 adoption and three-state EduQA regression gate.*
