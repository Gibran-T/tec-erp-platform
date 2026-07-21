import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useFirstDayData } from "../../first-day/FirstDayDataContext.js";
import { useMissionData } from "../../mission/MissionDataContext.js";
import {
  MISSION_ACTUELLE_TITLE,
  MISSION_PANEL_LABELS,
  OPEN_MISSION_CENTER_LABEL,
} from "../../mission/missionCopy.js";
import {
  CONTEXT_PANEL_CHECKLIST_BASE,
  CONTEXT_PANEL_TITLE,
  MANAGER_NAME,
} from "../../workspace/workspaceCopy.js";
import { getAppPath } from "../../workspace/appRegistry.js";

export function WorkspaceContextPanel(): ReactNode {
  const { inbox, tasks, initialLoading, refreshing } = useFirstDayData();
  const { summaryStatus, initialLoading: missionLoading } = useMissionData();

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
  const missionLabel =
    summaryStatus === null
      ? MISSION_PANEL_LABELS.none
      : MISSION_PANEL_LABELS[summaryStatus];

  return (
    <aside className="workspace-context-panel" data-testid="workspace-context-panel">
      <h2>{CONTEXT_PANEL_TITLE}</h2>
      {showInitialLoading ? (
        <p className="workspace-context-panel__status" role="status">
          Mise à jour de votre progression…
        </p>
      ) : (
        <>
          <ul className="workspace-context-panel__checklist" data-testid="workspace-context-checklist">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {refreshing ? (
            <p
              className="workspace-context-panel__status"
              role="status"
              data-testid="workspace-context-refreshing"
            >
              Actualisation…
            </p>
          ) : null}
        </>
      )}

      <section
        className="workspace-context-panel__mission"
        data-testid="workspace-context-mission"
        aria-labelledby="mission-actuelle-heading"
      >
        <h3 id="mission-actuelle-heading">{MISSION_ACTUELLE_TITLE}</h3>
        {missionLoading && summaryStatus === null ? (
          <p className="workspace-context-panel__status" role="status">
            Chargement de la mission…
          </p>
        ) : (
          <>
            <p data-testid="workspace-context-mission-status">{missionLabel}</p>
            <Link
              className="workspace-context-panel__mission-link"
              to={getAppPath("centre-mission")}
              data-testid="workspace-context-mission-link"
            >
              {OPEN_MISSION_CENTER_LABEL}
            </Link>
          </>
        )}
      </section>
    </aside>
  );
}
