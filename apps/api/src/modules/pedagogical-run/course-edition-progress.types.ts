import type { CourseEditionProgressRecord } from "@tec-platform/contracts";

export interface CourseEditionProgressRepository {
  findByEmployeeAndModule(
    employeeId: string,
    moduleCode: string,
  ): Promise<CourseEditionProgressRecord | null>;
  findByEmployeeIdsAndModule(
    employeeIds: readonly string[],
    moduleCode: string,
  ): Promise<ReadonlyArray<{ employeeId: string; progress: CourseEditionProgressRecord }>>;
  upsert(input: {
    readonly employeeId: string;
    readonly progress: CourseEditionProgressRecord;
  }): Promise<CourseEditionProgressRecord>;
}
