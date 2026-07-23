# TEC.ERP Learning Operating System — Technical Impact Assessment

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

**Do not implement these changes in this wave.** Classification: reusable · extend · refactor · replace · preserve.

| Area | Likely impact | Class |
|------|---------------|-------|
| Routes | Add portal public IA; module cycle routes; BI Studio; AI workspace; Teaching Deck; Historique | extend |
| DTOs | Evidence objects; KPI definition; mastery states; deck manifests | extend |
| Mission catalog | Keep keys; enrich pedagogical metadata (role, evidence, BI/AI links) | extend |
| Curriculum overlays | Already V1/V2; keep authority in mission-catalog | preserve |
| Run versioning | pedagogicalCourseRun.curriculumVersion | preserve |
| Evidence model | New persistence / projection for evidence graph | extend / refactor |
| Assessments | Multi-format items beyond MCQ; HCM_M8 remains | extend |
| BI endpoints | Richer KPI metadata + analysis submissions | extend / replace (dashboard tiles) |
| AI endpoints | Mode + evidence refs + synthesis gate | extend |
| Content storage | Module blueprints → structured content packs | extend |
| Teaching Deck content | New content type + assets | extend |
| Localization | FR/EN catalogs for all new surfaces | extend |
| Image assets | Process visuals pipeline | extend |
| Presentation mode | Professor presentation shell | extend |
| Accessibility | Projector + learner modes | extend |
| Performance | BI queries + deck assets budgets | extend |
| Migration risk | Avoid V1 rewrite; additive only | preserve |

## Preserve absolute

James Run 1 V1 data · certificates · Capstone approvals · integrity semantics · Professor count unchanged by this wave
