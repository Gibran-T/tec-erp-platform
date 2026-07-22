# TEC.ERP V2 Migration Plan

Migration: `packages/database-erp/prisma/migrations/20260725120000_v2_curriculum_version`

Additive only:
- `pedagogical_course_run.curriculumVersion` DEFAULT `V1`
- `capstone_submission.lifecycleStatus`, `currentStage`
- HCM `mission_definition` identity rows (`M8-HCM-M0x` codes)

Validation matrix:
- empty DB migrate
- populated V1 DB (existing runs stay V1)
- James-style V1 fixture unchanged
- new V2 run fixture starts 0/30 with HCM keys
- no certificate/run2 mutation

**Do not apply to production in this PR wave.**
