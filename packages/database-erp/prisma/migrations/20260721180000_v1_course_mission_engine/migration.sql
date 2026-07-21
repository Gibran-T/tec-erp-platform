-- V1 Course + Mission Engine foundation (additive).
-- Preserves employee_mission_attempt; migrates M1-M01 evidence into mission_attempt.

CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "course_code_key" ON "course"("code");

CREATE TABLE "course_module" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "moduleCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_module_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "course_module_moduleCode_key" ON "course_module"("moduleCode");
CREATE INDEX "course_module_courseId_idx" ON "course_module"("courseId");

ALTER TABLE "course_module" ADD CONSTRAINT "course_module_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "mission_definition" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "missionCode" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 2,
    "passThresholdPercent" INTEGER NOT NULL DEFAULT 70,
    "estimatedMinutes" INTEGER,
    "difficulty" TEXT,
    "definitionJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_definition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mission_definition_missionCode_key" ON "mission_definition"("missionCode");
CREATE UNIQUE INDEX "mission_definition_missionKey_key" ON "mission_definition"("missionKey");
CREATE INDEX "mission_definition_moduleId_idx" ON "mission_definition"("moduleId");

ALTER TABLE "mission_definition" ADD CONSTRAINT "mission_definition_moduleId_fkey"
  FOREIGN KEY ("moduleId") REFERENCES "course_module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "competency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "competency_code_key" ON "competency"("code");

CREATE TABLE "mission_competency" (
    "id" TEXT NOT NULL,
    "missionDefinitionId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "mission_competency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mission_competency_missionDefinitionId_competencyId_key"
  ON "mission_competency"("missionDefinitionId", "competencyId");
CREATE INDEX "mission_competency_missionDefinitionId_idx" ON "mission_competency"("missionDefinitionId");
CREATE INDEX "mission_competency_competencyId_idx" ON "mission_competency"("competencyId");

ALTER TABLE "mission_competency" ADD CONSTRAINT "mission_competency_missionDefinitionId_fkey"
  FOREIGN KEY ("missionDefinitionId") REFERENCES "mission_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mission_competency" ADD CONSTRAINT "mission_competency_competencyId_fkey"
  FOREIGN KEY ("competencyId") REFERENCES "competency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "employee_course_progress" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "percentComplete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_course_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "employee_course_progress_employeeId_courseId_key"
  ON "employee_course_progress"("employeeId", "courseId");
CREATE INDEX "employee_course_progress_employeeId_idx" ON "employee_course_progress"("employeeId");
CREATE INDEX "employee_course_progress_courseId_idx" ON "employee_course_progress"("courseId");

ALTER TABLE "employee_course_progress" ADD CONSTRAINT "employee_course_progress_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_course_progress" ADD CONSTRAINT "employee_course_progress_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "employee_module_progress" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "percentComplete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_module_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "employee_module_progress_employeeId_moduleId_key"
  ON "employee_module_progress"("employeeId", "moduleId");
CREATE INDEX "employee_module_progress_employeeId_idx" ON "employee_module_progress"("employeeId");
CREATE INDEX "employee_module_progress_moduleId_idx" ON "employee_module_progress"("moduleId");

ALTER TABLE "employee_module_progress" ADD CONSTRAINT "employee_module_progress_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_module_progress" ADD CONSTRAINT "employee_module_progress_moduleId_fkey"
  FOREIGN KEY ("moduleId") REFERENCES "course_module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "mission_attempt" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "missionDefinitionId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "responsesJson" JSONB NOT NULL DEFAULT '{}',
    "scorePercent" DOUBLE PRECISION,
    "earnedPoints" DOUBLE PRECISION,
    "maxPoints" DOUBLE PRECISION,
    "feedbackJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_attempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mission_attempt_employeeId_missionDefinitionId_attemptNumber_key"
  ON "mission_attempt"("employeeId", "missionDefinitionId", "attemptNumber");
CREATE INDEX "mission_attempt_employeeId_idx" ON "mission_attempt"("employeeId");
CREATE INDEX "mission_attempt_missionDefinitionId_idx" ON "mission_attempt"("missionDefinitionId");

ALTER TABLE "mission_attempt" ADD CONSTRAINT "mission_attempt_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mission_attempt" ADD CONSTRAINT "mission_attempt_missionDefinitionId_fkey"
  FOREIGN KEY ("missionDefinitionId") REFERENCES "mission_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "mission_evidence" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_evidence_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "mission_evidence_attemptId_idx" ON "mission_evidence"("attemptId");

ALTER TABLE "mission_evidence" ADD CONSTRAINT "mission_evidence_attemptId_fkey"
  FOREIGN KEY ("attemptId") REFERENCES "mission_attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "unlock_state" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceKey" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unlock_state_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "unlock_state_employeeId_resourceType_resourceKey_key"
  ON "unlock_state"("employeeId", "resourceType", "resourceKey");
CREATE INDEX "unlock_state_employeeId_idx" ON "unlock_state"("employeeId");

ALTER TABLE "unlock_state" ADD CONSTRAINT "unlock_state_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "feedback_record" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_record_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "feedback_record_attemptId_idx" ON "feedback_record"("attemptId");

ALTER TABLE "feedback_record" ADD CONSTRAINT "feedback_record_attemptId_fkey"
  FOREIGN KEY ("attemptId") REFERENCES "mission_attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed course / module / mission definitions (content authoritative in mission-catalog).
INSERT INTO "course" ("id", "code", "title", "version", "createdAt", "updatedAt")
VALUES (
  'course_tec_erp_v1',
  'TEC_ERP_V1',
  'TEC.ERP — Analyste ERP et processus d''affaires',
  '1.0.0',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO "course_module" ("id", "courseId", "moduleCode", "title", "sequence", "createdAt", "updatedAt")
VALUES (
  'module_m1',
  'course_tec_erp_v1',
  'M1',
  'Module 1 — Découverte organisationnelle',
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO "mission_definition" (
  "id", "moduleId", "missionCode", "missionKey", "title", "sequence",
  "maxAttempts", "passThresholdPercent", "estimatedMinutes", "difficulty",
  "definitionJson", "createdAt", "updatedAt"
) VALUES
(
  'md_m1_m01',
  'module_m1',
  'M1-M01',
  'm1-m01-decouvrir-entreprise',
  'Découvrir l''entreprise',
  1,
  2,
  70,
  25,
  'intro',
  '{"source":"mission-catalog","stub":true}'::jsonb,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'md_m1_m02',
  'module_m1',
  'M1-M02',
  'm1-m02-connecter-departements',
  'Connecter les départements',
  2,
  2,
  70,
  30,
  'intro',
  '{"source":"mission-catalog","stub":true}'::jsonb,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'md_m1_m03',
  'module_m1',
  'M1-M03',
  'm1-m03-diagnostiquer-preparation',
  'Diagnostiquer la préparation',
  3,
  2,
  70,
  35,
  'intermediate',
  '{"source":"mission-catalog","stub":true}'::jsonb,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO "competency" ("id", "code", "name", "description", "createdAt", "updatedAt")
VALUES
(
  'comp_c_org_01',
  'C-ORG-01',
  'Lecture organisationnelle',
  'Comprendre la structure et la circulation de l''information dans l''entreprise.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'comp_c_bus_01',
  'C-BUS-01',
  'Diagnostic d''affaires',
  'Relier signaux opérationnels à des problèmes d''affaires transverses.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO "mission_competency" ("id", "missionDefinitionId", "competencyId", "weight")
VALUES
('mc_m01_org', 'md_m1_m01', 'comp_c_org_01', 1),
('mc_m01_bus', 'md_m1_m01', 'comp_c_bus_01', 1),
('mc_m02_org', 'md_m1_m02', 'comp_c_org_01', 1),
('mc_m02_bus', 'md_m1_m02', 'comp_c_bus_01', 1),
('mc_m03_org', 'md_m1_m03', 'comp_c_org_01', 1),
('mc_m03_bus', 'md_m1_m03', 'comp_c_bus_01', 1);

-- Migrate existing M1-M01 rows into mission_attempt (attemptNumber = 1).
INSERT INTO "mission_attempt" (
  "id",
  "employeeId",
  "missionDefinitionId",
  "attemptNumber",
  "status",
  "startedAt",
  "submittedAt",
  "completedAt",
  "responsesJson",
  "scorePercent",
  "earnedPoints",
  "maxPoints",
  "feedbackJson",
  "createdAt",
  "updatedAt"
)
SELECT
  'migrated_' || ema."id",
  ema."employeeId",
  'md_m1_m01',
  1,
  CASE
    WHEN ema."status" = 'completed' THEN 'completed'
    ELSE 'in_progress'
  END,
  ema."startedAt",
  CASE WHEN ema."status" = 'completed' THEN ema."completedAt" ELSE NULL END,
  ema."completedAt",
  jsonb_build_object(
    'legacy', true,
    'acknowledgedInputKeys', COALESCE(ema."acknowledgedInputKeys", '[]'::jsonb),
    'departmentProblemMappings', COALESCE(ema."departmentProblemMappings", '[]'::jsonb),
    'justification', ema."justification",
    'feedbackKey', ema."feedbackKey"
  ),
  CASE WHEN ema."status" = 'completed' THEN 100 ELSE NULL END,
  CASE WHEN ema."status" = 'completed' THEN 100 ELSE NULL END,
  CASE WHEN ema."status" = 'completed' THEN 100 ELSE NULL END,
  CASE
    WHEN ema."feedbackKey" IS NOT NULL THEN jsonb_build_object('feedbackKey', ema."feedbackKey")
    ELSE NULL
  END,
  ema."createdAt",
  ema."updatedAt"
FROM "employee_mission_attempt" ema
WHERE ema."missionKey" = 'm1-m01-decouvrir-entreprise'
ON CONFLICT DO NOTHING;

-- Unlock next mission for employees who already completed M1-M01.
INSERT INTO "unlock_state" ("id", "employeeId", "resourceType", "resourceKey", "unlockedAt", "createdAt")
SELECT
  'unlock_m02_' || ema."employeeId",
  ema."employeeId",
  'mission',
  'm1-m02-connecter-departements',
  COALESCE(ema."completedAt", CURRENT_TIMESTAMP),
  CURRENT_TIMESTAMP
FROM "employee_mission_attempt" ema
WHERE ema."missionKey" = 'm1-m01-decouvrir-entreprise'
  AND ema."status" = 'completed'
ON CONFLICT DO NOTHING;
