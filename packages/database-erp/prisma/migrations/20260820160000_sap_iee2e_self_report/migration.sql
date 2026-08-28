-- CreateTable
CREATE TABLE "sap_iee2e_self_report" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "currentUnit" INTEGER NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "sapAccess" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT '',
    "needsSupport" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT NOT NULL DEFAULT '',
    "achievement" TEXT NOT NULL,
    "unitsJson" JSONB NOT NULL,
    "lastDeclaredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sap_iee2e_self_report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sap_iee2e_self_report_employeeId_key" ON "sap_iee2e_self_report"("employeeId");

-- CreateIndex
CREATE INDEX "sap_iee2e_self_report_needsSupport_idx" ON "sap_iee2e_self_report"("needsSupport");

-- AddForeignKey
ALTER TABLE "sap_iee2e_self_report" ADD CONSTRAINT "sap_iee2e_self_report_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
