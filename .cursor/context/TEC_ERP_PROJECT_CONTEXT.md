# TEC.ERP — Project Context

**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  
**Mission:** Educational ERP platform that teaches how enterprises operate through integrated **Business Missions** — not a generic LMS or SAP clone.

---

## Official Stack

| Layer | Technology |
|-------|------------|
| Hosting | Railway |
| Database | PostgreSQL + Prisma ORM |
| Backend | Express + TypeScript |
| Frontend | React + TypeScript + Tailwind CSS |
| Design | Fiori-inspired enterprise UI |

See `docs/13_SYSTEM_ARCHITECTURE.md` and `docs/19_CURSOR_MASTER_BUILD_SPECIFICATION.md`.

---

## Source-of-Truth Hierarchy

When documents conflict, follow this order (`docs/19` §4):

1. Product Vision → 2. Learning Philosophy → 3. Learning Blueprint →  
4. ERP Functional Specification → 5. UI Blueprint → 6. Database Schema →  
7. API Specification → 8. Cursor Master Build Specification → 9. Source Code

Source code must never contradict higher-level documentation.

---

## Official Documentation Index

### Foundation (upstream)
| Doc | Purpose |
|-----|---------|
| `docs/00_PRODUCT_VISION.md` | Product mission and scope |
| `docs/00_ENGINEERING_PRINCIPLES.md` | EP-001–005 engineering rules |
| `docs/01_LEARNING_BLUEPRINT.md` | Pedagogical structure |
| `docs/09_AI_COACH_ARCHITECTURE.md` | AI Coach role and limits |
| `docs/13_SYSTEM_ARCHITECTURE.md` | Six-layer technical architecture |

### Implementation specs (15–26)
| Doc | Purpose |
|-----|---------|
| `docs/15_ERP_FUNCTIONAL_SPECIFICATION.md` | Business modules, missions, workflows |
| `docs/16_UI_BLUEPRINT.md` | Screens, layout, navigation, components |
| `docs/17_DATABASE_SCHEMA.md` | Entities, relationships, DB principles |
| `docs/18_API_SPECIFICATION.md` | REST endpoints, business-first API |
| `docs/19_CURSOR_MASTER_BUILD_SPECIFICATION.md` | Master engineering and Cursor guide |
| `docs/20_MVP_IMPLEMENTATION_BACKLOG.md` | Sprint roadmap and exit criteria |
| `docs/21_PLATFORM_OPERATIONS_PLAYBOOK.md` | Railway ops, monitoring, incidents |
| `docs/22_QUALITY_ASSURANCE_MANUAL.md` | QA methodology and EduQA |
| `docs/23_TESTING_STRATEGY.md` | Test types, coverage, evidence |
| `docs/24_RELEASE_MANAGEMENT.md` | Release lifecycle and gates |
| `docs/25_DEPLOYMENT_GUIDE.md` | Deployment methodology |
| `docs/26_SECURITY_ARCHITECTURE.md` | Security-by-design controls |

---

## Engineering Loop

Every phase follows (`docs/19` §8, `docs/20` §3):

Planning → Architecture → Implementation → Testing → Documentation → Validation → **Approval Gate** → Git Commit → Next Phase

No phase may bypass the Approval Gate. Incomplete work does not advance.

---

## Non-Negotiable Standards

- **Business before software** — missions and decisions, not isolated transactions
- **Documentation before development** — consult specs before coding
- **Vertical delivery** — complete slices (backend + frontend + tests + docs)
- **Railway production validation** — every release deployable on Railway
- **Educational quality** — features must improve learning outcomes (EduQA, `docs/22` §24)
- **AI Coach** — guides reflection; never replaces student or professor (`docs/09`)

---

## Agent Guardrails

- **Never modify `docs/`** without explicit user approval
- **Only commit** when the user explicitly requests it
- **Read the relevant official doc** before implementing a feature
- **Flag spec gaps** — propose doc updates; do not silently drift from specs
- **Current execution anchor:** `docs/20_MVP_IMPLEMENTATION_BACKLOG.md`
