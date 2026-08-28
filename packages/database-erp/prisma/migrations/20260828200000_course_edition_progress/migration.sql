-- CreateTable
CREATE TABLE "course_edition_progress" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "moduleCode" TEXT NOT NULL,
    "progressJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_edition_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_edition_progress_employeeId_moduleCode_key" ON "course_edition_progress"("employeeId", "moduleCode");

-- CreateIndex
CREATE INDEX "course_edition_progress_employeeId_idx" ON "course_edition_progress"("employeeId");

-- AddForeignKey
ALTER TABLE "course_edition_progress" ADD CONSTRAINT "course_edition_progress_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
