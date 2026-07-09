-- CreateTable
CREATE TABLE "employee_message_state" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "messageKey" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_message_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_task_state" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "taskKey" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_task_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_message_state_employeeId_idx" ON "employee_message_state"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_message_state_employeeId_messageKey_key" ON "employee_message_state"("employeeId", "messageKey");

-- CreateIndex
CREATE INDEX "employee_task_state_employeeId_idx" ON "employee_task_state"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_task_state_employeeId_taskKey_key" ON "employee_task_state"("employeeId", "taskKey");

-- AddForeignKey
ALTER TABLE "employee_message_state" ADD CONSTRAINT "employee_message_state_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_task_state" ADD CONSTRAINT "employee_task_state_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
