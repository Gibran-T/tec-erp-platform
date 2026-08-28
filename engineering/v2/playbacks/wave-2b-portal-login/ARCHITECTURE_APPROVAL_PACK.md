# Wave 2B — Architecture Approval Pack (Revision 2)

> **Document type:** Governance / architecture approval pack  
> **Wave:** 2B — Functional SO-1048 Mission 1 Entry  
> **Revision:** 2 — Persistence, ledger and governance contract freeze  
> **Status:** READY FOR FINAL ARCHITECTURE RE-APPROVAL  
> **Implementation:** NOT AUTHORIZED  
> **Deploy:** NOT AUTHORIZED  
> **Push:** NOT AUTHORIZED (branch remains local)  
> **James Run 2:** NOT AUTHORIZED (must remain 0)  
> **Professor implementation:** NOT AUTHORIZED (preview-only)

| Field | Value |
|-------|-------|
| Repository | `Gibran-T/tec-erp-platform` |
| Baseline SHA | `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9` |
| Branch (current) | `feature/v2-portal-login-wave2b` |
| Branch rename | **RENAME REQUIRED BEFORE IMPLEMENTATION** → `feature/v2-so1048-mission-entry-wave2b` (**do not rename in this revision**) |
| Worktree | `C:\Projetos\tec-erp-wt-wave2b-portal-login` |
| Prior findings closed | R1-01 · R1-02 · R1-03 · R1-04 · R1-05 (**CLOSED** in Revision 2) |
| Wave 2A | MERGED AND POST-MERGE GREEN (PR #34 @ `3e23022`) |

---

## Unlike Wave 2A, Wave 2B will…

Unlike Wave 2A, Wave 2B will run an **isolated SO-1048 Mission 1 entry session** where the learner **collects governed evidence**, makes **one constrained diagnostic decision** among four options, observes a **deterministic consequence**, and can **resume or complete** that session with an **auditable append-only ledger** and **versioned sessionStorage resume** — without touching production auth, schema, or James runs.

Cosmetic refinement of Wave 2A screens is **out of goal**.

---

## Finding closure (Revision 2)

| Finding | Status |
|---------|--------|
| **R1-01** persistence serialization/versioning/corruption recovery | **CLOSED** |
| **R1-02** ledger schema and event catalog | **CLOSED** |
| **R1-03** decision-option alignment (four options) | **CLOSED** |
| **R1-04** risk-register structure | **CLOSED** (see `RISK_REGISTER.md`) |
| **R1-05** consequence idempotency and resume event | **CLOSED** |

---

## 1. Objective

Functional isolated V2 Mission 1 entry for Mandat SO-1048:

Presentation shell → Cockpit CTA → **mission session** → evidence → decision → consequence (exactly once) → resume/complete with frozen ledger + persistence contracts.

**IMPLEMENTATION NOT AUTHORIZED** by this document.

## 2. Scope / non-goals

Unchanged from Revision 1 functional scope. Non-goals remain: full M1–M10, Mission 2/3, Professor, BI Studio, ELE runtime, network AI, Prisma/schema/data, production login/auth, James Run 2, College rename, College logo, deploy, push without separate authorization.

## 3. Wave 2A vs Wave 2B delta (summary)

Genuine new (C): Mission 1 session · governed evidence · four-option decision · deterministic consequence · append-only ledger · versioned resume · corruption recovery · explicit COMPLETED.

---

## 4. Code boundary (Option C) — frozen

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Presentation shell | `apps/web/src/playback/v2/*` pages | Portal, login, cockpit chrome |
| Mission-entry engine | `apps/web/src/playback/v2/mission-entry/` (or `apps/web/src/v2/mission-entry/`) | Pure state machine, evidence, decision, consequence, ledger, persistence — **testable without DOM** |
| Thin UI | mission-entry views | Bind UI; no business rules in JSX |

---

## 5. Persistence envelope — frozen (closes R1-01)

Deterministic session envelope (`schemaVersion = 1`):

```ts
type MissionSessionEnvelopeV1 = {
  schemaVersion: 1;
  sessionId: string;
  missionId: "SO-1048-M1";
  learnerId: "playback-demo";
  status:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "DECISION_RECORDED"
    | "CONSEQUENCE_APPLIED"
    | "COMPLETED"
    | "ABANDONED";
  evidenceIds: string[];
  decisionId: string | null;
  consequenceId: string | null;
  debriefAcknowledged: boolean;
  ledger: MissionLedgerEvent[];
  createdAt: string; // ISO-8601 UTC
  updatedAt: string; // ISO-8601 UTC
};
```

| Rule | Value |
|------|-------|
| Serialization | JSON (`JSON.stringify` / `JSON.parse`) |
| Timestamps | Stable ISO-8601 **UTC** (`...Z`) |
| Field names | Exact camelCase names above — deterministic |
| `schemaVersion` | `1` only for this freeze |
| Storage key | `tec.erp.playback.v2.so1048.m1.session.v1` |
| Source of truth | **In-memory mission service** |
| Resume adapter | **sessionStorage only** |
| Forbidden | `localStorage` · backend · database · production auth/session reuse |

---

## 6. Corruption recovery — frozen (closes R1-01)

When stored state is **missing**, **invalid JSON**, **unsupported `schemaVersion`**, **missing required fields**, **invalid status/transition**, or has **duplicate/malformed ledger entries**:

| Step | Behavior |
|------|----------|
| 1 | Do **not** crash |
| 2 | Do **not** partially hydrate |
| 3 | Preserve **no** corrupt authoritative state in memory |
| 4 | Quarantine/discard invalid stored value (remove sessionStorage key) |
| 5 | Start clean session at `NOT_STARTED` with new `sessionId` |
| 6 | Expose non-production **recovery notice** in playback UI |
| 7 | Append **no** fake historical events from corrupt payload |
| 8 | On the **new** clean session only, may append `SESSION_RECOVERY_RESET` (payload describes recovery class; **no corrupted payload copied**) |
| 9 | Learner may restart safely |

Corruption classes and required tests: see `QA_GATE_PLAN.md` § Persistence.

---

## 7. Ledger schema — frozen (closes R1-02)

```ts
type MissionLedgerEventType =
  | "MISSION_1_STARTED"
  | "EVIDENCE_COLLECTED"
  | "DECISION_RECORDED"
  | "CONSEQUENCE_APPLIED"
  | "DEBRIEF_ACKNOWLEDGED"
  | "MISSION_1_COMPLETED"
  | "SESSION_RESUMED"
  | "SESSION_ABANDONED"
  | "SESSION_RECOVERY_RESET";

type MissionLedgerEvent = {
  id: string;              // unique per event
  sessionId: string;
  timestamp: string;       // ISO-8601 UTC
  type: MissionLedgerEventType;
  actor: "LEARNER" | "SYSTEM" | "VISIBLE_AI" | "AMBIENT_STAKEHOLDER";
  payload: Record<string, unknown>;
  version: 1;
};
```

| Rule | Requirement |
|------|-------------|
| Append-only | Yes |
| Immutable event objects | No in-place edits |
| Ordering | Monotonically non-decreasing timestamps within a session |
| IDs | Unique event IDs |
| Deletions | None during a session |
| AI authority | Visible AI / Ambient AI **must not** rewrite ledger |
| Resume | Adds `SESSION_RESUMED` |
| Corruption reset | Adds `SESSION_RECOVERY_RESET` only on **new** clean session; no corrupt payload copied |

---

## 8. Decision contract — frozen (closes R1-03)

**Decision ID:** `dec-primary-threat`  
**Question:** What is the primary threat to the Friday customer promise?  
**Options (exactly one of four):**

| Option ID | Meaning (learner-facing, non-scoring) |
|-----------|----------------------------------------|
| `DEMAND_QUANTITY` | Demand quantity (140 units) threatens the promise |
| `SUPPLIER_DELAY` | Supplier delay threatens the promise |
| `STOCK_AVAILABILITY` | Stock availability (Family A) threatens the promise |
| `WAREHOUSE_CAPACITY` | Warehouse capacity / quai constraint threatens the promise |

**Must not surface:** answer-key wording · score · grade · hidden “correct” labels.  
Architecture **may** retain an internal strongest-diagnosis hint for later debrief authoring — **never** as scoring UI.

---

## 9. Deterministic consequence contract — frozen (closes R1-05)

| Decision | Consequence ID | Pulse / KPI (authored) | Inbox (authored) | Debrief prompt (authored) |
|----------|----------------|------------------------|------------------|---------------------------|
| `DEMAND_QUANTITY` | `cns-demand-01` | Demand 140 vs Friday promise pressure | Marc Tremblay urgency framing | What evidence best supports demand as primary? |
| `SUPPLIER_DELAY` | `cns-supplier-01` | Supplier +4 days / qty>120 dependency | NordLog / buyer supervisor note | What breaks if supplier delay is primary? |
| `STOCK_AVAILABILITY` | `cns-stock-01` | Family A stock tension / OTIF framing | Warehouse / ops stock note | How does stock availability limit promise keeping? |
| `WAREHOUSE_CAPACITY` | `cns-warehouse-01` | Quai / capacity bottleneck signal | Warehouse capacity constraint note | How does capacity constrain fulfillment timing? |

| Rule | Requirement |
|------|-------------|
| Evaluation | Pure function `(decisionId, twinSnapshot) → consequenceViewModel` |
| Determinism | Same decision → same `consequenceId` + same authored outputs |
| Exactly once | `CONSEQUENCE_APPLIED` appended **exactly once** |
| Re-apply | Rejected or no-op; **no** second ledger append |
| Decision change after consequence | **Prohibited** in this slice |
| Network / generative AI / ELE / backend | **Forbidden** |

Ledger payload for `CONSEQUENCE_APPLIED` includes `{ decisionId, consequenceId }` and view-model refs (authored IDs only).

---

## 10. State-transition table — frozen

### Allowed transitions

| From | To | Trigger | Ledger |
|------|----|---------|--------|
| `NOT_STARTED` | `IN_PROGRESS` | CTA start | `MISSION_1_STARTED` |
| `IN_PROGRESS` | `DECISION_RECORDED` | Valid decision | `DECISION_RECORDED` |
| `IN_PROGRESS` | `ABANDONED` | Abandon | `SESSION_ABANDONED` |
| `DECISION_RECORDED` | `CONSEQUENCE_APPLIED` | Apply consequence | `CONSEQUENCE_APPLIED` (once) |
| `DECISION_RECORDED` | `ABANDONED` | Abandon | `SESSION_ABANDONED` |
| `CONSEQUENCE_APPLIED` | `COMPLETED` | Debrief ack + criteria | `DEBRIEF_ACKNOWLEDGED` then `MISSION_1_COMPLETED` |
| `CONSEQUENCE_APPLIED` | `ABANDONED` | Abandon | `SESSION_ABANDONED` |
| `ABANDONED` | `IN_PROGRESS` | Resume/restart flow only | `SESSION_RESUMED` (and/or restart policy) |
| `COMPLETED` | — | **Terminal** | no further status transition |

Evidence collection occurs while `IN_PROGRESS` (and may continue until decision per engine policy); each collect → `EVIDENCE_COLLECTED` without changing status away from `IN_PROGRESS` until decision.

### Invalid transitions (reject; no status change; no ledger mutation except optional structured error log outside mission ledger)

Examples: `NOT_STARTED → COMPLETED` · `IN_PROGRESS → COMPLETED` · `COMPLETED → *` · `CONSEQUENCE_APPLIED → DECISION_RECORDED` · second `CONSEQUENCE_APPLIED` · decision change after consequence.

### Resume

- `SESSION_RESUMED` is a **ledger event**, **not** a mission `status`
- Resume restores the **last valid** envelope status from in-memory/sessionStorage
- Corrupt storage → recovery contract (§6), not partial resume

### Completion requires all of

1. ≥1 evidence item in `evidenceIds`  
2. `decisionId` set  
3. `consequenceId` set / status `CONSEQUENCE_APPLIED` or completing from it  
4. `debriefAcknowledged === true`  

---

## 11. AI / Professor / James boundaries

- **Visible AI:** clarify/structure only; no decide/score/unlock/ledger rewrite  
- **Ambient AI:** authored stakeholder lines only; deterministic; no network/ELE runtime  
- **Professor:** preview-only; no control-plane dependency  
- **James Run 1:** immutable  
- **James Run 2:** remains 0  

## 12. Production isolation / rollback

Outside `ProtectedRoute`/`WorkspaceLayout` · marker required · no production nav · no deploy.  
Rollback: revert PR · unmount mission-entry · clear `tec.erp.playback.v2.so1048.m1.session.v1` · production unaffected.

## 13. Branch rename (document only)

| Item | Value |
|------|-------|
| Current | `feature/v2-portal-login-wave2b` |
| Verdict | **RENAME REQUIRED BEFORE IMPLEMENTATION** |
| Recommended | `feature/v2-so1048-mission-entry-wave2b` |
| This revision | **Do not rename** |

## 14. Approval gates

1. Scope — DONE  
2. Architecture Rev1 — REVISE  
3. Architecture Rev2 — **re-approval required**  
4. Implementation Checkpoint — **NOT AUTHORIZED**  
5–12. Automated behavioral QA · Manual QA · Owner playback · Governance · Code review · Merge · Post-merge · James Run 2 (later) · Deploy (separate)

---

**IMPLEMENTATION NOT AUTHORIZED.**  
**Revision 2 freezes persistence and ledger contracts for final Architecture Re-Approval only.**
