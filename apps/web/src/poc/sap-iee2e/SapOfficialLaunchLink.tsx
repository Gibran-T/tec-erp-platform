import type { ReactNode } from "react";

import {
  officialSapLearningLaunchHref,
  safeExternalSapHref,
  SAP_OFFICIAL_LAUNCH_LABEL,
} from "./officialCourse.js";

export interface SapOfficialLaunchLinkProps {
  readonly className?: string;
  readonly testId?: string;
  readonly children?: ReactNode;
}

/**
 * One click = one new tab. No iframe, no window.open, no SAP lesson URL construction.
 */
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

export interface SapOfficialExternalLinkProps {
  readonly href: string;
  readonly className?: string;
  readonly testId?: string;
  readonly children: ReactNode;
}

export function SapOfficialExternalLink({
  href,
  className,
  testId,
  children,
}: SapOfficialExternalLinkProps): ReactNode {
  return (
    <a
      className={className}
      href={safeExternalSapHref(href)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
    >
      {children}
    </a>
  );
}
