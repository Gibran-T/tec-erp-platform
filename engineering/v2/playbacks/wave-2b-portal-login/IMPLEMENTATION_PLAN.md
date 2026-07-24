# Wave 2B — Implementation Plan (Revision 1)

> **Status:** PLAN ONLY — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 1 — Functional SO-1048 Mission 1 entry  
> **Deploy:** NOT AUTHORIZED  
> **Push:** NOT AUTHORIZED  
> **James Run 2:** NOT AUTHORIZED  
> **Professor:** NOT IMPLEMENTED / NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch (current):** `feature/v2-portal-login-wave2b`  
> **Rename recommendation (document only):** `feature/v2-so1048-mission-entry-wave2b`  
> **Worktree:** `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Goal

Unlike Wave 2A, Wave 2B will deliver a **functional isolated SO-1048 Mission 1 entry session**: evidence collection → one constrained decision → deterministic consequence → resume/complete with an append-only ledger.

**Not a goal:** cosmetic refinement of Wave 2A playback screens.

## Preconditions (blocking)

1. Architecture Revision 1 **re-approved** by Owner/governance  
2. Implementation Checkpoint gate authorized  
3. Worktree clean on authorized branch  
4. Learning-contract worktree untouched  
5. No deploy/push authorization claimed by this plan  

## Sequencing (proposed — not started)

### Step 0 — Freeze Revision 1 architecture
- Confirm re-approval of this pack  
- Confirm non-goals still binding  
- Branch rename remains optional documentation recommendation only until separately authorized  

### Step 1 — Mission-entry engine (pure logic)
- Create isolated module (`playback/v2/mission-entry/` or `v2/mission-entry/`)  
- State machine: `NOT_STARTED → IN_PROGRESS → DECISION_RECORDED → CONSEQUENCE_APPLIED → COMPLETED` (+ `ABANDONED`)  
- Evidence catalog + collect API  
- Decision `dec-primary-threat` with three options  
- Deterministic consequence map  
- Append-only ledger  
- In-memory service + optional sessionStorage adapter  
- Unit tests (no DOM)

### Step 2 — Wire Cockpit CTA to session start
- CTA **Commencer l’enquête** starts Mission 1 session (`MISSION_1_STARTED`)  
- Navigate/render mission-entry surface under `/playback/v2/*`  
- Preview modal may remain secondary help — **not** completion  

### Step 3 — Mission-entry UI (thin)
- Evidence collection UI bound to engine  
- Decision UI (constrained options)  
- Consequence presentation (pulse/inbox/KPI view model)  
- Completion / debrief acknowledgement  
- Resume banner when session restored  

### Step 4 — Presentation shell hygiene
- Keep Portal/Login/Cockpit as shell  
- Marker non-production  
- No `useAuth` / production coupling  
- No Prisma/API  

### Step 5 — Authored AI labels (non-authoritative)
- Visible AI may coach structure; Ambient AI may show authored reaction lines  
- Neither mutates ledger as authority  

### Step 6 — Behavioral QA automation
- Execute `QA_GATE_PLAN.md` Revision 1 tests  
- Package typecheck/lint/test/build  

### Step 7 — Owner playback (functional loop)
- Execute `OWNER_PLAYBACK_PLAN.md` Revision 1  
- Capture evidence of start → evidence → decision → consequence → resume → complete  

### Step 8 — Governance / merge gates (later)
- Code review · merge authorization · post-merge verification  
- Deploy remains separately unauthorized  

## Out of sequence forever for Wave 2B

- James Run 2 · Professor implementation · production login replacement · schema/backend/data · `/orientation` rename · College logo invention · Wave 2A P2/P3 cleanup · ELE / BI Studio / Teaching Deck full · cosmetic-only “polish wave”

## Definition of done (Wave 2B product slice)

Behavioral criteria in Architecture Pack §19 / `QA_GATE_PLAN.md` all pass · Owner Green on functional loop · production isolation proven · James Run 1 untouched · James Run 2 = 0 · Professor preview-only · **no deploy** · **IMPLEMENTATION remains unauthorized until Implementation Checkpoint**

## Rollback

Revert PR · unmount mission-entry · clear sessionStorage key · production unaffected
