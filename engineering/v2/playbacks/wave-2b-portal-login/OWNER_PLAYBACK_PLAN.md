# Wave 2B — Owner Playback Plan (Revision 1)

> **Status:** PLAN ONLY — OWNER PLAYBACK NOT EXECUTED · IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 1 — Functional SO-1048 Mission 1 entry loop  
> **Marker:** Non-production marker required  
> **URL (presentation):** http://localhost:5173/playback/v2/portal  
> **URL (mission entry):** under `/playback/v2/*` mission-entry route (exact path fixed at Implementation Checkpoint)  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`  
> **Deploy / Push / James Run 2 / Professor implementation:** NOT AUTHORIZED

## Purpose

Demonstrate that Wave 2B is **not** a cosmetic Wave 2A refinement. Owner must witness a **functional mission-entry loop**:

**start → evidence → decision → consequence → resume → completion**

## Start (only after Architecture Re-Approval + Implementation Checkpoint)

```bash
cd C:\Projetos\tec-erp-wt-wave2b-portal-login
pnpm --filter erp-web dev -- --host 127.0.0.1 --port 5173
```

---

## Playback order

### Part A — Presentation shell (continuity, not the delta)

1. Portal FR / Light / TEC.ERP identity + College endorsement  
2. Pulse Map / journey / Capstone-outside-M1–M10 sanity  
3. Visible vs Ambient AI labels still distinguishable  
4. Professor controls still `APERÇU — NON IMPLÉMENTÉ`  
5. Playback login → Mission Cockpit · Mandat SO-1048  

### Part B — Functional delta (required for Owner Green)

6. **Start:** Activate **Commencer l’enquête** → Mission 1 **session** starts (not merely preview modal as done-state). Confirm session id / IN_PROGRESS signal.  
7. **Evidence:** Collect at least one governed evidence item (process map / supplier note / KPI / stakeholder). Confirm count + ledger visibility (QA panel or UI).  
8. **Decision:** Choose exactly one constrained primary threat (`inventory` / `supplier` / `demand`).  
9. **Consequence:** Observe deterministic pulse/inbox/KPI reaction matching the choice. Repeat once if needed to confirm same choice → same consequence.  
10. **Resume:** Refresh the browser (sessionStorage path) or equivalent restore → session returns without production login/API.  
11. **Completion:** Complete only when criteria met; confirm premature complete blocked; then COMPLETED + debrief ack.  
12. Confirm production `/login` still independent in another tab.  
13. Dark / Projector / tablet or mobile smoke on mission-entry surface.  
14. Keyboard path through evidence + decision controls.  

---

## Closure questions

1. Did Wave 2B do something Wave 2A could **not** do (session + evidence + decision + consequence + resume + complete)?  
2. Is Mission 1 entry clearly more than a preview modal?  
3. Is consequence deterministic and authored (no live AI network)?  
4. Is production login / James / Professor still untouched?  
5. Would you authorize Implementation Checkpoint closure / Owner Green for this functional slice?

## Required Owner verdict language (future)

`WAVE 2B — OWNER GREEN` · `WAVE 2B — OWNER REVISE` · `WAVE 2B — OWNER HOLD`

## Explicit non-claims

- This plan does **not** authorize implementation.  
- This plan does **not** authorize push or deploy.  
- This plan does **not** authorize James Run 2.  
- This plan does **not** authorize Professor implementation.  
- Branch rename recommendation remains documentation-only.  
- Wave 2A P2 residuals (College logo, `/orientation` rename) remain deferred.

**IMPLEMENTATION NOT AUTHORIZED.**
