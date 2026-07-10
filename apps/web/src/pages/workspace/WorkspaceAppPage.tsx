import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import { EmptyStateCard } from "../../components/workspace/EmptyStateCard.js";
import { getWorkspaceApp } from "../../workspace/appRegistry.js";
import {
  ACCESS_PREPARING_LABEL,
  EMPTY_STATE_COPY,
  PREPARING_ACCESS_DESCRIPTION,
} from "../../workspace/workspaceCopy.js";
import { EmployeeProfilePage } from "./EmployeeProfilePage.js";
import { InboxAppPage } from "./InboxAppPage.js";
import { TasksAppPage } from "./TasksAppPage.js";

export function WorkspaceAppPage(): ReactNode {
  const { appId } = useParams<{ appId: string }>();

  if (!appId) {
    return <Navigate to="/workspace" replace />;
  }

  if (appId === "profil") {
    return <EmployeeProfilePage />;
  }

  if (appId === "boite-reception") {
    return <InboxAppPage />;
  }

  if (appId === "taches") {
    return <TasksAppPage />;
  }

  const app = getWorkspaceApp(appId);

  if (!app) {
    return <Navigate to="/workspace" replace />;
  }

  if (app.access === "preparing") {
    return (
      <EmptyStateCard
        title={app.label}
        description={PREPARING_ACCESS_DESCRIPTION}
        badge={ACCESS_PREPARING_LABEL}
      />
    );
  }

  const emptyCopy = EMPTY_STATE_COPY[appId];

  if (emptyCopy) {
    return <EmptyStateCard title={emptyCopy.title} description={emptyCopy.description} />;
  }

  return (
    <EmptyStateCard
      title={app.label}
      description="Cette application sera disponible au fil de votre intégration chez NordHabitat."
    />
  );
}
