import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import { NORDHABITAT_TAGLINE } from "../../workspace/workspaceCopy.js";
import { EmployeeBadgeMenu } from "./EmployeeBadgeMenu.js";

export interface WorkspaceTopBarProps {
  readonly employee: AuthenticatedEmployee;
  readonly onLogout: () => void;
}

export function WorkspaceTopBar({ employee, onLogout }: WorkspaceTopBarProps): ReactNode {
  return (
    <div className="workspace-topbar" data-testid="workplace-topbar">
      <div className="workspace-topbar__brand">
        <span className="workspace-topbar__logo">NordHabitat</span>
        <span className="workspace-topbar__tagline">{NORDHABITAT_TAGLINE}</span>
      </div>
      <EmployeeBadgeMenu employee={employee} onLogout={() => void onLogout()} />
    </div>
  );
}
