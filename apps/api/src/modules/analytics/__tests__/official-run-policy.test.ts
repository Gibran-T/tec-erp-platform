import { describe, expect, it } from "vitest";

import {
  countUniqueStudentsFromRuns,
  isEligibleForOfficial,
  pickOfficialRun,
  type RunCandidate,
} from "../official-run-policy.js";

describe("official-run-policy", () => {
  const base = (overrides: Partial<RunCandidate>): RunCandidate => ({
    id: overrides.id ?? "r",
    employeeId: overrides.employeeId ?? "a",
    runSequence: overrides.runSequence ?? 1,
    runType: overrides.runType ?? "AUTONOMOUS",
    status: overrides.status ?? "COMPLETED",
  });

  it("counts one student for Run1 + Run2", () => {
    const runs = [
      base({ id: "1", runSequence: 1, status: "COMPLETED" }),
      base({ id: "2", runSequence: 2, status: "ACTIVE", runType: "INSTRUCTOR_LED" }),
    ];
    expect(countUniqueStudentsFromRuns(runs)).toBe(1);
    expect(pickOfficialRun(runs)?.id).toBe("1");
  });

  it("excludes demonstration and cancelled from official headcount", () => {
    const runs = [
      base({ id: "d", runType: "DEMONSTRATION", status: "COMPLETED" }),
      base({ id: "c", status: "CANCELLED", runSequence: 2 }),
    ];
    expect(countUniqueStudentsFromRuns(runs)).toBe(0);
    expect(isEligibleForOfficial(runs[0]!)).toBe(false);
  });

  it("prefers completed over active for official result", () => {
    const runs = [
      base({ id: "done", runSequence: 1, status: "COMPLETED" }),
      base({ id: "active", runSequence: 2, status: "ACTIVE" }),
    ];
    expect(pickOfficialRun(runs)?.id).toBe("done");
  });

  it("uses latest completed when multiple completed runs exist", () => {
    const runs = [
      base({ id: "old", runSequence: 1, status: "COMPLETED" }),
      base({ id: "new", runSequence: 2, status: "COMPLETED", runType: "INSTRUCTOR_LED" }),
    ];
    expect(pickOfficialRun(runs)?.id).toBe("new");
  });
});
