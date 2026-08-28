import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext.js";
import { ProtectedRoute } from "./auth/ProtectedRoute.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { LocaleProvider } from "./i18n/LocaleProvider.js";
import { WorkspaceLayout } from "./layouts/WorkspaceLayout.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { AcademicPortalPage } from "./pages/public/AcademicPortalPage.js";
import { CertificateVerifyPage } from "./pages/public/CertificateVerifyPage.js";
import { CourseEditionPage } from "./course-edition/CourseEditionPage.js";
import { LearnerHomePage } from "./pages/workspace/LearnerHomePage.js";
import { ModuleHubPage } from "./pages/workspace/modules/ModuleHubPage.js";
import { WorkspaceAppPage } from "./pages/workspace/WorkspaceAppPage.js";
import { PlaybackV2Root } from "./playback/v2/PlaybackV2Root.js";
import { SapIee2ePocApp } from "./poc/sap-iee2e/SapIee2ePocApp.js";
import { TeachingDeckPage } from "./teaching-deck/TeachingDeckPage.js";
import { ThemeProvider } from "./theme/ThemeProvider.js";

export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<AcademicPortalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify/:token" element={<CertificateVerifyPage />} />
      {/* Wave 2A Playback Zero — isolated prototype, not production navigation */}
      <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
      <Route path="/poc/sap-iee2e" element={<SapIee2ePocApp />} />
      <Route path="/poc/sap-iee2e/*" element={<SapIee2ePocApp />} />
      <Route element={<ProtectedRoute />}>
        <Route path="workspace/teaching-deck/:moduleCode" element={<TeachingDeckPage />} />
        <Route element={<WorkspaceLayout />}>
          <Route path="workspace" element={<LearnerHomePage />} />
          <Route path="workspace/modules/:moduleCode" element={<ModuleHubPage />} />
          <Route
            path="workspace/modules/:moduleCode/course-edition/:surfaceId?"
            element={<CourseEditionPage />}
          />
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
