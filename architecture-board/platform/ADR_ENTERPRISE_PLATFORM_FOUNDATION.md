# ADR — Enterprise Platform Foundation

## ADR Metadata

| Field | Value |
|-------|-------|
| **ADR Number** | ADR-PLATFORM-001 |
| **Title** | Enterprise Platform Foundation — Physical Architecture Constitution |
| **Date** | 2026-07-01 |
| **Status** | Proposed |
| **Supersedes** | — |
| **Superseded By** | — |
| **Decision Makers** | TEC.ERP Architecture Review Board |
| **Scope** | Permanent physical foundation for all TEC educational platform products |
| **Authority** | Constitutional — supersedes informal structure decisions; does not supersede `docs/01–30` |
| **Inputs** | RC00 Physical Architecture Proposal V1; Documents 01–30; Architecture Review Board Phase 3 consensus; Approved Enterprise AI Foundation |

---

## Context

TEC.ERP — Analyste ERP et Processus d'Affaires is the first major product built on a shared institutional vision: **educational business-process simulation platforms** that teach enterprise operations through integrated missions, dashboards, competencies, and governed AI assistance.

Documents 01–30 define product behaviour, pedagogy, data semantics, API intent, AI governance, and engineering process. RC00 (Enterprise Foundation Initialization) defined the initial physical repository proposal for TEC.ERP. Enterprise AI Foundation is complete.

Before any implementation code is written, TEC requires a **permanent platform architecture decision** that:

- applies to TEC.ERP and all future TEC products (WMS, SCM, CRM, HRM, future simulators);
- separates constitutional physical structure from product functional specifications;
- preserves approved six-layer architecture, AI boundaries, and database decisions;
- remains valid as products multiply without architectural redesign.

This ADR is **not** Document 31. It is **not** a functional specification. It is the **constitutional technical foundation** of the TEC Platform.

---

## Decision

TEC adopts a **single institutional TypeScript monorepo** governed by **Documentation First → Architecture First → Business First → Implementation Second**, with **pnpm workspaces**, **Turborepo** orchestration, **Railway** as the official cloud platform, and **strict package dependency law** separating presentation, application, domain, infrastructure, educational, AI, and simulation concerns.

Each TEC product is a **deployable application set** (`apps/<product>-*`) consuming **shared platform packages** (`packages/*`). Products own educational content and business rules; the platform owns cross-cutting engineering foundations.

**Database decision (permanent):**

| Product | Production Database | ORM / Access | Migration Policy |
|---------|---------------------|--------------|------------------|
| **TEC.WMS** | **MySQL** | Product-native (existing) | **No migration planned** |
| **TEC.ERP** | **PostgreSQL** | **Prisma** | Official V1 database |
| **Future products** | Case-by-case ADR | Case-by-case ADR | Requires platform ADR amendment |

TEC.WMS and TEC.ERP **must never share a runtime database**, schema package, or connection pool.

---

# 1. Enterprise Platform Vision

The TEC Platform is an **institutional educational technology ecosystem** that enables multiple business-domain simulators to share engineering foundations while preserving independent pedagogical identity.

### Vision statement

> Build once at the platform layer; teach many domains at the product layer.

### Platform goals

| Goal | Description |
|------|-------------|
| **Institutional continuity** | Engineering standards, security posture, and deployment discipline remain consistent across cohorts and products |
| **Pedagogical integrity** | Business Missions, competencies, and professor authority are never compromised by shared infrastructure |
| **Modular growth** | New simulators (SCM, CRM, HRM) attach to the platform without rewriting foundations |
| **Longevity** | Decisions favour maintainability over short-term convenience (`docs/19` IMPROVE-005) |
| **Railway readiness** | Every product remains deployable on Railway (`docs/19` §77.1, `docs/25`) |

### Product examples (non-exhaustive)

| Product | Domain focus | Database (production) |
|---------|--------------|----------------------|
| TEC.WMS | Warehouse & logistics simulation | MySQL |
| TEC.ERP | Integrated ERP & business processes | PostgreSQL + Prisma |
| TEC.SCM | Supply chain simulation | TBD — ADR required |
| TEC.CRM | Customer relationship simulation | TBD — ADR required |
| TEC.HRM | Human resources simulation | TBD — ADR required |
| Future simulators | Domain-specific | Case-by-case |

### Relationship to official documentation

| Layer | Authority |
|-------|-----------|
| Product behaviour, pedagogy, missions | `docs/01–30` (official specifications) |
| Physical platform structure | **This ADR** |
| Product-specific architecture decisions | Product ADRs in `architecture-board/` |
| Implementation | Source code — must not contradict above |

---

# 2. Platform Philosophy

### Core principle

**Business before software.** Platform infrastructure exists to support educational business simulation — not to dictate pedagogy.

### Engineering hierarchy

```text
Product Vision (docs/00)
        ↓
Learning Philosophy (docs/00)
        ↓
Learning Blueprint (docs/01)
        ↓
Functional / UI / Data / API Specifications (docs/15–18)
        ↓
AI Architecture (docs/27–30)
        ↓
Platform ADR (this document)
        ↓
Source Code
```

Source code must never contradict higher-level documentation.

### Four platform laws

| Law | Meaning | Enforcement |
|-----|---------|-------------|
| **Documentation First** | No implementation without consulting relevant official specifications | Approval Gate, PR review |
| **Architecture First** | Physical and logical structure decided before feature code | ADR, ARB review |
| **Business First** | APIs, data, and UI express business intent — not table operations | `docs/18` API-001 |
| **Implementation Second** | Code is the last step — not the first design artefact | Sprint gates (`docs/20`) |

### Platform invariants

- Incomplete vertical slices do not merge (`docs/19` §6–7).
- Every phase ends with an Approval Gate (`docs/19` §9).
- Repository must remain buildable after every session (BUILD-006).
- AI is pedagogical assistant — never academic authority (`docs/09`, `docs/27`).

---

# 3. Repository Philosophy

### Single source of truth

The institutional monorepo is the **permanent home** for:

- official documentation (`docs/`) — read-only without explicit approval;
- architecture decisions (`architecture-board/`);
- engineering agent rules (`.cursor/`);
- deployable applications (`apps/`);
- shared libraries (`packages/`);
- automation (`scripts/`, `.github/`);
- cross-product tests (`tests/`).

### Repository root structure (constitutional)

```text
<tec-platform-repo>/
├── apps/                    # Deployable product applications
├── packages/                # Shared platform libraries
├── docs/                    # Official product specifications (protected)
├── architecture-board/      # ADRs, reviews, consensus reports
│   └── platform/            # Platform-level ADRs (this document)
├── .cursor/                 # Engineering rules and agent context
├── scripts/                 # Repo automation (migrate, validate-env, smoke)
├── tests/                   # Cross-app E2E and shared fixtures
├── .github/                 # CI/CD workflows
├── package.json             # Root workspace scripts
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example             # Variable catalog (no secrets)
└── README.md
```

### Branch and commit governance

Per `docs/19` §12–14 and `.cursor/rules/tec_erp_git_workflow.mdc`:

- Feature work on branches; `main` protected.
- Commits represent one logical change; compile and pass tests.
- PRs include objective, impacted modules, testing evidence, doc alignment, Approval Gate status.
- **Only commit when explicitly authorized** by institutional process.

### Documentation protection

- **`docs/` is immutable** during implementation unless explicit user/institutional approval is granted.
- Spec gaps are **flagged and proposed** — never silently drifted.
- Engineering notes live outside `docs/` (e.g. `engineering/`, `architecture-board/`).

---

# 4. Monorepo Strategy

### Toolchain

| Tool | Role |
|------|------|
| **pnpm** | Workspace package manager; strict dependency boundaries |
| **Turborepo** | Task graph, caching: `build`, `lint`, `typecheck`, `test` |
| **TypeScript** | Strict mode — all packages and apps |
| **Node.js LTS** | Runtime (22.x recommended) |

### Workspace definition

```yaml
# pnpm-workspace.yaml (conceptual)
packages:
  - "apps/*"
  - "packages/*"
```

### Product application naming

Each product deploys as one or more apps:

```text
apps/
├── erp-api/                 # TEC.ERP Express service
├── erp-web/                 # TEC.ERP React SPA
├── wms-api/                 # TEC.WMS (when integrated into platform repo)
├── wms-web/                 # TEC.WMS frontend
└── <product>-<surface>/     # Future products
```

**RC00 / TEC.ERP initial implementation** may use `apps/api` and `apps/web` as aliases during bootstrap; **before multi-product expansion**, rename to `apps/erp-api` and `apps/erp-web` per this ADR.

### Dependency flow (constitutional)

```text
apps/*  →  packages/*  →  (external npm only)

FORBIDDEN:
  packages/*  →  apps/*
  apps/product-a  →  apps/product-b  (direct import)
  packages/database-erp  →  packages/database-wms
```

### Build orchestration

- Root scripts delegate to Turborepo.
- Each app declares its own `build`, `dev`, `start`.
- Shared packages build before dependents (`^build` in turbo.json).

### Alternatives rejected

| Alternative | Reason rejected |
|-------------|-----------------|
| Polyrepo per product | Fragments institutional standards; duplicates CI and shared types |
| Nx monorepo | Additional complexity without institutional mandate |
| Shared MySQL/PostgreSQL package | Violates database isolation decision |
| Monolith single app | Prevents independent Railway service scaling per product surface |

---

# 5. Package Responsibilities

## 5.1 Applications (`apps/`)

### `apps/<product>-api`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | HTTP service — Express + TypeScript — hosts application, domain orchestration, and infrastructure adapters for one product |
| **Responsibilities** | Route registration; middleware; env validation; service composition root; health/readiness; product module mounting |
| **Allowed dependencies** | `@tec-platform/core`, `contracts`, `domain`, `events`, `database-<product>`, `config`; product-internal modules |
| **Forbidden dependencies** | `@tec-platform/ui`; other products' `apps/*`; cross-product database packages |
| **Ownership examples** | `erp-api`: mission routes, simulation services, AI application services; `wms-api`: warehouse transaction routes |

### `apps/<product>-web`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | React SPA — student, teacher, admin portals via routing for one product |
| **Responsibilities** | Routing; page composition; client state; API client; portal layouts |
| **Allowed dependencies** | `@tec-platform/ui`, `contracts`, `core` (client-safe exports only), `config` |
| **Forbidden dependencies** | `database-*`; `domain` (server domain logic); Prisma; Express |
| **Ownership examples** | `erp-web`: Mission Control, ERP workspaces, dashboards; `wms-web`: warehouse operation screens |

---

## 5.2 Platform packages (`packages/`)

### `@tec-platform/config`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Shared engineering configuration — no runtime business logic |
| **Responsibilities** | ESLint presets; Prettier config; TSConfig bases; shared tooling constants |
| **Allowed dependencies** | Dev tooling only (eslint, typescript, prettier) |
| **Forbidden dependencies** | Any product app; database; React runtime; Express |
| **Ownership examples** | `eslint/base.js`, `typescript/node.json`, `typescript/react.json` |

### `@tec-platform/core`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Platform kernel — pure abstractions and cross-cutting primitives |
| **Responsibilities** | `Result<T>`; `Either`; `Entity`; `AggregateRoot`; `ValueObject`; `DomainError`; `UUID`; `Clock`; base repository interfaces; logging interfaces |
| **Allowed dependencies** | None (zero platform package dependencies) |
| **Forbidden dependencies** | Prisma; React; Express; product-specific types |
| **Ownership examples** | `Result.ok()`, `Result.fail()`, `DomainError.notFound()`, `Clock.system()`, `Uuid.generate()` |

### `@tec-platform/contracts`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Cross-boundary API contracts — the only types that cross HTTP/WebSocket boundaries |
| **Responsibilities** | Request/response DTOs; Zod validation schemas; error envelopes; pagination; API version constants; event payload schemas (serialization) |
| **Allowed dependencies** | `core` (for `Result` mapping helpers only); `zod` |
| **Forbidden dependencies** | Prisma types; React; Express; domain aggregates |
| **Ownership examples** | `HealthResponse`, `ApiErrorEnvelope`, `MissionStartRequest` (schema only, no logic) |

### `@tec-platform/domain`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Shared domain primitives and cross-product domain patterns — not product business rules |
| **Responsibilities** | Base aggregate patterns; shared value objects (Email, Money where applicable); domain event base classes; repository interfaces |
| **Allowed dependencies** | `core` |
| **Forbidden dependencies** | Prisma; Express; React; product-specific mission rules |
| **Ownership examples** | `AggregateRoot` extensions; `CohortId` value object; `DomainEvent` base class |

### `@tec-platform/events`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Institutional event bus contracts — naming, versioning, ownership metadata |
| **Responsibilities** | Event type registry; event name constants; payload interfaces; versioning rules; idempotency key conventions |
| **Allowed dependencies** | `core`, `contracts` |
| **Forbidden dependencies** | Event transport implementation (stays in apps); Prisma |
| **Ownership examples** | `MissionCompletedEvent`, `domainEvents.mission.completed.v1` |

### `@tec-platform/database-<product>`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Product-scoped persistence — one package per database engine/product |
| **Responsibilities** | Prisma schema (ERP); or product ORM config (WMS/MySQL); migrations; client singleton; seed scripts |
| **Allowed dependencies** | `core`; ORM (Prisma for ERP) |
| **Forbidden dependencies** | React; Express; other products' database packages; UI |
| **Ownership examples** | `database-erp`: PostgreSQL Prisma client; `database-wms`: MySQL client (existing WMS stack) |

**Package naming law:** `database-erp`, `database-wms` — never a generic `database` package shared across engines.

### `@tec-platform/ui`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Institutional design system — Fiori-inspired enterprise UI (`docs/16` §3) |
| **Responsibilities** | Design tokens; primitives (Button, Card, Table, Dialog); layout shell (AppShell, TopNav, Sidebar, RightPanel); feedback components; Tailwind preset |
| **Allowed dependencies** | React; Tailwind; `core` (type helpers only) |
| **Forbidden dependencies** | Prisma; Express; product business logic; mission-specific components |
| **Ownership examples** | `AppShell`, `PageHeader`, `DataTable`, TEC colour tokens |

### `@tec-platform/testing`

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Shared test infrastructure — builders, factories, fakes |
| **Responsibilities** | Test builders; factories; fixtures; Golden Student; Mission Generator; Scenario Generator; fake repository bases |
| **Allowed dependencies** | `core`, `domain`, `contracts` |
| **Forbidden dependencies** | Production app code; live database connections in default exports |
| **Ownership examples** | `GoldenStudentBuilder`, `FakeMissionRepository`, `ScenarioGenerator` |

---

# 6. Domain Separation

Physical code must respect the six-layer model (`docs/13`) and platform package boundaries.

### Layer map

| Layer | Physical location | May depend on |
|-------|-------------------|---------------|
| **Presentation** | `apps/<product>-web`, `@tec-platform/ui` | `contracts`, client-safe `core` |
| **Application** | `apps/<product>-api/src/application/` | `domain`, `events`, `database-<product>`, `contracts` |
| **Educational** | `apps/<product>-api/src/educational/` | Mission orchestration, competency flows, certification application services |
| **Simulation** | `apps/<product>-api/src/simulation/` | Business rules engine, KPI engine — never UI (`docs/06`) |
| **Business Domain** | `apps/<product>-api/src/modules/<domain>/` | `domain`, `core` — rules centralized (`docs/19` §20) |
| **AI Layer** | `apps/<product>-api/src/ai/` | Context Engine, Orchestrator, Coach delivery, Learning Intelligence — per `docs/27–30` |
| **Infrastructure** | `apps/<product>-api/src/infrastructure/`, `packages/database-*` | External adapters, Prisma, logging, queue |

### Dependency law (no bypass)

```text
Presentation
    ↓ (HTTP only)
Application
    ↓
Educational / Simulation / Business Domain
    ↓
Infrastructure (Repositories)
    ↓
Database Package
```

**Forbidden bypasses:**

- React → Prisma
- Route handler → Prisma (must go through service + repository)
- Orchestrator → Prisma (ORCH-001)
- AI Coach → Learning Intelligence direct read (must go through Context Engine)
- UI → business rule calculation

### Product module internal structure (`docs/19` §26)

```text
modules/<domain>/
├── <domain>.routes.ts
├── <domain>.handlers.ts
├── <domain>.service.ts
├── <domain>.repository.ts
├── <domain>.types.ts
└── __tests__/
```

---

# 7. Authoritative vs Advisory Components

### Definitions

| Class | Definition |
|-------|------------|
| **Authoritative** | Owns institutional truth; writes are binding; downstream consumers must treat output as fact |
| **Advisory** | Observes, interprets, recommends; never overrides authoritative state |

### Authoritative components

| Component | Owns | Write authority | Read authority |
|-----------|------|-----------------|----------------|
| **Competency Engine** | Student competency scores, validation state | Exclusive write to competency records | All authorized platform services (read-only for LI) |
| **Simulation Engine** | KPI calculation, decision consequences | Exclusive KPI write | Context Engine, LI, dashboards |
| **Certification Engine** | Silver/Gold certificates, verification records | Immutable certification writes | Public verification portal (read) |
| **Business Mission Engine** | Mission attempt state, official completion | Mission lifecycle writes | Application layer, LI |
| **Assessment Engine** | Quiz scores, formal assessments | Assessment result writes | Professor portal |
| **Database (per product)** | Persisted institutional records | Via owning service only | Via repositories |
| **Professor (institutional)** | Final academic judgement | Override and assessment authority | Own cohort data |
| **EduQA** | Per-response validation gate | Validation outcome on AI messages | Orchestrator, LI |
| **Context Engine** | AI Context Package assembly | Context package construction (not business scores) | Orchestrator (read); LI supplies enrichment inputs |

### Advisory components

| Component | Provides | Must never |
|-----------|----------|------------|
| **Learning Intelligence** | Recurring error patterns, competency gap signals, cohort insights | Modify scores, certifications, KPIs, or deliver coach responses |
| **AI Coach (delivery)** | Student-facing guidance text | Bypass EduQA; read LI directly |
| **Reasoning Orchestrator** | Strategy selection, provider invocation | Access database (ORCH-001); modify assessments |
| **AI Recommendations** | Pedagogical hints | Replace student decisions |
| **Dashboards (analytics)** | Aggregated views | Become source of truth for grades or certification |
| **Insight APIs** | Professor-facing analytics | Expose raw diagnostic labels to students without governance |

### Ownership rules

| Rule ID | Rule |
|---------|------|
| **AUTH-001** | Every authoritative entity has exactly one write owner |
| **AUTH-002** | Advisory components may read authoritative state; never write it |
| **AUTH-003** | AI components are advisory except EduQA validation records and persisted conversation audit |
| **AUTH-004** | Context Engine is the sole gateway between persistence and reasoning (CTX-RULE-001) |
| **AUTH-005** | Competency Engine → LI is read-only; LI gap detection is advisory-only |
| **AUTH-006** | Institutional authority (professor) supersedes AI advisory output in conflict |

### Examples

```text
MissionCompleted (authoritative: Mission Engine writes attempt status)
        ↓ async
Learning Intelligence (advisory: detects recurring error pattern)
        ↓ persist insight
Context Engine (authoritative for context assembly: reads patterns)
        ↓
Orchestrator (advisory reasoning: no DB)
        ↓
EduQA (authoritative for validation outcome on this response)
        ↓
AI Coach delivers (advisory language to student)
```

---

# 8. Shared Component Strategy

Per `docs/19` §19 (Reuse Strategy) and ENG-006.

### When a component MUST become shared (`@tec-platform/ui` or `packages/*`)

| Trigger | Action |
|---------|--------|
| Used by 2+ products | Extract to platform package |
| Represents institutional identity (layout, tokens, branding) | `ui` package |
| Crosses HTTP boundary (DTO) | `contracts` package |
| Duplicated domain primitive (Email, Money, Result) | `core` or `domain` |
| Duplicated test setup (Golden Student, builders) | `testing` package |
| Duplicated ESLint/TSConfig | `config` package |

### When duplication is FORBIDDEN

| Case | Reason |
|------|--------|
| API error envelopes | Contract consistency |
| Auth middleware patterns | Security uniformity |
| Design tokens and AppShell | Institutional UI identity |
| Event name constants | Observability and audit |
| Env validation approach | Fail-fast consistency |
| `Result<T>` / `DomainError` | Error handling uniformity |

### When product-specific implementation is ALLOWED

| Case | Example |
|------|---------|
| Business rules unique to one simulator | ERP procurement three-way match vs WMS pick-path optimization |
| Product database schema | `database-erp` vs `database-wms` |
| Product-specific mission definitions | ERP Module 3 vs WMS receiving mission |
| Product-specific AI context blocks | ERP KPI blocks vs WMS inventory blocks |
| Product portal navigation trees | ERP 10-module nav vs WMS zone nav |
| Pedagogical copy and scenarios | Product content teams own |

### Extraction protocol

1. Identify duplication across products.
2. Propose extraction ADR if boundaries shift.
3. Extract to appropriate `packages/*` with no business logic leakage.
4. Product apps import — never copy-paste.

---

# 9. Database Strategy

### Official permanent decision

| Product | Production | ORM / Access | Status |
|---------|------------|--------------|--------|
| **TEC.WMS** | **MySQL** | Existing WMS stack | **Production — no migration planned** |
| **TEC.ERP** | **PostgreSQL** | **Prisma** | **Official V1 database** |
| **TEC.SCM, CRM, HRM, future** | TBD | TBD | Requires new ADR before implementation |

### Isolation rules

| Rule ID | Rule |
|---------|------|
| **DB-PLATFORM-001** | One database engine per product in production |
| **DB-PLATFORM-002** | One `packages/database-<product>` package per product |
| **DB-PLATFORM-003** | No shared Prisma schema across MySQL and PostgreSQL |
| **DB-PLATFORM-004** | No cross-product foreign keys or shared tables |
| **DB-PLATFORM-005** | `DATABASE_URL` is product-scoped — never shared |
| **DB-PLATFORM-006** | Migrations are versioned, tested, and deployment-blocking on failure (`docs/19` §79) |

### TEC.ERP PostgreSQL conventions

- Logical layers in schema comments map to `docs/17` entity groups.
- IDs: `cuid()` or `uuid()` — consistent per entity group.
- Timestamps: `createdAt`, `updatedAt` on mutable entities.
- Certification records: immutable (`docs/17` DB-005).
- Learning history: traceable (`docs/17` DB-004).

### TEC.WMS MySQL

- Remains in production on MySQL.
- No migration to PostgreSQL.
- No inclusion in `@tec-platform/database-erp`.
- Platform reuse from WMS is **pattern-only** — not schema or connection sharing.

---

# 10. Event Architecture

### Purpose

Events provide **institutional audit continuity**, **async decoupling**, and **cross-layer notification** without bypassing authoritative ownership.

### Naming convention

```text
<domain>.<entity>.<action>.v<major>

Examples:
  mission.attempt.completed.v1
  competency.student.updated.v1
  simulation.kpi.calculated.v1
  certification.silver.granted.v1
  learning.reflection.created.v1
  ai.context.rebuilt.v1
  orchestration.feedback.dispatched.v1
  learning.insight.created.v1
```

### Event anatomy

| Field | Required | Description |
|-------|----------|-------------|
| `eventId` | Yes | Unique idempotency key |
| `eventName` | Yes | Versioned name from registry |
| `occurredAt` | Yes | `Clock` timestamp |
| `aggregateId` | Yes | Primary entity reference |
| `aggregateType` | Yes | Entity type |
| `payload` | Yes | Typed per `contracts` |
| `metadata` | Yes | `correlationId`, `causationId`, `productId`, `actorId` |
| `schemaVersion` | Yes | Payload schema version |

### Ownership

| Rule ID | Rule |
|---------|------|
| **EVT-001** | Events are owned by the **authoritative writer** of the aggregate that changed |
| **EVT-002** | Advisory components emit **derived events** only after persistence (e.g. `learning.insight.created.v1`) |
| **EVT-003** | Platform transport events (e.g. `orchestration.feedback.dispatched.v1`) are owned by the dispatching service |
| **EVT-004** | Consumers must be idempotent — `eventId` deduplication required |
| **EVT-005** | Event registry lives in `@tec-platform/events` |

### Canonical platform events (V1 registry)

| Event | Owner (authoritative writer) | Consumers (advisory unless noted) |
|-------|------------------------------|-----------------------------------|
| `mission.attempt.completed.v1` | Mission Engine | LI, dashboards, certification (read) |
| `competency.student.updated.v1` | Competency Engine | LI (read), Context Engine (read), dashboards |
| `simulation.kpi.calculated.v1` | Simulation Engine | Context Engine, LI, dashboards |
| `certification.silver.granted.v1` | Certification Engine | Verification portal, professor dashboard |
| `certification.gold.granted.v1` | Certification Engine | Verification portal, professor dashboard |
| `learning.reflection.created.v1` | Mission Engine | LI, competency (read) |
| `ai.context.rebuilt.v1` | Context Engine | Audit, operations |
| `orchestration.feedback.dispatched.v1` | Orchestrator | LI (async analysis) |
| `learning.insight.created.v1` | Learning Intelligence | Professor dashboard, audit |
| `learning.recurring_error.registered.v1` | Learning Intelligence | Context Engine (read on next build) |

### Versioning

- **Major** version in event name for breaking payload changes.
- Consumers must register supported versions.
- Breaking changes require ADR and dual-publish period when feasible.

### Transport (V1)

- **Synchronous path:** direct service calls within `apps/<product>-api`.
- **Async path:** in-process deferred dispatch (MVP) → durable queue (scale ADR).
- Orchestrator → LI async per `docs/29` §51 — dispatch failure logged; coach response already delivered.

---

# 11. Core Package Principles

`@tec-platform/core` provides institution-wide primitives. All products use these — no local reimplementation.

### `Result<T>`

Explicit success/failure without exceptions for expected domain failures.

```typescript
// Conceptual — not implementation
Result<T> = { ok: true; value: T } | { ok: false; error: DomainError }
```

**Use:** Service boundaries, repository returns, application orchestration.

### `Either<L, R>`

Functional alternative for branching — prefer `Result<T>` at service boundaries; `Either` for internal transforms.

### `Entity`

Base for objects with identity (`id`). Identity equality.

### `AggregateRoot`

- Extends `Entity`.
- Enforces consistency boundary.
- Emits `DomainEvent[]` from state changes.
- Only aggregate root is loaded/saved through repository.

### `ValueObject`

Immutable; equality by value. Examples: `Email`, `Money`, `CohortId`, `MissionCode`.

### `DomainError`

Typed errors with `code`, `message`, `context`. Mapped to HTTP via application layer — never leaked raw to UI.

| Code family | Example |
|-------------|---------|
| `NOT_FOUND` | Entity missing |
| `VALIDATION` | Business rule violation |
| `FORBIDDEN` | Authorization |
| `CONFLICT` | State transition invalid |

### `UUID`

Platform ID generation interface — `Uuid.generate()`, `Uuid.fromString()`. Implementation swappable for tests.

### `Clock`

Time abstraction — `Clock.system()`, `Clock.fixed()` for tests. **All timestamps through Clock** — no `Date.now()` in domain.

### Base abstractions

| Abstraction | Location | Purpose |
|-------------|----------|---------|
| `Repository<T>` | `core` | Persistence interface |
| `DomainEvent` | `domain` | Event base class |
| `UseCase<I, O>` | `core` | Application entry pattern |
| `Logger` | `core` (interface) | Infrastructure implements |

---

# 12. Testing Foundation

Per `docs/23` testing pyramid and platform package `@tec-platform/testing`.

### Physical layout

```text
# Co-located (default)
apps/<product>-api/src/**/__tests__/
apps/<product>-web/src/**/__tests__/
packages/ui/src/**/__tests__/

# Shared infrastructure
packages/testing/src/
tests/e2e/                           # Playwright cross-app
tests/fixtures/                      # Cross-product fixtures
```

### Tooling

| Layer | Tool |
|-------|------|
| Unit / Integration | Vitest |
| API | Vitest + supertest |
| E2E | Playwright |
| Coverage | v8 via Vitest |

### Shared testing components (`@tec-platform/testing`)

| Component | Purpose |
|-----------|---------|
| **Builders** | Fluent object construction (`MissionAttemptBuilder`, `StudentBuilder`) |
| **Factories** | Randomized valid instances for property-style tests |
| **Fixtures** | Static JSON / DB seed fragments for reproducible tests |
| **Golden Student** | Canonical test persona with known competency state — reuse across products for regression |
| **Mission Generator** | Produces valid mission scenarios for ERP/WMS test suites |
| **Scenario Generator** | End-to-end business scenarios (procure-to-pay path, warehouse receive path) |
| **Fake Repositories** | In-memory repository implementations for unit tests — no database required |

### Rules

| Rule ID | Rule |
|---------|------|
| **TEST-PLATFORM-001** | Golden Student baseline shared — products extend, not duplicate |
| **TEST-PLATFORM-002** | Fake repositories implement `core` interfaces |
| **TEST-PLATFORM-003** | Integration tests use real DB per product engine (Postgres for ERP, MySQL for WMS) |
| **TEST-PLATFORM-004** | E2E uses deployed or dockerized stack — not mocks |
| **TEST-PLATFORM-005** | CI blocks merge on test failure (BUILD-003) |

---

# 13. Configuration Strategy

### ESLint (`@tec-platform/config`)

| Preset | Extends | Used by |
|--------|---------|---------|
| `eslint/base` | TypeScript recommended | All packages |
| `eslint/node` | base | API apps, database packages |
| `eslint/react` | base | Web apps, ui package |

### Prettier

Single institutional formatter config — no per-developer overrides in repo.

### TSConfig

| Config | `strict` | Used by |
|--------|----------|---------|
| `typescript/base.json` | `true` | All packages |
| `typescript/node.json` | extends base | API, database, core |
| `typescript/react.json` | extends base | Web, ui |

**No `any`.** Explicit interfaces (`docs/19` §36).

### Environment

| Mechanism | Responsibility |
|-----------|----------------|
| `.env.example` | Documented catalog — all variables described |
| Zod schema in each API app | Fail-fast validation at startup |
| `scripts/validate-env.ts` | CI check: example keys match schema |
| Railway Variables | Production/staging source of truth |

### Variable classification

| Class | Storage | Example |
|-------|---------|---------|
| Public client | `VITE_*` prefix only | `VITE_API_BASE_URL` |
| Server secret | Railway encrypted | `JWT_ACCESS_SECRET`, `DATABASE_URL` |
| Server config | Railway plain | `LOG_LEVEL`, `CORS_ORIGIN` |
| Feature flag | Railway / env | `FEATURE_AI_COACH_ENABLED` |

**Rule:** Secrets never in `VITE_*`. Secrets never committed.

### Feature flags

- Naming: `FEATURE_<DOMAIN>_<CAPABILITY>` (e.g. `FEATURE_LI_COHORT_AGGREGATION`).
- Default: off in production until Approval Gate passes.
- Flags read at application startup — not per-request dynamic (V1).

---

# 14. Railway Strategy

Railway is the **official cloud platform** for all TEC products (`docs/19` §77.1, `docs/25`, INSTITUTION-005).

### Environment topology (per product)

```text
Railway Project: tec-<product>   (e.g. tec-erp, tec-wms)

├── Service: <product>-api
│   ├── Build: turbo build --filter=<product>-api
│   ├── Start: node dist/index.js
│   ├── Health: GET /health
│   └── Ready: GET /ready
│
├── Service: <product>-web
│   ├── Build: turbo build --filter=<product>-web
│   └── Static serve or lightweight Node static
│
└── Database Plugin
    ├── tec-erp → PostgreSQL
    └── tec-wms → MySQL (existing)
```

### Environment matrix

| Environment | Railway | Purpose | Promotion |
|-------------|---------|---------|-----------|
| **Development** | Optional shared env | Integration experiments | → Staging |
| **Staging** | Required per product | Pre-production validation | → Production |
| **Production** | Required per product | Official institutional use | Release Candidate only |

Local development uses Docker or native DB matching production engine per product.

### Deployment rules

| Rule ID | Rule |
|---------|------|
| **RAIL-001** | Every PR remains deployable to Railway |
| **RAIL-002** | Health check mandatory on all API services |
| **RAIL-003** | `prisma migrate deploy` (ERP) runs before API start |
| **RAIL-004** | Deployment logs reviewed after every production deploy |
| **RAIL-005** | Rollback plan documented before production promotion |
| **RAIL-006** | WMS and ERP are separate Railway projects — no shared database plugin |

---

# 15. CI/CD Foundation

### GitHub Actions workflows

```text
.github/workflows/
├── ci.yml                    # All PRs and main pushes
├── deploy-staging.yml        # Post-merge staging (per product)
└── deploy-production.yml     # Manual dispatch + institutional approval
```

### `ci.yml` pipeline

```text
Trigger: pull_request, push (main)

Jobs:
  1. lint          → turbo lint
  2. typecheck     → turbo typecheck
  3. test          → turbo test (unit)
  4. integration   → product DB service container + migrations + integration tests
  5. build         → turbo build
  6. env-check     → validate-env script
```

### Approval Gates (mandatory)

Per `docs/19` §9 — no phase advances on failure:

| Gate item | CI/CD evidence |
|-----------|----------------|
| Business Rules | Review + domain tests |
| UI | Component tests + visual review |
| Backend | API tests |
| Simulation | Simulation test suite |
| Database | Migration test job |
| API | Contract tests |
| Testing | CI green |
| Documentation | PR checklist |
| Production Readiness | Staging deploy + smoke |

### Quality gates

| Gate | Threshold (V1) |
|------|-----------------|
| Build | Must pass |
| Lint | Zero errors |
| Typecheck | Zero errors |
| Unit tests | 100% pass |
| Integration tests | 100% pass |
| Migration | Clean apply on empty DB |

### Build validation

- Turborepo ensures dependency order.
- Affected-only builds on PR (turbo `--filter=...[origin/main]`).
- Full monorepo build on `main`.

---

# 16. Reuse Policy

### TEC.WMS

| Reuse | Do not reuse |
|-------|--------------|
| Pedagogical UX patterns (mission workspace, progress visibility) | MySQL schema, queries, connection config |
| Railway deployment discipline | WMS business rules in ERP |
| Engineering loop (plan → gate → deploy) | ORM models |
| Institutional branding approach | API endpoints |
| Role-based portal patterns | Shared database package |

WMS remains on **MySQL in production**. Integration into platform monorepo is **optional** — if integrated, uses `apps/wms-*` and `packages/database-wms` only.

### TEC.ERP

| Reuse from platform | ERP-specific |
|---------------------|--------------|
| All `@tec-platform/*` packages | ERP modules (P2P, O2C, etc.) |
| `database-erp` (PostgreSQL + Prisma) | Business Missions content |
| Shared CI/CD and Railway patterns | Simulation rules for ERP domains |
| `ui` AppShell and tokens | ERP navigation tree |
| `testing` Golden Student baseline | ERP scenario library |

### Future products (SCM, CRM, HRM)

| Requirement | Detail |
|-------------|--------|
| Platform packages | Must consume `@tec-platform/core`, `config`, `contracts`, `ui`, `testing` |
| Database | New ADR before schema work |
| Business content | Product-owned in `apps/<product>-api/src/modules/` |
| AI (if applicable) | Must follow `docs/27–30` boundaries |
| Events | Register in `@tec-platform/events` |

### Reuse decision tree

```text
Is it institutional infrastructure?  → packages/*
Is it cross-product UI identity?     → ui
Is it HTTP contract?                 → contracts
Is it product business rule?         → apps/<product>-api/modules/*
Is it product persistence?           → database-<product>
```

---

# 17. Scalability Principles

Per `docs/20` §104–105 and platform longevity goals.

| Principle | Implementation |
|-----------|----------------|
| **Horizontal API scaling** | Stateless Express services on Railway — session in JWT/DB |
| **Database per product** | Scale PostgreSQL/MySQL independently per product load |
| **Async AI analysis** | LI and post-delivery work off synchronous path (`docs/29` §51) |
| **Modular domains** | New ERP module = new `modules/<domain>/` — not new repo |
| **Event-driven growth** | New consumers attach to event registry without modifying publishers |
| **Configuration over code** | New cohorts, institutions, feature flags — not architectural changes |
| **Connection pool discipline** | Repository layer controls query patterns; no N+1 in Context Engine + LI |
| **Static frontend** | Web apps are static assets — CDN/Railway static scaling |
| **Institutional multi-tenancy** | Future ADR — V1 single institution per deployment |

### Scale triggers requiring new ADR

- Durable message queue (replacing in-process async)
- Separate worker Railway service
- Multi-region deployment
- Read replicas
- Product split from monorepo

---

# 18. Evolution Strategy

### ADR governance

| Change type | Process |
|-------------|---------|
| Platform structural change | New ADR in `architecture-board/platform/` — supersedes prior |
| Product-specific change | ADR in `architecture-board/<product>/` |
| Official spec change | Explicit approval to modify `docs/` |
| Accepted ADR | **Immutable** — supersede, never edit |

### Platform versioning

- Platform packages: `0.x` during foundation; semver after first RC.
- Breaking package API → major version bump + migration guide.
- Event schema breaking change → new event major version.

### Extraction path

```text
Phase 1 (RC00): erp-api, erp-web, platform packages
Phase 2: Authentication, layout shell (Sprint 1–3)
Phase 3: Domain modules vertically (Sprint 4+)
Phase 4: Optional WMS integration into monorepo
Phase 5: SCM/CRM/HRM as new app pairs + database ADRs
```

### Technical debt policy

- Debt recorded in `architecture-board/` or engineering notes.
- Debt remediation scheduled in backlog — not ignored.
- Every sprint improves repository health (`docs/20` §91).

### Continuous improvement

Lessons from TEC.WMS incorporated when they strengthen the platform (`docs/19` IMPROVE-006) — **patterns only**, not runtime coupling.

---

# 19. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-01 | WMS/ERP database coupling attempted | Medium | Critical | `DB-PLATFORM-*` rules; separate Railway projects |
| R-02 | Business logic leaks into `ui` package | Medium | High | Package lint rules; PR review |
| R-03 | Orchestrator gains DB access | Low | Critical | ORCH-001 enforcement; module boundary tests |
| R-04 | LI writes competency scores | Low | Critical | AUTH rules; repository write ACL |
| R-05 | Monorepo build times degrade | Medium | Medium | Turborepo cache; affected-only CI |
| R-06 | Event schema drift | Medium | High | Central registry in `events`; contract tests |
| R-07 | Secret exposure via `VITE_*` | Low | Critical | Env validation; security review |
| R-08 | Premature package extraction | Medium | Medium | YAGNI — extract on second use |
| R-09 | In-process async event loss on crash | Medium | Medium | Logged loss + reconciliation job (V1); durable queue ADR (V2) |
| R-10 | Context Engine enrichment failure undefined | Medium | High | Resolve B-01 from Platform Review — degrade with `liEnrichmentUnavailable` flag |
| R-11 | Multi-product monorepo ownership confusion | Medium | Medium | This ADR; clear `apps/<product>-*` naming |
| R-12 | docs/ drift from implementation | Medium | High | Documentation First law; Approval Gate |

---

# 20. Approval Criteria

This ADR is **Accepted** only when all criteria pass institutional review.

### ARB approval checklist

| # | Criterion | Evidence |
|---|-----------|----------|
| A-01 | Aligns with `docs/13` six-layer architecture | Layer map §6 |
| A-02 | Preserves `docs/27–30` AI boundaries | §7 authoritative/advisory |
| A-03 | PostgreSQL + Prisma for ERP; MySQL for WMS unchanged | §9 |
| A-04 | Railway as official platform | §14 |
| A-05 | CI/CD and Approval Gate integration | §15 |
| A-06 | RC00 proposal incorporated and extended | §4–5 |
| A-07 | No ERP business logic in ADR | Document review |
| A-08 | No implementation code | Document review |
| A-09 | `docs/` unmodified | Git diff |
| A-10 | Reuse policy respects WMS production constraints | §16 |
| A-11 | Event architecture supports LI async path | §10 |
| A-12 | Testing foundation supports EduQA evidence | §12 |
| A-13 | Scalability and evolution paths defined | §17–18 |
| A-14 | Risks documented with mitigations | §19 |
| A-15 | Architecture Review Board consensus recorded | Sign-off below |

### Post-acceptance actions (not part of this ADR)

1. RC00 implementation begins per Sprint 0 (`docs/20` §9–11).
2. Platform packages scaffolded in dependency order: `config` → `core` → `contracts` → `domain` → `events` → `database-erp` → `ui` → `testing`.
3. `apps/erp-api` and `apps/erp-web` bootstrapped.
4. CI pipeline activated.
5. Railway staging project provisioned.

---

## Rationale

A **single institutional monorepo** with **strict package law** provides:

- One Approval Gate pipeline for all TEC products;
- Shared design system and engineering standards without shared databases;
- Clear authoritative vs advisory boundaries required by Enterprise AI Foundation;
- Railway-deployable product isolation;
- Growth path for SCM, CRM, HRM without architectural redesign.

Alternatives (polyrepo, shared database, monolith) were rejected because they either fragment institutional governance, violate the WMS/ERP database decision, or prevent independent product scaling.

---

## Alternatives Considered

| Alternative | Reason Not Selected |
|-------------|---------------------|
| Polyrepo per product | Duplicates CI, contracts, UI tokens; weakens institutional consistency |
| Shared database across products | Violates WMS MySQL / ERP PostgreSQL decision; coupling risk |
| Single `packages/database` | Cannot mix MySQL and PostgreSQL ORM schemas |
| Microservices per domain (V1) | Operational complexity exceeds MVP needs; Express monolith per product is Railway-compatible |
| Nx instead of Turborepo | No institutional mandate; pnpm + Turborepo sufficient |

---

## Consequences

### Positive

- Permanent reference for all TEC engineering teams and AI agents.
- Clear package boundaries prevent AI, simulation, and UI coupling.
- Database isolation protects WMS production stability.
- Event registry enables Learning Intelligence async integration.
- Testing foundation supports institutional quality evidence.

### Negative

- Monorepo complexity grows with each product — requires disciplined ownership.
- `apps/api` → `apps/erp-api` rename causes short-term migration cost.
- In-process async events (V1) risk loss on crash — mitigated by V2 queue ADR.
- Platform package API changes require coordinated version bumps across products.

---

## Compliance

| Standard | Alignment |
|----------|-----------|
| `docs/13` System Architecture | §6 layer map |
| `docs/17` Database Schema | §9 ERP PostgreSQL conventions |
| `docs/18` API Specification | §5 contracts package; business-first routes in apps |
| `docs/19` Master Build Specification | §2–3 philosophy; §9 Approval Gate; §77 Railway |
| `docs/20` MVP Backlog Sprint 0 | §20 post-acceptance actions |
| `docs/23` Testing Strategy | §12 testing foundation |
| `docs/25` Deployment Guide | §14 Railway strategy |
| `docs/26` Security Architecture | §13 secrets; env classification |
| `docs/27–30` AI Architecture | §7 authoritative/advisory; §10 events |
| Architecture Review Board Phase 3 | ORCH-001, CTX-RULE-001, LI boundaries preserved |
| RC00 Physical Architecture Proposal V1 | Extended — not redesigned |

---

## Approval / Status

| Field | Value |
|-------|-------|
| **Status** | **Proposed** |
| **Accepted By** | _Pending Architecture Review Board_ |
| **Acceptance Date** | _Pending_ |

### Sign-off (pending)

| Role | Name | Date | Decision |
|------|------|------|----------|
| Chief AI Architect (Agent A) | | | |
| Platform Integration (Agent B) | | | |
| Data & Knowledge (Agent C) | | | |
| Principal Engineering Reviewer (Agent G) | | | |
| Institutional Sponsor | | | |

---

*ADR-PLATFORM-001 — Enterprise Platform Foundation. Constitutional physical architecture for the TEC Platform ecosystem. Not a functional specification. Not implementation code.*
