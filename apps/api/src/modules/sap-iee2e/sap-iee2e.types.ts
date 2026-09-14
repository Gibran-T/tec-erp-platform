import type {
  SapIee2eAccess,
  SapIee2eAchievement,
  SapIee2eDeclaredUnit,
  SapIee2eSemaineZeroChecklist,
  SapIee2eUnitStatus,
  SapSuiteDeclaredStage,
  SapSuiteE2eStageCode,
  SapSuiteEvidence,
  SapSuiteInstitutionalStatus,
} from "@tec-platform/contracts";

export interface SapIee2eSelfReportRecord {
  readonly employeeId: string;
  readonly currentUnit: number;
  readonly sessionNumber: number;
  readonly currentStageCode: SapSuiteE2eStageCode;
  readonly institutionalStatus: SapSuiteInstitutionalStatus;
  readonly sapAccess: SapIee2eAccess;
  readonly difficulty: string;
  readonly needsSupport: boolean;
  readonly note: string;
  readonly achievement: SapIee2eAchievement;
  readonly units: readonly SapIee2eDeclaredUnit[];
  readonly stages: readonly SapSuiteDeclaredStage[];
  readonly evidence: readonly SapSuiteEvidence[];
  readonly semaineZero: SapIee2eSemaineZeroChecklist;
  readonly startedAt: Date | null;
  readonly lastDeclaredAt: Date;
}

export interface SapIee2eCohortStudentRecord {
  readonly employeeId: string;
  readonly displayName: string;
}

export interface SapIee2eCohortRecord {
  readonly cohortId: string;
  readonly cohortCode: string;
  readonly cohortName: string;
}

export interface SapIee2eProgramAssignmentRecord {
  readonly cohortId: string;
  readonly programCode: string;
  readonly language: string;
  readonly institutionalStatus: "planned" | "active" | "paused" | "closed";
}

export interface SapIee2eProfessorNoteRecord {
  readonly id: string;
  readonly professorId: string;
  readonly studentEmployeeId: string;
  readonly stageCode: SapSuiteE2eStageCode | null;
  readonly note: string;
  readonly updatedAt: Date;
}

export interface SapIee2eSelfReportRepository {
  findByEmployeeId(employeeId: string): Promise<SapIee2eSelfReportRecord | null>;
  upsert(record: SapIee2eSelfReportRecord): Promise<SapIee2eSelfReportRecord>;
  findByEmployeeIds(employeeIds: readonly string[]): Promise<readonly SapIee2eSelfReportRecord[]>;
  listVisibleStudents(actorId: string): Promise<readonly SapIee2eCohortStudentRecord[]>;
  listVisibleCohorts(actorId: string): Promise<readonly SapIee2eCohortRecord[]>;
  findProfessorIdForStudent(studentId: string): Promise<string | null>;
  findCalendarByProfessorId(professorId: string): Promise<Date | null>;
  upsertCalendar(professorId: string, session1At: Date): Promise<Date>;
  listAssignments(cohortIds: readonly string[]): Promise<readonly SapIee2eProgramAssignmentRecord[]>;
  upsertAssignment(record: SapIee2eProgramAssignmentRecord): Promise<SapIee2eProgramAssignmentRecord>;
  deleteAssignment(cohortId: string, programCode: string): Promise<void>;
  listNotesForStudent(studentEmployeeId: string): Promise<readonly SapIee2eProfessorNoteRecord[]>;
  listNoteCounts(studentEmployeeIds: readonly string[]): Promise<Readonly<Record<string, number>>>;
  upsertNote(record: {
    readonly professorId: string;
    readonly studentEmployeeId: string;
    readonly stageCode: SapSuiteE2eStageCode | null;
    readonly note: string;
  }): Promise<SapIee2eProfessorNoteRecord>;
}

export function isUnitStatus(value: string): value is SapIee2eUnitStatus {
  return (
    value === "a_decouvrir" ||
    value === "en_cours" ||
    value === "a_reprendre" ||
    value === "terminee_declaree" ||
    value === "accompagnement_requis"
  );
}

export function isAchievement(value: string): value is SapIee2eAchievement {
  return value === "non_declare" || value === "en_cours" || value === "obtenu_declare";
}

export function isAccess(value: string): value is SapIee2eAccess {
  return value === "non_confirme" || value === "confirme" || value === "commence";
}
