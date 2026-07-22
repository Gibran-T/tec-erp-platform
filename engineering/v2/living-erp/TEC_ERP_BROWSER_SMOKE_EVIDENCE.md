# TEC.ERP Browser Smoke Evidence — Living ERP

## Rules

- **Local / isolated fixtures only**
- **No production writes**
- **No production deploy**
- Do not use real James production data mutation
- Record URLs, roles, and pass/fail — never passwords or secrets

## Environment placeholders

| Field | Value |
|-------|-------|
| Date | `{{SMOKE_DATE}}` |
| Operator | `{{OPERATOR}}` |
| Web base URL (local) | `{{WEB_BASE_URL}}` |
| API base URL (local) | `{{API_BASE_URL}}` |
| Git SHA under test | `{{GIT_SHA}}` |
| Baseline main reference | `c6c242a` |
| Prod SHA (do not write) | `76709d6` HOLD |
| Fixture prefix | `{{FIXTURE_PREFIX}}` e.g. `__QA_LIVING_ERP_` |

## Personas (create locally)

| ID | Role | Curriculum / notes | Status |
|----|------|--------------------|--------|
| L-V1-H | Learner | V1 historical / read-only | `{{STATUS}}` |
| L-V2-N | Learner | V2 new | `{{STATUS}}` |
| L-V2-P | Learner | V2 partial progress | `{{STATUS}}` |
| L-V2-HCM | Learner | V2 + HCM assessment path | `{{STATUS}}` |
| L-V2-CAP | Learner | Capstone revision_requested | `{{STATUS}}` |
| P-A / P-B | Professors | Separate cohorts/companies as needed | `{{STATUS}}` |
| ADM | Admin | Company admin | `{{STATUS}}` |

## Learner checklist

| # | Step | Expected | Result | Evidence path |
|---|------|----------|--------|---------------|
| L1 | Login FR default | FR labels; no English credential leak | `{{PASS/FAIL}}` | `{{PATH}}` |
| L2 | Switch EN / back FR | Persistence across reload | `{{PASS/FAIL}}` | |
| L3 | Theme light/dark/system | `data-theme` matches | `{{PASS/FAIL}}` | |
| L4 | Learner home journey | M1–M10 cards + Capstone + Or | `{{PASS/FAIL}}` | |
| L5 | Open Module Hub | Why / process / missions | `{{PASS/FAIL}}` | |
| L6 | Open mission from hub | Mission Center with mission context | `{{PASS/FAIL}}` | |
| L7 | Documents Vue flux | Flow strip visible | `{{PASS/FAIL}}` | |
| L8 | Dashboard KPIs | Explained cards, not bare numbers | `{{PASS/FAIL}}` | |
| L9 | AI Coach 5 modes | Modes + safeguards list | `{{PASS/FAIL}}` | |
| L10 | Capstone locked | **No** submit CTA; hint visible | `{{PASS/FAIL}}` | |
| L11 | Certificates / verify | Eligibility + public verify (local) | `{{PASS/FAIL}}` | |
| L12 | Historical run | Read-only signals; no restart | `{{PASS/FAIL}}` | |
| L13 | Collapse context panel | Right panel collapsed | `{{PASS/FAIL}}` | |
| L14 | Mobile width | Bottom nav usable | `{{PASS/FAIL}}` | |

## Professor checklist

| # | Step | Expected | Result | Evidence path |
|---|------|----------|--------|---------------|
| P1 | Open Command Center | 14 sections navigable | `{{PASS/FAIL}}` | |
| P2 | Overview unique-students | Numeric official metric (not 404) | `{{PASS/FAIL}}` | |
| P3 | Student 360 | Detail loads for assigned student | `{{PASS/FAIL}}` | |
| P4 | Runs / compare | Curriculum honesty visible | `{{PASS/FAIL}}` | |
| P5 | Capstone queue | Review actions (local only) | `{{PASS/FAIL}}` | |
| P6 | AI oversight | Interactions without keys | `{{PASS/FAIL}}` | |
| P7 | Presentation mode | Overlay; quit works | `{{PASS/FAIL}}` | |
| P8 | Company isolation | P-A cannot see other company students | `{{PASS/FAIL}}` | |

## Admin isolation (spot)

| # | Step | Expected | Result |
|---|------|----------|--------|
| A1 | Admin apps visible | Admin only | `{{PASS/FAIL}}` |
| A2 | No Living learner data leak across companies | Isolated | `{{PASS/FAIL}}` |

## Cleanup

| Step | Result |
|------|--------|
| Delete `{{FIXTURE_PREFIX}}` rows | `{{PASS/FAIL}}` |
| Confirm residue count = 0 (local) | `{{PASS/FAIL}}` |
| Confirm **no** production mutation | `{{PASS/FAIL}}` |

## Verdict placeholder

`{{VERDICT}}` — e.g. `LOCAL SMOKE PASS — NOT A PRODUCTION RELEASE`
