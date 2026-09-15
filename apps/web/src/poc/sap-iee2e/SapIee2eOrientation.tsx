import type { ReactNode } from "react";

import { SAP_OFFICIAL_EXTERNAL_RESOURCES } from "./officialCourse.js";
import { SapOfficialExternalLink } from "./SapOfficialLaunchLink.js";

export function SapIee2eOrientation(): ReactNode {
  return (
    <article className="sap-iee2e-poc__card sap-iee2e-poc__teach" data-testid="sap-sofa-orientation">
      <div className="sap-iee2e-poc__ribbon">Ce que TEC.ERP fait — et ne fait pas</div>
      <h2 className="sap-iee2e-poc__h2">Trois preuves, trois émetteurs</h2>
      <ol className="sap-iee2e-poc__gold-rules">
        <li>
          <strong>SAP Learning</strong> enseigne, évalue et émet le SAP Achievement. Deux tentatives
          d’examen, selon les règles SAP, dans la fenêtre officielle (12 mois).
        </li>
        <li>
          <strong>La certification professionnelle SAP</strong> est une autre épreuve, émise par SAP.
          TEC.ERP ne la délivre pas et n’en promet aucune équivalence.
        </li>
        <li>
          <strong>L’attestation du Collège</strong> (Argent / Or) est un historique institutionnel
          distinct. Elle n’est pas une certification SAP et ne fait pas partie du parcours Analyste
          ERP SAP.
        </li>
      </ol>
      <p className="sap-iee2e-poc__muted">
        TEC.ERP organise la cohorte, oriente vers learning.sap.com, enregistre la progression
        déclarée et l’accompagnement. La vérité officielle demeure sur SAP Learning. TEC.ERP
        n’intègre jamais SAP Learning en iframe.
      </p>
      <h3 className="sap-iee2e-poc__h3">Ressources SAP officielles</h3>
      <ul data-testid="sap-official-external-resources">
        {SAP_OFFICIAL_EXTERNAL_RESOURCES.map((resource) => (
          <li key={resource.id}>
            <SapOfficialExternalLink href={resource.href} testId={`sap-external-${resource.id}`}>
              {resource.labelFr}
            </SapOfficialExternalLink>
          </li>
        ))}
      </ul>
      <p className="sap-iee2e-poc__muted">
        Best Practices, SAP Activate et SAP Business Suite se consultent depuis le parcours
        officiel SAP Learning. TEC.ERP n’ouvre pas de page interne SAP et ne reconstruit pas les
        unités. Si SAP Learning affiche une adresse se terminant par /null, ou un bandeau
        demandant d’actualiser le contenu — parfois plusieurs fois sur la page d’erreur SAP —,
        cela vient de la plateforme SAP, pas de TEC.ERP. Restez sur le parcours officiel et
        actualisez dans SAP Learning.
      </p>
    </article>
  );
}
