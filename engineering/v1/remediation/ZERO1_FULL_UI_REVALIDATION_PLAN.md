# TEC.ERP — Full-UI Revalidation Plan (Zero1 / Z1-006)

**Purpose:** After remediation merge + production deploy, revalidate all 30 missions with **browser-only** execution for James Timothy Zero1 (or a fresh pilot clone if owner prefers).  
**Rule:** Direct `POST .../submit` API is **not** a substitute for UI evidence.

---

## Scope

| In | Out |
|----|-----|
| Production Web UI (or staging twin) | API-only completion |
| All 30 missions M1-M01 … M10-M03 | Product content redesign |
| Wrong-action + recovery where safe | Destructive data corruption |
| Logout/login persistence checkpoints | Changing scoring rules |

---

## Execution contract (per mission)

1. Open Centre de mission in browser (authenticated student).  
2. Read visible title, briefing, contexts.  
3. State expected business outcome (notes).  
4. Start via UI button.  
5. Perform **one** safe incorrect action (empty submit / invalid mapping / wrong choice).  
6. Capture client error / feedback text.  
7. Recover via supported UI flow.  
8. Complete mission via UI controls only.  
9. Record score, attempt number, duration.  
10. Refresh page — verify persistence.  
11. Optional: logout/login every module boundary.  
12. Classify: PASS / PASS WITH NOTE / ISSUE.

---

## Automation that still counts as UI

Allowed:
- Playwright / Cursor browser driving real DOM clicks, fills, selects.
- Observing network responses **after** UI submit.

Forbidden as primary completion path:
- Building submit payload and calling `/submit` without UI interaction.
- DB upsert of attempts.

---

## Evidence pack

Create under `engineering/v1/pilot/revalidation/` (post-deploy):
- `FULL_UI_EXECUTION_LOG.md` (30-row table)
- Optional screenshots per module
- Network HAR excerpts for submit 200 only if useful

---

## Checkpoints

| Checkpoint | When |
|------------|------|
| First-day | Before M1-M01 |
| After M1 | Logout/login |
| After M2 + Silver eligibility | Certificates page |
| After M6 + Integrated assessment | Assessments page |
| After M10 | Capstone + Gold eligibility UI |
| End | Security 403 re-check; James isolation |

## Owner gate

Do not start full-UI revalidation until:
1. Remediation PR merged  
2. Production deploy approved  
3. Smoke health green  
4. James records still intact (or owner authorizes alternate Zero1 re-run identity)
