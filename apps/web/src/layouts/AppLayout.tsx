import { AppShell, PageHeader } from "@tec-platform/ui";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

export function AppLayout(): ReactNode {
  return (
    <AppShell
      topNav={<div>TEC.ERP Platform</div>}
      sidebar={
        <nav aria-label="Primary">
          <ul>
            <li>Home</li>
            <li>Platform</li>
          </ul>
        </nav>
      }
      rightPanel={<div>Context Panel</div>}
    >
      <PageHeader title="TEC.ERP" subtitle="Enterprise learning platform shell" />
      <Outlet />
    </AppShell>
  );
}
