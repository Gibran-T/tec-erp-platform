import { describe, expect, it } from "vitest";

import {
  getLauncherApps,
  getSidebarApps,
  isWorkspaceAppVisibleToRole,
  WORKSPACE_APPS,
} from "../appRegistry.js";

describe("Z1-001 workspace app RBAC", () => {
  it("hides Administration and Portail professeur from students", () => {
    const ids = getSidebarApps("JR_BUSINESS_ANALYST").map((app) => app.id);
    expect(ids).not.toContain("administration");
    expect(ids).not.toContain("portail-professeur");
    expect(ids).toContain("centre-mission");
    expect(ids).toContain("capstone");
  });

  it("shows Portail professeur to professors but not Administration", () => {
    const ids = getSidebarApps("PROFESSOR").map((app) => app.id);
    expect(ids).toContain("portail-professeur");
    expect(ids).not.toContain("administration");
  });

  it("shows Administration and Portail professeur to admins", () => {
    const ids = getLauncherApps("ADMIN").map((app) => app.id);
    expect(ids).toContain("administration");
    expect(ids).toContain("portail-professeur");
  });

  it("never marks role-gated apps as visible without matching role", () => {
    const adminApp = WORKSPACE_APPS.find((app) => app.id === "administration");
    const professorApp = WORKSPACE_APPS.find((app) => app.id === "portail-professeur");
    expect(adminApp && isWorkspaceAppVisibleToRole(adminApp, "JR_BUSINESS_ANALYST")).toBe(false);
    expect(professorApp && isWorkspaceAppVisibleToRole(professorApp, "JR_BUSINESS_ANALYST")).toBe(
      false,
    );
  });
});
