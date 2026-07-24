# Wave 2B — QA Gate Plan (Revision 1)

> **Status:** PLAN ONLY — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 1 — Behavioral acceptance for functional SO-1048 Mission 1 entry  
> **Deploy / Push / James Run 2 / Professor implementation:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Principle

Wave 2B QA must prove **behavior**, not merely that routes render, text appears, a modal opens, or themes work.

Wave 2A render/isolation suite remains green as regression baseline.

---

## A. Behavioral acceptance criteria (required)

| ID | Criterion | Pass condition |
|----|-----------|----------------|
| B1 | Session start | CTA starts Mission 1 session → state `IN_PROGRESS` + ledger `MISSION_1_STARTED` + stable `sessionId` |
| B2 | Evidence collection | Collecting an authored evidence item increments governed count + ledger `EVIDENCE_ADDED` |
| B3 | Constrained decision | Selecting one of three threat options → `DECISION_RECORDED` + ledger entry with `optionId` |
| B4 | Deterministic consequence | Same decision always yields same authored pulse/inbox/KPI consequence view + ledger `CONSEQUENCE_APPLIED` |
| B5 | Completion gate | `COMPLETED` rejected unless ≥1 evidence + decision + consequence applied + debrief ack |
| B6 | Resume | After reload (sessionStorage path) or service restore, session returns to last valid state without `fetch`/API |
| B7 | Illegal transitions | e.g. complete from `NOT_STARTED` throws/rejects; ledger unchanged |
| B8 | Production isolation | No `useAuth`; no navigation to `/workspace`; production `/login` not rendered by playback |
| B9 | No network | `fetch` not called during mission-entry loop |
| B10 | Professor boundary | Preview-only; no Professor control-plane dependency |
| B11 | James boundary | No Run scripts; Run 2 remains 0 by governance check |

---

## B. Exact tests to add (future implementation)

### B1. Pure engine unit tests (`mission-entry/__tests__`)

1. state machine happy path NOT_STARTED→…→COMPLETED  
2. reject COMPLETED without evidence  
3. reject COMPLETED without decision  
4. evidence append ledger  
5. decision options constrained (invalid option rejected)  
6. consequence map determinism (table-driven for three options)  
7. ledger append-only (no rewrite API)  
8. sessionStorage adapter round-trip resume  
9. abandon/recover policy  

### B2. Integration / UI behavioral tests

1. Cockpit CTA starts session (not preview-only done-state)  
2. Evidence collect updates UI count from engine  
3. Decision + visible consequence panels  
4. Completion blocked then allowed  
5. Resume banner / restored state after simulated reload  
6. `fetch` spy never called  
7. Production login isolation regression from Wave 2A  

### B3. Wave 2A regression (keep)

Marker · portal/login/cockpit mount · M1–M10/Capstone · themes/locale · pulse map · Visible vs Ambient labels · no M11  

---

## C. Package gates (future)

```text
pnpm --filter erp-web test
pnpm --filter erp-web typecheck
pnpm --filter erp-web lint
pnpm turbo --filter=erp-web... build
```

## D. Manual / a11y / responsive (still required, not sufficient alone)

Light/Dark/Projector · desktop/tablet/mobile · keyboard · reduced-motion  

## E. Governance checks (every PR)

- Diff limited to authorized file plan  
- No `apps/api`, Prisma, auth, James mutation scripts  
- Learning-contract worktree not used  
- **IMPLEMENTATION** only after Implementation Checkpoint  

## F. Pass / Fail

**Pass:** All B1–B11 proven + regressions green + Owner functional loop accepted.  
**Fail / HOLD:** Preview-modal-only “done” · render-only tests · network/auth/schema · missing ledger/resume · unauthorized push/deploy.

**IMPLEMENTATION NOT AUTHORIZED by this plan.**
