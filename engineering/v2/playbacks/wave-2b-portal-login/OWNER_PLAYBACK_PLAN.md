# Wave 2B — Owner Playback Plan (Revision 2)

> **Status:** PLAN ONLY — NOT EXECUTED · IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 2 — Functional loop + corruption/recovery demonstration  
> **Marker:** Non-production marker required  
> **Presentation URL:** http://localhost:5173/playback/v2/portal  
> **Mission entry:** under `/playback/v2/*` (exact path fixed at Implementation Checkpoint)  
> **Storage key:** `tec.erp.playback.v2.so1048.m1.session.v1`  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch:** `feature/v2-portal-login-wave2b` — **RENAME REQUIRED BEFORE IMPLEMENTATION** → `feature/v2-so1048-mission-entry-wave2b` (not now)  
> **Findings closed:** R1-01 … R1-05 = **CLOSED**  
> **Deploy / Push / James Run 2 / Professor:** NOT AUTHORIZED

## Purpose

Prove Wave 2B is a **functional** SO-1048 Mission 1 entry slice — including ledger visibility, resume, and corruption recovery — not cosmetic Wave 2A polish.

Do **not** require exposing internal “correct answer” scoring.

## Start (only after Final Architecture Re-Approval + Implementation Checkpoint + branch rename)

```bash
cd C:\Projetos\tec-erp-wt-wave2b-portal-login
pnpm --filter erp-web dev -- --host 127.0.0.1 --port 5173
```

---

## Playback order

### Part A — Presentation continuity

1. Portal FR / Light / TEC.ERP + College endorsement  
2. Pulse / journey / Capstone-outside-M1–M10 sanity  
3. Visible vs Ambient labels  
4. Professor still `APERÇU — NON IMPLÉMENTÉ`  
5. Playback login → Cockpit · Mandat SO-1048  

### Part B — Functional delta (required)

6. **Session start:** **Commencer l’enquête** → `IN_PROGRESS` + `MISSION_1_STARTED` (not preview-only done-state)  
7. **Evidence:** Collect ≥1 governed item → `EVIDENCE_COLLECTED`; count updates  
8. **Four-option decision:** Choose one of  
   `DEMAND_QUANTITY` · `SUPPLIER_DELAY` · `STOCK_AVAILABILITY` · `WAREHOUSE_CAPACITY`  
   → `DECISION_RECORDED`  
9. **Deterministic consequence:** Matching pulse/inbox/KPI/debrief prompt → single `CONSEQUENCE_APPLIED`  
10. **Ledger history:** Visible non-production ledger/history showing event types (no scoring labels)  
11. **Refresh / resume:** Reload → session restored → `SESSION_RESUMED` present; no production login/API  
12. **Completion blocking:** Attempt complete early → blocked  
13. **Successful completion:** Debrief ack → `DEBRIEF_ACKNOWLEDGED` → `MISSION_1_COMPLETED` / `COMPLETED`  

### Part C — Corruption / recovery (required)

14. **Corruption simulation:** (QA/Owner harness or documented console/test control) write invalid JSON or unsupported `schemaVersion` into `tec.erp.playback.v2.so1048.m1.session.v1`  
15. **Recovery:** Reload → no crash · no partial hydrate · recovery notice shown · clean `NOT_STARTED`  
16. Confirm **no** corrupted payload replayed as history; new session may show `SESSION_RECOVERY_RESET` only  
17. Restart safely through Part B abbreviated happy path  

### Part D — Isolation confirmation

18. Production `/login` independent in another tab  
19. No production mutation / no network AI calls observed  
20. Dark/Projector or mobile smoke on mission-entry  

---

## Closure questions

1. Did you see a real session + four-option decision + exactly-once consequence?  
2. Did resume emit/show `SESSION_RESUMED` without production auth?  
3. Did corruption reset safely with a recovery notice?  
4. Was completion blocked then allowed only when criteria met?  
5. Are Professor / James / production login still untouched?  

## Owner verdict language (future)

`WAVE 2B — OWNER GREEN` · `WAVE 2B — OWNER REVISE` · `WAVE 2B — OWNER HOLD`

## Explicit non-claims

- Does **not** authorize implementation, push, or deploy  
- Does **not** authorize James Run 2 or Professor implementation  
- Does **not** rename the branch  
- Does **not** expose scoring/answer keys  

**IMPLEMENTATION NOT AUTHORIZED.**
