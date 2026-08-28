import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import type { SapIee2eDeclaredUnit } from "@tec-platform/contracts";

import { parseSemaineZero } from "./sap-iee2e.catalog.js";
import {
  isAccess,
  isAchievement,
  isUnitStatus,
  type SapIee2eSelfReportRecord,
  type SapIee2eSelfReportRepository,
} from "./sap-iee2e.types.js";

function parseUnits(value: Prisma.JsonValue): SapIee2eDeclaredUnit[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const units: SapIee2eDeclaredUnit[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      continue;
    }
    const record = item as Record<string, unknown>;
    const unitNumber = Number(record.unitNumber);
    const status = typeof record.status === "string" ? record.status : "";
    if (!Number.isInteger(unitNumber) || !isUnitStatus(status)) {
      continue;
    }
    units.push({ unitNumber, status });
  }
  return units;
}

function mapRecord(row: {
  employeeId: string;
  currentUnit: number;
  sessionNumber: number;
  sapAccess: string;
  difficulty: string;
  needsSupport: boolean;
  note: string;
  achievement: string;
  unitsJson: Prisma.JsonValue;
  semaineZeroJson?: Prisma.JsonValue;
  lastDeclaredAt: Date;
}): SapIee2eSelfReportRecord | null {
  if (!isAccess(row.sapAccess) || !isAchievement(row.achievement)) {
    return null;
  }
  return {
    employeeId: row.employeeId,
    currentUnit: row.currentUnit,
    sessionNumber: row.sessionNumber,
    sapAccess: row.sapAccess,
    difficulty: row.difficulty,
    needsSupport: row.needsSupport,
    note: row.note,
    achievement: row.achievement,
    units: parseUnits(row.unitsJson),
    semaineZero: parseSemaineZero(row.semaineZeroJson),
    lastDeclaredAt: row.lastDeclaredAt,
  };
}

export function createPrismaSapIee2eSelfReportRepository(): SapIee2eSelfReportRepository {
  return {
    async findByEmployeeId(employeeId) {
      const prisma = getPrismaClient();
      const row = await prisma.sapIee2eSelfReport.findUnique({ where: { employeeId } });
      return row ? mapRecord(row) : null;
    },

    async upsert(record) {
      const prisma = getPrismaClient();
      const row = await prisma.sapIee2eSelfReport.upsert({
        where: { employeeId: record.employeeId },
        create: {
          employeeId: record.employeeId,
          currentUnit: record.currentUnit,
          sessionNumber: record.sessionNumber,
          sapAccess: record.sapAccess,
          difficulty: record.difficulty,
          needsSupport: record.needsSupport,
          note: record.note,
          achievement: record.achievement,
          unitsJson: record.units as unknown as Prisma.InputJsonValue,
          semaineZeroJson: record.semaineZero as unknown as Prisma.InputJsonValue,
          lastDeclaredAt: record.lastDeclaredAt,
        },
        update: {
          currentUnit: record.currentUnit,
          sessionNumber: record.sessionNumber,
          sapAccess: record.sapAccess,
          difficulty: record.difficulty,
          needsSupport: record.needsSupport,
          note: record.note,
          achievement: record.achievement,
          unitsJson: record.units as unknown as Prisma.InputJsonValue,
          semaineZeroJson: record.semaineZero as unknown as Prisma.InputJsonValue,
          lastDeclaredAt: record.lastDeclaredAt,
        },
      });
      const mapped = mapRecord(row);
      if (!mapped) {
        throw new Error("SAP IEE2E self-report persisté invalide.");
      }
      return mapped;
    },

    async findByEmployeeIds(employeeIds) {
      if (employeeIds.length === 0) {
        return [];
      }
      const prisma = getPrismaClient();
      const rows = await prisma.sapIee2eSelfReport.findMany({
        where: { employeeId: { in: [...employeeIds] } },
      });
      return rows
        .map((row) => mapRecord(row))
        .filter((row): row is SapIee2eSelfReportRecord => row !== null);
    },

    async listVisibleStudents(professorId) {
      const prisma = getPrismaClient();
      const professorMemberships = await prisma.cohortMembership.findMany({
        where: { employeeId: professorId, roleInCohort: "professor" },
        select: { cohortId: true },
      });
      const cohortIds = professorMemberships.map((membership) => membership.cohortId);
      if (cohortIds.length === 0) {
        return [];
      }
      const studentMemberships = await prisma.cohortMembership.findMany({
        where: { cohortId: { in: cohortIds }, roleInCohort: "student" },
        include: { employee: { select: { id: true, displayName: true } } },
      });
      const unique = new Map<string, { employeeId: string; displayName: string }>();
      for (const membership of studentMemberships) {
        unique.set(membership.employee.id, {
          employeeId: membership.employee.id,
          displayName: membership.employee.displayName,
        });
      }
      return [...unique.values()];
    },

    async findProfessorIdForStudent(studentId) {
      const prisma = getPrismaClient();
      const studentMemberships = await prisma.cohortMembership.findMany({
        where: { employeeId: studentId, roleInCohort: "student" },
        select: { cohortId: true },
      });
      const cohortIds = studentMemberships.map((membership) => membership.cohortId);
      if (cohortIds.length === 0) {
        return null;
      }
      const professorMembership = await prisma.cohortMembership.findFirst({
        where: { cohortId: { in: cohortIds }, roleInCohort: "professor" },
        select: { employeeId: true },
      });
      return professorMembership?.employeeId ?? null;
    },

    async findCalendarByProfessorId(professorId) {
      const prisma = getPrismaClient();
      const row = await prisma.sapIee2eTeachingCalendar.findUnique({
        where: { professorId },
      });
      return row?.session1At ?? null;
    },

    async upsertCalendar(professorId, session1At) {
      const prisma = getPrismaClient();
      const row = await prisma.sapIee2eTeachingCalendar.upsert({
        where: { professorId },
        create: { professorId, session1At },
        update: { session1At },
      });
      return row.session1At;
    },
  };
}
