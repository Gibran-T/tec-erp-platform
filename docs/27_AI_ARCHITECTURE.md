# TEC.ERP — AI Architecture

**Document:** AI Architecture

**Version:** 1.0

**Status:** Official Enterprise AI Standard

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

---

# 1. Purpose

This document defines the official Artificial Intelligence architecture for TEC.ERP Version 1.

It establishes how Enterprise Educational Intelligence is designed, implemented, persisted, validated, deployed and governed across the platform lifecycle.

TEC.ERP does not deploy AI as a generic chatbot.

TEC.ERP deploys **Enterprise Educational Intelligence** — an institutional capability that supports business reasoning, mission-based learning, competency development and educational quality assurance within the official ERP simulation environment.

This architecture is the authoritative reference for AI-related engineering, operations, quality assurance and institutional governance.

---

# 2. AI Mission

The mission of the TEC.ERP AI Architecture is to strengthen educational outcomes while preserving institutional control over learning intelligence.

The AI system shall:

- support student reasoning without replacing student decisions;
- reinforce Business Mission learning with contextual guidance;
- connect decisions, KPIs, processes and competencies;
- provide traceable, auditable educational feedback;
- enable professor visibility into learning patterns;
- integrate with EduQA and institutional quality standards;
- remain provider-independent at the architectural level;
- operate reliably on Railway production infrastructure.

AI exists to improve learning quality — not to automate academic judgement.

---

# 3. AI Philosophy

TEC.ERP adopts an **Intelligence-Before-Provider** philosophy.

Institutional intelligence is defined by TEC.ERP.

External language models provide reasoning capability — not educational authority.

```text
Business Mission Context
↓
Student History
↓
Context Engine
↓
Reasoning Engine
↓
Learning Intelligence
↓
AI Coach Response
↓
Feedback Loop
↓
EduQA Validation
```

The LLM is replaceable.

The intelligence belongs to TEC.ERP.

OpenAI may serve as the reasoning provider.

OpenAI does not constitute institutional intelligence.

---

# 4. AI Principles

AI-ARCH-001

Enterprise Educational Intelligence has priority over generic conversational AI.

AI-ARCH-002

The LLM is replaceable; institutional intelligence is not.

AI-ARCH-003

AI never modifies assessment results, scores or certifications.

AI-ARCH-004

AI feedback must remain context-aware and mission-bound.

AI-ARCH-005

Student history, competencies and recurring errors inform every coaching interaction.

AI-ARCH-006

Educational quality (EduQA) governs AI behaviour.

AI-ARCH-007

All AI interactions shall be persisted and auditable.

AI-ARCH-008

Provider independence shall be preserved through abstraction layers.

AI-ARCH-009

Security-by-design applies to every AI component.

AI-ARCH-010

Railway-first deployment constraints govern production AI services.

---

# 5. AI Scope

This architecture covers:

- AI Foundation
- AI Coach
- Context Engine
- Reasoning Engine
- Learning Intelligence
- Student history integration
- Business Mission context binding
- KPI and competency signal consumption
- Recurring error detection and feedback loops
- EduQA alignment
- PostgreSQL + Prisma persistence model
- React + Express + TypeScript implementation direction
- Railway deployment and operational constraints
- Provider abstraction and OpenAI integration boundaries
- AI testing, governance and Approval Gate requirements

This document does not redefine Business Missions, Simulation Engine logic or certification rules.

Those domains remain governed by their respective official specifications.

---

# 6. Related Documents

This architecture complements and must remain aligned with:

| Document | Relationship |
|----------|--------------|
| `09_AI_COACH_ARCHITECTURE.md` | AI Coach pedagogical role and functions |
| `13_SYSTEM_ARCHITECTURE.md` | Six-layer platform architecture |
| `15_ERP_FUNCTIONAL_SPECIFICATION.md` | AI Coach functional requirements |
| `17_DATABASE_SCHEMA.md` | AI Layer entities and persistence rules |
| `18_API_SPECIFICATION.md` | AI Coach REST endpoints |
| `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` | Engineering execution standards |
| `22_QUALITY_ASSURANCE_MANUAL.md` | EduQA and educational AI validation |
| `23_TESTING_STRATEGY.md` | AI testing requirements |
| `24_RELEASE_MANAGEMENT.md` | Release and Approval Gate lifecycle |
| `25_DEPLOYMENT_GUIDE.md` | Railway deployment methodology |
| `26_SECURITY_ARCHITECTURE.md` | Security controls for AI services |

When conflicts arise, follow the source-of-truth hierarchy defined in `19_CURSOR_MASTER_BUILD_SPECIFICATION.md` §4.

---

# End of Part 01/12
---
# 7. Enterprise Educational Intelligence

Enterprise Educational Intelligence (EEI) is the institutional AI capability of TEC.ERP.

EEI is not a chat interface.

EEI is a governed system that assembles business context, learning history, simulation outcomes and pedagogical rules before invoking external reasoning capability.

EEI distinguishes TEC.ERP from platforms that embed unstructured conversational AI without educational architecture.

---

# 8. Generic Chatbot vs Enterprise Educational Intelligence

| Generic Chatbot | Enterprise Educational Intelligence |
|-----------------|-------------------------------------|
| Unbounded conversation | Mission-bound context |
| Provider-defined behaviour | Institution-defined behaviour |
| No learning history | Full student history integration |
| No KPI awareness | KPI and simulation-aware |
| No competency model | Competency-driven guidance |
| No EduQA governance | EduQA-validated responses |
| No audit trail | Full persistence and traceability |
| Provider owns intelligence | TEC.ERP owns intelligence |

TEC.ERP shall never expose unconstrained general-purpose AI to students.

All AI interactions occur within defined educational contexts.

---

# 9. AI Foundation

The AI Foundation provides the institutional base upon which all AI capabilities operate.

The AI Foundation includes:

- AI governance policies and principles (this document);
- provider abstraction infrastructure;
- configuration management (environment variables, Railway secrets);
- logging, audit and monitoring hooks;
- security controls aligned with `26_SECURITY_ARCHITECTURE.md`;
- TypeScript service interfaces shared across Express backend services;
- Prisma data access patterns for AI entities;
- EduQA validation hooks before response delivery.

The AI Foundation ensures that AI Coach, Context Engine, Reasoning Engine and Learning Intelligence operate as coordinated institutional services — not isolated features.

---

# 10. Replaceable LLM Principle

The Reasoning Engine invokes external language models through a provider abstraction layer.

Architectural requirements:

- no business logic inside provider-specific SDK calls;
- no direct OpenAI calls from React components;
- no hardcoded prompts in frontend code;
- provider configuration via environment variables only;
- provider swap shall not require changes to Context Engine, Learning Intelligence or AI Coach contracts;
- fallback and error handling remain institutionally defined.

**OpenAI** is designated as the **Version 1 reasoning provider**.

OpenAI generates language output from institutional prompts and context.

OpenAI does not define:

- pedagogical rules;
- mission boundaries;
- competency thresholds;
- EduQA criteria;
- feedback structure;
- professor visibility policies;
- data retention rules.

Those belong exclusively to TEC.ERP.

---

# 11. Intelligence Ownership Model

```text
┌─────────────────────────────────────────────┐
│           TEC.ERP OWNS                       │
│  Context · Rules · History · EduQA · Audit  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        REASONING PROVIDER (replaceable)      │
│  OpenAI — language generation only           │
└─────────────────────────────────────────────┘
```

Institutional intelligence flows downward.

Provider output flows upward through validation layers before reaching the student.

---

# 12. AI Architecture Components

TEC.ERP AI Architecture comprises five primary components:

```text
AI Foundation
↓
Context Engine ──→ Reasoning Engine ──→ Learning Intelligence
↓                        ↓                        ↓
              AI Coach ← Feedback Loops → EduQA
```

| Component | Responsibility |
|-----------|----------------|
| AI Foundation | Governance, security, provider abstraction, configuration |
| Context Engine | Assembles mission, history, KPI, competency and error context |
| Reasoning Engine | Invokes provider with institutional prompts; returns raw reasoning output |
| Learning Intelligence | Interprets patterns, generates insights, detects recurring errors |
| AI Coach | Delivers pedagogical responses to students and professors |

Each component is implemented as an Express backend service layer.

The React frontend communicates exclusively through the official API (`18_API_SPECIFICATION.md` §38–42).

---

# 13. AI Architecture Rules

AI-RULE-001

No AI feature shall bypass the Context Engine.

AI-RULE-002

No AI response shall reach the student without EduQA validation hooks.

AI-RULE-003

No provider SDK shall be invoked from the Presentation Layer.

AI-RULE-004

All AI state shall persist through PostgreSQL via Prisma.

AI-RULE-005

Recurring error patterns shall feed back into Learning Intelligence.

AI-RULE-006

Provider replacement shall not alter institutional AI contracts.

---

# End of Part 02/12
---
# 14. Platform Layer Placement

The AI Architecture spans three official system layers (`13_SYSTEM_ARCHITECTURE.md`):

**Layer 2 — Application**

- AI request routing
- authentication and session binding
- role-based AI access (student, professor, administrator)

**Layer 3 — Simulation Engine**

- KPI outcomes consumed by Context Engine
- decision evaluation signals
- mission state transitions

**Layer 4 — Business Services**

- AI Coach Service
- Context Engine Service
- Reasoning Engine Service
- Learning Intelligence Service

**Layer 5 — Data Layer**

- AI Conversation, AI Message, AI Recommendation, Learning Insight entities
- Student Competency and Mission Attempt history
- Recurring error pattern storage

**Layer 6 — Infrastructure**

- Railway hosting
- PostgreSQL persistence
- environment variable management
- logging and monitoring

---

# 15. AI Coach

The AI Coach is the student-facing and professor-facing expression of Enterprise Educational Intelligence.

The AI Coach implements the pedagogical model defined in `09_AI_COACH_ARCHITECTURE.md`.

Core functions:

- Mission Feedback
- Reflection Prompts
- Error Explanation
- Recommendation Support (M9–M10)
- Professor Insights

The AI Coach operates exclusively through institutional intelligence.

It never delivers unconstrained provider responses.

Every AI Coach interaction follows the feedback structure:

```text
Observation
↓
Business Impact
↓
Process Connection
↓
KPI Interpretation
↓
Suggested Improvement
```

---

# 16. Context Engine

The Context Engine assembles the complete situational model before any reasoning request.

Context inputs include:

- current Business Mission and module (M1–M10);
- mission attempt state and student decisions;
- Simulation Engine KPI outcomes;
- competency progression (`04_COMPETENCY_MATRIX.md`);
- student learning history across prior missions;
- recurring error patterns detected by Learning Intelligence;
- professor-defined cohort constraints;
- assistance level (Guidance, Analysis, Recommendation — `15` §69).

The Context Engine produces a structured **AI Context Package** — a typed TypeScript object consumed by the Reasoning Engine.

No reasoning request shall proceed without a validated AI Context Package.

---

# 17. Reasoning Engine

The Reasoning Engine transforms institutional context into pedagogically appropriate language.

Responsibilities:

- select the appropriate institutional prompt template;
- bind the AI Context Package to the prompt;
- invoke the provider abstraction layer (OpenAI in Version 1);
- receive raw language output;
- pass output to EduQA validation hooks;
- return validated response to AI Coach Service.

The Reasoning Engine does not:

- determine pedagogical rules;
- modify scores or certifications;
- access the database directly (Prisma access belongs to Context Engine and Learning Intelligence);
- expose provider responses without validation.

Prompt templates are institutional assets stored and versioned within TEC.ERP — not within the provider platform.

---

# 18. Learning Intelligence

Learning Intelligence is the analytical capability that transforms AI interaction history into institutional learning insight.

Learning Intelligence responsibilities:

- detect recurring error patterns across missions and modules;
- identify competency gaps from decision and KPI history;
- generate Learning Insight records for professor analytics;
- feed error patterns back into the Context Engine;
- support cohort-level difficulty summaries;
- inform EduQA with measurable learning signals.

Learning Intelligence operates continuously — not only at mission completion.

Patterns accumulate across the student lifecycle.

---

# 19. Student History Integration

Student history is a first-class AI input.

The Context Engine shall retrieve:

- all Mission Attempts for the active module;
- decision history with outcomes;
- prior AI Coach conversations and recommendations;
- competency progression records;
- certification status;
- dashboard KPI trends;
- identified recurring errors.

Student history ensures that AI guidance evolves with the learner.

Repeated mistakes receive targeted explanation.

Progress achievements receive appropriately advanced challenges (M9–M10).

History retrieval occurs server-side through Prisma.

The frontend never assembles AI context.

---

# 20. Business Mission Binding

Every AI interaction shall be bound to a Business Mission context.

Binding requirements:

- `missionId` and `moduleId` are mandatory on every AI Conversation;
- AI Guidance endpoints (`18` §41) require active mission context;
- dashboard AI interactions reference the most recent relevant mission;
- capstone AI operates across integrated mission history (M10);
- unbound AI conversations are prohibited in production.

Business Mission binding preserves the principle: **business before software**.

AI explains business situations — not abstract technical topics.

---

# End of Part 03/12
---
# 21. KPI Integration

The Context Engine consumes KPI data produced by the Simulation Engine (`06_SIMULATION_ENGINE.md`).

KPI integration enables the AI Coach to:

- explain which KPI changed after a student decision;
- connect operational decisions to financial and supply chain indicators;
- support M9 BI and analytics reasoning;
- validate student KPI interpretations during reflection.

KPI data rules (`17` §50):

- KPIs are calculated automatically by the Simulation Engine;
- historical KPI values remain immutable;
- AI never recalculates KPIs — it interprets them;
- KPI context is read-only within the AI layer.

---

# 22. Competency Integration

Competencies (`04_COMPETENCY_MATRIX.md`, `17` §37–38) inform AI guidance depth and focus.

The Context Engine includes:

- current competency levels across four dimensions (Business Understanding, Process Execution, Analytical Thinking, Professional Decision-Making);
- module-specific competency targets;
- gaps identified by Learning Intelligence.

Progressive guidance alignment (`09` AI-004):

| Module Range | AI Guidance Style |
|--------------|-------------------|
| M1–M2 | Simple, supportive concept explanation |
| M3–M8 | Process impact and cross-module connection |
| M9–M10 | Challenge reasoning, support recommendations |

Competency signals never auto-adjust competency scores.

AI recommendations remain advisory (`17` DB-AI-002).

---

# 23. Recurring Error Detection

Learning Intelligence maintains a **Recurring Error Registry** derived from:

- repeated weak decisions within a mission;
- identical error types across multiple mission attempts;
- consistent KPI misinterpretation patterns;
- cohort-level error frequency thresholds.

When a recurring error is detected:

1. Learning Intelligence records the pattern in PostgreSQL;
2. the pattern is attached to the student's AI Context Package;
3. the AI Coach prioritizes targeted explanation;
4. professor dashboards receive cohort insight alerts;
5. EduQA validates that error feedback remains pedagogically appropriate.

Recurring errors strengthen the feedback loop.

They are institutional learning assets — not isolated incident logs.

---

# 24. Feedback Loops

TEC.ERP implements three institutional AI feedback loops:

**Loop 1 — Mission Feedback Loop**

Student Decision → Simulation Outcome → KPI Change → AI Coach Feedback → Reflection → Next Decision

**Loop 2 — Learning History Loop**

AI Interaction → Learning Intelligence Analysis → Recurring Error Detection → Context Engine Enrichment → Improved Future Guidance

**Loop 3 — EduQA Loop**

AI Response → EduQA Validation → Approved Delivery or Regeneration → Professor Review → Continuous Improvement

Feedback loops ensure AI guidance improves over time without manual prompt rewriting for every student.

---

# 25. Professor Visibility

Professors access AI intelligence through:

- individual student AI conversation history;
- Learning Insight summaries by module;
- cohort recurring error reports;
- competency gap analytics informed by AI observations;
- EduQA validation status for AI-assisted modules.

Professor visibility implements `09` AI-006.

Professors retain full authority over assessment and certification.

AI insights are advisory inputs to professional judgement.

---

# 26. AI Coach Activation Contexts

AI Coach activation follows `15` §68:

- Business Missions
- Dashboard Review
- Reflection Activities
- Module Completion
- Capstone
- Certification Review

Students initiate guidance requests.

The platform may suggest reflection prompts after weak decisions.

The platform shall never auto-submit decisions on behalf of students.

---

# 27. AI Coach Rules

COACH-RULE-001

The AI Coach shall not provide final answers that bypass student analysis.

COACH-RULE-002

Every response shall follow the institutional feedback structure.

COACH-RULE-003

Assistance level shall constrain response depth.

COACH-RULE-004

AI Coach shall use professional business language adapted to student level.

COACH-RULE-005

AI Coach shall never modify scores, grades or certifications.

COACH-RULE-006

All AI Coach interactions shall be persisted and linked to mission attempts.

---

# End of Part 04/12
---
# 28. EduQA Integration

Educational Quality Assurance (EduQA) governs AI behaviour (`22` §24, §30).

EduQA validates that AI:

- guides without providing final answers;
- stimulates reasoning and analysis;
- explains business concepts accurately;
- supports competency development;
- respects module-appropriate guidance depth;
- maintains educational integrity across cohorts.

AI features shall not reach production without EduQA validation evidence.

EduQA validation is a mandatory Approval Gate criterion for AI-related releases.

---

# 29. EduQA Validation Pipeline

Before any AI response reaches the student:

```text
Reasoning Engine Output
↓
Business Language Check
↓
Answer-Leak Detection (no final answers)
↓
Mission Context Verification
↓
Competency Appropriateness Check
↓
KPI Accuracy Verification (read-only comparison)
↓
Assistance Level Compliance
↓
Approved Response Delivery
```

Failed validation triggers regeneration with constrained prompts or fallback to institutional template responses.

EduQA failures are logged for continuous improvement.

---

# 30. Educational AI Validation Criteria

Aligned with `22` §30, every AI capability release shall verify:

✓ AI guides without providing final answers

✓ AI stimulates reasoning

✓ AI encourages analysis

✓ AI explains business concepts accurately

✓ AI supports competency development

✓ AI respects professor authority

✓ AI preserves assessment integrity

✓ AI maintains mission context binding

✓ AI responses are traceable and auditable

---

# 31. Learning Intelligence Metrics

Learning Intelligence shall monitor:

- Recurring Error Rate by module and cohort
- Competency Gap Detection Accuracy
- AI Coach Engagement Rate
- Reflection Completion Rate after AI feedback
- EduQA Validation Pass Rate
- Provider Response Latency
- AI Conversation Abandonment Rate
- Professor Insight Utilization Rate

Metrics support institutional decisions — not provider optimization alone.

---

# 32. AI Quality Domains

AI quality spans four official domains:

**Engineering Quality**

- TypeScript strict compliance
- API contract adherence
- provider abstraction integrity
- test coverage

**Educational Quality (EduQA)**

- pedagogical appropriateness
- competency alignment
- reasoning stimulation

**Operational Quality**

- Railway deployment stability
- response latency within SLA
- error rate monitoring

**Security Quality**

- data protection
- access control
- audit completeness

---

# 33. AI Testing Requirements

AI testing follows `23_TESTING_STRATEGY.md` AI Testing scope.

Mandatory test categories:

- Context Engine unit tests (context assembly correctness)
- Reasoning Engine integration tests (provider abstraction, mock provider)
- EduQA validation pipeline tests
- API endpoint tests (`18` §38–42)
- Mission-bound context enforcement tests
- Recurring error detection tests
- Educational workflow end-to-end tests
- Production smoke test: AI Coach (`23` §70)

Provider API calls shall be mocked in automated tests.

Production EduQA validation uses controlled test missions.

---

# 34. EduQA Rules

EDU-AI-001

Educational quality has priority over response fluency.

EDU-AI-002

No AI response shall bypass EduQA validation in production.

EDU-AI-003

Answer-leak detection is mandatory for all student-facing responses.

EDU-AI-004

Competency-appropriate guidance depth is mandatory.

EDU-AI-005

EduQA evidence is required for AI-related Approval Gates.

EDU-AI-006

Professor review channels shall remain available for AI pattern audit.

---

# End of Part 05/12
---
# 35. Data Architecture Overview

AI persistence follows the official Database Schema (`17` §45–50).

The AI Layer entities are:

```text
AI Conversation
↓
AI Message
↓
AI Recommendation
↓
Learning Insight
```

Supporting entities consumed by the Context Engine:

- Student
- Mission Attempt
- Decision
- Student Competency
- Competency
- KPI Snapshot
- Recurring Error Pattern (implementation entity)

All AI data persists in PostgreSQL through Prisma ORM.

---

# 36. AI Conversation Entity

Represents one coaching session (`17` §46).

Mandatory attributes:

- id
- studentId
- moduleId
- missionId
- startedAt
- endedAt
- conversationStatus
- assistanceLevel
- contextSnapshot (structured JSON — institutional context at session start)

Each conversation belongs to one authenticated student.

Conversations are immutable once closed.

---

# 37. AI Message Entity

Stores conversation messages (`17` §47).

Attributes:

- id
- conversationId
- sender (student | coach | system)
- message
- timestamp
- eduqaValidated (boolean)
- promptTemplateVersion (institutional prompt reference)

Messages remain searchable for professor review and audit.

Provider raw output is stored separately from delivered message when regeneration occurs.

---

# 38. AI Recommendation Entity

Stores advisory AI recommendations (`17` §48).

Attributes:

- id
- conversationId
- recommendationType
- recommendation
- competencyId
- createdAt
- advisoryOnly (always true)

Recommendations never modify assessment results.

---

# 39. Learning Insight Entity

Stores AI-generated educational observations (`17` §49).

Attributes:

- id
- studentId
- moduleId
- insightType (recurring_error | competency_gap | cohort_pattern)
- description
- priority
- generatedAt
- resolvedAt (nullable)

Insights support professor analytics and Learning Intelligence feedback loops.

---

# 40. Recurring Error Pattern Entity

Stores detected recurring error patterns.

Attributes:

- id
- studentId
- moduleId
- errorType
- errorDescription
- occurrenceCount
- firstDetectedAt
- lastDetectedAt
- status (active | resolved)

This entity closes the loop between Learning Intelligence and Context Engine.

---

# 41. Database AI Rules

DB-AI-001

AI never modifies assessment results.

DB-AI-002

AI recommendations remain advisory.

DB-AI-003

AI conversations remain associated with learning history.

DB-AI-004

Context snapshots shall be persisted at conversation start.

DB-AI-005

Recurring error patterns shall accumulate across missions.

DB-AI-006

All AI entities shall support audit queries by student, module and cohort.

DB-AI-007

Prisma migrations for AI entities require Approval Gate validation before production.

---

# End of Part 06/12
---
# 42. API Architecture

AI services expose business-oriented REST endpoints defined in `18_API_SPECIFICATION.md` §38–42.

Endpoint groups:

| Group | Purpose |
|-------|---------|
| AI Conversation | Session lifecycle management |
| AI Message | Message exchange within sessions |
| AI Guidance | Mission-bound explain, review, reflection |
| AI Recommendation | Advisory recommendations retrieval |

API rules (`18` §48):

- API-AI-001: AI never changes scores
- API-AI-002: AI never grants certifications

All endpoints require authenticated sessions with role-based authorization.

---

# 43. Express Backend Services

AI backend implementation follows Express + TypeScript service architecture.

Recommended service structure:

```text
src/
  services/
    ai/
      ai-foundation.service.ts
      context-engine.service.ts
      reasoning-engine.service.ts
      learning-intelligence.service.ts
      ai-coach.service.ts
      eduqa-validator.service.ts
      provider/
        reasoning-provider.interface.ts
        openai-reasoning.provider.ts
  routes/
    ai/
      conversations.routes.ts
      messages.routes.ts
      guidance.routes.ts
      recommendations.routes.ts
```

Business logic resides in services.

Routes handle HTTP orchestration only.

No provider SDK imports outside `provider/` directory.

---

# 44. React Frontend Integration

The React Presentation Layer implements AI Coach UI components.

Frontend responsibilities:

- render AI Coach panel within mission and dashboard layouts (`16_UI_BLUEPRINT.md`);
- submit guidance requests through official API endpoints;
- display structured feedback (Observation → Business Impact → Process → KPI → Improvement);
- show reflection prompts and conversation history;
- never construct AI prompts client-side;
- never store provider credentials;
- handle loading, error and EduQA-regeneration states gracefully.

Professor portal components consume Learning Insight and cohort error APIs.

---

# 45. TypeScript Standards

AI services follow institutional TypeScript standards (`19` §36):

- strict mode enabled;
- explicit interfaces for AI Context Package, Prompt Template, Reasoning Request, Reasoning Response, EduQA Result;
- discriminated unions for assistance levels and insight types;
- no `any` in AI service contracts;
- provider responses typed through abstraction interface.

Shared types shall live in a dedicated `types/ai/` module consumed by services and routes.

---

# 46. Provider Abstraction Layer

The provider abstraction defines the institutional contract for reasoning providers.

```typescript
interface ReasoningProvider {
  generate(request: InstitutionalReasoningRequest): Promise<ProviderRawResponse>;
  healthCheck(): Promise<ProviderHealthStatus>;
}
```

Version 1 implementation: `OpenAIReasoningProvider`.

Future providers implement the same interface without changing upstream services.

Provider selection via environment variable: `AI_REASONING_PROVIDER=openai`.

Provider model selection via: `AI_REASONING_MODEL` (never hardcoded).

---

# 47. Configuration Management

AI configuration belongs outside application code (`19` §78).

Required environment variables:

| Variable | Purpose |
|----------|---------|
| `AI_REASONING_PROVIDER` | Provider identifier (default: openai) |
| `AI_REASONING_MODEL` | Model selection |
| `AI_REASONING_API_KEY` | Provider credential (Railway secret) |
| `AI_REASONING_TIMEOUT_MS` | Request timeout |
| `AI_REASONING_MAX_TOKENS` | Output limit |
| `AI_EDUQA_STRICT_MODE` | EduQA validation strictness |

No AI credentials shall be committed to Git.

Railway Variables are the production configuration source.

---

# 48. Implementation Rules

IMPL-AI-001

All AI logic shall reside in Express backend services.

IMPL-AI-002

React components shall consume AI exclusively through REST API.

IMPL-AI-003

Prisma shall be the sole database access layer for AI entities.

IMPL-AI-004

Provider SDK usage shall be isolated to the provider directory.

IMPL-AI-005

Institutional prompt templates shall be versioned within the repository (prompts/ — not docs/).

IMPL-AI-006

Every AI endpoint shall include integration tests before Approval Gate.

---

# End of Part 07/12
---
# 49. Railway Deployment Architecture

TEC.ERP AI services deploy on Railway following `25_DEPLOYMENT_GUIDE.md` and `21_PLATFORM_OPERATIONS_PLAYBOOK.md`.

Railway-first constraints:

- AI backend runs as part of the Express application service on Railway;
- PostgreSQL on Railway hosts all AI persistence tables;
- AI provider credentials stored as Railway Variables;
- deployment logs reviewed after every AI-related release;
- health checks include Reasoning Engine provider connectivity;
- rollback capability verified before AI feature deployment;
- development environments remain Railway-compatible.

AI features are not production-complete until Railway validation passes.

---

# 50. AI Deployment Pipeline

AI feature deployment follows the institutional pipeline:

```text
Implementation Complete
↓
Unit and Integration Tests Passed
↓
EduQA Validation Evidence Collected
↓
Documentation Synchronized
↓
Approval Gate
↓
Railway Deployment
↓
Production Smoke Test (AI Coach)
↓
Monitoring Confirmed
↓
Release Closure
```

Incomplete AI features shall not reach production.

---

# 51. Security Architecture Alignment

AI security follows `26_SECURITY_ARCHITECTURE.md`.

Mandatory controls:

- authenticated access to all AI endpoints;
- role-based authorization (student, professor, administrator);
- student data isolation — students access only their own AI history;
- professor access scoped to assigned cohorts;
- encryption in transit (HTTPS);
- provider API keys in Railway secrets only;
- audit logging for all AI interactions;
- input validation on all AI request payloads;
- rate limiting on AI guidance endpoints;
- no student PII in provider logs beyond mission context requirements.

Security violations block deployment.

---

# 52. AI Audit and Logging

Every AI interaction generates audit records:

- conversation start and end timestamps;
- context snapshot hash;
- prompt template version used;
- provider request timestamp and latency;
- EduQA validation result;
- delivered message reference;
- professor access events on student AI history.

Logs support institutional accountability and EduQA review.

Logs never contain provider API keys.

---

# 53. Operational Monitoring

Platform operations shall monitor (`21` §Operational Philosophy):

- AI Coach availability
- Reasoning Engine response latency
- Provider error rate
- EduQA validation failure rate
- AI endpoint error rate
- PostgreSQL AI table growth
- recurring error detection throughput

Alerts follow institutional incident management procedures.

Educational continuity is mandatory during AI service incidents.

---

# 54. Incident Response for AI Services

AI service incidents include:

- provider outage or degraded performance;
- EduQA validation pipeline failure;
- abnormal response content detected post-delivery;
- unauthorized access to AI conversation history;
- data persistence failure.

Incident response follows `21` and `22` OpQA procedures.

Fallback behaviour: display institutional message indicating temporary AI unavailability.

Never expose raw provider errors to students.

---

# 55. Railway AI Rules

RAIL-AI-001

AI services shall deploy exclusively through approved Railway pipelines.

RAIL-AI-002

Provider credentials shall exist only in Railway Variables.

RAIL-AI-003

Production smoke tests shall include AI Coach validation.

RAIL-AI-004

Rollback shall be verified before every AI release.

RAIL-AI-005

AI deployment evidence shall be archived per release management standards.

RAIL-AI-006

Development environments shall mirror Railway configuration patterns.

---

# End of Part 08/12
---
# 56. AI Governance

AI Governance establishes institutional accountability for Enterprise Educational Intelligence.

Governance ensures that AI capabilities evolve under educational, engineering and operational oversight — not provider-driven feature adoption.

AI Governance spans:

- architecture decisions;
- EduQA validation authority;
- provider selection and replacement;
- prompt template approval;
- data retention policies;
- professor oversight requirements;
- release Approval Gate authority.

---

# 57. AI Governance Structure

| Role | AI Responsibility |
|------|-------------------|
| Product Owner | AI feature scope and educational alignment |
| Solution Architect | AI architecture integrity and provider abstraction |
| Software Engineers | Implementation per this specification |
| QA Engineers | AI testing and EduQA evidence |
| Educational Specialists | EduQA criteria and pedagogical validation |
| Instructors | Professor visibility and learning pattern review |
| Platform Administrators | Railway operations and monitoring |
| Institutional Leadership | Final Approval Gate authorization |

AI quality depends upon collaboration — not isolated engineering ownership.

---

# 58. AI Decision Matrix

AI architecture decisions require documented evidence.

| Validation Area | Required Status |
|-----------------|-----------------|
| Architecture Alignment | ✅ Approved |
| Context Engine Integrity | ✅ Validated |
| Provider Abstraction | ✅ Validated |
| EduQA Pipeline | ✅ Operational |
| Database Schema Alignment | ✅ Synchronized |
| API Contract Compliance | ✅ Verified |
| Security Controls | ✅ Validated |
| Railway Deployment | ✅ Verified |
| Testing Evidence | ✅ Complete |
| Documentation | ✅ Updated |
| Approval Gate | ✅ Completed |

Institutional approval requires completion of every mandatory validation.

---

# 59. AI Approval Gates

AI-related releases require dedicated Approval Gate evidence (`24` §21–27).

AI Approval Gate validates:

**Engineering Gate**

✓ Provider abstraction intact

✓ TypeScript compilation successful

✓ Integration tests passed

✓ No provider SDK in frontend

**Educational Gate (EduQA)**

✓ Answer-leak detection operational

✓ Mission context binding enforced

✓ Competency-appropriate guidance verified

✓ Professor visibility confirmed

**Operational Gate**

✓ Railway deployment successful

✓ AI Coach smoke test passed

✓ Monitoring active

✓ Rollback verified

Failed gates block release progression (BUILD-005).

---

# 60. AI Release Evidence

Every AI-related release shall archive:

- Approval Gate report;
- EduQA validation results;
- test execution summary;
- Railway deployment log reference;
- prompt template version changelog;
- known limitations and risks;
- rollback procedure confirmation.

Evidence supports institutional traceability per `24_RELEASE_MANAGEMENT.md`.

---

# 61. Continuous AI Improvement

Enterprise Educational Intelligence shall evolve continuously.

Improvement activities include:

- refining institutional prompt templates based on EduQA findings;
- expanding recurring error detection accuracy;
- strengthening competency gap analytics;
- improving provider fallback resilience;
- reducing response latency within educational SLA;
- incorporating professor feedback into Learning Intelligence;
- evaluating alternative reasoning providers through abstraction layer.

AI maturity should increase with every platform release.

Provider changes shall never require architectural redesign.

---

# End of Part 09/12
---
# 62. AI Architecture Validation

Before declaring AI architecture implementation complete, verify:

✓ AI Foundation services operational

✓ Context Engine assembles complete AI Context Package

✓ Reasoning Engine invokes provider through abstraction only

✓ Learning Intelligence detects and persists recurring errors

✓ AI Coach delivers structured pedagogical feedback

✓ EduQA validation pipeline operational

✓ All AI entities persist via Prisma

✓ API endpoints match `18_API_SPECIFICATION.md`

✓ React AI Coach UI integrated in mission layout

✓ Security controls validated

✓ Railway deployment verified

✓ Approval Gate evidence archived

---

# 63. AI Success Criteria

The AI Architecture is successful when:

- students receive context-aware guidance that improves reasoning;
- professors gain visibility into learning patterns and recurring errors;
- competencies develop measurably across Business Missions;
- EduQA consistently prevents answer-leak and off-mission responses;
- AI interactions remain fully auditable;
- provider replacement requires no service contract changes;
- Railway production AI services remain stable across releases;
- institutional intelligence — not provider behaviour — governs every interaction.

AI success is measured by educational outcomes — not conversational fluency.

---

# 64. Long-Term AI Vision

Enterprise Educational Intelligence shall continue evolving throughout the TEC.ERP lifecycle.

Future evolution may include:

- multi-provider reasoning failover;
- enhanced cohort analytics dashboards;
- adaptive competency pathway recommendations;
- deeper Simulation Engine integration;
- automated EduQA pattern learning (institutional models — not provider fine-tuning on student PII);
- professor-authored prompt template modules;
- institutional AI performance benchmarking across cohorts.

All future capabilities shall preserve:

- replaceable LLM principle;
- TEC.ERP intelligence ownership;
- EduQA governance;
- Railway-first deployment;
- PostgreSQL + Prisma persistence integrity.

---

# 65. AI Architecture Evolution Rules

EVOL-AI-001

New AI capabilities shall extend — not bypass — the five-component architecture.

EVOL-AI-002

Provider changes shall not alter institutional AI contracts.

EVOL-AI-003

Educational quality shall govern all AI evolution decisions.

EVOL-AI-004

Architecture changes require formal Approval Gate evidence.

EVOL-AI-005

Student data protection shall never be compromised for AI capability expansion.

EVOL-AI-006

Every AI evolution shall improve institutional learning intelligence.

---

# End of Part 10/12
---
# 66. Final AI Governance

Final AI Governance formally concludes the AI architecture lifecycle for a platform release and confirms that Enterprise Educational Intelligence remains operational, validated and institutionally controlled.

AI is never considered finished.

Every completed AI cycle establishes the baseline for the next stage of platform evolution.

Institutional AI maturity is achieved through continuous governance — not provider feature releases.

---

# 67. AI Architecture Closure

Every major AI initiative, production release or architectural revision shall conclude with formal AI closure.

AI Architecture Closure includes:

✓ Context Engine Validated

✓ Reasoning Engine Validated

✓ Learning Intelligence Operational

✓ AI Coach EduQA Approved

✓ Recurring Error Detection Verified

✓ Database Schema Synchronized

✓ API Contracts Verified

✓ Security Controls Validated

✓ Railway Deployment Confirmed

✓ Monitoring Active

✓ Documentation Updated

✓ Approval Gate Completed

Formal closure ensures complete institutional traceability.

---

# 68. Final AI Principles

AI-FINAL-001

Enterprise Educational Intelligence is an institutional capability.

AI-FINAL-002

The LLM is replaceable; TEC.ERP owns the intelligence.

AI-FINAL-003

OpenAI is the Version 1 reasoning provider — not the educational authority.

AI-FINAL-004

EduQA governs every student-facing AI response.

AI-FINAL-005

Business Mission context is mandatory for all AI interactions.

AI-FINAL-006

Continuous improvement strengthens institutional learning intelligence.

---

# 69. VS Code / Cursor Commands

Official engineering commands for AI Architecture work.

## Document Review

```powershell
code docs/27_AI_ARCHITECTURE.md
code docs/09_AI_COACH_ARCHITECTURE.md
code docs/17_DATABASE_SCHEMA.md
code docs/18_API_SPECIFICATION.md
```

## Cursor Context Activation

When implementing AI features in Cursor, ensure these rules are active:

- `.cursor/rules/tec_erp_ai_architecture.mdc`
- `.cursor/rules/tec_erp_engineering.mdc`
- `.cursor/rules/tec_erp_architecture.mdc`

Reference project context:

```powershell
code .cursor/context/TEC_ERP_PROJECT_CONTEXT.md
```

## Pre-Implementation Checklist (Cursor)

Before writing AI code, Cursor shall confirm:

1. Relevant official doc section identified (this document + 09, 17, 18)
2. AI Context Package interface defined
3. Provider abstraction boundary respected
4. EduQA validation hook planned
5. Prisma entity alignment verified
6. Approval Gate criteria understood

## Validation Commands

```powershell
npm run build
npm run test
npm run lint
npx prisma validate
npx prisma migrate diff
```

All commands must pass before Approval Gate.

---

# 70. Git Closure Package

Official git workflow for AI Architecture documentation and implementation closure.

## Status Review

```powershell
git status
git diff
```

## Stage AI Architecture Work

```powershell
git add docs/27_AI_ARCHITECTURE.md
git add src/services/ai/
git add src/routes/ai/
git add prisma/schema.prisma
```

Stage only files related to the approved AI scope.

Never stage `.env`, credentials or provider API keys.

## Pre-Commit Verification

```powershell
npm run build
npm run test
git diff --cached
```

## Commit

```powershell
git commit -m "docs: add official AI Architecture specification (Document 27)"
```

Commit messages shall follow institutional standards (`19` §13).

## Post-Commit Verification

```powershell
git log --oneline -1
git status
```

Repository must remain in a buildable state (BUILD-006).

## Pull Request Requirements

AI-related PRs shall include:

- objective and implementation summary;
- impacted AI components (Foundation, Context, Reasoning, Learning Intelligence, Coach);
- EduQA validation evidence;
- test execution results;
- Railway deployment readiness;
- Approval Gate status;
- documentation alignment confirmation.

---

# 71. Approval Gate

AI Architecture Approval Gate is mandatory before AI features enter production (`19` §9, `24` §21).

## Gate Checklist

| Domain | Criterion | Status |
|--------|-----------|--------|
| Business Rules | AI Coach aligns with `15` and `09` | ☐ |
| UI | AI Coach panel integrated per `16` | ☐ |
| Backend | Express services implement five-component architecture | ☐ |
| Simulation | KPI and decision signals consumed by Context Engine | ☐ |
| Database | Prisma entities match `17` AI Layer | ☐ |
| API | Endpoints match `18` §38–42 | ☐ |
| Testing | AI test suite passed per `23` | ☐ |
| Documentation | This document and related specs aligned | ☐ |
| EduQA | Educational AI validation passed per `22` §30 | ☐ |
| Security | Controls validated per `26` | ☐ |
| Railway | Deployment and smoke test passed per `25` | ☐ |
| Production Readiness | Monitoring, rollback and audit confirmed | ☐ |

## Gate Decision

| Decision | Authority |
|----------|-----------|
| Engineering Gate | Solution Architect + QA Engineer |
| Educational Gate | Educational Specialist + Instructor |
| Operational Gate | Platform Administrator |
| Institutional Gate | Institutional Leadership |

All gates must pass.

Failed gates keep the phase open until deficiencies are corrected.

---

# 72. Document Status

**Document:** AI Architecture  
**Version:** 1.0  
**Status:** Official Enterprise AI Standard — Complete  
**Parts:** 12/12  
**Approval Gate:** Pending Institutional Review  
**Last Updated:** 2026  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

This document establishes the official Enterprise Educational Intelligence architecture for TEC.ERP Version 1.

The LLM is replaceable.

The intelligence belongs to TEC.ERP.

---

# End of Part 11/12
---
# 73. Institutional AI Commitment

TEC.ERP commits to deploying Artificial Intelligence as a governed educational capability.

Enterprise Educational Intelligence shall:

- respect student autonomy and professor authority;
- strengthen Business Mission learning;
- preserve full auditability and data protection;
- remain independent of any single reasoning provider;
- evolve through EduQA-governed continuous improvement;
- operate reliably on Railway production infrastructure.

This commitment applies to every engineering team, educational stakeholder and operational role involved in TEC.ERP.

---

# 74. Architecture Summary

```text
┌──────────────────────────────────────────────────────────┐
│                  TEC.ERP INTELLIGENCE                     │
│  Rules · Context · History · EduQA · Competencies · KPIs │
├──────────────────────────────────────────────────────────┤
│  AI Foundation                                            │
│    ├── Context Engine                                     │
│    ├── Reasoning Engine ──→ Provider Abstraction          │
│    ├── Learning Intelligence                              │
│    └── AI Coach                                           │
├──────────────────────────────────────────────────────────┤
│  Persistence: PostgreSQL + Prisma                         │
│  API: Express + TypeScript                                │
│  UI: React + TypeScript                                   │
│  Hosting: Railway                                         │
│  Provider: OpenAI (reasoning only, replaceable)           │
└──────────────────────────────────────────────────────────┘
```

---

# 75. Final AI Architecture Principles

AI-ARCH-FINAL-001

TEC.ERP deploys Enterprise Educational Intelligence — not a generic chatbot.

AI-ARCH-FINAL-002

The Context Engine assembles institutional intelligence before any reasoning request.

AI-ARCH-FINAL-003

The Reasoning Engine invokes replaceable providers; TEC.ERP owns all pedagogical rules.

AI-ARCH-FINAL-004

Learning Intelligence transforms interaction history into recurring error detection and competency insights.

AI-ARCH-FINAL-005

The AI Coach delivers EduQA-governed pedagogical feedback within Business Mission context.

AI-ARCH-FINAL-006

Every AI capability requires Approval Gate evidence before production release.

---

# End of Part 12/12

# End of Document

**Document Status:** AI Architecture Complete
