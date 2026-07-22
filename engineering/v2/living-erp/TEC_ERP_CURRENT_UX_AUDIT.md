# TEC.ERP Current UX Audit (Pre-Wave → Living ERP)

## Baselines and release posture

| Item | Value | Notes |
|------|-------|-------|
| Authoritative main / Living ERP baseline | `c6c242a` (`c6c242afc179ad78106d64b71bfae81fea5a6e5e`) | Merge of PR #29 — V2 HCM Assessment Bank |
| Production product SHA | `76709d6` (`76709d62368675d8d6517c592e66e41349569ff2`) | **HOLD** — V2 foundations merged; production deployment held |
| PR #26 | Open / independent | Untouched by Living ERP wave; do not rebase or merge into this work |
| Merged foundations | PR #25, #27, #28, #29 | Versioned runs, Mission Center hotfix, V2 curriculum + Capstone, HCM assessment |

This audit describes the **pre-wave route/state map** (app-id shell) and marks what Living ERP changed in the worktree.

## Routing model

Learners do **not** use one deep URL per feature. Routes are declared in `apps/web/src/App.tsx`; most apps resolve via `WorkspaceAppPage` + `appRegistry`.

### Declared routes (`App.tsx`)

| Pattern | Element | Auth |
|---------|---------|------|
| `/login` | `LoginPage` | Public |
| `/verify/:token` | `CertificateVerifyPage` | Public |
| `/` → `/workspace` | redirect | Protected |
| `/workspace` | `LearnerHomePage` (Living) / previously launcher-home | Protected |
| `/workspace/modules/:moduleCode` | `ModuleHubPage` (**new**) | Protected |
| `/workspace/apps/:appId` | `WorkspaceAppPage` switch | Protected |
| `*` (inside shell) | `NotFoundPage` | Protected |

### App catalog (`apps/web/src/workspace/appRegistry.ts`)

| `appId` | Label (FR registry) | Access | Roles | `WorkspaceAppPage` target |
|---------|---------------------|--------|-------|---------------------------|
| `accueil` | Accueil | day1 | any | Path alias → `/workspace` |
| `boite-reception` | Boîte de réception | day1 | any | `InboxAppPage` |
| `taches` | Tâches | day1 | any | `TasksAppPage` |
| `documents` | Documents | day1 | any | `TransactionWorkspacePage` |
| `centre-mission` | Centre de mission | day1 | any | `MissionCenterPage` |
| `erp` | ERP | day1 | any | `OrganizationalErpPage` |
| `evaluations` | Évaluations | day1 | any | `AssessmentCenterPage` |
| `portail-professeur` | Portail professeur | day1 | PROFESSOR, ADMIN | `ProfessorCommandCenterPage` (Living) |
| `tableaux-bord` | Tableaux de bord | day1 | any | `DashboardPage` |
| `coach-ia` | Coach IA | day1 | any | `AiCoachPage` |
| `capstone` | Capstone | day1 | any | `CapstonePage` |
| `certificats` | Certificats | day1 | any | `CertificatesPage` |
| `administration` | Administration | day1 | ADMIN | `AdminPortalPage` |
| `calendrier` | Calendrier | preparing | any | Empty preparing card |
| `centre-services-ti` | Centre de services TI | preparing | any | Empty preparing card |
| `profil` | Mon profil | day1 | any | `EmployeeProfilePage` |

Shell: `WorkspaceLayout` → `AppShell` (top nav / sidebar / main / context panel) + optional mobile bottom nav.

## Pre-wave learner state matrix (summary)

| Surface | Loading | Empty | Error | Locked / blocked | Historical | Role-gated |
|---------|---------|-------|-------|------------------|------------|------------|
| Login | submit busy | — | credential / validation | — | — | public |
| Workspace home | fetch busy | no course | API error | Capstone/attention hints | run COMPLETED / `isHistorical` | — |
| Mission Center | mission list | no missions | API error | `locked` + unlock text | read-only historical run | — |
| Documents / transactions | tab load | no docs | action fail | company/sim rules | run writeability | — |
| Dashboard / KPI | fetch | no KPIs | API error | — | stale KPI flag | — |
| AI Coach | ask pending | no chat | ask fail | safeguards (no score change) | — | — |
| Capstone | load | no dossier | submit fail | lifecycle LOCKED | APPROVED/REJECTED RO | — |
| Certificates | load | none issued | load fail | eligibility incomplete | revoked sorted down | — |
| Assessments | load | locked bank | fail | unlock gates | curriculum-aware | — |
| Professor portal | load | empty cohorts | fail | — | — | PROFESSOR/ADMIN |
| Admin | — | — | — | — | — | ADMIN |
| Preparing apps | — | preparing copy | — | access preparing | — | — |

## Known P2s (1–10) — Living ERP wave targets

| # | Issue | Pre-wave | Worktree status |
|---|-------|----------|-----------------|
| 1 | English login validation string in French mode | Browser/HTML/`Invalid email…` leaks | **Addressed** — `LocaleProvider.localizeLoginError` + login tests |
| 2 | Professor `unique-students` alias/route mismatch | Professor path 404; Admin worked | **Addressed** — professor route alias + API test |
| 3 | Capstone submit CTA visible while locked | Button still rendered | **Addressed** — CTA replaced by unavailable status; unit test |
| 4 | Raw enum leakage in run/Capstone states | Technical enums in UI | **Partial** — `statusLabel` / chips on Living surfaces; some legacy pages still raw |
| 5 | Weak historical/current run distinction | Subtle or missing | **Addressed** on shell/home — `RunBadge` + historical chip; deepen elsewhere |
| 6 | Mixed-language primary labels | FR UI + EN API strings | **Partial** — FR default + EN catalog for shell keys; many page bodies still FR-hardcoded |
| 7 | Unexplained KPI cards | Value-only tiles | **Addressed** — `KpiExplainedCard` + `explainKpi` |
| 8 | `unknown` Professor analytics labels where data exists | Opaque labels | **Partial** — heatmap/competency lists improved; Student 360 still dumps JSON |
| 9 | Concatenated labels without spacing/hierarchy | Dense strings | **Partial** — chips/badges/sections; Mission Center legacy density remains |
| 10 | Flat 30-mission presentation without module hierarchy | Single long list | **Addressed** — Learner journey cards + `ModuleHubPage` M1–M10 |

## Audit notes (honest)

- Pre-wave Accueil was primarily launcher + Day-1 messaging; Living replaces `/workspace` with `LearnerHomePage` (journey, attention, competencies).
- Module hubs and Professor Command Center are **new Living surfaces** on top of existing APIs — not a full visual redesign of Mission Center / Organizational ERP.
- Production (`76709d6`) remains on HOLD; this pack documents the Living worktree, not a production deploy.
- No secrets, credentials, or assessment answer keys in this audit.
