-- AlterTable
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "currentStageCode" TEXT NOT NULL DEFAULT 'S1';
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "institutionalStatus" TEXT NOT NULL DEFAULT 'not_started';
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "stagesJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "evidenceJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "startedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "sap_iee2e_self_report_institutionalStatus_idx" ON "sap_iee2e_self_report"("institutionalStatus");

-- CreateTable
CREATE TABLE "sap_iee2e_professor_note" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "studentEmployeeId" TEXT NOT NULL,
    "stageCode" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sap_iee2e_professor_note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sap_iee2e_professor_note_studentEmployeeId_idx" ON "sap_iee2e_professor_note"("studentEmployeeId");

-- CreateIndex
CREATE INDEX "sap_iee2e_professor_note_professorId_idx" ON "sap_iee2e_professor_note"("professorId");

-- AddForeignKey
ALTER TABLE "sap_iee2e_professor_note" ADD CONSTRAINT "sap_iee2e_professor_note_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sap_iee2e_professor_note" ADD CONSTRAINT "sap_iee2e_professor_note_studentEmployeeId_fkey" FOREIGN KEY ("studentEmployeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "external_program_assignment" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "programCode" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "institutionalStatus" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_program_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_program_assignment_cohortId_programCode_key" ON "external_program_assignment"("cohortId", "programCode");

-- CreateIndex
CREATE INDEX "external_program_assignment_programCode_idx" ON "external_program_assignment"("programCode");

-- AddForeignKey
ALTER TABLE "external_program_assignment" ADD CONSTRAINT "external_program_assignment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
