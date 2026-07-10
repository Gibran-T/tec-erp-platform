import type { ReactNode } from "react";

import { useFirstDayData } from "../../first-day/FirstDayDataContext.js";
import {
  CONTEXT_PANEL_CHECKLIST_BASE,
  CONTEXT_PANEL_TITLE,
  MANAGER_NAME,
} from "../../workspace/workspaceCopy.js";

export function WorkspaceContextPanel(): ReactNode {
  const { inbox, tasks, initialLoading, refreshing } = useFirstDayData();

  const managerMessageRead =
    inbox?.messages.some((message) => message.readAt !== null) ?? false;
  const hasAssignedTask = (tasks?.tasks.length ?? 0) > 0;
  const firstTaskComplete =
    tasks?.tasks.some((task) => task.status === "terminee") ?? false;

  const checklist = [
    ...CONTEXT_PANEL_CHECKLIST_BASE,
    managerMessageRead
      ? `Premier message de ${MANAGER_NAME} consulté`
      : `En attente : premier message de ${MANAGER_NAME}`,
    hasAssignedTask
      ? firstTaskComplete
        ? "Première responsabilité opérationnelle complétée"
        : "Première responsabilité opérationnelle assignée"
      : "En attente : première responsabilité opérationnelle",
  ];

  const showInitialLoading = initialLoading && inbox === null;

  return (
    <aside className="workspace-context-panel" data-testid="workspace-context-panel">
      <h2>{CONTEXT_PANEL_TITLE}</h2>
      {showInitialLoading ? (
        <p className="workspace-context-panel__status">Mise à jour de votre progression…</p>
      ) : (
        <>
          <ul className="workspace-context-panel__checklist" data-testid="workspace-context-checklist">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {refreshing ? (
            <p className="workspace-context-panel__status" data-testid="workspace-context-refreshing">
              Actualisation…
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}
