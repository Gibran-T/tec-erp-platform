# TEC.ERP Professor Student 360

## Entry

Command Center → **Étudiants** → select learner → `getProfessorStudentDetail(studentId)`.

`data-testid="professor-student-360"`.

## Displayed identity

- Display name
- Employee number
- Cohort
- Curriculum version/label
- Run/status chip via `statusLabel` + `toneForStatus`

## Detail payload (current)

Structured preview of:

- `progress` / `modules`
- `assessments`
- `competencies`
- `capstone`

Rendered as formatted JSON for completeness during the Living wave (honest interim).

## Attention coupling

Overview attention queue flags low progress (<20%), inactive status, and Capstone revision_requested — pathways into 360/Capstone sections.

## Rules

1. Company-scoped — only assigned/visible students.
2. No answer keys in 360.
3. Curriculum label required to avoid V1/V2 misread.
4. Predictions hook exists (hidden control) for future attention scoring — not a learner-facing UI.

## Partial

- Not yet a polished multi-tab 360 (timeline, documents, interventions history as first-class panels).
- Relies on professor student detail API richness; missing fields show as absent in JSON.
