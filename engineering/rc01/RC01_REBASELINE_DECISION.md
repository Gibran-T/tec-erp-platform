# RC01 Rebaseline Decision

## 1. Decision Status

| Field | Value |
|-------|-------|
| Status | **Proposed / Pending approval** |
| Date | 2026-07-10 |
| Branch | `release/rc01` |
| Baseline HEAD | `e37a0306630ec3ea3f932a7f943d0d90aeddb92c` |
| Main | `49608de08c1527ab1fdbd355e6e0ec349177b69c` |
| Production | Untouched |

This document is **not** approved until the Project Owner explicitly reviews and approves it.

---

## 2. Why Rebaseline Was Required

RC01 delivery evolved beyond the original oversized MVP backlog into a workplace-first sequence of vertical slices.

- The original MVP backlog was too large to treat as a single RC01 release.
- Delivery proved value through enterprise workplace slices rather than a full LMS/mission platform.
- Slices A–C validated a real First-Day Foundation: authentication, workspace shell, inbox/tasks, and persistent employee state.
- The official Blueprint still requires Mission 1 discovery and read-only organizational ERP context before RC01 can close.
- RC01 must not absorb all MVP engines (Mission Engine, Simulation, scoring, certification, AI runtime, transactional ERP).

Rebaseline is therefore required to redefine RC01 as a bounded first-day and discovery release, not as the entire MVP.

---

## 3. Completed and Frozen Scope

The following are **CLOSED / GREEN** and frozen on `release/rc01` at baseline HEAD `e37a0306630ec3ea3f932a7f943d0d90aeddb92c`:

| Slice | Name | Status |
|-------|------|--------|
| A | Authentication and First-Day Entry | DONE / FROZEN |
| B | Enterprise Workspace Shell | DONE / FROZEN |
| C1 | First-Day Backend Foundation | DONE / FROZEN |
| C2 | First-Day Web Experience | DONE / FROZEN |
| C | First-Day Experience (final checkpoint) | CLOSED / GREEN |

Key references:

| Item | Value |
|------|-------|
| C1 implementation | `2670a68e5361e39e6bd97056726135dc26f65dff` |
| C1 governance exception | `35d09f6acd2bab907f57cebe6cdc7830d94389cf` |
| C1 checkpoint | `407e626599037ad34d46a1ab594e1dc0d03c17e5` |
| C2 implementation / PR #3 merge | `db621561b85c156b861c72b1b2788bfb3997179c` |
| Slice C checkpoint | `e37a0306630ec3ea3f932a7f943d0d90aeddb92c` |

First-Day Foundation closure is **not** RC01 closure. Remaining work is Slices D, E, and F only.

---

## 4. Product Owner Decisions

### OD-1 — RC01 status

Slices A–C close the validated First-Day Foundation. They do **not** close the entire RC01.

RC01 must still deliver:

- Mission Center minimum;
- M1-M01 enterprise discovery;
- read-only ERP organizational context;
- minimum French/accessibility hygiene;
- final RC01 release closure.

### OD-2 — Mission 1 depth

RC01 includes a thin vertical for **M1-M01 — Découvrir l’entreprise**. It does **not** include a generic or full Mission Engine.

Required thin-vertical capabilities:

- Day-1 completion unlock;
- workplace mission briefing;
- company context;
- one analytical business decision;
- short required justification;
- business feedback;
- persistent mission state;
- minimum reviewable evidence.

### OD-3 — Business-process boundary

Tom’s 40 versus 36 inventory discrepancy is narrative and analytical context only.

Forbidden in RC01:

- inventory adjustment;
- posting;
- PR / PO / GR;
- master-data write;
- ERP transaction engine.

### OD-4 — Evidence boundary

Persist:

- inputs consulted;
- department/problem selections;
- short justification;
- mission status;
- timestamps;
- linked competency codes where appropriate.

Do not add:

- numeric score;
- quiz;
- certification;
- AI evaluation;
- professor grading UI.

Reflection beyond the required short justification is optional.

### OD-5 — Professor boundary

Professor Console and evidence-review UI are deferred. The evidence model should be future-reviewable, but no professor surface enters RC01.

### OD-6 — Read-only ERP boundary

RC01 includes a bounded read-only organizational ERP view:

- NordHabitat company context;
- departments;
- functions;
- department relationships;
- process awareness;
- fragmentation signals.

No write path. No vendor-specific clone. No SAP, Oracle, Dynamics, or Odoo screen reproduction.

### OD-7 — AI boundary

Explicitly forbidden in RC01:

- AI Mentor;
- AI Coach;
- AI Context Engine;
- AI Reasoning Orchestrator;
- runtime prompts;
- AI evaluation;
- AI scoring influence;
- student-data exposure to LLMs.

AI remains only a future architectural concern.

### OD-8 — UX boundary

Do **not** begin a UX Polish Wave.

Only mandatory experience hygiene is allowed in the final refinement slice:

- French user-visible fallbacks and errors;
- French auth restore state;
- French NotFound / ErrorBoundary;
- French profile labels;
- skip link;
- employee badge menu Escape / outside-click / focus return;
- consistent workplace vocabulary;
- required accessibility and responsive exit checks.

No redesign. No visual system expansion. No cosmetic polish bundle.

---

## 5. Updated RC01 Definition

RC01 is:

> A validated enterprise first-day and discovery experience in which an employee enters NordHabitat, receives communication, completes a responsibility, enters a first discovery mission, records a justified business observation, and consults organizational ERP context without executing transactions.

RC01 is an enterprise workplace learning experience, not an LMS course shell and not a transactional ERP product.

---

## 6. RC01 Explicit Non-Goals

RC01 does **not** include:

- full Mission Engine;
- Simulation Engine;
- scoring;
- certification;
- AI runtime;
- professor/admin portals;
- ERP postings;
- master-data writes;
- full M1 (beyond thin M1-M01);
- P2P / O2C;
- production launch;
- vendor clone (SAP / Oracle / Dynamics / Odoo);
- UX Polish Wave.

---

## 7. Remaining Slice D

### Purpose

Deliver the first post-Day-1 business-process experience: Mission Center minimum and enterprise discovery for **M1-M01 — Découvrir l’entreprise**.

### Employee journey

Day 1 complete
→ Mission Center unlocked
→ Claire assigns Découvrir l’entreprise
→ employee opens company context
→ employee observes NordHabitat departments and fragmentation
→ Tom 40 versus 36 appears as a business signal
→ employee maps departments to business problems
→ employee submits a short justification
→ Claire/company feedback is recorded
→ mission completion persists

### Included

- Mission Center minimum workplace surface;
- one mission: M1-M01 Découvrir l’entreprise;
- Day-1 unlock rule;
- minimum mission/attempt state;
- department/problem mapping;
- short required justification;
- persistent evidence;
- business feedback;
- French workplace language;
- tests and validation.

### Excluded

- generic Mission Engine;
- M1-M02 and M1-M03;
- simulation;
- scoring;
- certification;
- teacher UI;
- AI;
- ERP transactions;
- UX Polish.

### Dependencies

- Frozen First-Day Foundation (A–C);
- Day-1 completion as unlock precondition;
- NordHabitat workplace identity and shell.

### Evidence

Minimum reviewable mission attempt/evidence per OD-4. No numeric score. No professor UI.

### Exit criteria

- Journey above works end-to-end on Railway validation;
- automated gates pass;
- no forbidden scope entered;
- PR-based merge into `release/rc01`;
- post-merge validation;
- Slice D checkpoint approved, committed, and pushed;
- Slice D frozen before Slice E begins.

Slice D is **not** implemented by this rebaseline document.

---

## 8. Remaining Slice E

### Purpose

Make NordHabitat’s organizational and process context accessible through the ERP/workplace without transactional scope.

### Employee journey (indicative)

Employee consults company profile
→ explores departments and functions
→ understands relationships and fragmentation signals
→ connects observations to Slice D discovery context
→ remains within honest read-only access boundaries

### Included

- company profile;
- departments;
- functions and responsibilities;
- relationships between departments;
- introductory process awareness;
- read-only navigation;
- connection to Slice D evidence/context;
- honest access boundaries;
- tests and validation.

### Excluded

- CRUD;
- master-data write;
- supplier/customer write;
- PR / PO / GR;
- inventory posting;
- sales order;
- finance posting;
- approvals;
- workflow engine;
- vendor-specific UI clone.

### Dependencies

- Slice D complete and frozen (or tightly coordinated if Owner authorizes overlap — default is D then E);
- First-Day Foundation frozen;
- OD-3 and OD-6 boundaries.

### Evidence

Read-only consultation may contribute context to mission evidence where appropriate. No write transactions. No scoring.

### Exit criteria

- Read-only organizational view usable and tested;
- no write path exists;
- automated gates pass;
- PR-based merge;
- post-merge validation;
- Slice E checkpoint approved, committed, and pushed;
- Slice E frozen before Slice F begins.

Slice E is **not** implemented by this rebaseline document.

---

## 9. Remaining Slice F

### Purpose

Close only the validated experience and release-readiness gaps. Final RC01 refinement and closure package.

### Included

- mandatory French consistency fixes;
- minimum accessibility fixes;
- profile-label hygiene;
- error/fallback consistency;
- auth and employee-scoping security review;
- complete regression;
- Railway validation;
- migration inventory review;
- governance audit;
- release scope freeze;
- final RC01 checkpoint;
- main-merge readiness package.

### Excluded

- visual redesign;
- UX Polish Wave;
- new business domain;
- AI;
- teacher/admin portals;
- certification;
- production deploy;
- automatic merge to main.

### Dependencies

- Slices D and E complete and frozen;
- OD-8 hygiene-only boundary;
- full QA and governance flow.

### Exit criteria

- All mandatory hygiene items closed;
- full automated gates pass;
- authoritative Railway validation with zero skipped integration tests;
- security and employee-scoping review passes;
- governance audit confirms PR-based merges after C2;
- final RC01 checkpoint approved;
- Project Owner approves final RC01 closure.

Slice F is **not** implemented by this rebaseline document. Completing F does **not** automatically merge to main or deploy production.

---

## 10. Evidence Model Boundary

Minimum mission attempt / evidence data may include:

- inputs consulted;
- department/problem selections;
- short required justification;
- mission status;
- timestamps;
- linked competency codes where appropriate.

Boundaries:

- required short justification is mandatory for M1-M01 completion;
- optional reflection beyond that justification is allowed but not required;
- **no** numeric score;
- **no** certification;
- **no** AI evaluation;
- **no** professor grading UI in RC01;
- evidence should remain future-reviewable for a later professor surface.

---

## 11. ERP Abstraction Boundary

RC01 ERP scope is conceptual and organizational:

- company, departments, functions, relationships, process awareness, fragmentation signals;
- Tom’s 40 versus 36 inventory discrepancy as **narrative and analytical context only**.

RC01 is **not**:

- a commercial ERP clone;
- a write-capable transaction system;
- inventory adjustment / posting / PR / PO / GR;
- master-data write;
- SAP, Oracle, Dynamics, or Odoo screen reproduction.

---

## 12. AI Boundary

The following are explicitly prohibited in RC01:

- AI Mentor;
- AI Coach;
- AI Context Engine;
- AI Reasoning Orchestrator;
- runtime prompts;
- AI evaluation;
- AI scoring influence;
- student-data exposure to LLMs.

AI is **not** planned for RC01 implementation. It remains a future architectural concern only.

---

## 13. UX and Accessibility Boundary

### Mandatory hygiene (Slice F only)

- French user-visible fallbacks and errors;
- French auth restore state;
- French NotFound / ErrorBoundary;
- French profile labels;
- skip link;
- employee badge menu Escape / outside-click / focus return;
- consistent workplace vocabulary;
- required accessibility and responsive exit checks.

### Explicitly out of scope

- UX Polish Wave;
- redesign;
- visual system expansion;
- cosmetic polish bundle;
- LMS vocabulary or course-dashboard framing.

---

## 14. QA and Release Governance

### Mandatory flow for Slices D, E, and F

1. Implement
2. QA / Approval Gate
3. Project Owner GO
4. Exact-scope commit
5. Push feature branch
6. PR into `release/rc01`
7. Formal review
8. Merge through GitHub UI or authenticated `gh`/API
9. Post-merge validation
10. Checkpoint
11. Checkpoint commit and push
12. Freeze
13. Only then next slice

### Prohibitions

- Direct push to `release/rc01` is prohibited as normal workflow.
- Do not use local fast-forward incorporation as the merge method.
- Before Slice D implementation begins, confirm authenticated GitHub merge capability or use the GitHub UI.

### Final RC01 Gate

After Slice F checkpoint:

- full automated gates;
- authoritative Railway validation (zero skipped integration tests);
- security / employee-scoping review;
- governance audit;
- Project Owner final RC01 closure approval;
- then separate decisions for main merge and production.

---

## 15. RC01 Exit Criteria

RC01 is complete only when:

1. A–C remain GREEN and frozen.
2. Slice D is complete and checkpointed.
3. Slice E is complete and checkpointed.
4. Slice F is complete and checkpointed.
5. Full automated gates pass.
6. Authoritative Railway validation passes with zero skipped integration tests.
7. Security and employee-scoping review passes.
8. No forbidden scope entered.
9. Governance audit confirms PR-based merges after C2.
10. Project Owner approves final RC01 closure.

Until all ten criteria are met, RC01 remains **open**.

---

## 16. Main and Production Gates

| Gate | Rule |
|------|------|
| Main merge | Separate Project Owner approval after RC01 closure |
| Production deployment | Separate later Project Owner approval |
| Automatic progression | **None** — RC01 closure does not merge to main or deploy |

`origin/main` remains at `49608de08c1527ab1fdbd355e6e0ec349177b69c` until a separate authorized PR and merge. Production remains untouched.

---

## 17. Risks and Controls

| Risk | Control |
|------|---------|
| Scope expansion beyond D/E/F | Owner decisions OD-1–OD-8; slice exclusions; exit criteria |
| LMS regression | Workplace vocabulary; no course/quiz/scoring framing |
| Premature transaction engine | OD-3 / OD-6; Slice E read-only only |
| Fake Mission Engine | OD-2 thin vertical for M1-M01 only |
| AI without context / AI in RC01 | OD-7 absolute prohibition |
| Direct-push recurrence | Mandatory PR merge via GitHub UI or authenticated `gh`/API |
| Doc drift | Rebaseline freeze after approval; checkpoints per slice |
| Production readiness gaps | Separate main and production gates; Slice F readiness package |

---

## 18. Decision Register

| Decision | Title | Status |
|----------|-------|--------|
| OD-1 | RC01 status | Approved for rebaseline synthesis |
| OD-2 | Mission 1 depth | Approved for rebaseline synthesis |
| OD-3 | Business-process boundary | Approved for rebaseline synthesis |
| OD-4 | Evidence boundary | Approved for rebaseline synthesis |
| OD-5 | Professor boundary | Approved for rebaseline synthesis |
| OD-6 | Read-only ERP boundary | Approved for rebaseline synthesis |
| OD-7 | AI boundary | Approved for rebaseline synthesis |
| OD-8 | UX boundary | Approved for rebaseline synthesis |

Clarification: Owner decisions OD-1 through OD-8 are approved for synthesis into this document. **This rebaseline document itself remains Pending approval** until formally reviewed and approved.

---

## 19. Next Authorized Step

1. Review this rebaseline document.
2. Explicitly approve it.
3. Commit only the document.
4. Push to `release/rc01`.
5. Freeze rebaseline.
6. Create a separate planning prompt for Slice D.
7. Do not implement Slice D before its plan is approved.

Do not begin Slice D, UX Polish, feature branches, or implementation from this task.

---

## 20. Approval Record

| Field | Value |
|-------|-------|
| Document status | **Approved** |
| Prepared by | Agent 0 / Release Captain |
| Reviewed by | TEC.ERP Governance Review |
| Approved by | Thiago Gibran — Project Owner |
| Date prepared | 2026-07-10 |
| Date approved | 2026-07-10 |

This rebaseline was explicitly reviewed and approved on 2026-07-10. It formally defines the remaining RC01 scope as Slices D, E, and F, preserves Slices A–C as frozen, and establishes the mandatory planning and governance boundaries for all subsequent RC01 work.
