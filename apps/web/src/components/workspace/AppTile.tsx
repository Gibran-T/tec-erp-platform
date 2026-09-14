import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { WorkspaceAppDefinition } from "../../workspace/appRegistry.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import { ACCESS_PREPARING_LABEL } from "../../workspace/workspaceCopy.js";

export interface AppTileProps {
  readonly app: WorkspaceAppDefinition;
  /** Optional exceptional status — normal day-1 access shows no badge. */
  readonly exceptionalLabel?: string | null;
}

export function AppTile({ app, exceptionalLabel = null }: AppTileProps): ReactNode {
  const preparing = app.access === "preparing";

  return (
    <Link
      to={getAppPath(app.id)}
      className={`workspace-app-tile${preparing ? " workspace-app-tile--preparing" : " workspace-app-tile--day1"}`}
      data-testid={`workspace-app-tile-${app.id}`}
    >
      <span className="workspace-app-tile__label">{app.label}</span>
      {preparing ? (
        <span className="workspace-app-tile__badge" data-testid="workspace-app-tile-preparing">
          {ACCESS_PREPARING_LABEL}
        </span>
      ) : exceptionalLabel ? (
        <span
          className="workspace-app-tile__badge workspace-app-tile__badge--exception"
          data-testid="workspace-app-tile-exception"
        >
          {exceptionalLabel}
        </span>
      ) : null}
    </Link>
  );
}
