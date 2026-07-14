-- RC01 Slice D — additive mission attempt state for enterprise discovery.
-- Rollback thinking: DROP TABLE IF EXISTS "employee_mission_attempt"; (validation only; no production).

CREATE TABLE "employee_mission_attempt" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "acknowledgedInputKeys" JSONB NOT NULL DEFAULT '[]',
    "departmentProblemMappings" JSONB NOT NULL DEFAULT '[]',
    "justification" TEXT,
    "feedbackKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_mission_attempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "employee_mission_attempt_employeeId_missionKey_key" ON "employee_mission_attempt"("employeeId", "missionKey");

CREATE INDEX "employee_mission_attempt_employeeId_idx" ON "employee_mission_attempt"("employeeId");

ALTER TABLE "employee_mission_attempt" ADD CONSTRAINT "employee_mission_attempt_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
