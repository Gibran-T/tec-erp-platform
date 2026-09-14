import { EMPTY_SAP_IEE2E_SEMAINE_ZERO } from "@tec-platform/contracts";

import { createDefaultStages } from "./sap-iee2e.catalog.js";
import type {
  SapIee2eCohortRecord,
  SapIee2eCohortStudentRecord,
  SapIee2eProfessorNoteRecord,
  SapIee2eProgramAssignmentRecord,
  SapIee2eSelfReportRecord,
  SapIee2eSelfReportRepository,
} from "./sap-iee2e.types.js";

export function createInMemorySapIee2eSelfReportRepository(
  initial: {
    readonly reports?: readonly SapIee2eSelfReportRecord[];
    readonly visibleStudents?: Readonly<Record<string, readonly SapIee2eCohortStudentRecord[]>>;
    readonly visibleCohorts?: Readonly<Record<string, readonly SapIee2eCohortRecord[]>>;
    readonly studentProfessor?: Readonly<Record<string, string>>;
    readonly calendars?: Readonly<Record<string, Date>>;
    readonly assignments?: readonly SapIee2eProgramAssignmentRecord[];
    readonly notes?: readonly SapIee2eProfessorNoteRecord[];
  } = {},
): SapIee2eSelfReportRepository {
  const reports = new Map<string, SapIee2eSelfReportRecord>(
    (initial.reports ?? []).map((report) => [
      report.employeeId,
      {
        ...report,
        units: [...report.units],
        stages: [...(report.stages ?? createDefaultStages())],
        evidence: [...(report.evidence ?? [])],
        semaineZero: { ...report.semaineZero },
      },
    ]),
  );
  const visibleStudents = initial.visibleStudents ?? {};
  const visibleCohorts = initial.visibleCohorts ?? {};
  const studentProfessor = { ...(initial.studentProfessor ?? {}) };
  const calendars = new Map(Object.entries(initial.calendars ?? {}));
  const assignments = new Map(
    (initial.assignments ?? []).map((assignment) => [
      `${assignment.cohortId}:${assignment.programCode}`,
      assignment,
    ]),
  );
  const notes = [...(initial.notes ?? [])];
  let noteSeq = notes.length;

  function cloneReport(row: SapIee2eSelfReportRecord): SapIee2eSelfReportRecord {
    return {
      ...row,
      units: [...row.units],
      stages: [...row.stages],
      evidence: [...row.evidence],
      semaineZero: { ...row.semaineZero },
    };
  }

  return {
    findByEmployeeId(employeeId) {
      const row = reports.get(employeeId);
      return Promise.resolve(row ? cloneReport(row) : null);
    },

    upsert(record) {
      const stored = cloneReport({
        ...record,
        currentStageCode: record.currentStageCode,
        institutionalStatus: record.institutionalStatus,
        stages: record.stages ?? createDefaultStages(),
        evidence: record.evidence ?? [],
        startedAt: record.startedAt ?? null,
      });
      reports.set(record.employeeId, stored);
      return Promise.resolve(cloneReport(stored));
    },

    findByEmployeeIds(employeeIds) {
      return Promise.resolve(
        employeeIds
          .map((id) => reports.get(id))
          .filter((row): row is SapIee2eSelfReportRecord => Boolean(row))
          .map((row) => cloneReport(row)),
      );
    },

    listVisibleStudents(professorId) {
      return Promise.resolve([...(visibleStudents[professorId] ?? [])]);
    },

    listVisibleCohorts(actorId) {
      return Promise.resolve([...(visibleCohorts[actorId] ?? [])]);
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

    listAssignments(cohortIds) {
      return Promise.resolve(
        [...assignments.values()].filter((assignment) => cohortIds.includes(assignment.cohortId)),
      );
    },

    upsertAssignment(record) {
      assignments.set(`${record.cohortId}:${record.programCode}`, record);
      return Promise.resolve(record);
    },

    deleteAssignment(cohortId, programCode) {
      assignments.delete(`${cohortId}:${programCode}`);
      return Promise.resolve();
    },

    listNotesForStudent(studentEmployeeId) {
      return Promise.resolve(notes.filter((note) => note.studentEmployeeId === studentEmployeeId));
    },

    listNoteCounts(studentEmployeeIds) {
      const counts: Record<string, number> = {};
      for (const id of studentEmployeeIds) {
        counts[id] = notes.filter((note) => note.studentEmployeeId === id).length;
      }
      return Promise.resolve(counts);
    },

    upsertNote(record) {
      noteSeq += 1;
      const stored: SapIee2eProfessorNoteRecord = {
        id: `note_${noteSeq}`,
        professorId: record.professorId,
        studentEmployeeId: record.studentEmployeeId,
        stageCode: record.stageCode,
        note: record.note,
        updatedAt: new Date(),
      };
      notes.push(stored);
      return Promise.resolve(stored);
    },
  };
}

export function emptySemaineZeroRecord() {
  return { ...EMPTY_SAP_IEE2E_SEMAINE_ZERO };
}
