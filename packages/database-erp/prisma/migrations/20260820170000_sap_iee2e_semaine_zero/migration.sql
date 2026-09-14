-- AlterTable
ALTER TABLE "sap_iee2e_self_report" ADD COLUMN "semaineZeroJson" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "sap_iee2e_teaching_calendar" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "session1At" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sap_iee2e_teaching_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sap_iee2e_teaching_calendar_professorId_key" ON "sap_iee2e_teaching_calendar"("professorId");

-- AddForeignKey
ALTER TABLE "sap_iee2e_teaching_calendar" ADD CONSTRAINT "sap_iee2e_teaching_calendar_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
