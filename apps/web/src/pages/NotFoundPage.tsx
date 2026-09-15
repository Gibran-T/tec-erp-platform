import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAppPath } from "../workspace/appRegistry.js";

export function NotFoundPage(): ReactNode {
  return (
    <section data-testid="not-found-page" className="living-home-section" role="status">
      <h1 className="living-type-page">Page introuvable</h1>
      <p className="living-lede">
        Cette adresse n’existe pas dans l’espace institutionnel TEC.ERP. Le contenu du parcours
        officiel demeure sur SAP Learning.
      </p>
      <p>
        <Link to={getAppPath("parcours-sap-iee2e")}>Retour au parcours</Link>
        {" · "}
        <Link to="/workspace">Retour à l’accueil</Link>
      </p>
    </section>
  );
}
