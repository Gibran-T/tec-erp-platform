import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAppPath } from "../../workspace/appRegistry.js";
import { SAP_ANALYSTE_PROGRAM_TITLE } from "../../workspace/sapAnalysteProduct.js";

const SAP_SOFA_CHECKLIST = [
  "Confirmer l’accès SAP Learning",
  "Préparer la Semaine Zéro",
  "Ouvrir le parcours officiel",
  "Déclarer votre progression",
] as const;

export function WorkspaceContextPanel(): ReactNode {
  return (
    <aside className="workspace-context-panel" data-testid="workspace-context-panel">
      <h2>Votre parcours SAP</h2>
      <ul className="workspace-context-panel__checklist" data-testid="workspace-context-checklist">
        {SAP_SOFA_CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <section
        className="workspace-context-panel__mission"
        data-testid="workspace-context-mission"
        aria-labelledby="sap-sofa-next-action"
      >
        <h3 id="sap-sofa-next-action">Prochaine action</h3>
        <p data-testid="workspace-context-mission-status">{SAP_ANALYSTE_PROGRAM_TITLE}</p>
        <Link
          className="workspace-context-panel__mission-link"
          to={getAppPath("parcours-sap-iee2e")}
          data-testid="workspace-context-mission-link"
        >
          Ouvrir mon parcours SAP
        </Link>
      </section>
    </aside>
  );
}
