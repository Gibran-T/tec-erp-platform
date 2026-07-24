# Wave 2B — Implementation Plan

> **Status:** PLAN ONLY — IMPLEMENTATION NOT STARTED  
> **Deploy:** NOT AUTHORIZED  
> **James Run 2:** NOT AUTHORIZED  
> **Professor:** NOT IMPLEMENTED / NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch:** `feature/v2-portal-login-wave2b`  
> **Worktree:** `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Goal

Deliver implementation-quality refinements of the Wave 2A isolated Portal → Login → Mission Cockpit → Mandat SO-1048 → Commencer l’enquête → Mission 1 preview journey under `/playback/v2/*`.

## Preconditions (blocking)

1. Architecture Approval Pack approved by Owner/governance  
2. Implementation Checkpoint gate authorized  
3. Worktree clean on `feature/v2-portal-login-wave2b`  
4. Learning-contract worktree untouched  
5. No production deploy authorization claimed  

## Sequencing (proposed — not started)

### Step 0 — Freeze architecture
- Confirm this plan and `ARCHITECTURE_APPROVAL_PACK.md` approved  
- Confirm non-goals still binding  

### Step 1 — Marker and isolation hygiene
- Ensure marker + isolation tests remain green  
- Confirm `App.tsx` mount unchanged in topology  

### Step 2 — Portal academic identity polish (implementation-quality)
- TEC.ERP primary identity · Concorde endorsement  
- Living enterprise sections remain coherent  
- No College logo invention · no production nav link  

### Step 3 — Playback login continuity
- Fake auth only → Cockpit  
- Continuity copy to mandat  
- Zero coupling to `AuthContext`  

### Step 4 — Mission Cockpit deepening
- Mandate SO-1048 clarity in ≤5 seconds  
- Pulse / inbox / evidence / learning panels  
- Explicit Guided Practice mode  
- CTA **Commencer l’enquête**  

### Step 5 — Mission 1 preview
- Secure preview only  
- Explicit “full mission later” framing  
- No Twin mutation · no progression  

### Step 6 — Authored AI/Twin classification
- Visible vs Ambient labels  
- Communication classification where shown  
- No network AI  

### Step 7 — QA automation
- Extend `playback-v2.test.tsx` per `QA_GATE_PLAN.md`  
- Typecheck · lint · erp-web tests · build  

### Step 8 — Owner playback + evidence
- Execute `OWNER_PLAYBACK_PLAN.md`  
- Capture screenshots  
- Produce QA report (future file)  

### Step 9 — Governance / merge gates
- Code review · merge authorization · post-merge verification  
- Deploy remains separately unauthorized  

## Out of sequence forever for Wave 2B

- James Run 2 creation/execution  
- Professor implementation  
- Production login replacement  
- Schema/backend/data changes  
- `/orientation` rename  
- Wave 2A P2/P3 cleanup (College logo, route rename)  
- ELE / BI Studio / Teaching Deck full  

## Definition of done (Wave 2B product slice)

- Owner-approved isolated journey complete  
- Automated + manual QA pass  
- Production isolation proven  
- James Run 1 untouched · James Run 2 = 0  
- Professor preview-only  
- No deploy performed as part of Wave 2B unless a later explicit deploy gate says otherwise (default: not authorized)

## Rollback

Revert PR; isolated routes leave production intact; no data rollback.
