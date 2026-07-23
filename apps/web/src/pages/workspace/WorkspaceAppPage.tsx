import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import { EmptyStateCard } from "../../components/workspace/EmptyStateCard.js";
import { getWorkspaceApp } from "../../workspace/appRegistry.js";
import {
  ACCESS_PREPARING_LABEL,
  EMPTY_STATE_COPY,
  PREPARING_ACCESS_DESCRIPTION,
} from "../../workspace/workspaceCopy.js";
import { AdminPortalPage } from "../admin/AdminPortalPage.js";
import { ProfessorCommandCenterPage } from "../professor/ProfessorCommandCenterPage.js";
import { AiCoachPage } from "./AiCoachPage.js";
import { AssessmentCenterPage } from "./AssessmentCenterPage.js";
import { CapstonePage } from "./CapstonePage.js";
import { CertificatesPage } from "./CertificatesPage.js";
import { DashboardPage } from "./DashboardPage.js";
import { EmployeeProfilePage } from "./EmployeeProfilePage.js";
import { InboxAppPage } from "./InboxAppPage.js";
import { MissionCenterPage } from "./MissionCenterPage.js";
import { OrganizationalErpPage } from "./OrganizationalErpPage.js";
import { TasksAppPage } from "./TasksAppPage.js";
import { TransactionWorkspacePage } from "./transactions/TransactionWorkspacePage.js";

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

  if (appId === "centre-mission") {
    return <MissionCenterPage />;
  }

  if (appId === "evaluations") {
    return <AssessmentCenterPage />;
  }

  if (appId === "portail-professeur") {
    return <ProfessorCommandCenterPage />;
  }

  if (appId === "erp") {
    return <OrganizationalErpPage />;
  }

  if (appId === "documents") {
    return <TransactionWorkspacePage />;
  }

  if (appId === "tableaux-bord") {
    return <DashboardPage />;
  }

  if (appId === "coach-ia") {
    return <AiCoachPage />;
  }

  if (appId === "capstone") {
    return <CapstonePage />;
  }

  if (appId === "certificats") {
    return <CertificatesPage />;
  }

  if (appId === "administration") {
    return <AdminPortalPage />;
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
