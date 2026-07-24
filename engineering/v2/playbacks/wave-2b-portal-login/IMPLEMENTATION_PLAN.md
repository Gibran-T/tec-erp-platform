# Wave 2B — Implementation Plan (Revision 2)

> **Status:** PLAN ONLY — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 2 — Persistence, ledger and governance contract freeze  
> **Deploy / Push:** NOT AUTHORIZED  
> **James Run 2 / Professor:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch (current):** `feature/v2-portal-login-wave2b`  
> **Branch rename:** **RENAME REQUIRED BEFORE IMPLEMENTATION** → `feature/v2-so1048-mission-entry-wave2b` (**do not rename here**)  
> **Worktree:** `C:\Projetos\tec-erp-wt-wave2b-portal-login`  
> **Findings closed:** R1-01 · R1-02 · R1-03 · R1-04 · R1-05 = **CLOSED**

## Goal

Deliver the frozen SO-1048 Mission 1 entry engine: versioned session envelope, append-only ledger (exact event catalog), four-option decision, exactly-once consequence, corruption recovery, resume with `SESSION_RESUMED`.

**Not a goal:** Wave 2A cosmetic polish.

## Preconditions (blocking)

1. Final Architecture Re-Approval of Revision 2  
2. Implementation Checkpoint authorized  
3. Branch renamed to recommended name **before implementation starts** (separate authorized step)  
4. Worktree clean · learning-contract untouched  
5. No push/deploy claimed  

## Sequencing (proposed — not started)

### Step 0 — Freeze & rename gate
- Confirm Revision 2 re-approved  
- Perform authorized branch rename to `feature/v2-so1048-mission-entry-wave2b` before code work  

### Step 1 — Engine core (pure logic)
- Types: `MissionSessionEnvelopeV1`, `MissionLedgerEvent`, event catalog  
- State machine + invalid transition rejections  
- Evidence collect → `EVIDENCE_COLLECTED`  
- Four options → `DECISION_RECORDED`  
- Consequence map → `CONSEQUENCE_APPLIED` exactly once  
- Debrief → `DEBRIEF_ACKNOWLEDGED` → `MISSION_1_COMPLETED`  
- Abandon → `SESSION_ABANDONED`  

### Step 2 — Persistence adapters
- In-memory SoT  
- sessionStorage key `tec.erp.playback.v2.so1048.m1.session.v1`  
- JSON + ISO-8601 UTC  
- Corruption classes → safe reset + `SESSION_RECOVERY_RESET` on new session  
- Resume → `SESSION_RESUMED`  
- **No** localStorage / API / DB / auth  

### Step 3 — Thin UI + Cockpit CTA
- CTA starts session (`MISSION_1_STARTED`)  
- Mission-entry surface under `/playback/v2/*`  
- Recovery notice UI (non-production)  
- Ledger history visibility for Owner/QA  
- Preview modal ≠ done-state  

### Step 4 — Behavioral QA + Owner loop
- Execute `QA_GATE_PLAN.md` Revision 2 suites  
- Execute `OWNER_PLAYBACK_PLAN.md` Revision 2 (incl. corruption simulation)  

### Step 5 — Governance (later)
- Code review · merge auth · post-merge  
- Deploy remains unauthorized  

## Definition of done

All Revision 2 behavioral criteria green · Owner Green on functional + recovery loop · isolation proven · James 1 untouched · James 2 = 0 · Professor preview-only · **no deploy**.

## Rollback

Revert PR · unmount mission-entry · clear sessionStorage key · production unaffected.

**IMPLEMENTATION NOT AUTHORIZED.**
