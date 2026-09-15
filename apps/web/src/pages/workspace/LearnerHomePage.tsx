import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.js";
import { AppLauncherGrid } from "../../components/workspace/AppLauncherGrid.js";
import { SapIee2eDiscoveryCard } from "../../poc/sap-iee2e/SapIee2eDiscoveryCard.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import {
  SAP_ANALYSTE_INSTITUTION,
  SAP_ANALYSTE_PROGRAM_SUBTITLE,
  SAP_ANALYSTE_PROGRAM_TITLE,
  buildSapAnalysteWelcome,
} from "../../workspace/sapAnalysteProduct.js";

export function LearnerHomePage(): ReactNode {
  const { employee } = useAuth();

  if (!employee) return null;

  return (
    <section data-testid="workspace-home-page" className="living-learner-home">
      <header className="living-home-section living-home-section--primary living-card--l1">
        <p className="living-kicker">{SAP_ANALYSTE_INSTITUTION}</p>
        <h1 className="living-type-page">{SAP_ANALYSTE_PROGRAM_TITLE}</h1>
        <p className="living-lede">{SAP_ANALYSTE_PROGRAM_SUBTITLE}</p>
        <p data-testid="workspace-welcome-message" className="living-lede">
          {buildSapAnalysteWelcome(employee.displayName)}
        </p>
        <ol className="living-home-path" aria-label="Organisation du parcours">
          <li>Accueil</li>
          <li>Parcours SAP</li>
          <li>Semaine Zéro</li>
          <li>S1–S10</li>
          <li>SAP Learning</li>
        </ol>
        <p>
          <Link to={getAppPath("parcours-sap-iee2e")}>Ouvrir mon parcours SAP</Link>
        </p>
      </header>

      <SapIee2eDiscoveryCard />
      <AppLauncherGrid />
    </section>
  );
}
