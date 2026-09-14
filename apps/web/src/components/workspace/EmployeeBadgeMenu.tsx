import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { getEmployeeInitials } from "../../workspace/employeeDisplay.js";
import { ROLE_LABELS } from "../../workspace/workspaceCopy.js";

export interface EmployeeBadgeMenuProps {
  readonly employee: AuthenticatedEmployee;
  readonly onLogout: () => void;
  /** Avatar-only trigger; identity is shown elsewhere in the compact shell. */
  readonly compact?: boolean;
}

export function EmployeeBadgeMenu({
  employee,
  onLogout,
  compact = false,
}: EmployeeBadgeMenuProps): ReactNode {
  const [open, setOpen] = useState(false);
  const initials = getEmployeeInitials(employee.displayName);

  return (
    <div className="workspace-employee-badge" data-testid="employee-badge-menu">
      <button
        type="button"
        className={`workspace-employee-badge__trigger${compact ? " workspace-employee-badge__trigger--compact" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${employee.displayName} — ${ROLE_LABELS[employee.role]}`}
        onClick={() => setOpen((current) => !current)}
        data-testid="employee-badge-trigger"
      >
        <span className="workspace-employee-badge__avatar" aria-hidden="true">
          {initials}
        </span>
        <span
          className="workspace-employee-badge__identity"
          data-testid="employee-identity"
          hidden={compact}
        >
          <span className="workspace-employee-badge__name">{employee.displayName}</span>
          <span className="workspace-employee-badge__meta">
            {employee.employeeNumber} · {ROLE_LABELS[employee.role]}
          </span>
        </span>
      </button>

      {open ? (
        <div className="workspace-employee-badge__menu" role="menu" data-testid="employee-badge-dropdown">
          <p className="workspace-employee-badge__company">{employee.companyName}</p>
          <Link
            to="/workspace/apps/profil"
            role="menuitem"
            onClick={() => setOpen(false)}
            data-testid="employee-badge-profile-link"
          >
            Mon profil
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            data-testid="logout-button"
          >
            Se déconnecter
          </button>
        </div>
      ) : null}
    </div>
  );
}
