import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import { getAppPath } from "../../workspace/appRegistry.js";
import { isSapAnalysteSofaApp } from "../../workspace/sapAnalysteProduct.js";
import { AdminPortalPage } from "../admin/AdminPortalPage.js";
import { EmployeeProfilePage } from "./EmployeeProfilePage.js";
import { SapIee2eWorkspacePage } from "./SapIee2eWorkspacePage.js";

export function WorkspaceAppPage(): ReactNode {
  const { appId } = useParams<{ appId: string }>();

  if (!appId) {
    return <Navigate to="/workspace" replace />;
  }

  if (!isSapAnalysteSofaApp(appId)) {
    return <Navigate to={getAppPath("parcours-sap-iee2e")} replace />;
  }

  if (appId === "profil") {
    return <EmployeeProfilePage />;
  }

  if (appId === "parcours-sap-iee2e") {
    return <SapIee2eWorkspacePage />;
  }

  if (appId === "administration") {
    return <AdminPortalPage />;
  }

  return <Navigate to="/workspace" replace />;
}
