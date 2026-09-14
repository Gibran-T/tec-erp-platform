import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import type { SapIee2eDeclaredUnit, SapSuiteE2eStageCode } from "@tec-platform/contracts";

import {
  isInstitutionalStatus,
  isStageCode,
  parseEvidence,
  parseSemaineZero,
  parseStages,
} from "./sap-iee2e.catalog.js";
import {
  isAccess,
  isAchievement,
  isUnitStatus,
  type SapIee2eProgramAssignmentRecord,
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
  currentStageCode?: string;
  institutionalStatus?: string;
  sapAccess: string;
  difficulty: string;
  needsSupport: boolean;
  note: string;
  achievement: string;
  unitsJson: Prisma.JsonValue;
  stagesJson?: Prisma.JsonValue;
  evidenceJson?: Prisma.JsonValue;
  semaineZeroJson?: Prisma.JsonValue;
  startedAt?: Date | null;
  lastDeclaredAt: Date;
}): SapIee2eSelfReportRecord | null {
  if (!isAccess(row.sapAccess) || !isAchievement(row.achievement)) {
    return null;
  }
  const stageCode = row.currentStageCode && isStageCode(row.currentStageCode) ? row.currentStageCode : "S1";
  const institutionalStatus =
    row.institutionalStatus && isInstitutionalStatus(row.institutionalStatus)
      ? row.institutionalStatus
      : "not_started";
  return {
    employeeId: row.employeeId,
    currentUnit: row.currentUnit,
    sessionNumber: row.sessionNumber,
    currentStageCode: stageCode,
    institutionalStatus,
    sapAccess: row.sapAccess,
    difficulty: row.difficulty,
    needsSupport: row.needsSupport,
    note: row.note,
    achievement: row.achievement,
    units: parseUnits(row.unitsJson),
    stages: parseStages(row.stagesJson),
    evidence: parseEvidence(row.evidenceJson),
    semaineZero: parseSemaineZero(row.semaineZeroJson),
    startedAt: row.startedAt ?? null,
    lastDeclaredAt: row.lastDeclaredAt,
  };
}

async function resolveVisibleCohortIds(actorId: string): Promise<string[]> {
  const prisma = getPrismaClient();
  const actor = await prisma.employee.findUnique({
    where: { id: actorId },
    select: { id: true, role: true, companyId: true },
  });
  if (!actor) {
    return [];
  }
  if (actor.role === "ADMIN") {
    const cohorts = await prisma.cohort.findMany({
      where: { companyId: actor.companyId },
      select: { id: true },
    });
    return cohorts.map((cohort) => cohort.id);
  }
  const professorMemberships = await prisma.cohortMembership.findMany({
    where: { employeeId: actorId, roleInCohort: "professor" },
    select: { cohortId: true },
  });
  return professorMemberships.map((membership) => membership.cohortId);
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
          currentStageCode: record.currentStageCode,
          institutionalStatus: record.institutionalStatus,
          sapAccess: record.sapAccess,
          difficulty: record.difficulty,
          needsSupport: record.needsSupport,
          note: record.note,
          achievement: record.achievement,
          unitsJson: record.units as unknown as Prisma.InputJsonValue,
          stagesJson: record.stages as unknown as Prisma.InputJsonValue,
          evidenceJson: record.evidence as unknown as Prisma.InputJsonValue,
          semaineZeroJson: record.semaineZero as unknown as Prisma.InputJsonValue,
          startedAt: record.startedAt,
          lastDeclaredAt: record.lastDeclaredAt,
        },
        update: {
          currentUnit: record.currentUnit,
          sessionNumber: record.sessionNumber,
          currentStageCode: record.currentStageCode,
          institutionalStatus: record.institutionalStatus,
          sapAccess: record.sapAccess,
          difficulty: record.difficulty,
          needsSupport: record.needsSupport,
          note: record.note,
          achievement: record.achievement,
          unitsJson: record.units as unknown as Prisma.InputJsonValue,
          stagesJson: record.stages as unknown as Prisma.InputJsonValue,
          evidenceJson: record.evidence as unknown as Prisma.InputJsonValue,
          semaineZeroJson: record.semaineZero as unknown as Prisma.InputJsonValue,
          startedAt: record.startedAt,
          lastDeclaredAt: record.lastDeclaredAt,
        },
      });
      const mapped = mapRecord(row);
      if (!mapped) {
        throw new Error("SAP Suite self-report persisté invalide.");
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

    async listVisibleStudents(actorId) {
      const prisma = getPrismaClient();
      const cohortIds = await resolveVisibleCohortIds(actorId);
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

    async listVisibleCohorts(actorId) {
      const prisma = getPrismaClient();
      const cohortIds = await resolveVisibleCohortIds(actorId);
      if (cohortIds.length === 0) {
        return [];
      }
      const cohorts = await prisma.cohort.findMany({
        where: { id: { in: cohortIds } },
        select: { id: true, code: true, name: true },
      });
      return cohorts.map((cohort) => ({
        cohortId: cohort.id,
        cohortCode: cohort.code,
        cohortName: cohort.name,
      }));
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

    async listAssignments(cohortIds) {
      if (cohortIds.length === 0) {
        return [];
      }
      const prisma = getPrismaClient();
      const rows = await prisma.externalProgramAssignment.findMany({
        where: { cohortId: { in: [...cohortIds] } },
      });
      return rows
        .filter(
          (row): row is typeof row & { institutionalStatus: SapIee2eProgramAssignmentRecord["institutionalStatus"] } =>
            row.institutionalStatus === "planned" ||
            row.institutionalStatus === "active" ||
            row.institutionalStatus === "paused" ||
            row.institutionalStatus === "closed",
        )
        .map((row) => ({
          cohortId: row.cohortId,
          programCode: row.programCode,
          language: row.language,
          institutionalStatus: row.institutionalStatus,
        }));
    },

    async upsertAssignment(record) {
      const prisma = getPrismaClient();
      const row = await prisma.externalProgramAssignment.upsert({
        where: {
          cohortId_programCode: {
            cohortId: record.cohortId,
            programCode: record.programCode,
          },
        },
        create: {
          cohortId: record.cohortId,
          programCode: record.programCode,
          language: record.language,
          institutionalStatus: record.institutionalStatus,
        },
        update: {
          language: record.language,
          institutionalStatus: record.institutionalStatus,
        },
      });
      return {
        cohortId: row.cohortId,
        programCode: row.programCode,
        language: row.language,
        institutionalStatus: record.institutionalStatus,
      };
    },

    async deleteAssignment(cohortId, programCode) {
      const prisma = getPrismaClient();
      await prisma.externalProgramAssignment.deleteMany({
        where: { cohortId, programCode },
      });
    },

    async listNotesForStudent(studentEmployeeId) {
      const prisma = getPrismaClient();
      const rows = await prisma.sapIee2eProfessorNote.findMany({
        where: { studentEmployeeId },
        orderBy: { updatedAt: "desc" },
      });
      return rows.map((row) => ({
        id: row.id,
        professorId: row.professorId,
        studentEmployeeId: row.studentEmployeeId,
        stageCode: row.stageCode && isStageCode(row.stageCode) ? row.stageCode : null,
        note: row.note,
        updatedAt: row.updatedAt,
      }));
    },

    async listNoteCounts(studentEmployeeIds) {
      if (studentEmployeeIds.length === 0) {
        return {};
      }
      const prisma = getPrismaClient();
      const grouped = await prisma.sapIee2eProfessorNote.groupBy({
        by: ["studentEmployeeId"],
        where: { studentEmployeeId: { in: [...studentEmployeeIds] } },
        _count: { _all: true },
      });
      return Object.fromEntries(
        grouped.map((row) => [row.studentEmployeeId, row._count._all]),
      );
    },

    async upsertNote(record) {
      const prisma = getPrismaClient();
      const row = await prisma.sapIee2eProfessorNote.create({
        data: {
          professorId: record.professorId,
          studentEmployeeId: record.studentEmployeeId,
          stageCode: record.stageCode,
          note: record.note,
        },
      });
      return {
        id: row.id,
        professorId: row.professorId,
        studentEmployeeId: row.studentEmployeeId,
        stageCode: row.stageCode as SapSuiteE2eStageCode | null,
        note: row.note,
        updatedAt: row.updatedAt,
      };
    },
  };
}
