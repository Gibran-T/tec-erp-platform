# TEC.ERP V1 → V2 Compatibility

## Hard gate

James Run 1 (curriculum V1) must remain 30/30 with unchanged attempts, scores, certificates, Capstone submission, and legacy integrity hash.

## Mechanism

1. Existing runs keep `curriculumVersion = V1` (DB default + no backfill rewrite of meaning).
2. New runs (`createRun`, bootstrap of greenfield learners) receive `V2`.
3. V1 regular keys remain the historical 30 (incl. m10-* Capstone-module missions).
4. V2 regular keys replace m10-* with HCM keys; Capstone is domain-only.
5. Historical mission definitions remain resolvable via `listAllKnownMissionDefinitions` / `getMissionByKey`.
6. No HCM completion is invented for V1; V1 keys do not include HCM missions.

## Reporting

Analytics and professor surfaces expose `curriculumVersion` and must not imply module-by-module equivalence between V1 and V2 where structure differs (esp. M8–M10).
