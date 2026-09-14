import type { ReactNode } from "react";

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
        déclarée et l’accompagnement. La vérité officielle demeure sur SAP Learning.
      </p>
    </article>
  );
}
