# TEC.ERP — Zero1 Pre-Cohort Remediation Plan

**Branch:** `remediation/zero1-precohort`  
**Base:** `main` @ `63897327ce6a5c1ad7dee4acc8e7960ac7245b29`  
**Evidence:** PR #21 / `pilot/james-timothy-zero1` @ `bb52d702a81ab48851ba7976b8fe6434227a3211`  
**Rule:** Plan before implementation · no James mutation · no deploy until owner approval

---

## Wave scope

| Include | Exclude |
|---------|---------|
| Z1-001, Z1-002, Z1-003/010, Z1-004, Z1-005, Z1-007, Z1-008, Z1-009, Z1-012 | Product redesign, new modules, mission contract changes |
| Z1-006 as **plan only** (full-UI revalidation after merge/deploy) | Rerunning James during this wave |
| Deferred P3/P4 with explicit reasons | Production seed of Thiago Gibran |

---

## Findings register

### Z1-001 — Student navigation RBAC display
| Field | Value |
|-------|-------|
| Severity | P2 |
| Category | UX · security perception |
| Affected | `apps/web/src/workspace/appRegistry.ts`, `WorkspaceSidebar.tsx`, `AppLauncherGrid.tsx`, `AppTile.tsx`, `WorkspaceAppPage.tsx` |
| Root cause | Admin/professor apps marked `access: "day1"` for all roles; badge « Accès actif » whenever not `preparing` |
| Proposed fix | Add `roles?: EmployeeRole[]` (or `requiredRole`) on app definitions; filter sidebar/launcher by authenticated role; forbidden direct URL shows reserved message (existing page gates) + keep API 403 |
| Test strategy | Web unit tests student/professor/admin nav; forbidden route text; refresh persistence |
| Production risk | Low — UI-only |
| This wave | **Accepted** |

### Z1-002 — Duplicate locked M2 course payload
| Field | Value |
|-------|-------|
| Severity | P2 |
| Category | technical · progression |
| Affected | `apps/api/src/modules/course/course.service.ts` (`getCourseOverview`) |
| Root cause | **Confirmed:** after `listModules()` (already includes real M2), leftover Wave-1 block appends placeholder M2 when `module_ready:M2` unlock exists |
| Proposed fix | Remove placeholder push; ensure exactly 10 unique modules from catalog; contract tests |
| Test strategy | API course overview for new + completed student; 10 unique codes; 30 missions; order M1–M10 |
| Production risk | Low — projection-only; James rows unchanged |
| This wave | **Accepted** |

### Z1-003 / Z1-010 — Institutional professor assignment
| Field | Value |
|-------|-------|
| Severity | P1 / P2 |
| Category | admin · professor portal · certification |
| Affected | `admin.routes.ts`, `admin.service.ts`, `AdminPortalPage.tsx`, `admin.ts` client, schema `CohortMembership` |
| Root cause | No admin API to create/promote PROFESSOR or assign `roleInCohort: "professor"`; enroll hardcodes student |
| Proposed fix | Admin endpoints: create employee (with role), create cohort, assign/remove professor membership with audit; Admin UI actions; runbook. **No Thiago email in code/seed. No James mutation.** |
| Test strategy | API admin create professor, assign, isolation Professor B, reassignment audit |
| Production risk | Medium — new write paths; require admin auth + validation |
| This wave | **Accepted** (workflow only; live Thiago identity deferred to owner ops) |

### Z1-004 — AI Coach professional depth
| Field | Value |
|-------|-------|
| Severity | P2 |
| Category | AI Coach · pedagogy |
| Affected | `ai-coach.guards.ts`, `ai-coach.service.ts`, tests |
| Root cause | Single generic deterministic fallback |
| Proposed fix | Contextual deterministic templates by mission/module/department + prompt categories; preserve no-answer-key / no writes |
| Test strategy | Context specificity; sanitization; no mutation; French |
| Production risk | Low |
| This wave | **Accepted** |

### Z1-005 — French accents / terminology
| Field | Value |
|-------|-------|
| Severity | P3 (elevated into wave by mandate) |
| Category | French language · content |
| Affected | `packages/mission-catalog` wave2/m2+ titles, workspace labels as needed |
| Proposed fix | Accent corrections; `TECERP_FRENCH_TERMINOLOGY.md` |
| Test strategy | Catalog snapshot / string assertions on corrected titles |
| Production risk | Low |
| This wave | **Accepted** |

### Z1-006 — Hybrid UI evidence
| Field | Value |
|-------|-------|
| Severity | P2 (process) |
| Category | testing · pedagogy evidence |
| Proposed fix | Document `ZERO1_FULL_UI_REVALIDATION_PLAN.md` only |
| This wave | **Plan only — deferred execution** until after merge/deploy |
| Reason | Must not rerun James during remediation; product not broken |

### Z1-007 — Stale revoked Gold certificate UI
| Field | Value |
|-------|-------|
| Severity | P3 (elevated) |
| Category | UX · certification |
| Affected | `CertificatesPage.tsx`, certification list API if needed |
| Root cause | Student page fetches once in `useEffect([])`; no invalidation after revoke/reissue |
| Proposed fix | Refetch on focus/visibility/interval after mount; filter display so revoked not shown as valid; ensure list order prefers active |
| Test strategy | Web tests issue/revoke/reissue list state |
| This wave | **Accepted** |

### Z1-008 — Scoring transparency
| Field | Value |
|-------|-------|
| Severity | P2 |
| Category | scoring · pedagogy |
| Affected | `evaluator.ts`, mission submit response, `MissionCenterPage.tsx` |
| Root cause | Partial scores lack criterion breakdown in UI |
| Proposed fix | Extend submit feedback with dimension breakdown (points earned/max, gap explanation, retry guidance) without answer keys; no retroactive score change |
| Test strategy | 100 / 85 / validation fail / retry / refresh |
| This wave | **Accepted** |

### Z1-009 — Professor roster M10 visibility
| Field | Value |
|-------|-------|
| Severity | P3 (elevated) |
| Category | professor portal · analytics |
| Affected | `professor.service.ts` listStudents/getStudentDetail/exportCsv |
| Root cause | CSV lacks modules; roster may omit empty module rows |
| Proposed fix | Always emit M1–M10 ordered; Capstone status separate; CSV columns for modules + Capstone |
| Test strategy | new / partial / M10-complete / Capstone pending/approved / CSV |
| This wave | **Accepted** |

### Z1-012 — Capstone / Gold route discovery
| Field | Value |
|-------|-------|
| Severity | P3 (elevated) |
| Category | UX · capstone · certification |
| Affected | `CapstonePage.tsx`, `ProfessorPortalPage.tsx`, `capstone.ts` client |
| Root cause | No eligibility UI; professor queue read-only; Gold not linked to eligibility |
| Proposed fix | Student Capstone eligibility/status; professor approve/reject + pending count; Gold only when eligible with reasons |
| Test strategy | Web/API discoverability + role gates |
| This wave | **Accepted** |

### Deferred (documented)

| ID | Sev | Reason |
|----|-----|--------|
| Z1-011 | P2 | Institutional teaching model — covered by Z1-003 workflow; live assignment is ops |
| Z1-013 | P3 | Assessment feedback laconic — non-blocking; not in mandatory list |
| Z1-014 | P4 | Hybrid duration metrics — polish |
| Z1-015 | P4 | Public verify privacy already OK |

---

## Implementation order

1. Z1-002 course payload (smallest, high confidence)  
2. Z1-001 nav RBAC  
3. Z1-003/010 admin professor workflow + runbook  
4. Z1-008 scoring transparency  
5. Z1-004 AI Coach depth  
6. Z1-007 certificates refresh  
7. Z1-009 professor M10/CSV  
8. Z1-012 Capstone/Gold UX  
9. Z1-005 French + terminology map  
10. Z1-006 UI revalidation plan  
11. Tests, smoke, remediation report  

## Invariants

- 10 unique modules · 30 unique missions  
- James production data untouched  
- Role isolation intact  
- AI non-authoritative  
- No secrets · no production seed of personal identities  
