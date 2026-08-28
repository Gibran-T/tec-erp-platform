import { useState, type ReactNode } from "react";

import { scoreConsolidationQuiz, type QuizScoreResult } from "../scoreLab.js";
import type { ConsolidationQuizItem } from "../types.js";

export interface ModuleConsolidationProps {
  readonly items: readonly ConsolidationQuizItem[];
  readonly progressPercent: number;
  readonly moduleComplete: boolean;
  readonly onCompleted?: (result: QuizScoreResult) => void;
}

export function ModuleConsolidation(props: ModuleConsolidationProps): ReactNode {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizScoreResult | null>(null);

  const submit = (): void => {
    const scored = scoreConsolidationQuiz(props.items, answers);
    setResult(scored);
    props.onCompleted?.(scored);
  };

  return (
    <section className="ce-module-consolidation" data-testid="module-consolidation">
      <header>
        <h2>Consolidation du module</h2>
        <p data-testid="module-consolidation-progress">
          Progression Course Edition : {props.progressPercent} %
          {props.moduleComplete ? " — module consolidé" : ""}
        </p>
      </header>

      <ol className="ce-module-consolidation__quiz">
        {props.items.map((item) => (
          <li key={item.id} data-testid={`module-consolidation-item-${item.id}`}>
            <fieldset>
              <legend>{item.prompt}</legend>
              <ul>
                {item.options.map((option) => (
                  <li key={option.key}>
                    <label>
                      <input
                        type="radio"
                        name={item.id}
                        value={option.key}
                        checked={answers[item.id] === option.key}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [item.id]: option.key }))
                        }
                        data-testid={`module-consolidation-choice-${item.id}-${option.key}`}
                      />
                      <span>{option.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          </li>
        ))}
      </ol>

      <button type="button" data-testid="module-consolidation-submit" onClick={submit}>
        Soumettre le quiz de consolidation
      </button>

      {result ? (
        <aside data-testid="module-consolidation-result">
          <p>
            Résultat : {result.earned}/{result.total} ({result.percent} %) —{" "}
            {result.passed ? "Réussi" : "À retravailler"}
          </p>
          <ul>
            {result.results.map((item) => {
              const source = props.items.find((quizItem) => quizItem.id === item.id);
              return (
                <li key={item.id}>
                  {item.id}: {item.correct ? "Correct" : "Incorrect"}
                  {source ? ` — ${source.explanation}` : ""}
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}
    </section>
  );
}
