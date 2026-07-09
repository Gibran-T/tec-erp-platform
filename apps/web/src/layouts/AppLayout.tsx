import { AppShell, PageHeader } from "@tec-platform/ui";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { FirstDayWelcome } from "../components/FirstDayWelcome.js";

export function AppLayout(): ReactNode {
  const { employee, logout } = useAuth();

  return (
    <AppShell
      topNav={
        <div data-testid="workplace-topbar">
          <span>NordHabitat</span>
          {employee ? (
            <span data-testid="employee-identity">
              {employee.displayName} · {employee.employeeNumber}
            </span>
          ) : null}
          <button type="button" onClick={() => void logout()} data-testid="logout-button">
            Se déconnecter
          </button>
        </div>
      }
      sidebar={
        <nav aria-label="Primary">
          <ul>
            <li>Accueil</li>
            <li>Mon poste</li>
          </ul>
        </nav>
      }
      rightPanel={<div>Panneau contextuel</div>}
    >
      <PageHeader title="NordHabitat" subtitle="Poste de travail numérique" />
      <FirstDayWelcome employeeName={employee?.displayName} />
      <Outlet />
    </AppShell>
  );
}
