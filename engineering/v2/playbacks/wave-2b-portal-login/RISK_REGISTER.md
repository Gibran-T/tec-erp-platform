# Wave 2B — Risk Register (Revision 2)

> **Status:** Architecture Revision 2 — IMPLEMENTATION NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`  
> **Branch rename:** RENAME REQUIRED BEFORE IMPLEMENTATION → `feature/v2-so1048-mission-entry-wave2b` (not performed here)  
> **Deploy / Push / James Run 2 / Professor implementation:** NOT AUTHORIZED  
> **Findings:** R1-01 … R1-05 = **CLOSED** by Revision 2 contracts

## R2B-01 … R2B-08 (full structure)

| ID | Severity | Trigger | Impact | Prevention | Detection | Rollback | Gate owner | Blocking | Residual risk |
|----|----------|---------|--------|------------|-----------|----------|------------|----------|---------------|
| **R2B-01** Product delta collapse | HIGH | PR ships UI polish without session/evidence/decision/consequence/ledger | Wave 2B indistinguishable from Wave 2A | Frozen functional contract; behavioral QA B* required | Diff review vs FILE_CHANGE_PLAN; missing engine tests fails gate | Revert PR; withhold Owner Green | Architecture + QA | **Yes** if delta absent | LOW if contract held |
| **R2B-02** Playback UI as source of truth | HIGH | Business rules live only in JSX/`PlaybackProvider` toggles | Non-testable / non-resumable state; second prototype | Option C engine; envelope is SoT in memory | Unit tests without DOM; UI-only state machine rejected | Extract/revert to engine module | Architecture + Implementation Checkpoint | **Yes** if UI is SoT | LOW with engine |
| **R2B-03** Second V1 engine | MEDIUM | Broad framework rewrite or Living ERP coupling | Permanent parallel platform | Narrow mission-entry module; no shell rewrite | File-plan drift into workspace/auth/api | Unmount mission-entry; keep shell | Architecture | **Yes** if second framework appears | MEDIUM long-term migration |
| **R2B-04** Auth/API coupling | HIGH | `useAuth`, fetch, `/workspace`, production login reuse | Production/James risk | Fake playback login; no-fetch tests; out-of-plan auth/api | Spy `fetch`; grep `useAuth` under mission-entry | Revert coupling commits | QA + Security | **Yes** if coupling present | LOW if isolation held |
| **R2B-05** Non-deterministic AI | HIGH | Network/generative AI for consequence or ledger | Non-auditable pedagogy; flaky tests | Authored maps only; AI non-authoritative | No-fetch; consequence table tests | Disable AI UI; keep authored map | Architecture + QA | **Yes** if generative path used | LOW with authored AI |
| **R2B-06** Session corruption | HIGH | Invalid JSON/version/fields/ledger in sessionStorage | Crash, partial hydrate, fake history | Corruption contract: discard, clean NOT_STARTED, recovery notice, `SESSION_RECOVERY_RESET` | QA corruption suite | Clear key; restart session | QA + Implementation | **Yes** if unhandled | LOW with suite green |
| **R2B-07** Invalid completion | HIGH | COMPLETED without evidence/decision/consequence/debrief | False mastery signal | Transition table + completion gate | QA completion blocked/allowed cases | Reject transition; fix engine | QA + Pedagogy | **Yes** if invalid complete allowed | LOW with gates |
| **R2B-08** Professor/James/deploy leakage | HIGH | Professor runtime, James Run 2, or deploy without gate | Pedagogical/production integrity breach | Explicit prohibitions; Run 2 = 0; no deploy/push | Governance checklist each PR | Disable account/run; revert deploy; cancel Run 2 | Owner / Governance | **Yes** if claimed or performed | LOW if gates held |

## Branch-name risk note

| Item | Value |
|------|-------|
| Current | `feature/v2-portal-login-wave2b` |
| Verdict | **RENAME REQUIRED BEFORE IMPLEMENTATION** |
| Recommended | `feature/v2-so1048-mission-entry-wave2b` |
| This task | Do not rename |

## Residual Wave 2A P2 (out of Wave 2B)

- College logo asset  
- `/orientation` → `/mission-cockpit` rename  

## Severity summary

| Severity | Status |
|----------|--------|
| P0 | None in docs-only Revision 2 |
| P1 (doc contract) | **Closed** by Revision 2 freeze (R1-01, R1-02) |
| P2 | Branch rename still pending before implementation |
| P3 | Optional marker wording polish later |

**IMPLEMENTATION NOT AUTHORIZED** until Final Architecture Re-Approval + Implementation Checkpoint.
