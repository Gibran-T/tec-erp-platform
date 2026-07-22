import type { EmployeeRole } from "@tec-platform/contracts";

export type WorkspaceAppAccess = "day1" | "preparing";

export interface WorkspaceAppDefinition {
  readonly id: string;
  readonly label: string;
  readonly access: WorkspaceAppAccess;
  readonly sidebarOrder: number;
  readonly launcherOrder: number;
  /**
   * When set, the app is shown only to employees whose role is listed.
   * When omitted, any authenticated employee may see the app (subject to `access`).
   */
  readonly roles?: readonly EmployeeRole[];
}

export const WORKSPACE_APPS: readonly WorkspaceAppDefinition[] = [
  { id: "accueil", label: "Accueil", access: "day1", sidebarOrder: 1, launcherOrder: 1 },
  {
    id: "boite-reception",
    label: "Boîte de réception",
    access: "day1",
    sidebarOrder: 2,
    launcherOrder: 2,
  },
  { id: "taches", label: "Tâches", access: "day1", sidebarOrder: 3, launcherOrder: 3 },
  { id: "documents", label: "Documents", access: "day1", sidebarOrder: 4, launcherOrder: 4 },
  {
    id: "centre-mission",
    label: "Centre de mission",
    access: "day1",
    sidebarOrder: 5,
    launcherOrder: 5,
  },
  { id: "erp", label: "ERP", access: "day1", sidebarOrder: 6, launcherOrder: 6 },
  {
    id: "evaluations",
    label: "Évaluations",
    access: "day1",
    sidebarOrder: 7,
    launcherOrder: 7,
  },
  {
    id: "portail-professeur",
    label: "Portail professeur",
    access: "day1",
    sidebarOrder: 8,
    launcherOrder: 8,
    roles: ["PROFESSOR", "ADMIN"],
  },
  {
    id: "tableaux-bord",
    label: "Tableaux de bord",
    access: "day1",
    sidebarOrder: 9,
    launcherOrder: 9,
  },
  {
    id: "coach-ia",
    label: "Coach IA",
    access: "day1",
    sidebarOrder: 10,
    launcherOrder: 10,
  },
  {
    id: "capstone",
    label: "Capstone",
    access: "day1",
    sidebarOrder: 11,
    launcherOrder: 11,
  },
  {
    id: "certificats",
    label: "Certificats",
    access: "day1",
    sidebarOrder: 12,
    launcherOrder: 12,
  },
  {
    id: "administration",
    label: "Administration",
    access: "day1",
    sidebarOrder: 13,
    launcherOrder: 13,
    roles: ["ADMIN"],
  },
  { id: "calendrier", label: "Calendrier", access: "preparing", sidebarOrder: 14, launcherOrder: 14 },
  {
    id: "centre-services-ti",
    label: "Centre de services TI",
    access: "preparing",
    sidebarOrder: 15,
    launcherOrder: 15,
  },
  { id: "profil", label: "Mon profil", access: "day1", sidebarOrder: 16, launcherOrder: 16 },
];

export function isWorkspaceAppVisibleToRole(
  app: WorkspaceAppDefinition,
  role: EmployeeRole,
): boolean {
  if (!app.roles || app.roles.length === 0) {
    return true;
  }
  return app.roles.includes(role);
}

export function getWorkspaceApp(appId: string): WorkspaceAppDefinition | undefined {
  return WORKSPACE_APPS.find((app) => app.id === appId);
}

export function getSidebarApps(role?: EmployeeRole): WorkspaceAppDefinition[] {
  return [...WORKSPACE_APPS]
    .filter((app) => (role ? isWorkspaceAppVisibleToRole(app, role) : true))
    .sort((left, right) => left.sidebarOrder - right.sidebarOrder);
}

export function getLauncherApps(role?: EmployeeRole): WorkspaceAppDefinition[] {
  return [...WORKSPACE_APPS]
    .filter((app) => (role ? isWorkspaceAppVisibleToRole(app, role) : true))
    .sort((left, right) => left.launcherOrder - right.launcherOrder);
}

export function getAppPath(appId: string): string {
  if (appId === "accueil") {
    return "/workspace";
  }
  return `/workspace/apps/${appId}`;
}
