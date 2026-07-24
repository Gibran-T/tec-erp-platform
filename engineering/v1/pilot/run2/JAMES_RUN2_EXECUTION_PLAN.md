# James Run 2 — Execution Plan

**Run code (planned):** `TECERP-PILOT-001-RUN2`  
**Run type:** `INSTRUCTOR_LED`  
**Label:** James Timothy — Run 2 — Instructor-Led Pedagogical Validation  
**Status:** **PLANNED — EXECUTION BLOCKED**  
**Branch:** `pilot/james-timothy-run2-instructor-led`

---

## Gates before execution

| Gate | Status |
|------|--------|
| Baseline main = `e8761d8…` | PASS |
| Product SHA production = `2378b2b…` | PASS (remediation green) |
| PR #21 open (Run 1 evidence) | PASS |
| PR #22 / #23 merged | PASS |
| James identity + login | PASS |
| Run 1 immutable snapshot | PASS |
| QA residue = 0 | PASS |
| Versioned pedagogical run support | **FAIL — HOLD** |
| Legitimate Thiago professor + assignment | **FAIL — HOLD** |

**Execution must not start** until both HOLDs are cleared by owner-authorized product deploy + Thiago ops.

---

## Teaching session model (10 modules)

Each module session A–T (introduction → missions → synthesis → professor assessment).  
Support **pause/resume** with logout/login persistence checkpoints after each module.  
Full UI only — no API submit / DB score / unlock shortcuts.

---

## Mission execution contract (when unblocked)

1. Browser production Web only  
2. Wrong-action ≥1 per module (safe)  
3. Evidence per mission (URL, labels, score, screenshots, intervention class)  
4. After each module: save → refresh → logout → login → verify; re-check Run 1 integrityHash  
5. Assessments SILVER / INTEGRATED / GOLD via UI on Run 2 only  
6. Capstone + Gold via UI + Thiago professor portal  
7. Never invalidate Run 1 certificates  

---

## Deliverables after execution (blocked)

See file checklist in `JAMES_RUN2_FINAL_REPORT.md`. Logs/feedback/comparison remain templates until Run 2 exists.
