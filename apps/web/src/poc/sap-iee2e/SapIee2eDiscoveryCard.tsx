import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import { SapIee2eReception } from "./SapIee2eReception.js";
import "./sap-iee2e-poc.css";

export function SapIee2eDiscoveryCard(): ReactNode {
  const { employee } = useAuth();

  return (
    <section
      className="sap-iee2e-poc sap-iee2e-poc--embedded"
      data-testid="learner-home-sap-iee2e"
      aria-labelledby="learner-home-sap-iee2e-title"
    >
      <SapIee2eReception
        compact
        displayName={employee?.displayName}
        parcoursTo={getAppPath("parcours-sap-iee2e")}
      />
    </section>
  );
}
