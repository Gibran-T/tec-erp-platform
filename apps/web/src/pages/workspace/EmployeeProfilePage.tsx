import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { getEmployeeInitials } from "../../workspace/employeeDisplay.js";
import { ROLE_LABELS } from "../../workspace/workspaceCopy.js";

function ProfileField({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="workspace-profile__field" data-testid={`profile-field-${label}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ProfileContent({ employee }: { employee: AuthenticatedEmployee }): ReactNode {
  const initials = getEmployeeInitials(employee.displayName);

  return (
    <section data-testid="employee-profile-page">
      <header className="workspace-profile__header">
        <span className="workspace-profile__avatar" aria-hidden="true">
          {initials}
        </span>
        <div>
          <h1>{employee.displayName}</h1>
          <p>{employee.companyName}</p>
        </div>
      </header>

      <dl className="workspace-profile__details">
        <ProfileField label="nom" value={employee.displayName} />
        <ProfileField label="matricule" value={employee.employeeNumber} />
        <ProfileField label="role" value={ROLE_LABELS[employee.role]} />
        <ProfileField label="entreprise" value={employee.companyName} />
        <ProfileField label="courriel" value={employee.email} />
      </dl>
    </section>
  );
}

export function EmployeeProfilePage(): ReactNode {
  const { employee } = useAuth();

  if (!employee) {
    return null;
  }

  return <ProfileContent employee={employee} />;
}
