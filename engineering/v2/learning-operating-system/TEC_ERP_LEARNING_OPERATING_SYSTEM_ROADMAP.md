# TEC.ERP Learning Operating System Roadmap

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 + Wave 1A Research Addendum · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Wave 1 (complete as contract)

Master Learning Architecture Contract — documentation only. No deploy.

## Wave 1A (this addendum)

Research Addendum: serious simulation, Digital Twin pedagogy, consulting mandates, experience modes, Enterprise Life Engine / Ambient AI contracts — documentation only. No deploy. No application source changes.

## Future waves

### Wave 2A — Portal Experience Playback Zero

| Field | Value |
|-------|-------|
| Objective | Playback Zero of portal/login academic identity journey before build |
| Dependency | Wave 1 + 1A owner review |
| Branch | `feature/los-wave2a-portal-playback-zero` |
| Outputs | Journey review artifacts; Sponsor User feedback; Hills |
| Tests | Design review checklist |
| Owner approval | Owner |
| Deployment gate | None (no production) |
| Rollback | N/A |

### Wave 2B — Portal / Login implementation

| Field | Value |
|-------|-------|
| Objective | Portal, Login and Academic Identity implementation |
| Dependency | Wave 2A approved |
| Branch | `feature/los-wave2b-portal-login` |
| Outputs | Portal/login UX + assets |
| Tests | Visual + a11y + i18n |
| Screenshot gates | Hero/login FR/EN Light/Dark |
| Owner approval | Owner |
| Deployment gate | Deploy only after gate |
| Rollback | Revert web deploy |

### Wave 3A — M3 Module Experience Playback Zero

| Field | Value |
|-------|-------|
| Objective | Playback Zero for M3 module learning experience |
| Dependency | Wave 2B |
| Branch | `feature/los-wave3a-m3-playback-zero` |
| Outputs | M3 journey review; mandate/mission walkthrough |
| Tests | Design review |
| Owner approval | Owner |
| Deployment gate | None |
| Rollback | N/A |

### Wave 3B — M3 module implementation

| Field | Value |
|-------|-------|
| Objective | Implement M3 module learning cycle as first module pilot |
| Dependency | Wave 3A approved |
| Branch | `feature/los-wave3b-m3-module` |
| Outputs | Cycle UX + M3 content |
| Tests | Mission role tests |
| Screenshot gates | Module hub cycle screens |
| Owner approval | Owner |
| Deployment gate | Pilot flag |
| Rollback | Feature flag off |

### Wave 3C — M8 and M10 pilots

| Field | Value |
|-------|-------|
| Objective | HCM (M8) and BI/KPI/AI (M10) module pilots |
| Dependency | Wave 3B |
| Branch | `feature/los-wave3c-m8-m10-pilots` |
| Outputs | M8/M10 cycle UX + content |
| Tests | Mission + HCM_M8 + BI path tests |
| Screenshot gates | M8/M10 hubs |
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

### Wave 5A — AI Decision Workspace

| Field | Value |
|-------|-------|
| Objective | Visible AI Decision Workspace |
| Dependency | Wave 4 |
| Branch | `feature/los-wave5a-ai-workspace` |
| Outputs | Workspace + evidence binding |
| Tests | AI boundary tests; no state mutation by coach |
| Screenshot gates | Large workspace screenshots |
| Owner approval | Owner |
| Deployment gate | API guardrails |
| Rollback | Fallback Coach IA |

### Wave 5B — Enterprise Life Engine and stakeholder AI pilot

| Field | Value |
|-------|-------|
| Objective | Controlled Ambient AI / ELE pilot |
| Dependency | Wave 5A + Digital Twin readiness |
| Branch | `feature/los-wave5b-enterprise-life-engine-pilot` |
| Outputs | Stakeholder profiles + event engine pilot on **M3** |
| Pilot stakeholders | supplier · buyer supervisor · warehouse · finance · customer |
| Tests | Grounding, authority, no Twin contradiction, historical-run isolation, AI-unavailable fallback |
| Screenshot gates | Inbox/chat consequence demos |
| Owner approval | Owner |
| Deployment gate | Pilot flag only — **not** full company life |
| Rollback | Disable ELE; authored events remain |

**Do not activate full AI-driven company life across all modules at once.**

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
| Objective | Professor Pedagogical Control (freeze, events, compare, guidance) |
| Dependency | Wave 6 |
| Branch | `feature/los-wave7-professor-control` |
| Outputs | Teaching control surfaces + event suppress/trigger |
| Tests | RBAC + event governance tests |
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

No Thiago Professor before Wave 8 · No James Run 2 before Wave 9 · No production mutation in Waves 1–1A · No full Ambient AI company life before successful M3 ELE pilot · No Wave 2 implementation before owner approval of this contract pack.
