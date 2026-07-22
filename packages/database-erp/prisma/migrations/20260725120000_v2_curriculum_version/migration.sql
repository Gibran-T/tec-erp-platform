-- V2 curriculum foundation (additive only).
-- Existing pedagogical runs remain V1 (historical James Run 1 compatibility).
-- New runs are assigned V2 by application code (CURRENT_CURRICULUM_VERSION).

ALTER TABLE "pedagogical_course_run"
ADD COLUMN IF NOT EXISTS "curriculumVersion" TEXT NOT NULL DEFAULT 'V1';

ALTER TABLE "capstone_submission"
ADD COLUMN IF NOT EXISTS "lifecycleStatus" TEXT;

ALTER TABLE "capstone_submission"
ADD COLUMN IF NOT EXISTS "currentStage" TEXT;

-- Ensure no accidental mutation of historical run versions.
UPDATE "pedagogical_course_run"
SET "curriculumVersion" = 'V1'
WHERE "curriculumVersion" IS NULL OR "curriculumVersion" = '';

-- HCM mission identity rows (V2 M8). Display codes use M8-HCM-* to avoid colliding
-- with historical M8-M01..M03 governance missionCode uniqueness. Catalog overlays
-- present learner-facing M8-M01..M03 for curriculum V2.
INSERT INTO "mission_definition" (
  "id","moduleId","missionCode","missionKey","title","sequence",
  "maxAttempts","passThresholdPercent","estimatedMinutes","difficulty",
  "definitionJson","createdAt","updatedAt"
) VALUES
(
  'md_m8_hcm_m01','module_m8','M8-HCM-M01','m8-m01-integrer-nouvel-employe',
  'Integrer un nouvel employe',1,2,70,45,'intermediate',
  '{"source":"mission-catalog","curriculum":"V2","domain":"HCM"}'::jsonb,
  CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
),
(
  'md_m8_hcm_m02','module_m8','M8-HCM-M02','m8-m02-gerer-temps-absences',
  'Gerer le temps, les absences et l impact financier',2,2,70,50,'advanced',
  '{"source":"mission-catalog","curriculum":"V2","domain":"HCM"}'::jsonb,
  CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
),
(
  'md_m8_hcm_m03','module_m8','M8-HCM-M03','m8-m03-evaluer-competences-evolution',
  'Evaluer les competences et preparer l evolution',3,2,70,50,'advanced',
  '{"source":"mission-catalog","curriculum":"V2","domain":"HCM"}'::jsonb,
  CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
ON CONFLICT ("missionKey") DO NOTHING;
