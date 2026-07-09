import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { WorkspaceAppDefinition } from "../../workspace/appRegistry.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import { ACCESS_PREPARING_LABEL } from "../../workspace/workspaceCopy.js";

export interface AppTileProps {
  readonly app: WorkspaceAppDefinition;
}

export function AppTile({ app }: AppTileProps): ReactNode {
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
      ) : (
        <span className="workspace-app-tile__badge workspace-app-tile__badge--active">Accès actif</span>
      )}
    </Link>
  );
}
