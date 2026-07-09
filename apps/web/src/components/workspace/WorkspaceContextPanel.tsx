import type { ReactNode } from "react";

import { CONTEXT_PANEL_CHECKLIST, CONTEXT_PANEL_TITLE } from "../../workspace/workspaceCopy.js";

export function WorkspaceContextPanel(): ReactNode {
  return (
    <aside className="workspace-context-panel" data-testid="workspace-context-panel">
      <h2>{CONTEXT_PANEL_TITLE}</h2>
      <ul className="workspace-context-panel__checklist">
        {CONTEXT_PANEL_CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
