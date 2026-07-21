-- AlterEnum
ALTER TYPE "EmployeeRole" ADD VALUE 'PROFESSOR';

-- CreateTable
CREATE TABLE "cohort" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohort_membership" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "roleInCohort" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohort_membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_data_record" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "businessKey" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "qualityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_data_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_data_audit" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_data_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_document" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "missionKey" TEXT,
    "missionAttemptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_line" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "payloadJson" JSONB NOT NULL,

    CONSTRAINT "document_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_decision" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movement" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "materialKey" TEXT NOT NULL,
    "locationKey" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "direction" TEXT NOT NULL,
    "sourceDocumentId" TEXT,
    "missionAttemptId" TEXT,
    "postingKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_posting" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "sourceDocumentId" TEXT,
    "missionAttemptId" TEXT,
    "postingKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_posting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_item" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "openAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_event" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT,
    "eventType" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_event" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "actorEmployeeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceKey" TEXT NOT NULL,
    "reason" TEXT,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_snapshot" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_definition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "moduleScope" TEXT NOT NULL,
    "passThresholdPercent" INTEGER NOT NULL DEFAULT 70,
    "maxAttempts" INTEGER NOT NULL DEFAULT 2,
    "timeLimitSeconds" INTEGER,
    "definitionJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_question" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "optionsJson" JSONB NOT NULL,
    "scoringJson" JSONB NOT NULL,

    CONSTRAINT "assessment_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_attempt" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "scorePercent" DOUBLE PRECISION,
    "responsesJson" JSONB NOT NULL DEFAULT '{}',
    "feedbackJson" JSONB,

    CONSTRAINT "assessment_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "cohortId" TEXT,
    "certificateType" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "competencySummaryJson" JSONB NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'valid',
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_audit" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "actorEmployeeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cohort_code_key" ON "cohort"("code");

-- CreateIndex
CREATE INDEX "cohort_companyId_idx" ON "cohort"("companyId");

-- CreateIndex
CREATE INDEX "cohort_membership_employeeId_idx" ON "cohort_membership"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_membership_cohortId_employeeId_key" ON "cohort_membership"("cohortId", "employeeId");

-- CreateIndex
CREATE INDEX "master_data_record_companyId_idx" ON "master_data_record"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "master_data_record_companyId_entityType_businessKey_key" ON "master_data_record"("companyId", "entityType", "businessKey");

-- CreateIndex
CREATE INDEX "master_data_audit_recordId_idx" ON "master_data_audit"("recordId");

-- CreateIndex
CREATE INDEX "business_document_companyId_idx" ON "business_document"("companyId");

-- CreateIndex
CREATE INDEX "business_document_missionKey_idx" ON "business_document"("missionKey");

-- CreateIndex
CREATE UNIQUE INDEX "business_document_companyId_documentType_documentNumber_key" ON "business_document"("companyId", "documentType", "documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "document_line_documentId_lineNumber_key" ON "document_line"("documentId", "lineNumber");

-- CreateIndex
CREATE INDEX "approval_decision_documentId_idx" ON "approval_decision"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_movement_postingKey_key" ON "inventory_movement"("postingKey");

-- CreateIndex
CREATE INDEX "inventory_movement_companyId_materialKey_locationKey_idx" ON "inventory_movement"("companyId", "materialKey", "locationKey");

-- CreateIndex
CREATE UNIQUE INDEX "financial_posting_postingKey_key" ON "financial_posting"("postingKey");

-- CreateIndex
CREATE INDEX "financial_posting_companyId_accountCode_idx" ON "financial_posting"("companyId", "accountCode");

-- CreateIndex
CREATE INDEX "open_item_companyId_status_idx" ON "open_item"("companyId", "status");

-- CreateIndex
CREATE INDEX "transaction_event_companyId_idx" ON "transaction_event"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_event_companyId_sequence_key" ON "transaction_event"("companyId", "sequence");

-- CreateIndex
CREATE INDEX "audit_event_companyId_createdAt_idx" ON "audit_event"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "simulation_snapshot_companyId_employeeId_idx" ON "simulation_snapshot"("companyId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_definition_code_key" ON "assessment_definition"("code");

-- CreateIndex
CREATE INDEX "assessment_question_assessmentId_idx" ON "assessment_question"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_question_assessmentId_questionKey_key" ON "assessment_question"("assessmentId", "questionKey");

-- CreateIndex
CREATE INDEX "assessment_attempt_employeeId_idx" ON "assessment_attempt"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_attempt_employeeId_assessmentId_attemptNumber_key" ON "assessment_attempt"("employeeId", "assessmentId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_certificateNumber_key" ON "certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "certificate_employeeId_idx" ON "certificate"("employeeId");

-- CreateIndex
CREATE INDEX "certificate_audit_certificateId_idx" ON "certificate_audit"("certificateId");

-- AddForeignKey
ALTER TABLE "cohort" ADD CONSTRAINT "cohort_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_membership" ADD CONSTRAINT "cohort_membership_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_membership" ADD CONSTRAINT "cohort_membership_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_data_record" ADD CONSTRAINT "master_data_record_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_data_audit" ADD CONSTRAINT "master_data_audit_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "master_data_record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_data_audit" ADD CONSTRAINT "master_data_audit_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_document" ADD CONSTRAINT "business_document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_line" ADD CONSTRAINT "document_line_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "business_document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decision" ADD CONSTRAINT "approval_decision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "business_document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decision" ADD CONSTRAINT "approval_decision_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "business_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_posting" ADD CONSTRAINT "financial_posting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_posting" ADD CONSTRAINT "financial_posting_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "business_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_item" ADD CONSTRAINT "open_item_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_item" ADD CONSTRAINT "open_item_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "business_document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_event" ADD CONSTRAINT "transaction_event_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_actorEmployeeId_fkey" FOREIGN KEY ("actorEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_snapshot" ADD CONSTRAINT "simulation_snapshot_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question" ADD CONSTRAINT "assessment_question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_attempt" ADD CONSTRAINT "assessment_attempt_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_attempt" ADD CONSTRAINT "assessment_attempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_audit" ADD CONSTRAINT "certificate_audit_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_audit" ADD CONSTRAINT "certificate_audit_actorEmployeeId_fkey" FOREIGN KEY ("actorEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Wave 2 catalog seed (modules M2-M6 + assessment definitions)
INSERT INTO "course_module" ("id", "courseId", "moduleCode", "title", "sequence", "createdAt", "updatedAt") VALUES
('module_m2', 'course_tec_erp_v1', 'M2', 'Module 2 — Donnees de reference et structure', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m3', 'course_tec_erp_v1', 'M3', 'Module 3 — Procure-to-Pay', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m4', 'course_tec_erp_v1', 'M4', 'Module 4 — Order-to-Cash', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m5', 'course_tec_erp_v1', 'M5', 'Module 5 — Supply Chain et inventaire', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('module_m6', 'course_tec_erp_v1', 'M6', 'Module 6 — Finance et comptabilite', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "mission_definition" ("id","moduleId","missionCode","missionKey","title","sequence","maxAttempts","passThresholdPercent","estimatedMinutes","difficulty","definitionJson","createdAt","updatedAt") VALUES
('md_m2_m01','module_m2','M2-M01','m2-m01-structurer-organisation','Structurer l organisation',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m2_m02','module_m2','M2-M02','m2-m02-creer-donnees-reference','Creer les donnees de reference essentielles',2,2,70,35,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m2_m03','module_m2','M2-M03','m2-m03-corriger-qualite-donnees','Corriger les problemes de qualite des donnees',3,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m3_m01','module_m3','M3-M01','m3-m01-identifier-besoin-achat','Identifier un besoin d achat',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m3_m02','module_m3','M3-M02','m3-m02-creer-traiter-commande-achat','Creer et traiter une commande d achat',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m3_m03','module_m3','M3-M03','m3-m03-receptionner-analyser-fournisseur','Receptionner et analyser l impact fournisseur',3,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m4_m01','module_m4','M4-M01','m4-m01-saisir-commande-institutionnelle','Saisir la commande institutionnelle',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m4_m02','module_m4','M4-M02','m4-m02-allocation-inter-entrepots','Allouer entre entrepots (DC)',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m4_m03','module_m4','M4-M03','m4-m03-confirmer-livraison-cloture','Confirmer la livraison et cloturer',3,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m5_m01','module_m5','M5-M01','m5-m01-analyser-stock-reappro','Analyser les stocks et le signal de reapprovisionnement',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m5_m02','module_m5','M5-M02','m5-m02-decision-transfert-inter-dc','Decider un transfert inter-DC',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m5_m03','module_m5','M5-M03','m5-m03-presentation-sop','Presenter la recommandation S&OP',3,2,70,40,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m6_m01','module_m6','M6-M01','m6-m01-reception-facture','Receptionner la facture fournisseur',1,2,70,30,'intro','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m6_m02','module_m6','M6-M02','m6-m02-exception-rapprochement-trois-voies','Traiter l exception de rapprochement trois voies',2,2,70,35,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('md_m6_m03','module_m6','M6-M03','m6-m03-expliquer-ecart-finance','Expliquer l ecart a la finance',3,2,70,40,'intermediate','{"source":"mission-catalog"}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "assessment_definition" ("id","code","title","moduleScope","passThresholdPercent","maxAttempts","timeLimitSeconds","definitionJson","createdAt","updatedAt") VALUES
('assess_silver_m1_m2','SILVER_M1_M2','Evaluation Silver — Modules 1 et 2','M1-M2',70,2,2700,'{"kind":"silver","modules":["M1","M2"]}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('assess_integrated_m3_m6','INTEGRATED_M3_M6','Evaluation integree — Modules 3 a 6','M3-M6',70,2,3600,'{"kind":"integrated","modules":["M3","M4","M5","M6"]}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "assessment_question" ("id","assessmentId","questionKey","sequence","type","prompt","optionsJson","scoringJson") VALUES
('aq_silver_1','assess_silver_m1_m2','silver-q1',1,'SINGLE_CHOICE','Quel est le role principal des donnees de reference ?','[{"key":"foundation","label":"Fonder les transactions"},{"key":"decoration","label":"Decorer les ecrans"}]'::jsonb,'{"maxPoints":25,"correctKeys":["foundation"]}'::jsonb),
('aq_silver_2','assess_silver_m1_m2','silver-q2',2,'SINGLE_CHOICE','Quand un partenaire est bloque, que faire ?','[{"key":"block-tx","label":"Interdire la transaction"},{"key":"force","label":"Forcer la transaction"}]'::jsonb,'{"maxPoints":25,"correctKeys":["block-tx"]}'::jsonb),
('aq_silver_3','assess_silver_m1_m2','silver-q3',3,'MULTI_CHOICE','Quels elements appartiennent a la structure organisationnelle ?','[{"key":"dc","label":"Sites/DC"},{"key":"cc","label":"Centres de couts"},{"key":"meme","label":"Meme LinkedIn"}]'::jsonb,'{"maxPoints":25,"correctKeys":["dc","cc"],"minimumSelections":2}'::jsonb),
('aq_silver_4','assess_silver_m1_m2','silver-q4',4,'SINGLE_CHOICE','Pourquoi corriger les doublons avant O2C/P2P ?','[{"key":"integrity","label":"Preserver l integrite transactionnelle"},{"key":"style","label":"Ameliorer le style graphique"}]'::jsonb,'{"maxPoints":25,"correctKeys":["integrity"]}'::jsonb),
('aq_int_1','assess_integrated_m3_m6','int-q1',1,'SINGLE_CHOICE','Quel document precede la commande d achat ?','[{"key":"pr","label":"Demande d achat"},{"key":"invoice","label":"Facture client"}]'::jsonb,'{"maxPoints":25,"correctKeys":["pr"]}'::jsonb),
('aq_int_2','assess_integrated_m3_m6','int-q2',2,'SINGLE_CHOICE','Une reception partielle de 36/40 :','[{"key":"stock36","label":"Augmente le stock de 36"},{"key":"stock40","label":"Augmente le stock de 40"}]'::jsonb,'{"maxPoints":25,"correctKeys":["stock36"]}'::jsonb),
('aq_int_3','assess_integrated_m3_m6','int-q3',3,'SINGLE_CHOICE','Le rapprochement trois voies compare :','[{"key":"po-gr-inv","label":"PO, reception et facture"},{"key":"crm","label":"CRM uniquement"}]'::jsonb,'{"maxPoints":25,"correctKeys":["po-gr-inv"]}'::jsonb),
('aq_int_4','assess_integrated_m3_m6','int-q4',4,'SINGLE_CHOICE','Un goods issue O2C :','[{"key":"stock-down","label":"Diminue le stock"},{"key":"stock-up","label":"Augmente le stock"}]'::jsonb,'{"maxPoints":25,"correctKeys":["stock-down"]}'::jsonb);
