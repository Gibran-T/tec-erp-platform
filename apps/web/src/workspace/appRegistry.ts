export type WorkspaceAppAccess = "day1" | "preparing";

export interface WorkspaceAppDefinition {
  readonly id: string;
  readonly label: string;
  readonly access: WorkspaceAppAccess;
  readonly sidebarOrder: number;
  readonly launcherOrder: number;
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
  { id: "taches", label: "Tâches", access: "preparing", sidebarOrder: 3, launcherOrder: 3 },
  { id: "documents", label: "Documents", access: "day1", sidebarOrder: 4, launcherOrder: 4 },
  {
    id: "centre-mission",
    label: "Centre de mission",
    access: "preparing",
    sidebarOrder: 5,
    launcherOrder: 5,
  },
  { id: "erp", label: "ERP", access: "preparing", sidebarOrder: 6, launcherOrder: 6 },
  {
    id: "tableaux-bord",
    label: "Tableaux de bord",
    access: "preparing",
    sidebarOrder: 7,
    launcherOrder: 7,
  },
  { id: "calendrier", label: "Calendrier", access: "preparing", sidebarOrder: 8, launcherOrder: 8 },
  {
    id: "centre-services-ti",
    label: "Centre de services TI",
    access: "preparing",
    sidebarOrder: 9,
    launcherOrder: 9,
  },
  { id: "profil", label: "Mon profil", access: "day1", sidebarOrder: 10, launcherOrder: 10 },
];

export function getWorkspaceApp(appId: string): WorkspaceAppDefinition | undefined {
  return WORKSPACE_APPS.find((app) => app.id === appId);
}

export function getSidebarApps(): WorkspaceAppDefinition[] {
  return [...WORKSPACE_APPS].sort((left, right) => left.sidebarOrder - right.sidebarOrder);
}

export function getLauncherApps(): WorkspaceAppDefinition[] {
  return [...WORKSPACE_APPS].sort((left, right) => left.launcherOrder - right.launcherOrder);
}

export function getAppPath(appId: string): string {
  if (appId === "accueil") {
    return "/workspace";
  }
  return `/workspace/apps/${appId}`;
}
