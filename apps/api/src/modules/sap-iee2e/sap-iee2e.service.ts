import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import {
  SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
  SAP_IEE2E_STALE_AFTER_DAYS,
  SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER,
  SAP_SUITE_E2E_OFFICIAL_URL,
  SAP_SUITE_E2E_PROGRAM_CODE,
  stageCodeFromSessionNumber,
  type SapIee2eCalendarView,
  type SapIee2eCohortResponse,
  type SapIee2eCohortStudent,
  type SapIee2eProfessorNote,
  type SapIee2eSelfReport,
  type SapIee2eStudentAccompaniment,
  type SapSuiteProgramAssignmentList,
  type SapSuiteProgramCatalog,
  type UpdateSapIee2eCalendarRequest,
  type UpdateSapIee2eProfessorNoteRequest,
  type UpdateSapIee2eSelfReportRequest,
  type UpdateSapSuiteProgramAssignmentRequest,
  type UpdateSapSuiteStageReviewRequest,
} from "@tec-platform/contracts";

import {
  applyProfessorStageStatus,
  buildCalendarView,
  buildProgramCatalog,
  buildProgressionLabel,
  createDefaultSelfReportView,
  deriveInstitutionalStatus,
  deriveSapAccessFromSemaineZero,
  formatDeclarationLabel,
  isSemaineZeroReady,
  isStaleDeclaration,
  mergeDeclaredStages,
  mergeDeclaredUnits,
  normalizeEvidence,
  parseSession1Date,
} from "./sap-iee2e.catalog.js";
import type { SapIee2eSelfReportRecord, SapIee2eSelfReportRepository } from "./sap-iee2e.types.js";

export interface SapIee2eServiceDependencies {
  readonly repository: SapIee2eSelfReportRepository;
  readonly now?: () => Date;
}

export interface SapIee2eService {
  getProgramCatalog(): SapSuiteProgramCatalog;
  getMyReport(employeeId: string): Promise<SapIee2eSelfReport>;
  saveMyReport(
    employeeId: string,
    input: UpdateSapIee2eSelfReportRequest,
  ): Promise<ResultType<SapIee2eSelfReport>>;
  getProfessorCohort(actorId: string): Promise<SapIee2eCohortResponse>;
  getStudentAccompaniment(
    actorId: string,
    studentEmployeeId: string,
  ): Promise<ResultType<SapIee2eStudentAccompaniment>>;
  saveProfessorNote(
    actorId: string,
    studentEmployeeId: string,
    input: UpdateSapIee2eProfessorNoteRequest,
  ): Promise<ResultType<SapIee2eProfessorNote>>;
  saveProfessorStageReview(
    actorId: string,
    studentEmployeeId: string,
    input: UpdateSapSuiteStageReviewRequest,
  ): Promise<ResultType<SapIee2eStudentAccompaniment>>;
  listProgramAssignments(actorId: string): Promise<SapSuiteProgramAssignmentList>;
  saveProgramAssignment(
    actorId: string,
    input: UpdateSapSuiteProgramAssignmentRequest,
  ): Promise<ResultType<SapSuiteProgramAssignmentList>>;
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
  const stages = mergeDeclaredStages(record.stages, record.sessionNumber);
  const semaineZero = record.semaineZero;
  return {
    currentUnit: record.currentUnit,
    sessionNumber: record.sessionNumber,
    currentStageCode: record.currentStageCode,
    institutionalStatus: record.institutionalStatus,
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
    stages,
    evidence: [...record.evidence],
    semaineZero,
    semaineZeroReady: isSemaineZeroReady(semaineZero),
    calendar,
    officialUrl: SAP_SUITE_E2E_OFFICIAL_URL,
    sapResultOfficial: false,
  };
}

function toCohortStudent(
  student: { employeeId: string; displayName: string },
  report: SapIee2eSelfReportRecord | undefined,
  noteCount: number,
  clock: Date,
): SapIee2eCohortStudent {
  if (!report) {
    return {
      employeeId: student.employeeId,
      displayName: student.displayName,
      sapAccess: "non_confirme",
      declaredUnit: null,
      currentStageCode: null,
      institutionalStatus: "not_started",
      progressionLabel: "Non commencé",
      lastUpdateLabel: "Jamais déclarée",
      difficulty: "",
      needsSupport: false,
      achievement: "non_declare",
      staleUpdate: false,
      notStarted: true,
      semaineZeroReady: false,
      evidenceCount: 0,
      professorNoteCount: noteCount,
      sapResultOfficial: false,
    };
  }
  const units = mergeDeclaredUnits(report.units);
  return {
    employeeId: student.employeeId,
    displayName: student.displayName,
    sapAccess: report.sapAccess,
    declaredUnit: report.currentUnit,
    currentStageCode: report.currentStageCode,
    institutionalStatus: report.institutionalStatus,
    progressionLabel: buildProgressionLabel(units, report.currentUnit),
    lastUpdateLabel: formatDeclarationLabel(report.lastDeclaredAt, clock),
    difficulty: report.difficulty,
    needsSupport: report.needsSupport,
    achievement: report.achievement,
    staleUpdate: isStaleDeclaration(report.lastDeclaredAt, clock, SAP_IEE2E_STALE_AFTER_DAYS),
    notStarted: report.sapAccess === "non_confirme",
    semaineZeroReady: isSemaineZeroReady(report.semaineZero),
    evidenceCount: report.evidence.length,
    professorNoteCount: noteCount,
    sapResultOfficial: false,
  };
}

async function assertVisibleStudent(
  repository: SapIee2eSelfReportRepository,
  actorId: string,
  studentEmployeeId: string,
): Promise<boolean> {
  const visible = await repository.listVisibleStudents(actorId);
  return visible.some((student) => student.employeeId === studentEmployeeId);
}

export function createSapIee2eService(dependencies: SapIee2eServiceDependencies): SapIee2eService {
  const { repository } = dependencies;
  const now = dependencies.now ?? (() => new Date());

  return {
    getProgramCatalog() {
      return buildProgramCatalog();
    },

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
      const existing = await repository.findByEmployeeId(employeeId);
      const sapAccess = deriveSapAccessFromSemaineZero(input.semaineZero);
      const units = mergeDeclaredUnits(input.units);
      const currentStageCode = input.currentStageCode ?? stageCodeFromSessionNumber(input.sessionNumber);
      const stages = mergeDeclaredStages(input.stages ?? existing?.stages, input.sessionNumber).map(
        (stage) => {
          const incoming = input.stages?.find((item) => item.stageCode === stage.stageCode);
          if (!incoming) {
            return stage;
          }
          if (
            incoming.status === "institutional_review" ||
            incoming.status === "accompaniment_completed"
          ) {
            return stage.status === incoming.status ? stage : { ...stage };
          }
          return { ...stage, status: incoming.status };
        },
      );
      const evidence = normalizeEvidence(input.evidence ?? existing?.evidence, now());
      const institutionalStatus = deriveInstitutionalStatus({
        requested: input.institutionalStatus ?? existing?.institutionalStatus,
        stages,
        evidenceCount: evidence.length,
        needsSupport: input.needsSupport,
        persisted: true,
      });
      const saved = await repository.upsert({
        employeeId,
        currentUnit: input.currentUnit,
        sessionNumber: input.sessionNumber,
        currentStageCode,
        institutionalStatus,
        sapAccess,
        difficulty: input.difficulty.trim(),
        needsSupport: input.needsSupport,
        note: input.note.trim(),
        achievement: input.achievement,
        units,
        stages,
        evidence,
        semaineZero: input.semaineZero,
        startedAt: existing?.startedAt ?? now(),
        lastDeclaredAt: now(),
      });
      const calendar = await resolveCalendar(repository, employeeId, false, now());
      return Result.ok(toView(saved, now(), calendar));
    },

    async getProfessorCohort(actorId) {
      const students = await repository.listVisibleStudents(actorId);
      const reports = await repository.findByEmployeeIds(students.map((student) => student.employeeId));
      const reportById = new Map(reports.map((report) => [report.employeeId, report]));
      const noteCounts = await repository.listNoteCounts(students.map((student) => student.employeeId));
      const clock = now();
      const calendar = await resolveCalendar(repository, actorId, true, clock);

      const mapped = students.map((student) =>
        toCohortStudent(student, reportById.get(student.employeeId), noteCounts[student.employeeId] ?? 0, clock),
      );

      return {
        disclaimer: SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
        certificationDisclaimer: SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER,
        calendar,
        officialUrl: SAP_SUITE_E2E_OFFICIAL_URL,
        students: mapped,
        semaineZero: {
          readyCount: mapped.filter((row) => row.semaineZeroReady).length,
          pendingCount: mapped.filter((row) => !row.semaineZeroReady).length,
          totalCount: mapped.length,
        },
      };
    },

    async getStudentAccompaniment(actorId, studentEmployeeId) {
      if (!(await assertVisibleStudent(repository, actorId, studentEmployeeId))) {
        return Result.fail(DomainError.forbidden("Étudiant hors de votre périmètre de cohorte."));
      }
      const students = await repository.listVisibleStudents(actorId);
      const student = students.find((row) => row.employeeId === studentEmployeeId);
      if (!student) {
        return Result.fail(DomainError.notFound("Étudiant introuvable dans la cohorte."));
      }
      const report = await repository.findByEmployeeId(studentEmployeeId);
      const notes = await repository.listNotesForStudent(studentEmployeeId);
      const clock = now();
      return Result.ok({
        student: toCohortStudent(student, report ?? undefined, notes.length, clock),
        stages: report ? mergeDeclaredStages(report.stages, report.sessionNumber) : mergeDeclaredStages([], 1),
        evidence: report ? [...report.evidence] : [],
        notes: notes.map((note) => ({
          id: note.id,
          studentEmployeeId: note.studentEmployeeId,
          stageCode: note.stageCode,
          note: note.note,
          updatedAt: note.updatedAt.toISOString(),
        })),
        sapResultOfficial: false,
      });
    },

    async saveProfessorNote(actorId, studentEmployeeId, input) {
      if (!(await assertVisibleStudent(repository, actorId, studentEmployeeId))) {
        return Result.fail(DomainError.forbidden("Étudiant hors de votre périmètre de cohorte."));
      }
      const saved = await repository.upsertNote({
        professorId: actorId,
        studentEmployeeId,
        stageCode: input.stageCode,
        note: input.note.trim(),
      });
      return Result.ok({
        id: saved.id,
        studentEmployeeId: saved.studentEmployeeId,
        stageCode: saved.stageCode,
        note: saved.note,
        updatedAt: saved.updatedAt.toISOString(),
      });
    },

    async saveProfessorStageReview(actorId, studentEmployeeId, input) {
      if (!(await assertVisibleStudent(repository, actorId, studentEmployeeId))) {
        return Result.fail(DomainError.forbidden("Étudiant hors de votre périmètre de cohorte."));
      }
      const existing = await repository.findByEmployeeId(studentEmployeeId);
      if (!existing) {
        return Result.fail(DomainError.validation("Aucune déclaration étudiante à réviser."));
      }
      const stages = applyProfessorStageStatus(existing.stages, input.stageCode, input.status);
      const institutionalStatus = deriveInstitutionalStatus({
        requested: input.status,
        stages,
        evidenceCount: existing.evidence.length,
        needsSupport: existing.needsSupport,
        persisted: true,
      });
      await repository.upsert({
        ...existing,
        stages,
        institutionalStatus,
      });
      return this.getStudentAccompaniment(actorId, studentEmployeeId);
    },

    async listProgramAssignments(actorId) {
      const cohorts = await repository.listVisibleCohorts(actorId);
      const assignments = await repository.listAssignments(cohorts.map((cohort) => cohort.cohortId));
      const assignmentByCohort = new Map(
        assignments
          .filter((assignment) => assignment.programCode === SAP_SUITE_E2E_PROGRAM_CODE)
          .map((assignment) => [assignment.cohortId, assignment]),
      );
      return {
        assignments: cohorts.map((cohort) => {
          const existing = assignmentByCohort.get(cohort.cohortId);
          return {
            cohortId: cohort.cohortId,
            cohortCode: cohort.cohortCode,
            cohortName: cohort.cohortName,
            programCode: SAP_SUITE_E2E_PROGRAM_CODE,
            language: existing?.language ?? "fr",
            institutionalStatus: existing?.institutionalStatus ?? "planned",
            assigned: Boolean(existing),
          };
        }),
      };
    },

    async saveProgramAssignment(actorId, input) {
      const cohorts = await repository.listVisibleCohorts(actorId);
      const cohort = cohorts.find((row) => row.cohortId === input.cohortId);
      if (!cohort) {
        return Result.fail(DomainError.forbidden("Cohorte hors de votre périmètre."));
      }
      if (input.assigned) {
        await repository.upsertAssignment({
          cohortId: input.cohortId,
          programCode: SAP_SUITE_E2E_PROGRAM_CODE,
          language: input.language,
          institutionalStatus: input.institutionalStatus,
        });
      } else {
        await repository.deleteAssignment(input.cohortId, SAP_SUITE_E2E_PROGRAM_CODE);
      }
      return Result.ok(await this.listProgramAssignments(actorId));
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
