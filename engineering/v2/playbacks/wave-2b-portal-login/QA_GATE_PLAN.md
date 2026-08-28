# Wave 2B — QA Gate Plan (Revision 2)

> **Status:** PLAN ONLY — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 2 — Behavioral + persistence/ledger freeze tests  
> **Deploy / Push / James Run 2 / Professor:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch:** `feature/v2-portal-login-wave2b` (rename required before implementation)  
> **Findings closed:** R1-01 … R1-05 = **CLOSED**

## Principle

Prove **behavior** and **contract freeze** — not render-only. Wave 2A regressions remain green.

Storage key under test: `tec.erp.playback.v2.so1048.m1.session.v1`  
Envelope: `schemaVersion: 1`

---

## A. Persistence tests (closes R1-01)

| ID | Case | Pass |
|----|------|------|
| P1 | Valid hydrate | Round-trip serialize → parse → equal envelope; status restored |
| P2 | Invalid JSON | No crash; no partial hydrate; key cleared; clean `NOT_STARTED`; recovery notice |
| P3 | Unsupported `schemaVersion` | Same as P2 |
| P4 | Missing required field | Same as P2 |
| P5 | Malformed ledger (dup IDs / bad types) | Same as P2 |
| P6 | Invalid status value | Same as P2 |
| P7 | Safe reset | New `sessionId`; optional `SESSION_RECOVERY_RESET` on **new** session only; **no** corrupt payload copied |
| P8 | Missing key | Treated as fresh `NOT_STARTED` (no false recovery history) |
| P9 | No `localStorage` writes | Adapter never touches `localStorage` |
| P10 | Timestamps | ISO-8601 UTC (`Z`) on `createdAt`/`updatedAt`/event `timestamp` |

---

## B. Ledger tests (closes R1-02)

| ID | Case | Pass |
|----|------|------|
| L1 | Required fields | Every event has `id`, `sessionId`, `timestamp`, `type`, `actor`, `payload`, `version: 1` |
| L2 | Unique IDs | No duplicate `id` in session |
| L3 | Append-only | No update/delete API mutates past events |
| L4 | Exact event names | Only frozen `MissionLedgerEventType` union values |
| L5 | Event version | `version === 1` |
| L6 | Resume event | Successful restore appends `SESSION_RESUMED` |
| L7 | Recovery reset event | After corruption, new session may contain `SESSION_RECOVERY_RESET` without corrupt payload |
| L8 | Monotonic timestamps | Non-decreasing within session |
| L9 | AI non-authority | No API path for Visible AI to rewrite ledger |

Required catalog coverage in happy path:  
`MISSION_1_STARTED` · `EVIDENCE_COLLECTED` · `DECISION_RECORDED` · `CONSEQUENCE_APPLIED` · `DEBRIEF_ACKNOWLEDGED` · `MISSION_1_COMPLETED`  
Plus as applicable: `SESSION_RESUMED` · `SESSION_ABANDONED` · `SESSION_RECOVERY_RESET`

---

## C. Consequence tests (closes R1-03 · R1-05)

| ID | Case | Pass |
|----|------|------|
| C1 | Four-option map | `DEMAND_QUANTITY` / `SUPPLIER_DELAY` / `STOCK_AVAILABILITY` / `WAREHOUSE_CAPACITY` each → unique `consequenceId` |
| C2 | Determinism | Same decision twice (fresh sessions) → identical consequence outputs |
| C3 | Exactly once | One `CONSEQUENCE_APPLIED` per session |
| C4 | Re-apply | Reject or no-op; ledger count unchanged |
| C5 | No decision change after consequence | Rejected |
| C6 | No network | `fetch` unused |

---

## D. Completion / transition tests

| ID | Case | Pass |
|----|------|------|
| T1 | Blocked without evidence | Cannot COMPLETE |
| T2 | Blocked without decision | Cannot COMPLETE |
| T3 | Blocked without consequence | Cannot COMPLETE |
| T4 | Blocked without debrief | Cannot COMPLETE |
| T5 | Allowed when all criteria pass | `COMPLETED` + `MISSION_1_COMPLETED` |
| T6 | Invalid transitions | Rejected; status unchanged |
| T7 | `COMPLETED` terminal | No further status transition |
| T8 | Abandon paths | `SESSION_ABANDONED` from allowed states |

---

## E. Isolation tests

| ID | Case | Pass |
|----|------|------|
| I1 | No `fetch` | Spy never called in loop |
| I2 | No `useAuth` | Not imported under mission-entry |
| I3 | No API/DB | No Prisma/api modules in diff |
| I4 | Production login unchanged | `/login` still production page; playback isolated |
| I5 | James Run 1 unchanged | Governance confirmation |
| I6 | James Run 2 = 0 | Governance confirmation |
| I7 | Professor preview-only | Badge/controls non-functional |

---

## F. Package gates (future)

```text
pnpm --filter erp-web test
pnpm --filter erp-web typecheck
pnpm --filter erp-web lint
pnpm turbo --filter=erp-web... build
```

## G. Pass / Fail

**Pass:** P* · L* · C* · T* · I* green + Wave 2A regression + Owner Revision 2 loop.  
**Fail:** Partial hydrate · fake history · second `CONSEQUENCE_APPLIED` · three-option-only decision · render-only suite · auth/API/deploy/James leakage.

**IMPLEMENTATION NOT AUTHORIZED by this plan.**
