import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { AppLayout } from "./layouts/AppLayout.js";
import { HomePage } from "./pages/HomePage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";

export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function App(): ReactNode {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
