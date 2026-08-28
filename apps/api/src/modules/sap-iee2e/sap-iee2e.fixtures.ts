import { EMPTY_SAP_IEE2E_SEMAINE_ZERO } from "@tec-platform/contracts";

import type {
  SapIee2eCohortStudentRecord,
  SapIee2eSelfReportRecord,
  SapIee2eSelfReportRepository,
} from "./sap-iee2e.types.js";

function cloneReport(record: SapIee2eSelfReportRecord): SapIee2eSelfReportRecord {
  return {
    ...record,
    units: record.units.map((unit) => ({ ...unit })),
    semaineZero: { ...record.semaineZero },
  };
}

export function createInMemorySapIee2eSelfReportRepository(
  initial: {
    readonly reports?: readonly SapIee2eSelfReportRecord[];
    readonly visibleStudents?: Readonly<Record<string, readonly SapIee2eCohortStudentRecord[]>>;
    readonly studentProfessor?: Readonly<Record<string, string>>;
    readonly calendars?: Readonly<Record<string, Date>>;
  } = {},
): SapIee2eSelfReportRepository {
  const reports = new Map<string, SapIee2eSelfReportRecord>(
    (initial.reports ?? []).map((report) => [report.employeeId, cloneReport(report)]),
  );
  const visibleStudents = initial.visibleStudents ?? {};
  const studentProfessor = { ...(initial.studentProfessor ?? {}) };
  const calendars = new Map(Object.entries(initial.calendars ?? {}));

  return {
    findByEmployeeId(employeeId) {
      const row = reports.get(employeeId);
      return Promise.resolve(row ? cloneReport(row) : null);
    },

    upsert(record) {
      const stored = cloneReport(record);
      reports.set(record.employeeId, stored);
      return Promise.resolve(cloneReport(stored));
    },

    findByEmployeeIds(employeeIds) {
      const found: SapIee2eSelfReportRecord[] = [];
      for (const id of employeeIds) {
        const row = reports.get(id);
        if (row) {
          found.push(cloneReport(row));
        }
      }
      return Promise.resolve(found);
    },

    listVisibleStudents(professorId) {
      return Promise.resolve([...(visibleStudents[professorId] ?? [])]);
    },

    findProfessorIdForStudent(studentId) {
      return Promise.resolve(studentProfessor[studentId] ?? null);
    },

    findCalendarByProfessorId(professorId) {
      return Promise.resolve(calendars.get(professorId) ?? null);
    },

    upsertCalendar(professorId, session1At) {
      calendars.set(professorId, session1At);
      return Promise.resolve(session1At);
    },
  };
}

export function emptySemaineZeroRecord() {
  return { ...EMPTY_SAP_IEE2E_SEMAINE_ZERO };
}
