import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext.js";
import { ProtectedRoute } from "./auth/ProtectedRoute.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { WorkspaceLayout } from "./layouts/WorkspaceLayout.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { WorkspaceAppPage } from "./pages/workspace/WorkspaceAppPage.js";
import { WorkspaceHomePage } from "./pages/workspace/WorkspaceHomePage.js";

export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="/workspace" replace />} />
          <Route path="workspace" element={<WorkspaceHomePage />} />
          <Route path="workspace/apps/:appId" element={<WorkspaceAppPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export function App(): ReactNode {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
