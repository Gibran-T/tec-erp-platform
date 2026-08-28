import type { ReactNode } from "react";

import { KpiExplainedCard } from "../../living-erp/components/KpiExplainedCard.js";
import type { MissionBilanContent, ModuleKpiLearningView } from "../types.js";

export interface MissionBilanProps {
  readonly bilan: MissionBilanContent;
  readonly kpi: ModuleKpiLearningView;
  readonly completedMissionCodes: readonly string[];
}

export function MissionBilan(props: MissionBilanProps): ReactNode {
  const { bilan, kpi } = props;

  return (
    <section className="ce-mission-bilan" data-testid="mission-bilan">
      <header>
        <h2 data-testid="mission-bilan-title">{bilan.title}</h2>
        <p data-testid="mission-bilan-actions">{bilan.learnerActionsSummary}</p>
      </header>

      <div className="ce-mission-bilan__grid">
        <article>
          <h3>Missions complétées (parcours)</h3>
          <ul data-testid="mission-bilan-missions">
            {props.completedMissionCodes.length > 0 ? (
              props.completedMissionCodes.map((code) => <li key={code}>{code}</li>)
            ) : (
              <li>Complétez M1-M01 à M1-M03 dans le Centre de mission pour enrichir cette vue.</li>
            )}
          </ul>
        </article>

        <article>
          <h3>Décisions clés</h3>
          <ul data-testid="mission-bilan-decisions">
            {bilan.keyDecisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3>Concepts reconnus</h3>
          <ul data-testid="mission-bilan-concepts">
            {bilan.recognizedConcepts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3>Conséquence authored</h3>
          <p data-testid="mission-bilan-consequence">{bilan.authoredConsequence}</p>
        </article>

        <article>
          <h3>Impact transversal NordHabitat</h3>
          <p data-testid="mission-bilan-impact">{bilan.crossFunctionalImpact}</p>
          <p>
            <strong>Départements touchés :</strong> {bilan.affectedDepartments.join(" · ")}
          </p>
        </article>

        <article>
          <h3>Forces</h3>
          <ul data-testid="mission-bilan-strengths">
            {bilan.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3>Écarts / dimensions manquantes</h3>
          <ul data-testid="mission-bilan-gaps">
            {bilan.gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3>Action recommandée</h3>
          <p data-testid="mission-bilan-action">{bilan.recommendedAction}</p>
          <p data-testid="mission-bilan-improvement">{bilan.improvementGuidance}</p>
        </article>
      </div>

      <section data-testid="mission-bilan-kpi">
        <h3>Lecture KPI</h3>
        <p>{bilan.kpiInterpretation}</p>
        <p>{bilan.kpiImpact}</p>
        <p>
          Processus : {kpi.affectedProcess} · Départements : {kpi.affectedDepartment}
        </p>
        <KpiExplainedCard
          name={kpi.name}
          definition={kpi.definition}
          formula={kpi.formula}
          unit={kpi.unit}
          period={kpi.period}
          target={kpi.target}
          actual={kpi.actual}
          variance={kpi.variance}
          trend={kpi.trend}
          source={kpi.source}
          interpretation={kpi.interpretation}
          risk={kpi.risk}
          recommendedAction={kpi.recommendedAction}
          testId="mission-bilan-kpi-card"
        />
      </section>
    </section>
  );
}
