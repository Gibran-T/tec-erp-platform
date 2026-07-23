# TEC.ERP Learning Operating System Roadmap

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Wave 1 (this wave)

Master Learning Architecture Contract — documentation only. No deploy. No merge automation.

## Future waves

### Wave 2 — Portal, Login and Academic Identity

| Field | Value |
|-------|-------|
| Objective | Portal, Login and Academic Identity |
| Dependency | Wave 1 contract approved |
| Branch | `feature/los-wave2-portal-login` |
| Outputs | Portal/login UX + assets |
| Tests | Visual + a11y + i18n |
| Screenshot gates | Hero/login FR/EN Light/Dark |
| Owner approval | Owner |
| Deployment gate | Deploy only after gate |
| Rollback | Revert web deploy |

### Wave 3 — Module Learning Experience (pilots M3, M10, M8)

| Field | Value |
|-------|-------|
| Objective | Module Learning Experience (pilots M3, M10, M8) |
| Dependency | Wave 2 |
| Branch | `feature/los-wave3-module-learning` |
| Outputs | Cycle UX + pilot content |
| Tests | Mission role tests |
| Screenshot gates | Module hub cycle screens |
| Owner approval | Owner |
| Deployment gate | Pilot flag |
| Rollback | Feature flag off |

### Wave 4 — BI Studio

| Field | Value |
|-------|-------|
| Objective | BI Studio |
| Dependency | Wave 3 pilots |
| Branch | `feature/los-wave4-bi-studio` |
| Outputs | BI Studio contract implemented |
| Tests | KPI schema tests |
| Screenshot gates | BI visualizations real |
| Owner approval | Owner |
| Deployment gate | API+Web |
| Rollback | Disable BI route |

### Wave 5 — AI Decision Workspace

| Field | Value |
|-------|-------|
| Objective | AI Decision Workspace |
| Dependency | Wave 4 |
| Branch | `feature/los-wave5-ai-workspace` |
| Outputs | Workspace + evidence binding |
| Tests | AI boundary tests |
| Screenshot gates | Large workspace screenshots |
| Owner approval | Owner |
| Deployment gate | API guardrails |
| Rollback | Fallback Coach IA |

### Wave 6 — Teaching Deck and Presentation Mode

| Field | Value |
|-------|-------|
| Objective | Teaching Deck and Presentation Mode |
| Dependency | Wave 3–5 content |
| Branch | `feature/los-wave6-teaching-deck` |
| Outputs | Decks M1–M10 + presentation |
| Tests | Keyboard/projector tests |
| Screenshot gates | Deck sequence screenshots |
| Owner approval | Owner |
| Deployment gate | Web |
| Rollback | Hide decks |

### Wave 7 — Professor Pedagogical Control

| Field | Value |
|-------|-------|
| Objective | Professor Pedagogical Control |
| Dependency | Wave 6 |
| Branch | `feature/los-wave7-professor-control` |
| Outputs | Teaching control surfaces |
| Tests | RBAC tests |
| Screenshot gates | Professor flows |
| Owner approval | Owner |
| Deployment gate | API+Web |
| Rollback | Role gate |

### Wave 8 — Thiago Professor Setup

| Field | Value |
|-------|-------|
| Objective | Thiago Professor Setup |
| Dependency | Wave 7 + owner auth |
| Branch | `ops/thiago-professor-setup` |
| Outputs | Thiago account evidence |
| Tests | Authz isolation |
| Screenshot gates | N/A (ops) |
| Owner approval | Owner |
| Deployment gate | Production ops gate |
| Rollback | Disable account |

### Wave 9 — James Run 2

| Field | Value |
|-------|-------|
| Objective | James Run 2 |
| Dependency | Wave 8 + owner auth |
| Branch | `pilot/james-timothy-run2` |
| Outputs | Run 2 V2 pedagogical |
| Tests | V1 immutability tests |
| Screenshot gates | Run badges |
| Owner approval | Owner |
| Deployment gate | Production ops gate |
| Rollback | Cancel Run 2 |

## Hard holds until authorized

No Thiago Professor before Wave 8 · No James Run 2 before Wave 9 · No production mutation in Waves 1–7 except explicit deploy gates.
