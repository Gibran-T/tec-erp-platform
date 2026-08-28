import type {
  SapIee2eAccess,
  SapIee2eAchievement,
  SapIee2eDeclaredUnit,
  SapIee2eSemaineZeroChecklist,
  SapIee2eUnitStatus,
} from "@tec-platform/contracts";

export interface SapIee2eSelfReportRecord {
  readonly employeeId: string;
  readonly currentUnit: number;
  readonly sessionNumber: number;
  readonly sapAccess: SapIee2eAccess;
  readonly difficulty: string;
  readonly needsSupport: boolean;
  readonly note: string;
  readonly achievement: SapIee2eAchievement;
  readonly units: readonly SapIee2eDeclaredUnit[];
  readonly semaineZero: SapIee2eSemaineZeroChecklist;
  readonly lastDeclaredAt: Date;
}

export interface SapIee2eCohortStudentRecord {
  readonly employeeId: string;
  readonly displayName: string;
}

export interface SapIee2eSelfReportRepository {
  findByEmployeeId(employeeId: string): Promise<SapIee2eSelfReportRecord | null>;
  upsert(record: SapIee2eSelfReportRecord): Promise<SapIee2eSelfReportRecord>;
  findByEmployeeIds(employeeIds: readonly string[]): Promise<readonly SapIee2eSelfReportRecord[]>;
  listVisibleStudents(professorId: string): Promise<readonly SapIee2eCohortStudentRecord[]>;
  findProfessorIdForStudent(studentId: string): Promise<string | null>;
  findCalendarByProfessorId(professorId: string): Promise<Date | null>;
  upsertCalendar(professorId: string, session1At: Date): Promise<Date>;
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
