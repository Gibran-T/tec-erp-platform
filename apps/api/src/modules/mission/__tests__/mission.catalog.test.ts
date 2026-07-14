import { describe, expect, it } from "vitest";

import {
  ALLOWED_DEPARTMENT_PROBLEM_PAIRS,
  ENTERPRISE_DISCOVERY_MISSION_KEY,
  isAllowedDepartmentProblemPair,
  MISSION_CATALOG,
  MISSION_CONTEXT_CATALOG,
  MISSION_DEPARTMENT_CATALOG,
  MISSION_PROBLEM_CATALOG,
  REQUIRED_ACKNOWLEDGED_INPUT_KEYS,
} from "../mission.catalog.js";

describe("mission catalog", () => {
  it("contains exactly one production mission", () => {
    expect(MISSION_CATALOG).toHaveLength(1);
    expect(MISSION_CATALOG[0]?.missionKey).toBe(ENTERPRISE_DISCOVERY_MISSION_KEY);
    expect(MISSION_CATALOG[0]?.competencyCodes).toEqual(["C-ORG-01", "C-BUS-01"]);
  });

  it("requires overview and Tom 40-versus-36 acknowledgments", () => {
    expect([...REQUIRED_ACKNOWLEDGED_INPUT_KEYS]).toEqual([
      "ctx-nordhabitat-overview",
      "ctx-tom-40-36",
    ]);
    expect(MISSION_CONTEXT_CATALOG.some((item) => item.key === "ctx-tom-40-36")).toBe(true);
  });

  it("keeps allowed pairs consistent with department and problem catalogs", () => {
    const departments = new Set(MISSION_DEPARTMENT_CATALOG.map((item) => item.key));
    const problems = new Set(MISSION_PROBLEM_CATALOG.map((item) => item.key));

    expect(ALLOWED_DEPARTMENT_PROBLEM_PAIRS.length).toBeGreaterThanOrEqual(2);

    for (const pair of ALLOWED_DEPARTMENT_PROBLEM_PAIRS) {
      expect(departments.has(pair.departmentKey)).toBe(true);
      expect(problems.has(pair.problemKey)).toBe(true);
      expect(isAllowedDepartmentProblemPair(pair.departmentKey, pair.problemKey)).toBe(true);
    }

    expect(isAllowedDepartmentProblemPair("dept-entrepot", "prob-plaintes-clients")).toBe(false);
  });
});
