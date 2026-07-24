# Wave 2B — Architecture Approval Pack (Revision 1)

> **Document type:** Governance / architecture approval pack  
> **Wave:** 2B — Functional SO-1048 Mission 1 Entry  
> **Revision:** 1 — Functional mission-entry delta (closes Architecture REVISE)  
> **Status:** READY FOR ARCHITECTURE RE-APPROVAL  
> **Implementation:** NOT AUTHORIZED  
> **Deploy:** NOT AUTHORIZED  
> **Push:** NOT AUTHORIZED (branch remains local until separately authorized)  
> **James Run 2:** NOT AUTHORIZED (must remain 0)  
> **Professor implementation:** NOT AUTHORIZED (preview-only)

| Field | Value |
|-------|-------|
| Repository | `Gibran-T/tec-erp-platform` |
| Baseline SHA | `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9` |
| Branch (current) | `feature/v2-portal-login-wave2b` |
| Branch rename recommendation | `feature/v2-so1048-mission-entry-wave2b` — **document only; do not rename in this revision** |
| Worktree | `C:\Projetos\tec-erp-wt-wave2b-portal-login` |
| Scope source | Wave 2B Scope Authorization + Architecture REVISE findings (2026-07-24) |
| Wave 2A | MERGED AND POST-MERGE GREEN (PR #34 @ `3e23022`) |

---

## Unlike Wave 2A, Wave 2B will…

Unlike Wave 2A, Wave 2B will run an **isolated SO-1048 Mission 1 entry session** where the learner **collects governed evidence**, makes **one constrained diagnostic decision**, observes a **deterministic consequence**, and can **resume or complete** that session with an **auditable client-side event ledger** — without touching production auth, schema, or James runs.

Cosmetic refinement of Wave 2A screens is **out of goal**.

---

## 1. Objective

Deliver a **functional, isolated V2 Mission 1 entry vertical slice** for Mandat SO-1048:

Portal / Login (presentation) → Mission Cockpit → **start Mission 1 session** → evidence → decision → consequence → resume/complete

Preserve production isolation. Do not implement Professor, ELE runtime, BI Studio, James Run 2, or full M1 Mission 2/3.

## 2. Scope

- Keep `/playback/v2/*` as presentation/orientation shell
- Add **separate mission-entry engine** (Option C)
- Mission session state machine
- Governed evidence collection (≥1 item)
- One constrained learner decision
- Deterministic authored consequence rules
- Append-only client-side event ledger
- Resume via isolated in-memory service + optional `sessionStorage`
- Behavioral acceptance tests and Owner playback of the functional loop
- FR/EN, themes, a11y retained from Wave 2A presentation

## 3. Non-goals / prohibitions

Full M1–M10 runtime · full Mission 2/3 · Professor workspace · live BI Studio · College logo invention · `/orientation` rename · Capstone · production deploy · James Run 2 · production `/login`/auth replacement · backend rewrite · Prisma/schema/data changes · network AI · multi-tenant · certification automation · full assessment engine · Wave 2A P2/P3 cleanup · ELE Wave 5B · Teaching Deck full · Thiago Professor · Master Contract rewrite · production data mutation · James Run 1 modification · push without separate authorization · **IMPLEMENTATION NOT AUTHORIZED by this document**

---

## 4. Wave 2A versus Wave 2B delta matrix

| Capability | Wave 2A | Wave 2B (Revision 1) | Class |
|------------|---------|----------------------|-------|
| Portal | Implemented (playback) | Reuse as presentation shell | Already in 2A / reuse |
| Login (fake) | Implemented | Reuse as presentation shell | Already in 2A / reuse |
| Mission Cockpit | Implemented | Reuse + CTA starts **session** | Evolved |
| Mandat SO-1048 | Authored display | Binding mission context for session | Evolved |
| Mission 1 preview modal | Implemented | May remain as secondary help; **not** done-state | Already in 2A |
| Mission 1 **entry session** | Absent | **Required** | **Genuine new (C)** |
| Governed evidence collection | Display only (0/3) | Collect ≥1; ledgered | **Genuine new (C)** |
| Constrained learner decision | Absent | One diagnostic decision | **Genuine new (C)** |
| Deterministic consequence | Static demo text | Rule-mapped reaction | **Genuine new (C)** |
| Event ledger | Absent | Append-only client ledger | **Genuine new (C)** |
| Session resume | Absent | In-memory + optional sessionStorage | **Genuine new (C)** |
| Completion state | Preview close ≠ complete | Explicit COMPLETED criteria | **Genuine new (C)** |
| Visible / Ambient AI | Authored previews | Authored; may narrate consequence; never authoritative | Static + bound |
| Professor | Preview-only | Preview-only | Out / unchanged |
| James Run 2 | 0 | Remains 0 | Out |
| Prisma / production persistence | None | None | Out |
| Cosmetic-only polish as goal | N/A | **Forbidden as Wave 2B goal** | Out |

---

## 5. Route architecture

| Decision | Choice |
|----------|--------|
| Presentation routes | Preserve `/playback/v2/{portal,login,orientation}` |
| Mission entry surface | Isolated route under `/playback/v2/*` (e.g. `mission-1` or `mission-entry`) — **not** production routes |
| `/orientation` rename | **Not in this wave** |
| Production `/login` | Untouched |
| Marker | Non-production marker required |

## 6. Component / code boundary (Option C)

| Layer | Location (proposed) | Responsibility |
|-------|---------------------|----------------|
| Presentation shell | Existing `apps/web/src/playback/v2/*` pages | Portal, login, cockpit chrome |
| Mission-entry engine | **New** `apps/web/src/playback/v2/mission-entry/` (or `apps/web/src/v2/mission-entry/`) | Session state machine, evidence, decision, consequence, ledger, storage adapter — **pure logic testable without DOM** |
| Mission-entry UI | Thin views under mission-entry | Bind UI to engine; no business rules in JSX |

**Do not** treat page polish alone as the product. Engine must be separable for future V2 migration and rollback.

## 7. Mission session state machine

```text
NOT_STARTED
  → (CTA start) IN_PROGRESS          [ledger: MISSION_1_STARTED]
  → (evidence add) IN_PROGRESS       [ledger: EVIDENCE_ADDED]
  → (decision) DECISION_RECORDED     [ledger: DECISION_RECORDED]
  → (rules apply) CONSEQUENCE_APPLIED[ledger: CONSEQUENCE_APPLIED]
  → (complete OK) COMPLETED          [ledger: MISSION_1_COMPLETED]
  → (abandon) ABANDONED              [ledger: MISSION_1_ABANDONED]  (recoverable → IN_PROGRESS or restart policy)
```

Illegal transitions (e.g. COMPLETED without decision + ≥1 evidence) **must be rejected**.

## 8. Governed evidence collection

Authored evidence catalog (SO-1048):

| Evidence ID | Type | Label (FR intent) |
|-------------|------|-------------------|
| `ev-otc-map` | process map | Carte processus Order-to-Cash |
| `ev-supplier-delay` | document | Note délai fournisseur NordLog |
| `ev-stock-kpi` | KPI signal | Stocks famille A / OTIF tension |
| `ev-marc-urgency` | stakeholder | Message urgent Marc Tremblay |

Rules:

- Learner may collect items from the catalog (select/inspect/pin)
- At least **one** evidence required before completion
- Each collection appends ledger `EVIDENCE_ADDED`
- Evidence does not invent Twin facts outside authored catalog

## 9. Constrained learner decision

**Decision ID:** `dec-primary-threat`  
**Prompt:** What is the primary threat to the Friday customer promise?  
**Options (exactly one):**

| Option ID | Meaning |
|-----------|---------|
| `threat-inventory` | Family A inventory tension is primary |
| `threat-supplier` | Supplier delay (+4 days / qty > 120) is primary |
| `threat-demand` | Demand surge (140 units) is primary |

Decision requires session `IN_PROGRESS` and is recorded once (or explicitly revised per engine policy — default: single commit then consequence).

## 10. Deterministic consequence rules

Authored map (no network AI, no random drift):

| Decision | Pulse / KPI effect (authored) | Inbox reaction (authored) |
|----------|-------------------------------|---------------------------|
| `threat-inventory` | Highlight Family A stock risk; OTIF pressure framing | Warehouse / ops note |
| `threat-supplier` | Highlight supplier dependency +4 days | NordLog / buyer supervisor note |
| `threat-demand` | Highlight demand 140 vs promise | Sales (Marc) confirmation pressure |

Consequence application is pure function: `(decisionId, twinSnapshot) → consequenceViewModel` + ledger `CONSEQUENCE_APPLIED`.

## 11. Append-only client-side event ledger

Entry shape:

```ts
{
  ts: string;           // ISO timestamp
  type: string;         // MISSION_1_STARTED | EVIDENCE_ADDED | DECISION_RECORDED | ...
  actor: "learner" | "system";
  sessionId: string;
  payload: Record<string, unknown>;
}
```

Rules: append-only · no silent rewrite · Visible AI must not be ledger authority · exportable for QA snapshots.

## 12. Persistence / resume

| Store | Role |
|-------|------|
| Isolated **in-memory mission service** | Source of truth while tab alive |
| Optional **`sessionStorage`** | Resume after refresh within browser session |
| Prisma / production DB / API | **Forbidden** |

No auth tokens in storage. Storage key namespaced (e.g. `tec-erp.v2.wave2b.so1048.session`). Clearable on rollback.

## 13. Auth isolation

Playback login remains fake navigation into Cockpit. No `useAuth`, JWT, or production login coupling. Mission engine never calls API.

## 14. Digital Twin / ELE / AI boundaries

- **Twin:** authored Equinoxe snapshot; consequence updates **view model** only, not production Twin  
- **ELE:** no runtime engine; authored reactions only via consequence map  
- **Visible AI:** may clarify / structure; must not decide, score, unlock, or authoritatively mutate ledger  
- **Ambient AI:** authored stakeholder lines tied to consequence; no generative network AI  
- **Professor:** preview-only; no dependency  

## 15. James Run boundary

James Run 1 untouched · James Run 2 remains 0 · Wave 2B is not Run 2 readiness

## 16. Production isolation

Outside `ProtectedRoute` / `WorkspaceLayout` · marker required · no production nav link · no deploy · no schema

## 17. Rollback

- Revert PR / unmount mission-entry routes  
- Clear sessionStorage key  
- Presentation shell can remain; engine removable independently  
- Production `/login` and James data unaffected  

## 18. Approval gates

1. Scope approval — DONE  
2. Architecture approval — **REVISE → Revision 1 → re-approval required**  
3. Implementation Checkpoint — **NOT AUTHORIZED**  
4. Automated behavioral validation  
5. Manual QA  
6. Owner playback (functional loop)  
7. Governance review  
8. Code review  
9. Merge authorization  
10. Post-merge verification  
11. James Run 2 — later  
12. Deploy — separate  

## 19. Behavioral acceptance criteria (summary)

See `QA_GATE_PLAN.md`. Implementation approval requires proving session start, evidence, decision, consequence, resume, completion — **not** merely that routes render.

## 20. Branch-name recommendation (document only)

Current: `feature/v2-portal-login-wave2b` — acceptable but imprecise.  
Recommended before implementation: `feature/v2-so1048-mission-entry-wave2b`.  
**Do not rename in this documentation revision.**

---

**IMPLEMENTATION NOT AUTHORIZED.**  
**This Revision 1 pack is ready for Architecture Re-Approval only.**
