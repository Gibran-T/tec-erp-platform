import type { CourseEditionProgressRecord } from "@tec-platform/contracts";

import type { CourseEditionProgressRepository } from "./course-edition-progress.types.js";

function cloneProgress(progress: CourseEditionProgressRecord): CourseEditionProgressRecord {
  return {
    ...progress,
    completedSurfaces: [...progress.completedSurfaces],
    framesViewed: [...progress.framesViewed],
    documentsOpened: [...progress.documentsOpened],
  };
}

export function createInMemoryCourseEditionProgressRepository(
  initial: ReadonlyArray<{ employeeId: string; progress: CourseEditionProgressRecord }> = [],
): CourseEditionProgressRepository {
  const rows = new Map<string, CourseEditionProgressRecord>();
  for (const item of initial) {
    rows.set(`${item.employeeId}:${item.progress.moduleCode.toUpperCase()}`, cloneProgress(item.progress));
  }

  return {
    findByEmployeeAndModule(employeeId, moduleCode) {
      const row = rows.get(`${employeeId}:${moduleCode.toUpperCase()}`);
      return Promise.resolve(row ? cloneProgress(row) : null);
    },

    findByEmployeeIdsAndModule(employeeIds, moduleCode) {
      const code = moduleCode.toUpperCase();
      const found: Array<{ employeeId: string; progress: CourseEditionProgressRecord }> = [];
      for (const employeeId of employeeIds) {
        const row = rows.get(`${employeeId}:${code}`);
        if (row) {
          found.push({ employeeId, progress: cloneProgress(row) });
        }
      }
      return Promise.resolve(found);
    },

    upsert(input) {
      const stored = cloneProgress({
        ...input.progress,
        moduleCode: input.progress.moduleCode.toUpperCase(),
      });
      rows.set(`${input.employeeId}:${stored.moduleCode}`, stored);
      return Promise.resolve(cloneProgress(stored));
    },
  };
}
