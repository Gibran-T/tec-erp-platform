-- V1 Pedagogical Course Runs — additive, non-destructive, with Run 1 backfill.
-- No learning-history DELETE. Safe on empty and populated databases.

-- 1) New tables
CREATE TABLE "pedagogical_course_run" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "cohortId" TEXT,
    "employeeId" TEXT NOT NULL,
    "professorId" TEXT,
    "courseId" TEXT NOT NULL,
    "runCode" TEXT NOT NULL,
    "runSequence" INTEGER NOT NULL,
    "runType" TEXT NOT NULL,
    "runLabel" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "status" TEXT NOT NULL,
    "sourceRunId" TEXT,
    "startedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "completionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadataJson" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "pedagogical_course_run_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pedagogical_course_run_runCode_key" ON "pedagogical_course_run"("runCode");
CREATE UNIQUE INDEX "pedagogical_course_run_employeeId_courseId_runSequence_key" ON "pedagogical_course_run"("employeeId", "courseId", "runSequence");
CREATE INDEX "pedagogical_course_run_companyId_idx" ON "pedagogical_course_run"("companyId");
CREATE INDEX "pedagogical_course_run_employeeId_status_idx" ON "pedagogical_course_run"("employeeId", "status");
CREATE INDEX "pedagogical_course_run_cohortId_idx" ON "pedagogical_course_run"("cohortId");
-- At most one ACTIVE run per employee+course
CREATE UNIQUE INDEX "pedagogical_course_run_one_active_per_employee_course"
  ON "pedagogical_course_run"("employeeId", "courseId")
  WHERE "status" = 'ACTIVE';

ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run"
  ADD CONSTRAINT "pedagogical_course_run_sourceRunId_fkey" FOREIGN KEY ("sourceRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "pedagogical_course_run_audit" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "reason" TEXT,
    "payloadJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pedagogical_course_run_audit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pedagogical_course_run_audit_runId_createdAt_idx" ON "pedagogical_course_run_audit"("runId", "createdAt");
ALTER TABLE "pedagogical_course_run_audit"
  ADD CONSTRAINT "pedagogical_course_run_audit_runId_fkey" FOREIGN KEY ("runId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedagogical_course_run_audit"
  ADD CONSTRAINT "pedagogical_course_run_audit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "professor_intervention" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "moduleCode" TEXT,
    "missionCode" TEXT,
    "professorId" TEXT NOT NULL,
    "interventionType" TEXT NOT NULL,
    "durationMinutes" INTEGER,
    "reason" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "outcome" TEXT,
    "shouldSystemTeach" BOOLEAN,
    "learningHubCandidate" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "professor_intervention_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "professor_intervention_runId_createdAt_idx" ON "professor_intervention"("runId", "createdAt");
ALTER TABLE "professor_intervention"
  ADD CONSTRAINT "professor_intervention_runId_fkey" FOREIGN KEY ("runId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "professor_intervention"
  ADD CONSTRAINT "professor_intervention_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "student_mission_reflection" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "clarity" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "cognitiveLoad" INTEGER NOT NULL,
    "realism" INTEGER NOT NULL,
    "relevance" INTEGER NOT NULL,
    "navigationQuality" INTEGER NOT NULL,
    "feedbackQuality" INTEGER NOT NULL,
    "visualQuality" INTEGER NOT NULL,
    "aiUsefulness" INTEGER,
    "biUsefulness" INTEGER,
    "externalExplanationRequired" BOOLEAN NOT NULL DEFAULT false,
    "externalSlidesWouldHelp" BOOLEAN NOT NULL DEFAULT false,
    "qualitativeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "student_mission_reflection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "student_mission_reflection_runId_missionKey_employeeId_key"
  ON "student_mission_reflection"("runId", "missionKey", "employeeId");
CREATE INDEX "student_mission_reflection_runId_idx" ON "student_mission_reflection"("runId");
ALTER TABLE "student_mission_reflection"
  ADD CONSTRAINT "student_mission_reflection_runId_fkey" FOREIGN KEY ("runId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "student_mission_reflection"
  ADD CONSTRAINT "student_mission_reflection_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 2) Add nullable run FK columns + certificate provenance
ALTER TABLE "employee_course_progress" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "employee_module_progress" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "mission_attempt" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "unlock_state" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "assessment_attempt" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "capstone_submission" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "ai_interaction" ADD COLUMN "pedagogicalCourseRunId" TEXT;
ALTER TABLE "certificate" ADD COLUMN "sourceRunId" TEXT;
ALTER TABLE "certificate" ADD COLUMN "achievementType" TEXT;

-- 3) Ensure default course exists for orphan learners (no-op if present)
INSERT INTO "course" ("id", "code", "title", "version", "createdAt", "updatedAt")
SELECT 'course_tec_erp_v1', 'TEC_ERP_V1', 'TEC.ERP V1', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "course" WHERE "code" = 'TEC_ERP_V1' OR "id" = 'course_tec_erp_v1'
);

-- 4) Backfill Run 1 for every employee with learning activity
WITH learners AS (
  SELECT DISTINCT e."id" AS employee_id, e."companyId", e."employeeNumber", e."displayName"
  FROM "employee" e
  WHERE EXISTS (SELECT 1 FROM "employee_course_progress" p WHERE p."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "employee_module_progress" p WHERE p."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "mission_attempt" a WHERE a."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "assessment_attempt" a WHERE a."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "capstone_submission" c WHERE c."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "certificate" c WHERE c."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "ai_interaction" i WHERE i."employeeId" = e."id")
     OR EXISTS (SELECT 1 FROM "unlock_state" u WHERE u."employeeId" = e."id")
),
cohort_pick AS (
  SELECT DISTINCT ON (cm."employeeId")
    cm."employeeId",
    cm."cohortId",
    c."code" AS cohort_code
  FROM "cohort_membership" cm
  JOIN "cohort" c ON c."id" = cm."cohortId"
  WHERE cm."roleInCohort" = 'student'
  ORDER BY cm."employeeId", cm."createdAt" ASC
),
course_pick AS (
  SELECT DISTINCT ON (p."employeeId")
    p."employeeId",
    p."courseId",
    p."percentComplete",
    p."status" AS course_status,
    p."createdAt" AS course_started,
    p."updatedAt" AS course_updated
  FROM "employee_course_progress" p
  ORDER BY p."employeeId", p."updatedAt" DESC
),
company_codes AS (
  SELECT co."id" AS company_id, co."code" AS company_code FROM "company" co
)
INSERT INTO "pedagogical_course_run" (
  "id", "companyId", "cohortId", "employeeId", "professorId", "courseId",
  "runCode", "runSequence", "runType", "runLabel", "language", "status",
  "sourceRunId", "startedAt", "pausedAt", "completedAt", "cancelledAt",
  "createdAt", "updatedAt", "createdById", "completionPercent", "metadataJson"
)
SELECT
  'pcr_run1_' || l.employee_id,
  l."companyId",
  cp."cohortId",
  l.employee_id,
  NULL,
  COALESCE(cse."courseId", 'course_tec_erp_v1'),
  CASE
    WHEN cp.cohort_code = 'TECERP-PILOT-001' AND l."employeeNumber" = 'TECERP-2026-PILOT-001'
      THEN 'TECERP-PILOT-001-RUN1'
    ELSE COALESCE(cp.cohort_code, cc.company_code) || '-' || l."employeeNumber" || '-RUN1'
  END,
  1,
  'AUTONOMOUS',
  CASE
    WHEN cp.cohort_code = 'TECERP-PILOT-001' AND l."employeeNumber" = 'TECERP-2026-PILOT-001'
      THEN 'James Timothy — Run 1 — Autonomous Zero1 Validation'
    ELSE l."displayName" || ' — Run 1 — Autonomous'
  END,
  'fr',
  CASE
    WHEN COALESCE(cse."percentComplete", 0) >= 100 OR cse.course_status = 'completed' THEN 'COMPLETED'
    WHEN cse."employeeId" IS NOT NULL OR EXISTS (SELECT 1 FROM "mission_attempt" ma WHERE ma."employeeId" = l.employee_id)
      THEN 'ACTIVE'
    ELSE 'PLANNED'
  END,
  NULL,
  cse.course_started,
  NULL,
  CASE
    WHEN COALESCE(cse."percentComplete", 0) >= 100 OR cse.course_status = 'completed' THEN cse.course_updated
    ELSE NULL
  END,
  NULL,
  COALESCE(cse.course_started, CURRENT_TIMESTAMP),
  CURRENT_TIMESTAMP,
  l.employee_id,
  COALESCE(cse."percentComplete", 0),
  jsonb_build_object('legacyBackfill', true, 'baselineRun', 'RUN1_AUTONOMOUS')
FROM learners l
LEFT JOIN cohort_pick cp ON cp."employeeId" = l.employee_id
LEFT JOIN course_pick cse ON cse."employeeId" = l.employee_id
LEFT JOIN company_codes cc ON cc.company_id = l."companyId"
WHERE NOT EXISTS (
  SELECT 1 FROM "pedagogical_course_run" r
  WHERE r."employeeId" = l.employee_id AND r."runSequence" = 1
);

-- 5) Attach existing learning rows to Run 1
UPDATE "employee_course_progress" p
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = p."employeeId" AND r."runSequence" = 1 AND p."pedagogicalCourseRunId" IS NULL;

UPDATE "employee_module_progress" p
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = p."employeeId" AND r."runSequence" = 1 AND p."pedagogicalCourseRunId" IS NULL;

UPDATE "mission_attempt" a
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = a."employeeId" AND r."runSequence" = 1 AND a."pedagogicalCourseRunId" IS NULL;

UPDATE "unlock_state" u
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = u."employeeId" AND r."runSequence" = 1 AND u."pedagogicalCourseRunId" IS NULL;

UPDATE "assessment_attempt" a
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = a."employeeId" AND r."runSequence" = 1 AND a."pedagogicalCourseRunId" IS NULL;

UPDATE "capstone_submission" c
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = c."employeeId" AND r."runSequence" = 1 AND c."pedagogicalCourseRunId" IS NULL;

UPDATE "ai_interaction" i
SET "pedagogicalCourseRunId" = r."id"
FROM "pedagogical_course_run" r
WHERE r."employeeId" = i."employeeId" AND r."runSequence" = 1 AND i."pedagogicalCourseRunId" IS NULL;

UPDATE "certificate" c
SET "sourceRunId" = r."id",
    "achievementType" = COALESCE(c."achievementType", c."certificateType")
FROM "pedagogical_course_run" r
WHERE r."employeeId" = c."employeeId" AND r."runSequence" = 1 AND c."sourceRunId" IS NULL;

-- 6) Enforce NOT NULL on required learning FKs (only rows that were backfilled exist;
--    empty tables remain compatible after SET NOT NULL with no nulls)
ALTER TABLE "employee_course_progress" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;
ALTER TABLE "employee_module_progress" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;
ALTER TABLE "mission_attempt" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;
ALTER TABLE "unlock_state" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;
ALTER TABLE "assessment_attempt" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;
ALTER TABLE "capstone_submission" ALTER COLUMN "pedagogicalCourseRunId" SET NOT NULL;

-- 7) Replace uniqueness constraints
DROP INDEX IF EXISTS "employee_course_progress_employeeId_courseId_key";
CREATE UNIQUE INDEX "employee_course_progress_employeeId_courseId_pedagogicalCourseRunId_key"
  ON "employee_course_progress"("employeeId", "courseId", "pedagogicalCourseRunId");
CREATE INDEX "employee_course_progress_pedagogicalCourseRunId_idx" ON "employee_course_progress"("pedagogicalCourseRunId");

DROP INDEX IF EXISTS "employee_module_progress_employeeId_moduleId_key";
CREATE UNIQUE INDEX "employee_module_progress_employeeId_moduleId_pedagogicalCourseRunId_key"
  ON "employee_module_progress"("employeeId", "moduleId", "pedagogicalCourseRunId");
CREATE INDEX "employee_module_progress_pedagogicalCourseRunId_idx" ON "employee_module_progress"("pedagogicalCourseRunId");

DROP INDEX IF EXISTS "mission_attempt_employeeId_missionDefinitionId_attemptNumber_key";
CREATE UNIQUE INDEX "mission_attempt_employeeId_missionDefinitionId_pedagogicalCourseRunId_attemptNumber_key"
  ON "mission_attempt"("employeeId", "missionDefinitionId", "pedagogicalCourseRunId", "attemptNumber");
CREATE INDEX "mission_attempt_pedagogicalCourseRunId_idx" ON "mission_attempt"("pedagogicalCourseRunId");

DROP INDEX IF EXISTS "unlock_state_employeeId_resourceType_resourceKey_key";
CREATE UNIQUE INDEX "unlock_state_employeeId_resourceType_resourceKey_pedagogicalCourseRunId_key"
  ON "unlock_state"("employeeId", "resourceType", "resourceKey", "pedagogicalCourseRunId");
CREATE INDEX "unlock_state_pedagogicalCourseRunId_idx" ON "unlock_state"("pedagogicalCourseRunId");

DROP INDEX IF EXISTS "assessment_attempt_employeeId_assessmentId_attemptNumber_key";
CREATE UNIQUE INDEX "assessment_attempt_employeeId_assessmentId_pedagogicalCourseRunId_attemptNumber_key"
  ON "assessment_attempt"("employeeId", "assessmentId", "pedagogicalCourseRunId", "attemptNumber");
CREATE INDEX "assessment_attempt_pedagogicalCourseRunId_idx" ON "assessment_attempt"("pedagogicalCourseRunId");

DROP INDEX IF EXISTS "capstone_submission_employeeId_key";
CREATE UNIQUE INDEX "capstone_submission_employeeId_pedagogicalCourseRunId_key"
  ON "capstone_submission"("employeeId", "pedagogicalCourseRunId");
CREATE INDEX "capstone_submission_pedagogicalCourseRunId_idx" ON "capstone_submission"("pedagogicalCourseRunId");

CREATE INDEX "ai_interaction_pedagogicalCourseRunId_idx" ON "ai_interaction"("pedagogicalCourseRunId");
CREATE INDEX "certificate_sourceRunId_idx" ON "certificate"("sourceRunId");

-- 8) Foreign keys for run scoping
ALTER TABLE "employee_course_progress"
  ADD CONSTRAINT "employee_course_progress_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_module_progress"
  ADD CONSTRAINT "employee_module_progress_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mission_attempt"
  ADD CONSTRAINT "mission_attempt_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "unlock_state"
  ADD CONSTRAINT "unlock_state_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "assessment_attempt"
  ADD CONSTRAINT "assessment_attempt_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capstone_submission"
  ADD CONSTRAINT "capstone_submission_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ai_interaction"
  ADD CONSTRAINT "ai_interaction_pedagogicalCourseRunId_fkey"
  FOREIGN KEY ("pedagogicalCourseRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "certificate"
  ADD CONSTRAINT "certificate_sourceRunId_fkey"
  FOREIGN KEY ("sourceRunId") REFERENCES "pedagogical_course_run"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 9) Lifecycle audit rows for backfilled runs
INSERT INTO "pedagogical_course_run_audit" ("id", "runId", "actorId", "action", "fromStatus", "toStatus", "reason", "payloadJson", "createdAt")
SELECT
  'pcra_backfill_' || r."id",
  r."id",
  r."createdById",
  'legacy_backfill',
  NULL,
  r."status",
  'Additive migration backfill of legacy learning history as Run 1',
  jsonb_build_object('runCode', r."runCode"),
  CURRENT_TIMESTAMP
FROM "pedagogical_course_run" r
WHERE r."runSequence" = 1
  AND NOT EXISTS (SELECT 1 FROM "pedagogical_course_run_audit" a WHERE a."id" = 'pcra_backfill_' || r."id");
