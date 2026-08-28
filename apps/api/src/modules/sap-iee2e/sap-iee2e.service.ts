import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import {
  SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
  SAP_IEE2E_STALE_AFTER_DAYS,
  type SapIee2eCalendarView,
  type SapIee2eCohortResponse,
  type SapIee2eSelfReport,
  type UpdateSapIee2eCalendarRequest,
  type UpdateSapIee2eSelfReportRequest,
} from "@tec-platform/contracts";

import {
  buildCalendarView,
  buildProgressionLabel,
  createDefaultSelfReportView,
  deriveSapAccessFromSemaineZero,
  formatDeclarationLabel,
  isSemaineZeroReady,
  isStaleDeclaration,
  mergeDeclaredUnits,
  parseSession1Date,
} from "./sap-iee2e.catalog.js";
import type { SapIee2eSelfReportRecord, SapIee2eSelfReportRepository } from "./sap-iee2e.types.js";

export interface SapIee2eServiceDependencies {
  readonly repository: SapIee2eSelfReportRepository;
  readonly now?: () => Date;
}

export interface SapIee2eService {
  getMyReport(employeeId: string): Promise<SapIee2eSelfReport>;
  saveMyReport(
    employeeId: string,
    input: UpdateSapIee2eSelfReportRequest,
  ): Promise<ResultType<SapIee2eSelfReport>>;
  getProfessorCohort(professorId: string): Promise<SapIee2eCohortResponse>;
  saveProfessorCalendar(
    professorId: string,
    input: UpdateSapIee2eCalendarRequest,
  ): Promise<ResultType<SapIee2eCalendarView>>;
}

async function resolveCalendar(
  repository: SapIee2eSelfReportRepository,
  employeeId: string,
  asProfessor: boolean,
  now: Date,
): Promise<SapIee2eCalendarView> {
  const professorId = asProfessor
    ? employeeId
    : await repository.findProfessorIdForStudent(employeeId);
  const session1At = professorId ? await repository.findCalendarByProfessorId(professorId) : null;
  return buildCalendarView(session1At, now);
}

function toView(
  record: SapIee2eSelfReportRecord,
  now: Date,
  calendar: SapIee2eCalendarView,
): SapIee2eSelfReport {
  const units = mergeDeclaredUnits(record.units);
  const semaineZero = record.semaineZero;
  return {
    currentUnit: record.currentUnit,
    sessionNumber: record.sessionNumber,
    sapAccess: record.sapAccess,
    difficulty: record.difficulty,
    needsSupport: record.needsSupport,
    note: record.note,
    achievement: record.achievement,
    lastDeclaredAt: record.lastDeclaredAt.toISOString(),
    lastUpdateLabel: formatDeclarationLabel(record.lastDeclaredAt, now),
    progressionLabel: buildProgressionLabel(units, record.currentUnit),
    persisted: true,
    units,
    semaineZero,
    semaineZeroReady: isSemaineZeroReady(semaineZero),
    calendar,
  };
}

export function createSapIee2eService(dependencies: SapIee2eServiceDependencies): SapIee2eService {
  const { repository } = dependencies;
  const now = dependencies.now ?? (() => new Date());

  return {
    async getMyReport(employeeId) {
      const calendar = await resolveCalendar(repository, employeeId, false, now());
      const existing = await repository.findByEmployeeId(employeeId);
      if (!existing) {
        const defaults = createDefaultSelfReportView();
        return {
          ...defaults,
          lastUpdateLabel: formatDeclarationLabel(null, now()),
          calendar,
        };
      }
      return toView(existing, now(), calendar);
    },

    async saveMyReport(employeeId, input) {
      const sapAccess = deriveSapAccessFromSemaineZero(input.semaineZero);
      const units = mergeDeclaredUnits(input.units);
      const saved = await repository.upsert({
        employeeId,
        currentUnit: input.currentUnit,
        sessionNumber: input.sessionNumber,
        sapAccess,
        difficulty: input.difficulty.trim(),
        needsSupport: input.needsSupport,
        note: input.note.trim(),
        achievement: input.achievement,
        units,
        semaineZero: input.semaineZero,
        lastDeclaredAt: now(),
      });
      const calendar = await resolveCalendar(repository, employeeId, false, now());
      return Result.ok(toView(saved, now(), calendar));
    },

    async getProfessorCohort(professorId) {
      const students = await repository.listVisibleStudents(professorId);
      const reports = await repository.findByEmployeeIds(students.map((student) => student.employeeId));
      const reportById = new Map(reports.map((report) => [report.employeeId, report]));
      const clock = now();
      const calendar = await resolveCalendar(repository, professorId, true, clock);

      const mapped = students.map((student) => {
        const report = reportById.get(student.employeeId);
        if (!report) {
          return {
            employeeId: student.employeeId,
            displayName: student.displayName,
            sapAccess: "non_confirme" as const,
            declaredUnit: null,
            progressionLabel: "Non commencé",
            lastUpdateLabel: "Jamais déclarée",
            difficulty: "",
            needsSupport: false,
            achievement: "non_declare" as const,
            staleUpdate: false,
            notStarted: true,
            semaineZeroReady: false,
          };
        }
        const units = mergeDeclaredUnits(report.units);
        return {
          employeeId: student.employeeId,
          displayName: student.displayName,
          sapAccess: report.sapAccess,
          declaredUnit: report.currentUnit,
          progressionLabel: buildProgressionLabel(units, report.currentUnit),
          lastUpdateLabel: formatDeclarationLabel(report.lastDeclaredAt, clock),
          difficulty: report.difficulty,
          needsSupport: report.needsSupport,
          achievement: report.achievement,
          staleUpdate: isStaleDeclaration(report.lastDeclaredAt, clock, SAP_IEE2E_STALE_AFTER_DAYS),
          notStarted: report.sapAccess === "non_confirme",
          semaineZeroReady: isSemaineZeroReady(report.semaineZero),
        };
      });

      return {
        disclaimer: SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
        calendar,
        students: mapped,
        semaineZero: {
          readyCount: mapped.filter((row) => row.semaineZeroReady).length,
          pendingCount: mapped.filter((row) => !row.semaineZeroReady).length,
          totalCount: mapped.length,
        },
      };
    },

    async saveProfessorCalendar(professorId, input) {
      const session1At = parseSession1Date(input.session1Date);
      if (!session1At) {
        return Result.fail(DomainError.validation("Date de séance 1 invalide."));
      }
      const saved = await repository.upsertCalendar(professorId, session1At);
      return Result.ok(buildCalendarView(saved, now()));
    },
  };
}
