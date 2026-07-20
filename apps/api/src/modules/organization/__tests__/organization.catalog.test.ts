import { describe, expect, it } from "vitest";

import { OrganizationPayloadSchema } from "../../../../../../packages/contracts/src/organization.js";
import { MISSION_DEPARTMENT_CATALOG } from "../../mission/mission.catalog.js";
import { getOrganizationCatalog, ORGANIZATION_CATALOG } from "../organization.catalog.js";

const WRITE_ACTION_KEY_PATTERN =
  /(^|[^a-z])(action|write|post|mutate|attempt|score|restart|progress)([^a-z]|$)/i;

function collectKeys(value: unknown, path = ""): string[] {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectKeys(item, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.entries(record).flatMap(([key, nested]) => {
      const nextPath = path ? `${path}.${key}` : key;
      return [nextPath, ...collectKeys(nested, nextPath)];
    });
  }
  return [];
}

describe("organization catalog", () => {
  it("payload passes OrganizationPayloadSchema", () => {
    const parsed = OrganizationPayloadSchema.safeParse(ORGANIZATION_CATALOG);
    expect(parsed.success).toBe(true);
  });

  it("contains exactly seven departments", () => {
    expect(ORGANIZATION_CATALOG.departments).toHaveLength(7);
  });

  it("keeps department keys unique and labels non-empty", () => {
    const keys = ORGANIZATION_CATALOG.departments.map((department) => department.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const department of ORGANIZATION_CATALOG.departments) {
      expect(department.key.length).toBeGreaterThan(0);
      expect(department.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("requires non-empty responsibilities for each department", () => {
    for (const department of ORGANIZATION_CATALOG.departments) {
      expect(department.responsibilities.length).toBeGreaterThan(0);
      for (const responsibility of department.responsibilities) {
        expect(responsibility.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("references only valid departments in relationships, process and fragmentation", () => {
    const departmentKeys = new Set(
      ORGANIZATION_CATALOG.departments.map((department) => department.key),
    );

    for (const relationship of ORGANIZATION_CATALOG.relationships) {
      expect(departmentKeys.has(relationship.fromDepartmentKey)).toBe(true);
      expect(departmentKeys.has(relationship.toDepartmentKey)).toBe(true);
    }

    for (const item of ORGANIZATION_CATALOG.processAwareness) {
      expect(item.participatingDepartmentKeys.length).toBeGreaterThan(0);
      for (const departmentKey of item.participatingDepartmentKeys) {
        expect(departmentKeys.has(departmentKey)).toBe(true);
      }
    }

    for (const signal of ORGANIZATION_CATALOG.fragmentationSignals) {
      expect(signal.affectedDepartmentKeys.length).toBeGreaterThan(0);
      for (const departmentKey of signal.affectedDepartmentKeys) {
        expect(departmentKeys.has(departmentKey)).toBe(true);
      }
    }
  });

  it("excludes write/action configuration keys", () => {
    const keys = collectKeys(ORGANIZATION_CATALOG);
    const forbidden = keys.filter((key) => {
      const leaf = key.split(".").pop() ?? key;
      const leafName = leaf.replace(/\[\d+\]/g, "");
      return WRITE_ACTION_KEY_PATTERN.test(leafName);
    });
    expect(forbidden).toEqual([]);
  });

  it("keeps Tom narrative expected 40 and actual 36", () => {
    expect(ORGANIZATION_CATALOG.narrativeContext.expected).toBe(40);
    expect(ORGANIZATION_CATALOG.narrativeContext.actual).toBe(36);
    expect(ORGANIZATION_CATALOG.narrativeContext.unit).toBe("unités");
  });

  it("is deterministic", () => {
    expect(getOrganizationCatalog()).toBe(ORGANIZATION_CATALOG);
    expect(getOrganizationCatalog()).toEqual(getOrganizationCatalog());
    expect(getOrganizationCatalog()).toEqual(ORGANIZATION_CATALOG);
  });

  it("matches Slice D department catalog parity exactly", () => {
    expect(ORGANIZATION_CATALOG.departments).toHaveLength(7);
    expect(MISSION_DEPARTMENT_CATALOG).toHaveLength(7);

    const organizationKeys = ORGANIZATION_CATALOG.departments.map((department) => department.key);
    const missionKeys = MISSION_DEPARTMENT_CATALOG.map((department) => department.key);
    expect(organizationKeys).toEqual(missionKeys);

    const organizationLabels = ORGANIZATION_CATALOG.departments.map(
      (department) => department.label,
    );
    const missionLabels = MISSION_DEPARTMENT_CATALOG.map((department) => department.label);
    expect(organizationLabels).toEqual(missionLabels);

    expect(new Set(organizationKeys).size).toBe(7);
    expect(new Set(missionKeys).size).toBe(7);

    for (const missionDepartment of MISSION_DEPARTMENT_CATALOG) {
      const match = ORGANIZATION_CATALOG.departments.find(
        (department) => department.key === missionDepartment.key,
      );
      expect(match).toBeDefined();
      expect(match?.label).toBe(missionDepartment.label);
    }

    for (const organizationDepartment of ORGANIZATION_CATALOG.departments) {
      const match = MISSION_DEPARTMENT_CATALOG.find(
        (department) => department.key === organizationDepartment.key,
      );
      expect(match).toBeDefined();
    }
  });
});
