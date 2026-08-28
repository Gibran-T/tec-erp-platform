import { useMemo, useState, type ReactNode } from "react";

import {
  MissionInteractionRenderer,
  type InteractionResponses,
} from "../../mission/MissionInteractions.js";
import { scoreConnectionLab, type LabScoreResult } from "../scoreLab.js";
import type { ConnectionLabDefinition } from "../types.js";

export interface ConnectionLabProps {
  readonly lab: ConnectionLabDefinition;
  readonly onCompleted?: (result: LabScoreResult) => void;
}

export function ConnectionLab(props: ConnectionLabProps): ReactNode {
  const [responses, setResponses] = useState<InteractionResponses>({});
  const [result, setResult] = useState<LabScoreResult | null>(null);

  const contextItems = useMemo(() => [], []);

  const submit = (): void => {
    const scored = scoreConnectionLab(props.lab, responses);
    setResult(scored);
    props.onCompleted?.(scored);
  };

  return (
    <section className="ce-connection-lab" data-testid="connection-lab">
      <header>
        <h2 data-testid="connection-lab-title">{props.lab.title}</h2>
        <p>{props.lab.objective}</p>
      </header>

      <ol className="ce-connection-lab__activities">
        {props.lab.activities.map((activity) => (
          <li key={activity.id} data-testid={`connection-lab-activity-${activity.id}`}>
            <h3>{activity.title}</h3>
            <p>{activity.instruction}</p>
            <MissionInteractionRenderer
              interaction={activity.interaction}
              contextItems={contextItems}
              value={responses[activity.interaction.id]}
              disabled={false}
              onChange={(next) =>
                setResponses((current) => ({
                  ...current,
                  [activity.interaction.id]: next,
                }))
              }
            />
          </li>
        ))}
      </ol>

      <button type="button" data-testid="connection-lab-submit" onClick={submit}>
        Soumettre le laboratoire
      </button>

      {result ? (
        <aside className="ce-connection-lab__feedback" data-testid="connection-lab-feedback">
          <p data-testid="connection-lab-score">
            Score : {result.scorePercent} % ({result.earnedPoints}/{result.maxPoints}) —{" "}
            {result.passed ? "Seuil atteint" : "Seuil non atteint"}
          </p>
          <ul>
            {result.activityResults.map((activity) => (
              <li key={activity.activityId} data-testid={`connection-lab-result-${activity.activityId}`}>
                {activity.activityId}: {activity.earnedPoints}/{activity.maxPoints}
                {activity.feedback ? ` — ${activity.feedback}` : ""}
                {activity.matchedConcepts.length > 0
                  ? ` · Concepts : ${activity.matchedConcepts.join(", ")}`
                  : ""}
              </li>
            ))}
          </ul>
          <div data-testid="connection-lab-summary-feedback">
            <p>
              <strong>Relations correctes :</strong> {result.summaryFeedback.correctRelationships}
            </p>
            <p>
              <strong>Relations manquantes :</strong> {result.summaryFeedback.missingRelationships}
            </p>
            <p>
              <strong>Implication systémique :</strong>{" "}
              {result.summaryFeedback.systemicImplication}
            </p>
            <p>
              <strong>Amélioration :</strong> {result.summaryFeedback.improvement}
            </p>
          </div>
        </aside>
      ) : null}
    </section>
  );
}
