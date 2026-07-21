-- AlterEnum
ALTER TYPE "EmployeeRole" ADD VALUE 'ADMIN';

-- CreateTable
CREATE TABLE "company_configuration" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "settingsJson" JSONB NOT NULL DEFAULT '{}',
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_definition" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "layoutJson" JSONB NOT NULL DEFAULT '{}',
    "kpiKeys" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_formula_version" (
    "id" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "formulaJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_formula_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_record" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "stale" BOOLEAN NOT NULL DEFAULT false,
    "snapshotJson" JSONB NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_policy" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "policyJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interaction" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "refused" BOOLEAN NOT NULL DEFAULT false,
    "metadataJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_record" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "professorId" TEXT,
    "modelVersion" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prediction_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capstone_submission" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL DEFAULT 'm10-m03-presentation-capstone-or',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "diagnose" TEXT,
    "prioritize" TEXT,
    "execute" TEXT,
    "analyze" TEXT,
    "recommend" TEXT,
    "executiveSummary" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewStatus" TEXT,
    "professorApproved" BOOLEAN NOT NULL DEFAULT false,
    "professorNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capstone_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capstone_evidence" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capstone_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_draft" (
    "id" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL,
    "authorEmployeeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "draftJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_version" (
    "id" TEXT NOT NULL,
    "draftId" TEXT,
    "missionKey" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "definitionJson" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "publishedByEmployeeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',

    CONSTRAINT "mission_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_publication" (
    "id" TEXT NOT NULL,
    "missionVersionId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorEmployeeId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scenario_publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_connection" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "adapterKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "secretRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_run" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "resultJson" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "integration_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_event" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rule" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_execution" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "companyId" TEXT,
    "employeeId" TEXT,
    "status" TEXT NOT NULL,
    "resultJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_verification_token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_verification_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "companyId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_configuration_companyId_key" ON "company_configuration"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_definition_key_key" ON "dashboard_definition"("key");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_formula_version_kpiKey_version_key" ON "kpi_formula_version"("kpiKey", "version");

-- CreateIndex
CREATE INDEX "kpi_record_companyId_kpiKey_recordedAt_idx" ON "kpi_record"("companyId", "kpiKey", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_policy_companyId_key" ON "ai_policy"("companyId");

-- CreateIndex
CREATE INDEX "ai_interaction_employeeId_createdAt_idx" ON "ai_interaction"("employeeId", "createdAt");

-- CreateIndex
CREATE INDEX "prediction_record_studentId_createdAt_idx" ON "prediction_record"("studentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "capstone_submission_employeeId_key" ON "capstone_submission"("employeeId");

-- CreateIndex
CREATE INDEX "capstone_evidence_submissionId_idx" ON "capstone_evidence"("submissionId");

-- CreateIndex
CREATE INDEX "mission_draft_missionKey_idx" ON "mission_draft"("missionKey");

-- CreateIndex
CREATE UNIQUE INDEX "mission_version_missionKey_versionNumber_key" ON "mission_version"("missionKey", "versionNumber");

-- CreateIndex
CREATE INDEX "scenario_publication_missionVersionId_idx" ON "scenario_publication"("missionVersionId");

-- CreateIndex
CREATE INDEX "integration_connection_companyId_idx" ON "integration_connection"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "integration_run_idempotencyKey_key" ON "integration_run"("idempotencyKey");

-- CreateIndex
CREATE INDEX "integration_run_connectionId_startedAt_idx" ON "integration_run"("connectionId", "startedAt");

-- CreateIndex
CREATE INDEX "integration_event_runId_idx" ON "integration_event"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "automation_rule_key_key" ON "automation_rule"("key");

-- CreateIndex
CREATE INDEX "automation_execution_ruleId_createdAt_idx" ON "automation_execution"("ruleId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "public_verification_token_tokenHash_key" ON "public_verification_token"("tokenHash");

-- CreateIndex
CREATE INDEX "public_verification_token_certificateId_idx" ON "public_verification_token"("certificateId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_key_companyId_key" ON "feature_flag"("key", "companyId");

-- AddForeignKey
ALTER TABLE "company_configuration" ADD CONSTRAINT "company_configuration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_record" ADD CONSTRAINT "kpi_record_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_policy" ADD CONSTRAINT "ai_policy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_interaction" ADD CONSTRAINT "ai_interaction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_interaction" ADD CONSTRAINT "ai_interaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction_record" ADD CONSTRAINT "prediction_record_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capstone_submission" ADD CONSTRAINT "capstone_submission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capstone_evidence" ADD CONSTRAINT "capstone_evidence_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "capstone_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_draft" ADD CONSTRAINT "mission_draft_authorEmployeeId_fkey" FOREIGN KEY ("authorEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_version" ADD CONSTRAINT "mission_version_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "mission_draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_version" ADD CONSTRAINT "mission_version_publishedByEmployeeId_fkey" FOREIGN KEY ("publishedByEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_publication" ADD CONSTRAINT "scenario_publication_missionVersionId_fkey" FOREIGN KEY ("missionVersionId") REFERENCES "mission_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_publication" ADD CONSTRAINT "scenario_publication_actorEmployeeId_fkey" FOREIGN KEY ("actorEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_connection" ADD CONSTRAINT "integration_connection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_run" ADD CONSTRAINT "integration_run_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "integration_connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_event" ADD CONSTRAINT "integration_event_runId_fkey" FOREIGN KEY ("runId") REFERENCES "integration_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_execution" ADD CONSTRAINT "automation_execution_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_execution" ADD CONSTRAINT "automation_execution_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_verification_token" ADD CONSTRAINT "public_verification_token_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag" ADD CONSTRAINT "feature_flag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Wave 3 catalog seed (modules M7-M10 + mission definitions)
INSERT INTO "course_module" ("id", "courseId", "moduleCode", "title", "sequence", "createdAt", "updatedAt") VALUES
('module_m7', 'course_tec_erp_v1', 'M7', 'Module 7 — CRM et service client', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m8', 'course_tec_erp_v1', 'M8', 'Module 8 — Gouvernance et conformite', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m9', 'course_tec_erp_v1', 'M9', 'Module 9 — BI et intelligence artificielle', 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m10', 'course_tec_erp_v1', 'M10', 'Module 10 — Capstone Equinoxe', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "mission_definition" ("id","moduleId","missionCode","missionKey","title","sequence","maxAttempts","passThresholdPercent","estimatedMinutes","difficulty","definitionJson","createdAt","updatedAt") VALUES
('md_m7_m01','module_m7','M7-M01','m7-m01-ouvrir-dossier-client','Ouvrir le dossier client',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m7_m02','module_m7','M7-M02','m7-m02-coordonner-escalade','Coordonner l escalade',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m7_m03','module_m7','M7-M03','m7-m03-cloturer-cas-nps','Cloturer le cas et recuperer le NPS',3,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m8_m01','module_m8','M8-M01','m8-m01-matrice-approbation-pression','Matrice d approbation sous pression',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m8_m02','module_m8','M8-M02','m8-m02-revue-acces-sod','Revue d acces et segregation des taches',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m8_m03','module_m8','M8-M03','m8-m03-autoevaluation-probation','Autoevaluation de probation',3,2,70,40,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m9_m01','module_m9','M9-M01','m9-m01-atelier-definition-kpi','Atelier de definition des KPI',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m9_m02','module_m9','M9-M02','m9-m02-tableau-bord-comite','Tableau de bord comite de pilotage',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m9_m03','module_m9','M9-M03','m9-m03-analyse-concurrentielle-ia','Analyse concurrentielle et IA',3,2,70,40,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m10_m01','module_m10','M10-M01','m10-m01-diapositive-conseil','Diapositive conseil d administration',1,2,70,35,'advanced','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m10_m02','module_m10','M10-M02','m10-m02-defi-final-equinoxe','Defi final Equinoxe',2,2,70,45,'advanced','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m10_m03','module_m10','M10-M03','m10-m03-presentation-capstone-or','Presentation capstone et certification Or',3,2,70,50,'advanced','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "assessment_definition" ("id","code","title","moduleScope","passThresholdPercent","maxAttempts","timeLimitSeconds","definitionJson","createdAt","updatedAt") VALUES
('assess_gold_m7_m10','GOLD_M7_M10','Evaluation Gold — Modules 7 a 10','M7-M10',70,2,3600,'{"kind":"gold","modules":["M7","M8","M9","M10"]}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "assessment_question" ("id","assessmentId","questionKey","sequence","type","prompt","optionsJson","scoringJson") VALUES
('aq_gold_1','assess_gold_m7_m10','gold-q1',1,'SINGLE_CHOICE','Quel est l objectif principal d un dossier CRM escalade ?','[{"key":"retention","label":"Preserver la relation institutionnelle"},{"key":"speed-only","label":"Clore rapidement sans suivi"}]'::jsonb,'{"maxPoints":25,"correctKeys":["retention"]}'::jsonb),
('aq_gold_2','assess_gold_m7_m10','gold-q2',2,'SINGLE_CHOICE','La segregation des taches (SoD) vise surtout a :','[{"key":"fraud-prevention","label":"Prevenir les conflits d interets et la fraude"},{"key":"ui-speed","label":"Accelerer la saisie ecran"}]'::jsonb,'{"maxPoints":25,"correctKeys":["fraud-prevention"]}'::jsonb),
('aq_gold_3','assess_gold_m7_m10','gold-q3',3,'MULTI_CHOICE','Quels elements appartiennent a un tableau de bord decisionnel ?','[{"key":"kpi","label":"KPI relies a une decision"},{"key":"lineage","label":"Lignee des donnees"},{"key":"decoration","label":"Decoration visuelle seule"}]'::jsonb,'{"maxPoints":25,"correctKeys":["kpi","lineage"],"minimumSelections":2}'::jsonb),
('aq_gold_4','assess_gold_m7_m10','gold-q4',4,'SINGLE_CHOICE','Le capstone Equinoxe exige surtout :','[{"key":"integration","label":"Integrer P2P, O2C, stock, finance et CRM"},{"key":"single-module","label":"Optimiser un seul module isole"}]'::jsonb,'{"maxPoints":25,"correctKeys":["integration"]}'::jsonb);

INSERT INTO "dashboard_definition" ("id","key","title","description","category","layoutJson","kpiKeys","createdAt","updatedAt") VALUES
('dash_executive','dashboard-executive','Tableau de bord executif','Vue synthese pour le comite de direction','executive','{"columns":2}'::jsonb,'["otif","margin","exceptionRate"]'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dash_operational','dashboard-operational','Tableau de bord operationnel','Indicateurs operationnels entrepots et livraisons','operational','{"columns":3}'::jsonb,'["otif","fillRate","exceptionRate"]'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dash_financial','dashboard-financial','Tableau de bord financier','Marge, qualite des donnees et exceptions comptables','financial','{"columns":2}'::jsonb,'["margin","dataQuality","exceptionRate"]'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "kpi_formula_version" ("id","kpiKey","version","formulaJson","createdAt") VALUES
('kfv_otif_v1','otif',1,'{"numerator":"onTimeDeliveries","denominator":"totalDeliveries"}'::jsonb,CURRENT_TIMESTAMP),
('kfv_fill_v1','fillRate',1,'{"numerator":"filledLines","denominator":"requestedLines"}'::jsonb,CURRENT_TIMESTAMP),
('kfv_margin_v1','margin',1,'{"numerator":"grossMargin","denominator":"revenue"}'::jsonb,CURRENT_TIMESTAMP),
('kfv_exception_v1','exceptionRate',1,'{"numerator":"exceptions","denominator":"documents"}'::jsonb,CURRENT_TIMESTAMP),
('kfv_dq_v1','dataQuality',1,'{"numerator":"qualitySum","denominator":"records"}'::jsonb,CURRENT_TIMESTAMP);

INSERT INTO "automation_rule" ("id","key","name","description","enabled","configJson","createdAt","updatedAt") VALUES
('auto_notify_failure','notify_professor_repeated_failure','Notifier echecs repetes','Alerte professeur apres echecs repetes de mission',true,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('auto_flag_dq','flag_data_quality','Signaler qualite des donnees','Signale une baisse de qualite des donnees de reference',true,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('auto_cert_notify','certificate_eligibility_notify','Notifier eligibilite certificat','Notifie lorsqu un etudiant devient eligible Gold',true,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
