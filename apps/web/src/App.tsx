import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext.js";
import { ProtectedRoute } from "./auth/ProtectedRoute.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { LocaleProvider } from "./i18n/LocaleProvider.js";
import { WorkspaceLayout } from "./layouts/WorkspaceLayout.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { CertificateVerifyPage } from "./pages/public/CertificateVerifyPage.js";
import { LearnerHomePage } from "./pages/workspace/LearnerHomePage.js";
import { ModuleHubPage } from "./pages/workspace/modules/ModuleHubPage.js";
import { WorkspaceAppPage } from "./pages/workspace/WorkspaceAppPage.js";
import { PlaybackV2Root } from "./playback/v2/PlaybackV2Root.js";
import { ThemeProvider } from "./theme/ThemeProvider.js";

export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify/:token" element={<CertificateVerifyPage />} />
      {/* Wave 2A Playback Zero — isolated prototype, not production navigation */}
      <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="/workspace" replace />} />
          <Route path="workspace" element={<LearnerHomePage />} />
          <Route path="workspace/modules/:moduleCode" element={<ModuleHubPage />} />
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
      <ThemeProvider>
        <AuthProvider>
          <LocaleProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
