import type { ReactNode } from "react";

import {
  officialSapLearningLaunchHref,
  SAP_OFFICIAL_LAUNCH_LABEL,
} from "./officialCourse.js";

export interface SapOfficialLaunchLinkProps {
  readonly className?: string;
  readonly testId?: string;
  readonly children?: ReactNode;
}

export function SapOfficialLaunchLink({
  className,
  testId = "sap-official-launch",
  children = SAP_OFFICIAL_LAUNCH_LABEL,
}: SapOfficialLaunchLinkProps): ReactNode {
  return (
    <a
      className={className}
      href={officialSapLearningLaunchHref()}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      data-sap-official-launch="true"
    >
      {children}
    </a>
  );
}
