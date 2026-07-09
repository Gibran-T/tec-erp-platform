import type { ReactNode } from "react";

import { DASHBOARD_PREVIEW_COPY, DASHBOARD_PREVIEW_TITLE } from "../../workspace/workspaceCopy.js";

export function DashboardPreview(): ReactNode {
  return (
    <section className="workspace-dashboard-preview" data-testid="workspace-dashboard-preview">
      <h3>{DASHBOARD_PREVIEW_TITLE}</h3>
      <div className="workspace-dashboard-preview__placeholder" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{DASHBOARD_PREVIEW_COPY}</p>
    </section>
  );
}
