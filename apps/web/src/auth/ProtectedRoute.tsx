import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./AuthContext.js";

export function ProtectedRoute(): ReactNode {
  const { status } = useAuth();

  if (status === "restoring") {
    return (
      <div data-testid="auth-restoring" role="status" aria-live="polite">
        Connexion en cours… / Signing you in…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
