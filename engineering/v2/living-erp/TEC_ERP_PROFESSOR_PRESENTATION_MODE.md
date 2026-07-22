# TEC.ERP Professor Presentation Mode

## Entry

Command Center nav → **Présentation** sets `presentationOpen` and renders overlay  
`data-testid="professor-presentation-mode"`.

## Intent

Classroom-safe, enlarged view for process teaching:

- Process map: Besoin → Transaction → Document → Contrôle → KPI
- Non-sensitive scenario facts (NordHabitat simulation framing)
- Curriculum/run context without private professor notes

## Safeguards

- Personal notes hidden
- Answer keys absent unless an explicit correction mode exists (not enabled in this overlay)
- Quit control returns to Command Center

## Partial

- Overlay is a focused Living shell, not a full slide system or second window API.
- Does not yet mirror arbitrary Student 360 panes into presentation-safe projections.
