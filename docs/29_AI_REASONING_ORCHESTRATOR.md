# TEC.ERP — AI Reasoning Orchestrator

**Document:** AI Reasoning Orchestrator

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

---

# 1. Purpose

This document defines the official implementation architecture for the **AI Reasoning Orchestrator** — the coordination layer of TEC.ERP Enterprise Educational Intelligence.

The Orchestrator receives validated **AI Context Packages** from the AI Context Engine and coordinates reasoning requests through replaceable LLM providers, educational strategy selection, response validation and delivery to the AI Coach.

The Orchestrator never queries the database directly.

The LLM is replaceable.

OpenAI is the Version 1 reasoning provider only.

TEC.ERP owns institutional intelligence.

This document is the authoritative reference for reasoning orchestration, provider management, pedagogical strategy selection, safety governance, testing and deployment.

---

# 2. Orchestrator Mission

The mission of the AI Reasoning Orchestrator is to transform approved institutional context into pedagogically governed AI responses through controlled, auditable and provider-independent reasoning coordination.

The Orchestrator shall:

- accept only validated AI Context Packages from the Context Engine;
- select the correct educational reasoning strategy for each request;
- invoke replaceable LLM providers through an abstraction layer;
- enforce EduQA validation before any response reaches the student;
- coordinate regeneration when validation fails;
- integrate with AI Coach delivery and Learning Intelligence feedback;
- maintain full audit traceability across the reasoning lifecycle;
- operate reliably on Railway production infrastructure.

Reasoning without orchestration produces ungoverned AI output.

Orchestration without institutional context produces unreliable guidance.

---

# 3. Orchestrator Philosophy

TEC.ERP adopts an **Orchestrate-Before-Deliver** philosophy.

Context arrives validated.

Strategy is selected institutionally.

Providers generate language — not decisions.

Responses are validated before delivery.

```text
Validated AI Context Package
↓
Reasoning Strategy Selection
↓
Prompt Template Binding
↓
Provider Invocation (OpenAI V1 — replaceable)
↓
Raw Provider Response
↓
Response Validation (EduQA)
↓
Approved Response → AI Coach Delivery
↓
Learning Intelligence Feedback (async)
```

The LLM is replaceable.

The intelligence belongs to TEC.ERP.

---

# 4. Orchestrator Principles

ORCH-001

The Orchestrator never queries the database directly.

ORCH-002

Only validated AI Context Packages may enter the reasoning pipeline.

ORCH-003

Educational reasoning strategy is selected by TEC.ERP — not by the provider.

ORCH-004

OpenAI is the Version 1 provider — not the institutional authority.

ORCH-005

No student-facing response shall bypass EduQA validation.

ORCH-006

Provider SDK usage is isolated to the provider layer.

ORCH-007

Failed validation triggers regeneration or institutional fallback — never raw provider output.

ORCH-008

Every reasoning request produces a complete audit trace.

ORCH-009

Provider independence shall be preserved through abstraction contracts.

ORCH-010

Railway-first operational constraints govern production orchestration.

---

# 5. Orchestrator Scope

This document defines:

- orchestration architecture and request lifecycle;
- reasoning strategy matrix and selection rules;
- provider abstraction and OpenAI Version 1 boundary;
- TypeScript interface direction and Express service responsibilities;
- React integration points (delivery only);
- Context Package dependency and validation gates;
- AI Coach, EduQA and Learning Intelligence integration;
- response validation, safety and governance controls;
- observability, audit logging and failure modes;
- test strategy and Railway deployment considerations;
- Approval Gate requirements.

This document does not redefine:

- context reconstruction (`28_AI_CONTEXT_ENGINE.md`);
- Learning Intelligence analysis algorithms (`27_AI_ARCHITECTURE.md` §18);
- AI Coach pedagogical content structure (`09_AI_COACH_ARCHITECTURE.md`);
- Simulation Engine KPI calculation (`06_SIMULATION_ENGINE.md`).

---

# 6. Related Documents

| Document | Relationship |
|----------|--------------|
| `09_AI_COACH_ARCHITECTURE.md` | AI Coach functions and feedback structure |
| `15_ERP_FUNCTIONAL_SPECIFICATION.md` | Assistance levels and AI Coach activation |
| `18_API_SPECIFICATION.md` | AI endpoint contracts |
| `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` | Engineering standards |
| `22_QUALITY_ASSURANCE_MANUAL.md` | EduQA validation criteria |
| `23_TESTING_STRATEGY.md` | Orchestrator test requirements |
| `24_RELEASE_MANAGEMENT.md` | Approval Gate lifecycle |
| `25_DEPLOYMENT_GUIDE.md` | Railway deployment |
| `26_SECURITY_ARCHITECTURE.md` | Security and rate limiting |
| `27_AI_ARCHITECTURE.md` | Parent AI architecture |
| `28_AI_CONTEXT_ENGINE.md` | Context Package producer — upstream dependency |

When conflicts arise, follow the source-of-truth hierarchy defined in `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` §4.

---

# End of Part 01/12
---
# 7. Architecture Overview

The AI Reasoning Orchestrator sits between the Context Engine and external reasoning providers.

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT PRESENTATION                        │
│              AI Coach UI — request + display only            │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│                   EXPRESS — AI COACH ROUTES                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              AI REASONING ORCHESTRATOR (this document)         │
│  Strategy → Prompt → Provider → Validate → Deliver            │
└───────┬──────────────────────────────────────┬──────────────┘
        │                                        │
        │ ContextBuildRequest                    │ ReasoningResult
        ▼                                        ▼
┌───────────────────┐                  ┌─────────────────────────┐
│  CONTEXT ENGINE   │                  │      AI COACH SERVICE    │
│  (docs/28)        │                  │  (response delivery)     │
└───────────────────┘                  └─────────────────────────┘
        │
        │ Approved AIContextPackage
        ▼
┌───────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR INTERNAL PIPELINE                                │
│  StrategySelector → PromptBinder → ProviderGateway             │
│                  → ResponseValidator → DeliveryCoordinator      │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  PROVIDER LAYER (replaceable)                                  │
│  ReasoningProvider Interface → OpenAIReasoningProvider (V1)   │
└───────────────────────────────────────────────────────────────┘
```

The Orchestrator is the second implementation-level component of Enterprise Educational Intelligence.

It consumes context — it does not produce it.

---

# 8. Component Responsibilities

## Orchestrator Owns

- reasoning request lifecycle management;
- educational strategy selection;
- institutional prompt template binding;
- provider invocation and retry logic;
- EduQA validation coordination;
- regeneration and fallback orchestration;
- audit trace emission;
- rate limiting enforcement;
- delivery coordination to AI Coach Service.

## Orchestrator Does Not Own

- context reconstruction (Context Engine);
- database access of any kind (prohibited);
- recurring error detection (Learning Intelligence);
- AI Coach UI rendering (React);
- KPI calculation (Simulation Engine);
- competency score modification (prohibited);
- provider model training or fine-tuning.

---

# 9. System Boundaries

| Boundary | Rule |
|----------|------|
| Orchestrator ↔ Context Engine | ContextBuildRequest in; AIContextPackage out |
| Orchestrator ↔ PostgreSQL | **No contact — prohibited** |
| Orchestrator ↔ OpenAI | Via ProviderGateway abstraction only |
| Orchestrator ↔ React | No direct contact — AI Coach Service mediates |
| Orchestrator ↔ EduQA Validator | Synchronous validation call per attempt |
| Orchestrator ↔ Learning Intelligence | Async feedback after delivery |
| Orchestrator ↔ Prisma | **No contact — prohibited** |

Boundary violations are architectural defects requiring immediate remediation.

---

# 10. Upstream and Downstream Integration

**Upstream — Context Engine (`28`)**

- Orchestrator invokes `ContextEngineService.buildContext()`;
- rejects requests when context build fails;
- never proceeds without `AIContextPackage` with valid `contextHash`.

**Downstream — AI Coach Service**

- Orchestrator returns `ReasoningDeliveryPackage` to AI Coach;
- AI Coach persists messages and renders to student/professor;
- AI Coach never invokes providers directly.

**Parallel — EduQA Validator**

- invoked synchronously after each provider response;
- may trigger regeneration loop (max attempts configured);
- blocks delivery on persistent validation failure.

**Async — Learning Intelligence**

- receives reasoning outcome metadata after successful delivery;
- updates recurring error patterns and learning insights;
- does not block the reasoning response path.

---

# 11. Orchestrator Input Contract

Primary input: validated `AIContextPackage` from Context Engine.

Secondary input: `ReasoningOrchestrationRequest`.

| Field | Type | Description |
|-------|------|-------------|
| `orchestrationId` | string | Unique trace identifier |
| `contextPackage` | AIContextPackage | Validated package from Context Engine |
| `conversationId` | string | Active AI conversation |
| `requestedByRole` | enum | student \| professor \| administrator |
| `priority` | enum | normal \| elevated (professor-initiated) |
| `regenerationAttempt` | number | 0 for initial; incremented on EduQA failure |

The Orchestrator rejects requests where:

- `contextPackage` is null or undefined;
- `contextPackage.packageVersion` is unsupported;
- `contextHash` validation fails integrity check;
- `regenerationAttempt` exceeds configured maximum.

---

# 12. Orchestrator Output Contract

Primary output: `ReasoningOrchestrationResult`.

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Delivery approved |
| `orchestrationId` | string | Trace reference |
| `strategyUsed` | ReasoningStrategy | Selected strategy |
| `deliveryPackage` | ReasoningDeliveryPackage? | Approved response for AI Coach |
| `validationResult` | EduqaValidationResult | Final validation outcome |
| `providerMetadata` | ProviderInvocationMetadata | Latency, model, tokens — no PII |
| `auditTrace` | AuditTraceRef | Reference to audit log chain |
| `error` | OrchestratorError? | Structured error if failed |

Unsuccessful results never contain raw provider output destined for students.

---

# 13. Orchestrator Rules

ORCH-RULE-001

No reasoning shall proceed without a validated Context Package.

ORCH-RULE-002

No provider SDK import shall exist outside the provider layer.

ORCH-RULE-003

Strategy selection shall be deterministic based on institutional rules.

ORCH-RULE-004

EduQA validation failure shall trigger regeneration before fallback.

ORCH-RULE-005

Maximum regeneration attempts shall be enforced (default: 2).

ORCH-RULE-006

Audit trace shall be complete for every orchestration attempt.

---

# End of Part 02/12
---
# 14. Reasoning Request Lifecycle

Every reasoning request follows eight institutional phases.

```text
Phase 1 — Request Admission
Phase 2 — Context Verification
Phase 3 — Strategy Selection
Phase 4 — Prompt Assembly
Phase 5 — Provider Invocation
Phase 6 — Response Validation
Phase 7 — Delivery Coordination
Phase 8 — Async Feedback
```

Each phase emits audit events.

Failure at Phases 1–6 blocks delivery.

Phase 8 failure does not affect delivered response.

---

# 15. Phase 1 — Request Admission

Admission checks:

1. authenticated session valid;
2. rate limit not exceeded for student/cohort;
3. conversation exists and is active;
4. request type permitted for assistance level;
5. professor role has cohort scope (if applicable);
6. no concurrent orchestration lock on same conversation (configurable);
7. orchestrationId assigned and logged.

Admission failure returns `OrchestratorAdmissionError`.

---

# 16. Phase 2 — Context Verification

Before strategy selection:

1. verify `AIContextPackage` present and schema version supported;
2. verify `contextHash` integrity;
3. verify `missionContext.missionId` matches conversation binding;
4. verify `pedagogicalContext.assistanceLevel` permits request type;
5. verify `eduqaSignals` do not indicate hard block (configurable policy);
6. verify package age within staleness threshold (default: 60 seconds).

Stale or tampered packages trigger Context Engine rebuild — not reasoning with degraded context.

Context verification failure returns `ContextIntegrityError`.

---

# 17. Phase 3 — Strategy Selection

The Educational Decision Engine selects one **ReasoningStrategy** (see §21–22).

Selection inputs:

- `pedagogicalContext.requestType`;
- `pedagogicalContext.assistanceLevel`;
- `competencyContext.guidanceTier`;
- `recurringErrorContext.priorityPattern`;
- `kpiContext.impactedByRecentDecision`;
- `eduqaSignals`;
- module code (M1–M10);
- `regenerationAttempt` (may narrow strategy on retry).

Strategy selection is rule-based — never delegated to the provider.

---

# 18. Phase 4 — Prompt Assembly

Prompt assembly binds:

1. selected institutional prompt template (versioned);
2. serialized context subset appropriate for strategy;
3. strategy-specific instruction block;
4. EduQA constraint injection (answer-leak prevention, structure requirements);
5. output format specification (Observation → Business Impact → Process → KPI → Improvement);
6. assistance level cap instructions.

Prompt templates are institutional assets in `prompts/` — never in `docs/` or frontend code.

Assembled prompt is logged as hash — not full content — in audit trail.

---

# 19. Phase 5 — Provider Invocation

ProviderGateway invokes the configured reasoning provider.

Invocation rules:

- timeout enforced (default: 15000ms);
- retry on transient failure (max 1 retry with backoff);
- token limit enforced via configuration;
- model version pinned via `AI_REASONING_MODEL` environment variable;
- provider credentials from Railway Variables only;
- mock provider used in test environments.

Provider returns `ProviderRawResponse` — never delivered directly to students.

OpenAI (Version 1) receives assembled prompt only — never database access.

---

# 20. Phase 6 — Response Validation

EduQA Validator evaluates `ProviderRawResponse` against:

- answer-leak detection;
- mission context alignment;
- business language accuracy;
- assistance level compliance;
- feedback structure compliance;
- competency-appropriate depth;
- KPI interpretation accuracy (read-only check against context);
- hallucination indicators (unsupported claims vs. context package).

Validation outcomes:

| Result | Action |
|--------|--------|
| PASS | Proceed to Phase 7 |
| FAIL — recoverable | Regenerate with constrained prompt (Phase 4–6) |
| FAIL — persistent | Institutional fallback message (Phase 7) |
| FAIL — security | Block, alert, log incident |

---

# End of Part 03/12
---
# 21. Reasoning Strategy Matrix

The Orchestrator selects from eight institutional reasoning strategies.

| Strategy | Code | Primary Use |
|----------|------|-------------|
| Coach Guidance | `coach` | General mission support and concept explanation |
| Hint | `hint` | Progressive clue without revealing answer |
| Reflection | `reflection` | Deep thinking prompts after decisions |
| Feedback | `feedback` | Structured post-decision evaluation |
| Question-First | `question_first` | Socratic guidance — questions before explanations |
| Mission Support | `mission_support` | Active mission phase navigation |
| Competency Guidance | `competency_guidance` | Targeted competency gap support |
| EduQA Recovery | `eduqa_recovery` | Regeneration after validation failure |

Only one primary strategy applies per orchestration attempt.

Secondary strategy modifiers may apply (e.g., recurring error emphasis).

---

# 22. Strategy Selection Rules

```text
IF requestType = reflection          → reflection
IF requestType = review-decision   → feedback
IF requestType = explain-kpi       → coach + KPI modifier
IF requestType = explain-process     → mission_support
IF requestType = explain             → coach
IF regenerationAttempt > 0           → eduqa_recovery
IF priorityPattern.active            → competency_guidance + error modifier
IF assistanceLevel = guidance        → question_first (preferred)
IF assistanceLevel = analysis        → coach
IF assistanceLevel = recommendation  → feedback (M9-M10 only)
IF guidanceTier = M1-M2              → hint (when appropriate)
IF guidanceTier = M9-M10             → reflection or question_first
```

Rules are evaluated in priority order — first match wins unless overridden by regeneration.

Professor-initiated requests may elevate to `coach` with cohort context modifier.

---

# 23. Strategy — Coach Guidance

**Purpose:** Support student understanding during Business Missions.

**Behaviour:**

- explain business concepts in professional language;
- connect decisions to process impact;
- adapt depth to `guidanceTier`;
- follow institutional feedback structure;
- never provide final mission answers.

**Prompt template:** `prompts/v1/coach-guidance.ts`

**Assistance levels:** guidance, analysis

**Modules:** M1–M10

---

# 24. Strategy — Hint

**Purpose:** Provide progressive clues without revealing solutions.

**Behaviour:**

- offer directional clues tied to business situation;
- reference relevant process or department;
- escalate specificity only after repeated student attempts;
- never state the correct decision option directly.

**Prompt template:** `prompts/v1/hint-progressive.ts`

**Assistance levels:** guidance only

**Modules:** M1–M8 (M9–M10 use reflection instead)

---

# 25. Strategy — Reflection

**Purpose:** Encourage deep thinking and self-assessment.

**Behaviour:**

- ask open-ended business questions;
- challenge assumptions (M9–M10);
- reference KPI changes as reflection triggers;
- connect to competency development goals.

**Prompt template:** `prompts/v1/reflection-prompts.ts`

**Assistance levels:** all

**Activation:** reflection activities, post-decision, M9–M10 capstone

---

# 26. Strategy — Feedback

**Purpose:** Deliver structured post-decision evaluation.

**Behaviour:**

- follow Observation → Business Impact → Process → KPI → Improvement structure;
- evaluate decision quality without assigning grades;
- explain consequences from Simulation Engine outcomes;
- suggest review areas based on recurring errors.

**Prompt template:** `prompts/v1/mission-feedback.ts`

**Assistance levels:** analysis, recommendation

**Activation:** end of mission steps, review-decision requests

---

# 27. Strategy — Question-First Guidance

**Purpose:** Socratic method — guide through questions before explanations.

**Behaviour:**

- lead with 1–3 targeted business questions;
- provide explanation only after student engagement signal;
- prevent answer-leak by design;
- preferred strategy for M1–M2 and guidance assistance level.

**Prompt template:** `prompts/v1/question-first.ts`

**Assistance levels:** guidance

**EduQA alignment:** highest answer-leak prevention score

---

# End of Part 04/12
---
# 28. Strategy — Mission Support

**Purpose:** Help students navigate active Business Mission phases.

**Behaviour:**

- clarify current mission phase and business situation;
- explain available decision options in business terms (not recommendations);
- connect scenario narrative to ERP process context;
- support process understanding without decision substitution.

**Prompt template:** `prompts/v1/mission-support.ts`

**Activation:** explain-process requests, mission phase transitions

---

# 29. Strategy — Competency Guidance

**Purpose:** Target support based on identified competency gaps.

**Behaviour:**

- reference specific competency dimensions from context package;
- align guidance with module competency targets;
- prioritize `priorityPattern` from recurring errors;
- suggest concept review areas from Learning Intelligence signals.

**Prompt template:** `prompts/v1/competency-guidance.ts`

**Activation:** when `recurringErrorContext.priorityPattern` is active

---

# 30. Strategy — EduQA Recovery

**Purpose:** Regenerate response after EduQA validation failure.

**Behaviour:**

- apply stricter answer-leak constraints;
- narrow context subset to reduce hallucination risk;
- prefer question-first or hint over direct explanation;
- include explicit validation failure reason in prompt constraint block;
- never widen guidance beyond original assistance level.

**Prompt template:** `prompts/v1/eduqa-recovery.ts`

**Activation:** `regenerationAttempt > 0`

**Max attempts:** 2 (configurable via `AI_ORCHESTRATOR_MAX_REGENERATIONS`)

---

# 31. KPI Interpretation Strategy Modifier

When `kpiContext.impactedByRecentDecision = true`, any primary strategy receives KPI modifier:

- include KPI delta in prompt context block;
- require KPI Interpretation section in response structure;
- validate KPI references against context package values only;
- prohibit KPI values not present in context snapshot.

KPI modifier prevents hallucinated metric references.

---

# 32. Recurring Error Strategy Modifier

When active recurring error pattern exists:

- prepend targeted review area to prompt constraints;
- AI Coach emphasizes error pattern in feedback strategy;
- competency_guidance strategy preferred if pattern persists across attempts;
- Learning Intelligence notified on delivery (async).

Modifier does not expose occurrence counts to students — only business-language description.

---

# 33. Educational Decision Engine Rules

EDU-ORCH-001

Strategy selection shall be rule-based — never provider-determined.

EDU-ORCH-002

Assistance level shall cap strategy depth.

EDU-ORCH-003

Recommendation assistance is restricted to M9–M10 modules.

EDU-ORCH-004

Question-first is preferred for guidance level requests.

EDU-ORCH-005

Feedback structure is mandatory for feedback and coach strategies.

EDU-ORCH-006

Final mission answers shall never be generated by any strategy.

---

# End of Part 05/12
---
# 34. Provider Abstraction Layer

The Provider Layer isolates all LLM provider specifics from institutional orchestration logic.

```typescript
interface ReasoningProvider {
  readonly providerId: string;
  generate(request: ProviderGenerateRequest): Promise<ProviderRawResponse>;
  healthCheck(): Promise<ProviderHealthStatus>;
  estimateTokens(request: ProviderGenerateRequest): Promise<number>;
}
```

Implementations:

| Provider | Status | Module |
|----------|--------|--------|
| OpenAI | Version 1 — production | `openai-reasoning.provider.ts` |
| Mock | Test environments | `mock-reasoning.provider.ts` |
| Future providers | Planned | implement `ReasoningProvider` interface |

Provider selection: `AI_REASONING_PROVIDER=openai`

Provider factory resolves implementation at application startup.

---

# 35. OpenAI — Version 1 Provider Boundary

OpenAI is the **Version 1 reasoning provider only**.

OpenAI responsibilities:

- receive assembled institutional prompt;
- generate language output;
- return token usage metadata.

OpenAI does not:

- select reasoning strategy;
- access PostgreSQL or Prisma;
- validate its own output;
- modify scores, competencies or certifications;
- define pedagogical rules;
- store conversation history (TEC.ERP persists all records);
- constitute institutional intelligence.

Replacing OpenAI requires:

1. new `ReasoningProvider` implementation;
2. environment variable update;
3. contract tests passing;
4. Approval Gate evidence.

No changes to Orchestrator, Context Engine or AI Coach contracts.

---

# 36. Provider Generate Request

Data crossing the provider boundary:

```typescript
interface ProviderGenerateRequest {
  requestId: string;
  assembledPrompt: string;
  promptTemplateVersion: string;
  strategyCode: ReasoningStrategy;
  modelConfig: {
    model: string;
    maxTokens: number;
    temperature: number;
    timeoutMs: number;
  };
  contextSubsetHash: string;  // reference only — not full package
}
```

The provider never receives:

- database connection strings;
- full unfiltered AIContextPackage;
- other students' data;
- Prisma entity objects;
- internal system identifiers.

---

# 37. Provider Raw Response

```typescript
interface ProviderRawResponse {
  requestId: string;
  rawContent: string;
  finishReason: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  modelUsed: string;
  providerId: string;
}
```

Raw responses are:

- stored internally for audit (separate from delivered message);
- passed to EduQA Validator — never directly to React;
- discarded after successful validation and delivery packaging.

---

# 38. Provider Fallback and Retry

**Retry policy (transient failures):**

- network timeout: 1 retry with exponential backoff (500ms);
- rate limit (429): 1 retry after provider-specified delay (max 3000ms);
- server error (5xx): 1 retry after 1000ms.

**Fallback policy (persistent failures):**

- provider unavailable: institutional fallback message;
- token limit exceeded: regenerate with reduced context subset;
- persistent EduQA failure: institutional fallback message;
- security validation failure: block delivery, alert operations.

Fallback messages are pre-approved institutional templates — not provider-generated.

---

# 39. Cost and Token Controls

| Control | Configuration |
|---------|---------------|
| Max tokens per request | `AI_REASONING_MAX_TOKENS` (default: 1024) |
| Max tokens per conversation session | `AI_SESSION_TOKEN_BUDGET` (default: 8192) |
| Daily cohort token budget | `AI_COHORT_DAILY_TOKEN_BUDGET` (institutional policy) |
| Cost alert threshold | Railway monitoring + institutional dashboard |

Token budgets are enforced at Phase 1 (Admission).

Exceeded budgets return `OrchestratorBudgetError` — not silent truncation.

---

# 40. Model Versioning

Model selection via environment variables:

| Variable | Purpose |
|----------|---------|
| `AI_REASONING_MODEL` | Active model identifier |
| `AI_REASONING_MODEL_FALLBACK` | Secondary model if primary unavailable |
| `AI_REASONING_TEMPERATURE` | Generation temperature (default: 0.3) |

Model changes require:

- regression testing against EduQA validation suite;
- Approval Gate evidence;
- prompt template compatibility verification.

Model version is logged in every `ProviderInvocationMetadata` record.

---

# 41. Provider Layer Rules

PROV-001

Provider SDK imports shall exist only in `provider/` directory.

PROV-002

OpenAI API keys shall exist only in Railway Variables.

PROV-003

Provider replacement shall not require Orchestrator logic changes.

PROV-004

Mock provider shall be used in all automated tests.

PROV-005

Token budgets shall be enforced before provider invocation.

PROV-006

Provider health check shall be included in Railway health endpoint.

---

# End of Part 06/12
---
# 42. TypeScript Interface Direction

Shared types in `src/services/ai/orchestrator/types/`:

```typescript
type ReasoningStrategy =
  | 'coach'
  | 'hint'
  | 'reflection'
  | 'feedback'
  | 'question_first'
  | 'mission_support'
  | 'competency_guidance'
  | 'eduqa_recovery';

interface ReasoningOrchestrationRequest {
  orchestrationId: string;
  contextPackage: AIContextPackage;
  conversationId: string;
  requestedByRole: 'student' | 'professor' | 'administrator';
  priority: 'normal' | 'elevated';
  regenerationAttempt: number;
}

interface ReasoningDeliveryPackage {
  messageId: string;
  deliveredContent: string;
  strategyUsed: ReasoningStrategy;
  feedbackStructure: FeedbackStructureBlock;
  eduqaValidated: true;
  promptTemplateVersion: string;
}

interface EduqaValidationResult {
  passed: boolean;
  validationCode: string;
  failureReasons?: string[];
  attemptNumber: number;
}

interface OrchestratorError {
  code: string;
  message: string;
  phase: OrchestrationPhase;
  recoverable: boolean;
}
```

Strict TypeScript mode mandatory. No `any` in orchestration contracts.

---

# 43. Express Service Layer

File structure:

```text
src/
  services/
    ai/
      orchestrator/
        reasoning-orchestrator.service.ts    # Main orchestrator
        request-admission.service.ts        # Phase 1
        context-verification.service.ts     # Phase 2
        strategy-selector.service.ts        # Phase 3
        prompt-assembler.service.ts         # Phase 4
        provider-gateway.service.ts         # Phase 5
        response-validator.service.ts       # Phase 6
        delivery-coordinator.service.ts     # Phase 7
        feedback-dispatcher.service.ts      # Phase 8
        provider/
          reasoning-provider.interface.ts
          openai-reasoning.provider.ts
          mock-reasoning.provider.ts
          provider.factory.ts
        prompts/
          v1/
            coach-guidance.ts
            hint-progressive.ts
            reflection-prompts.ts
            mission-feedback.ts
            question-first.ts
            mission-support.ts
            competency-guidance.ts
            eduqa-recovery.ts
        types/
          orchestration-request.ts
          orchestration-result.ts
          reasoning-strategy.ts
          provider-contracts.ts
  routes/
    ai/
      guidance.routes.ts   # Delegates to Orchestrator via AI Coach Service
```

Routes never invoke ProviderGateway directly.

---

# 44. ReasoningOrchestratorService

```typescript
class ReasoningOrchestratorService {
  async orchestrate(input: ReasoningOrchestrationRequest): Promise<ReasoningOrchestrationResult> {
    const trace = this.audit.start(input);
    try {
      await this.admission.verify(input);
      await this.contextVerification.verify(input.contextPackage);
      const strategy = this.strategySelector.select(input);
      const prompt = this.promptAssembler.build(input.contextPackage, strategy);
      const raw = await this.providerGateway.invoke(prompt, strategy);
      const validation = await this.responseValidator.validate(raw, input.contextPackage, strategy);
      if (!validation.passed) {
        return this.handleRegeneration(input, validation, trace);
      }
      const delivery = await this.deliveryCoordinator.package(raw, validation, strategy);
      this.feedbackDispatcher.dispatchAsync(input, delivery);
      this.audit.complete(trace, delivery);
      return { success: true, deliveryPackage: delivery, /* ... */ };
    } catch (error) {
      this.audit.fail(trace, error);
      return { success: false, error: this.mapError(error) };
    }
  }
}
```

Total orchestration SLA target: **≤ 20000ms** (P95) including one regeneration on Railway production.

---

# 45. Context Package Dependency

The Orchestrator depends exclusively on `AIContextPackage` from Context Engine (`28` §21–27).

Dependency rules:

- Orchestrator never calls Prisma;
- if context is stale, Orchestrator requests Context Engine rebuild via AI Coach Service;
- context package version mismatch triggers graceful error — not partial processing;
- `contextHash` verified before every provider invocation;
- context subset for prompt assembly is strategy-specific — not full package.

Context Engine failure = Orchestrator cannot proceed.

There is no fallback to empty context.

---

# 46. AI Coach Integration

Integration sequence:

```text
1. Student/professor triggers AI Coach action in React
2. AI Coach Route receives HTTP request
3. AI Coach Service calls Context Engine.buildContext()
4. AI Coach Service calls ReasoningOrchestrator.orchestrate()
5. Orchestrator returns ReasoningDeliveryPackage
6. AI Coach Service persists AI Message (delivered content)
7. AI Coach Service returns HTTP response to React
8. React renders structured feedback
```

AI Coach Service owns persistence.

Orchestrator owns reasoning coordination.

Clear separation prevents responsibility overlap.

---

# 47. React Integration Points

React responsibilities:

- trigger AI requests via official API endpoints (`18` §38–41);
- pass `missionId`, `moduleId`, `requestType` only;
- display `ReasoningDeliveryPackage` structured feedback;
- show loading state during orchestration (context + reasoning + validation);
- handle orchestration errors with institutional messages;
- never display raw provider output;
- never invoke OpenAI or orchestrator services directly.

Loading indicator should reflect full pipeline duration — not provider-only latency.

---

# 48. Express Route Responsibilities

AI guidance routes delegate to AI Coach Service — not Orchestrator directly.

```typescript
// guidance.routes.ts — simplified
router.post('/ai/explain', authenticate, async (req, res) => {
  const result = await aiCoachService.handleExplainRequest(req.user, req.body);
  if (!result.success) return res.status(result.statusCode).json(result.error);
  return res.json(result.response);
});
```

AI Coach Service orchestrates Context Engine and Reasoning Orchestrator calls.

Routes handle HTTP concerns only: auth, validation, status codes, rate limit headers.

---

# End of Part 07/12
---
# 49. EduQA Integration

EduQA validation is Phase 6 of the orchestration lifecycle.

EduQA Validator receives:

- `ProviderRawResponse`;
- `AIContextPackage` (for context alignment checks);
- `ReasoningStrategy` (for depth compliance);
- `regenerationAttempt` (for escalating constraints).

Validation checks (`22` §30, `27` §29):

✓ Answer-leak detection

✓ Mission context alignment

✓ Business language accuracy

✓ Assistance level compliance

✓ Feedback structure compliance

✓ Competency-appropriate depth

✓ No unsupported KPI claims

✓ Professor authority preserved

Failed validation triggers regeneration with `eduqa_recovery` strategy.

Persistent failure delivers institutional fallback template.

---

# 50. EduQA Regeneration Loop

```text
Provider Response
↓
EduQA Validate
↓
PASS → Deliver
↓
FAIL → regenerationAttempt++
↓
regenerationAttempt ≤ max → eduqa_recovery strategy → Provider Response
↓
regenerationAttempt > max → Institutional Fallback → Deliver
```

Regeneration audit trail links all attempts to original `orchestrationId`.

Prior failed raw responses are stored for EduQA review — not delivered.

---

# 51. Learning Intelligence Integration

After successful delivery (Phase 8 — async):

Orchestrator dispatches to Learning Intelligence:

- strategy used;
- request type;
- validation attempt count;
- competency context at time of request;
- recurring error pattern reference;
- KPI impact flag;
- delivery success/fallback flag.

Learning Intelligence uses signals to:

- update recurring error patterns;
- refine competency gap detection;
- inform future Context Engine enrichment.

Async dispatch failure is logged — does not affect delivered response.

---

# 52. Response Validation — Hallucination Controls

Hallucination controls beyond EduQA:

| Control | Method |
|---------|--------|
| KPI claim verification | Compare response KPI references against `kpiContext.kpis` |
| Mission fact verification | Compare claims against `missionContext` fields |
| Unsupported recommendation | Flag recommendations not grounded in context |
| Cross-module claim check | Verify process connections exist in context |
| Answer-leak pattern match | Regex + semantic check against decision options |

Detected hallucinations trigger EduQA FAIL — regeneration required.

Repeated hallucination patterns trigger Learning Intelligence alert.

---

# 53. Safety and Governance Controls

| Control | Implementation |
|---------|----------------|
| Rate limiting | Per student: 10 requests/minute; per cohort: configurable |
| Token budgets | Phase 1 admission check |
| Prompt injection defense | Sanitize student message input; context package is trusted (server-built) |
| Output content filter | EduQA + institutional blocklist patterns |
| Role-based strategy limits | Professor vs. student strategy availability |
| Concurrent request lock | Optional per-conversation mutex |
| Provider credential isolation | Railway Variables; never in code or logs |
| Audit completeness | All 8 phases emit events |

Safety violations block delivery and trigger incident logging per `26`.

---

# 54. Governance Rules

GOV-ORCH-001

EduQA validation is mandatory for every student-facing response.

GOV-ORCH-002

Raw provider output shall never reach React clients.

GOV-ORCH-003

Orchestrator shall never import Prisma client.

GOV-ORCH-004

Rate limits shall be enforced at admission.

GOV-ORCH-005

Hallucination detections shall be logged and monitored.

GOV-ORCH-006

Provider credentials shall never appear in audit logs or error messages.

---

# End of Part 08/12
---
# 55. Observability and Audit Logs

Audit events per orchestration:

| Event | Phase | Key Data |
|-------|-------|----------|
| `orchestration.admitted` | 1 | orchestrationId, role, strategy candidates |
| `orchestration.context.verified` | 2 | contextHash, packageVersion |
| `orchestration.strategy.selected` | 3 | strategyCode, selectionReason |
| `orchestration.prompt.assembled` | 4 | templateVersion, promptHash |
| `orchestration.provider.invoked` | 5 | providerId, model, latencyMs, tokens |
| `orchestration.provider.retry` | 5 | attemptNumber, reason |
| `orchestration.validation.result` | 6 | passed, validationCode, attemptNumber |
| `orchestration.regeneration.triggered` | 6 | attemptNumber, failureReasons |
| `orchestration.delivered` | 7 | messageId, strategyCode |
| `orchestration.feedback.dispatched` | 8 | learningIntelligenceRef |
| `orchestration.failed` | any | phase, errorCode |

Structured JSON logs on Railway.

---

# 56. Operational Metrics

| Metric | Target |
|--------|--------|
| `orchestration.duration_ms` P95 | ≤ 20000ms |
| `orchestration.success_rate` | ≥ 99% |
| `orchestration.eduqa.first_pass_rate` | ≥ 95% |
| `orchestration.regeneration.rate` | monitored |
| `orchestration.provider.error_rate` | ≤ 1% |
| `orchestration.hallucination.detection_rate` | monitored |
| `orchestration.fallback.rate` | ≤ 0.5% |
| `orchestration.token.usage_daily` | within budget |

Alerts configured per `21_PLATFORM_OPERATIONS_PLAYBOOK.md`.

---

# 57. Incident Handling

| Incident | Response |
|----------|----------|
| Provider outage | Institutional fallback; alert operations |
| Elevated EduQA failure rate | Pause AI Coach; investigate prompt templates |
| Hallucination spike | Tighten validation; review context package quality |
| Rate limit abuse | Temporary student lock; professor notification |
| Token budget exceeded | Graceful error; cohort budget review |
| Security validation failure | Block delivery; security incident log |

Incident response follows `21` and `26` procedures.

Never expose provider error details to students.

---

# 58. Failure Modes

| Failure | Phase | Behaviour |
|---------|-------|-----------|
| Rate limit exceeded | 1 | `OrchestratorAdmissionError` |
| Context package missing | 2 | `ContextIntegrityError` — request Context Engine rebuild |
| Unsupported strategy for assistance level | 3 | `StrategySelectionError` |
| Prompt assembly failure | 4 | `PromptAssemblyError` |
| Provider timeout | 5 | Retry once → fallback |
| Provider auth failure | 5 | Alert operations; fallback |
| EduQA persistent failure | 6 | Institutional fallback message |
| Delivery persistence failure | 7 | Error to client; orchestration logged |
| Learning Intelligence dispatch failure | 8 | Logged only — response already delivered |

Orchestrator never returns partial or unvalidated AI content.

---

# 59. Failure Mode Rules

FAIL-ORCH-001

Never deliver unvalidated provider output.

FAIL-ORCH-002

Never bypass EduQA validation under error conditions.

FAIL-ORCH-003

Never expose provider internals in client error messages.

FAIL-ORCH-004

Provider outage shall trigger fallback — not hung requests.

FAIL-ORCH-005

All failure modes shall emit audit events with phase identification.

FAIL-ORCH-006

Repeated failures shall trigger operational alerts on Railway.

---

# 60. Railway Deployment Considerations

Orchestrator deploys embedded in Express application on Railway.

Requirements:

- `AI_REASONING_API_KEY` in Railway Variables;
- provider health check in `/health/ai` endpoint;
- request timeout aligned with Railway HTTP timeout (default: 30s);
- structured JSON logging to Railway deployment logs;
- token budget counters in PostgreSQL (via AI Coach Service — not Orchestrator Prisma);
- no separate Railway service required;
- mock provider active in staging environment;
- OpenAI connectivity verified in deployment smoke test.

Production activation requires Approval Gate evidence.

---

# End of Part 09/12
---
# 61. Test Strategy

Orchestrator testing follows `23_TESTING_STRATEGY.md`.

**Unit Tests**

- strategy selection rules for all request types and modules;
- prompt assembly for each strategy template;
- context verification logic;
- regeneration loop termination;
- token budget enforcement.

**Integration Tests**

- full orchestration lifecycle with mock provider;
- EduQA validation pass and fail paths;
- regeneration with eduqa_recovery strategy;
- fallback on persistent provider failure;
- Learning Intelligence async dispatch.

**Contract Tests**

- AIContextPackage consumption compatibility with Context Engine v1.0;
- ReasoningDeliveryPackage output compatibility with AI Coach Service;
- ReasoningProvider interface compliance.

**Security Tests**

- rate limit enforcement;
- prompt injection sanitization;
- raw provider output exclusion from HTTP responses.

All tests use MockReasoningProvider — never live OpenAI in CI.

---

# 62. Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Valid context + coach strategy | EduQA pass → delivered response |
| Guidance level explain request | question_first strategy selected |
| review-decision request | feedback strategy selected |
| Active recurring error | competency_guidance + error modifier |
| EduQA fail first attempt | eduqa_recovery regeneration |
| EduQA fail all attempts | institutional fallback delivered |
| Provider timeout | retry → fallback |
| Token budget exceeded | OrchestratorBudgetError |
| Stale context package | ContextIntegrityError |
| Missing contextHash | ContextIntegrityError |
| Rate limit exceeded | OrchestratorAdmissionError |

Every scenario verifies complete audit event chain.

---

# 63. Orchestrator Validation Checklist

Before Approval Gate:

✓ ReasoningOrchestratorService implements 8-phase lifecycle

✓ Strategy selection rules match §22 matrix

✓ All 8 prompt templates versioned in prompts/v1/

✓ ProviderGateway uses ReasoningProvider interface only

✓ OpenAI provider isolated in provider/ directory

✓ No Prisma imports in orchestrator module

✓ EduQA validation blocks unvalidated delivery

✓ Regeneration loop respects max attempts

✓ Mock provider used in all automated tests

✓ Rate limits and token budgets enforced

✓ Audit events emit for all phases

✓ Railway smoke test passes with mock provider

✓ React receives delivered content only — never raw provider output

---

# 64. Orchestrator Success Criteria

The Reasoning Orchestrator is successful when:

- every AI response is strategy-selected, provider-generated and EduQA-validated;
- provider replacement requires changes to provider/ module only;
- zero raw provider output reaches React clients;
- EduQA first-pass rate meets institutional target (≥ 95%);
- orchestration completes within SLA on Railway production;
- Learning Intelligence receives async feedback on every successful delivery;
- audit trail reconstructs any orchestration decision from logs alone.

Orchestration quality is measurable — not assumed.

---

# 65. Continuous Orchestrator Improvement

Improvement activities:

- refine strategy selection rules based on EduQA failure analysis;
- optimize prompt templates for first-pass validation rate;
- tune regeneration constraints to reduce fallback rate;
- evaluate alternative providers through abstraction interface;
- reduce P95 latency through prompt optimization;
- expand hallucination detection patterns;
- improve institutional fallback message quality.

Orchestrator maturity increases with every platform release.

---

# 66. Orchestrator Evolution Rules

EVOL-ORCH-001

New strategies require prompt template, selection rules and Approval Gate evidence.

EVOL-ORCH-002

Provider additions implement ReasoningProvider — no Orchestrator logic changes.

EVOL-ORCH-003

EduQA validation changes require educational specialist review.

EVOL-ORCH-004

Token budget changes require institutional policy approval.

EVOL-ORCH-005

Performance regressions block release until resolved.

EVOL-ORCH-006

Every evolution shall preserve provider independence and EduQA governance.

---

# End of Part 10/12
---
# 67. Final Orchestrator Governance

Final Orchestrator Governance confirms that the coordination layer of Enterprise Educational Intelligence is operational, validated and institutionally controlled.

The Orchestrator transforms validated context into governed responses.

It is the institutional gatekeeper between approved context and external reasoning providers.

Governance ensures no provider output reaches students without EduQA approval.

---

# 68. Orchestrator Closure

Every Orchestrator release shall conclude with formal closure.

Orchestrator Closure includes:

✓ Eight-Phase Lifecycle Validated

✓ Strategy Selection Rules Verified

✓ Prompt Templates Versioned and Tested

✓ Provider Abstraction Validated

✓ OpenAI Provider Boundary Confirmed

✓ EduQA Integration Verified

✓ Regeneration Loop Tested

✓ Learning Intelligence Dispatch Confirmed

✓ Security Controls Validated

✓ Railway Deployment Confirmed

✓ Audit Logging Operational

✓ Documentation Updated

✓ Approval Gate Completed

Formal closure ensures institutional traceability.

---

# 69. Final Orchestrator Principles

ORCH-FINAL-001

The Orchestrator never queries the database directly.

ORCH-FINAL-002

Only validated Context Packages enter the reasoning pipeline.

ORCH-FINAL-003

Educational strategy selection belongs to TEC.ERP — not the provider.

ORCH-FINAL-004

OpenAI is the Version 1 reasoning provider — replaceable without architectural change.

ORCH-FINAL-005

EduQA validation is mandatory before every student-facing delivery.

ORCH-FINAL-006

Every orchestration produces a complete audit trace.

---

# End of Part 11/12
---
# 70. VS Code / Cursor Commands

Official engineering commands for Reasoning Orchestrator work.

## Document Review

```powershell
code docs/29_AI_REASONING_ORCHESTRATOR.md
code docs/28_AI_CONTEXT_ENGINE.md
code docs/27_AI_ARCHITECTURE.md
code docs/09_AI_COACH_ARCHITECTURE.md
code docs/18_API_SPECIFICATION.md
```

## Cursor Context Activation

When implementing Orchestrator features in Cursor, ensure these rules are active:

- `.cursor/rules/tec_erp_ai_architecture.mdc`
- `.cursor/rules/tec_erp_engineering.mdc`
- `.cursor/rules/tec_erp_architecture.mdc`

Reference project context:

```powershell
code .cursor/context/TEC_ERP_PROJECT_CONTEXT.md
```

## Pre-Implementation Checklist (Cursor)

Before writing Orchestrator code, Cursor shall confirm:

1. ReasoningOrchestrationRequest/Result interfaces defined
2. No Prisma imports in orchestrator module
3. Provider SDK isolated to provider/ directory
4. All 8 strategy templates planned in prompts/v1/
5. EduQA validation integrated in Phase 6
6. Regeneration loop with max attempts configured
7. Mock provider configured for tests
8. Approval Gate criteria understood

## Validation Commands

```powershell
npm run build
npm run test -- --grep "orchestrator"
npm run lint
npm run test -- --grep "eduqa"
```

All commands must pass before Approval Gate.

---

# 71. Git Closure Package

Official git workflow for Reasoning Orchestrator documentation and implementation closure.

## Status Review

```powershell
git status
git diff
```

## Stage Orchestrator Work

```powershell
git add docs/29_AI_REASONING_ORCHESTRATOR.md
git add src/services/ai/orchestrator/
git add src/services/ai/orchestrator/provider/
git add src/services/ai/orchestrator/prompts/
```

Stage only files related to the approved Orchestrator scope.

Never stage `.env`, credentials or provider API keys.

## Pre-Commit Verification

```powershell
npm run build
npm run test
git diff --cached
```

## Commit

```powershell
git commit -m "docs: add AI reasoning orchestrator architecture"
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

Orchestrator PRs shall include:

- objective and implementation summary;
- strategy selection rules implemented;
- prompt template versions;
- EduQA first-pass rate from test suite;
- provider abstraction verification;
- mock provider test evidence;
- Railway deployment readiness;
- Approval Gate status;
- alignment with `27` and `28`.

---

# 72. Approval Gate

Reasoning Orchestrator Approval Gate is mandatory before production activation (`19` §9, `24` §21, `27` §71).

## Gate Checklist

| Domain | Criterion | Status |
|--------|-----------|--------|
| Architecture | Eight-phase lifecycle implemented | ☐ |
| Context Dependency | Consumes AIContextPackage v1.0 only; no Prisma | ☐ |
| Strategy Selection | All 8 strategies with selection rules verified | ☐ |
| Prompt Templates | Versioned templates for all strategies | ☐ |
| Provider Layer | ReasoningProvider interface; OpenAI isolated | ☐ |
| Provider Independence | Mock provider swap test passed | ☐ |
| EduQA Integration | Validation blocks unvalidated delivery | ☐ |
| Regeneration | eduqa_recovery loop with max attempts | ☐ |
| AI Coach Integration | ReasoningDeliveryPackage contract verified | ☐ |
| Learning Intelligence | Async dispatch on successful delivery | ☐ |
| Security | Rate limits, token budgets, no credential exposure | ☐ |
| Hallucination Controls | KPI and mission fact verification active | ☐ |
| Testing | Unit, integration, contract tests passed | ☐ |
| Observability | All audit events and metrics operational | ☐ |
| Railway | Deployment and smoke test passed | ☐ |
| Documentation | This document aligned with `27` and `28` | ☐ |

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

# 73. Document Status

**Document:** AI Reasoning Orchestrator

**Version:** 1.0

**Status:** Official Enterprise AI Component Standard — Complete

**Parts:** 12/12

**Approval Gate:** Pending Institutional Review

**Last Updated:** 2026

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

This document establishes the official implementation architecture for the AI Reasoning Orchestrator — the coordination layer of TEC.ERP Enterprise Educational Intelligence.

The LLM is replaceable.

The intelligence belongs to TEC.ERP.

---

# End of Part 12/12

# End of Document

**Document Status:** AI Reasoning Orchestrator Complete
