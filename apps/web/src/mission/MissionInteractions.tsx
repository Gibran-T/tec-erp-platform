import type { MissionDetail } from "@tec-platform/contracts";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export type InteractionDefinition = NonNullable<MissionDetail["interactions"]>[number];

export type InteractionValue =
  | string
  | number
  | string[]
  | Array<{ leftKey: string; rightKey: string }>;

export type InteractionResponses = Record<string, InteractionValue>;

function pairKey(leftKey: string, rightKey: string): string {
  return `${leftKey}::${rightKey}`;
}

function SingleChoiceInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: string;
  disabled: boolean;
  onChange: (next: string) => void;
}): ReactNode {
  const options = interaction.options ?? [];

  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <ul className="workspace-mission__choice-list">
        {options.map((option) => (
          <li key={option.key}>
            <label className="workspace-mission__checkbox">
              <input
                type="radio"
                name={`interaction-${interaction.id}`}
                value={option.key}
                checked={value === option.key}
                onChange={() => onChange(option.key)}
                data-testid={`mission-choice-${interaction.id}-${option.key}`}
              />
              <span>
                {option.label}
                {option.description ? ` — ${option.description}` : ""}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function MultiChoiceInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: string[];
  disabled: boolean;
  onChange: (next: string[]) => void;
}): ReactNode {
  const options = interaction.options ?? [];
  const selected = new Set(value);

  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <ul className="workspace-mission__choice-list">
        {options.map((option) => (
          <li key={option.key}>
            <label className="workspace-mission__checkbox">
              <input
                type="checkbox"
                checked={selected.has(option.key)}
                onChange={() => {
                  const next = new Set(selected);
                  if (next.has(option.key)) {
                    next.delete(option.key);
                  } else {
                    next.add(option.key);
                  }
                  onChange([...next]);
                }}
                data-testid={`mission-choice-${interaction.id}-${option.key}`}
              />
              <span>
                {option.label}
                {option.description ? ` — ${option.description}` : ""}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function OrderingInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: string[];
  disabled: boolean;
  onChange: (next: string[]) => void;
}): ReactNode {
  const options = interaction.options ?? [];
  const order =
    value.length === options.length ? value : options.map((option) => option.key);

  const move = (index: number, direction: -1 | 1): void => {
    const target = index + direction;
    if (target < 0 || target >= order.length) {
      return;
    }
    const next = [...order];
    const [item] = next.splice(index, 1);
    if (item === undefined) {
      return;
    }
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <ol className="workspace-mission__ordering-list">
        {order.map((key, index) => {
          const option = options.find((item) => item.key === key);
          return (
            <li key={key}>
              <span>
                {index + 1}. {option?.label ?? key}
              </span>
              <span className="workspace-mission__ordering-actions">
                <button
                  type="button"
                  className="workspace-mission__link-button"
                  disabled={disabled || index === 0}
                  data-testid={`mission-order-up-${interaction.id}-${key}`}
                  onClick={() => move(index, -1)}
                >
                  Monter
                </button>
                <button
                  type="button"
                  className="workspace-mission__link-button"
                  disabled={disabled || index === order.length - 1}
                  data-testid={`mission-order-down-${interaction.id}-${key}`}
                  onClick={() => move(index, 1)}
                >
                  Descendre
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}

function NumericInputInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: number | "";
  disabled: boolean;
  onChange: (next: number | "") => void;
}): ReactNode {
  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <label className="workspace-mission__justification">
        Valeur numérique
        <input
          type="number"
          className="workspace-mission__numeric-input"
          value={value === "" ? "" : String(value)}
          disabled={disabled}
          data-testid={`mission-numeric-${interaction.id}`}
          onChange={(event) => {
            const raw = event.target.value.trim();
            if (raw === "") {
              onChange("");
              return;
            }
            const parsed = Number(raw);
            onChange(Number.isFinite(parsed) ? parsed : "");
          }}
        />
      </label>
    </fieldset>
  );
}

function TextAnalysisInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: string;
  disabled: boolean;
  onChange: (next: string) => void;
}): ReactNode {
  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <label className="workspace-mission__justification">
        Réponse
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={5}
          maxLength={1000}
          data-testid={`mission-text-${interaction.id}`}
        />
      </label>
    </fieldset>
  );
}

function DiagnosisRecommendationInteraction({
  interaction,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  value: Array<{ leftKey: string; rightKey: string }>;
  disabled: boolean;
  onChange: (next: Array<{ leftKey: string; rightKey: string }>) => void;
}): ReactNode {
  const options = useMemo(() => interaction.options ?? [], [interaction.options]);
  const [leftKey, setLeftKey] = useState(options[0]?.key ?? "");
  const [rightKey, setRightKey] = useState(options[1]?.key ?? options[0]?.key ?? "");

  useEffect(() => {
    const first = options[0];
    const second = options[1] ?? options[0];
    if (!leftKey && first) {
      setLeftKey(first.key);
    }
    if (!rightKey && second) {
      setRightKey(second.key);
    }
  }, [leftKey, options, rightKey]);

  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <div className="workspace-mission__mapping-controls">
        <label>
          Élément
          <select
            value={leftKey}
            onChange={(event) => setLeftKey(event.target.value)}
            data-testid={`mission-diag-left-${interaction.id}`}
          >
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Association
          <select
            value={rightKey}
            onChange={(event) => setRightKey(event.target.value)}
            data-testid={`mission-diag-right-${interaction.id}`}
          >
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="workspace-mission__button workspace-mission__button--secondary"
          data-testid={`mission-diag-add-${interaction.id}`}
          onClick={() => {
            if (!leftKey || !rightKey || leftKey === rightKey) {
              return;
            }
            const key = pairKey(leftKey, rightKey);
            if (value.some((item) => pairKey(item.leftKey, item.rightKey) === key)) {
              return;
            }
            onChange([...value, { leftKey, rightKey }]);
          }}
        >
          Ajouter l’association
        </button>
      </div>
      <ul className="workspace-mission__mapping-list" data-testid={`mission-diag-list-${interaction.id}`}>
        {value.map((mapping) => {
          const leftLabel =
            options.find((item) => item.key === mapping.leftKey)?.label ?? mapping.leftKey;
          const rightLabel =
            options.find((item) => item.key === mapping.rightKey)?.label ?? mapping.rightKey;
          const key = pairKey(mapping.leftKey, mapping.rightKey);
          return (
            <li key={key}>
              <span>
                {leftLabel} → {rightLabel}
              </span>
              <button
                type="button"
                className="workspace-mission__link-button"
                data-testid={`mission-diag-remove-${interaction.id}-${key}`}
                onClick={() =>
                  onChange(
                    value.filter((item) => pairKey(item.leftKey, item.rightKey) !== key),
                  )
                }
              >
                Retirer
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function ProcessMapAcknowledgementInteraction({
  interaction,
  contextItems,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  contextItems: NonNullable<MissionDetail["contextItems"]>;
  value: string[];
  disabled: boolean;
  onChange: (next: string[]) => void;
}): ReactNode {
  const selected = new Set(value);

  return (
    <fieldset
      className="workspace-mission__fieldset"
      disabled={disabled}
      data-testid={`mission-interaction-${interaction.id}`}
    >
      <legend>{interaction.prompt}</legend>
      <ul className="workspace-mission__context-list">
        {contextItems.map((item) => (
          <li key={item.key}>
            <article
              className="workspace-mission__context-item"
              data-testid={`mission-context-${item.key}`}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <label className="workspace-mission__checkbox">
                <input
                  type="checkbox"
                  checked={selected.has(item.key)}
                  onChange={() => {
                    const next = new Set(selected);
                    if (next.has(item.key)) {
                      next.delete(item.key);
                    } else {
                      next.add(item.key);
                    }
                    onChange([...next]);
                  }}
                  data-testid={`mission-ack-${item.key}`}
                />
                <span>
                  Je reconnais ce contexte
                  {item.required ? " (requis)" : ""}
                </span>
              </label>
            </article>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function MissionInteractionRenderer({
  interaction,
  contextItems,
  value,
  disabled,
  onChange,
}: {
  interaction: InteractionDefinition;
  contextItems: MissionDetail["contextItems"];
  value: InteractionValue | undefined;
  disabled: boolean;
  onChange: (next: InteractionValue) => void;
}): ReactNode {
  switch (interaction.type) {
    case "SINGLE_CHOICE":
      return (
        <SingleChoiceInteraction
          interaction={interaction}
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "MULTI_CHOICE":
      return (
        <MultiChoiceInteraction
          interaction={interaction}
          value={Array.isArray(value) && value.every((item) => typeof item === "string")
            ? value
            : []}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "ORDERING":
      return (
        <OrderingInteraction
          interaction={interaction}
          value={Array.isArray(value) && value.every((item) => typeof item === "string")
            ? value
            : []}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "NUMERIC_INPUT":
      return (
        <NumericInputInteraction
          interaction={interaction}
          value={typeof value === "number" ? value : ""}
          disabled={disabled}
          onChange={(next) => {
            if (next === "") {
              onChange("");
              return;
            }
            onChange(next);
          }}
        />
      );
    case "TEXT_ANALYSIS":
      return (
        <TextAnalysisInteraction
          interaction={interaction}
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "DIAGNOSIS_RECOMMENDATION":
      return (
        <DiagnosisRecommendationInteraction
          interaction={interaction}
          value={
            Array.isArray(value) &&
            value.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                "leftKey" in item &&
                "rightKey" in item,
            )
              ? (value as Array<{ leftKey: string; rightKey: string }>)
              : []
          }
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "PROCESS_MAP_ACKNOWLEDGEMENT":
      return (
        <ProcessMapAcknowledgementInteraction
          interaction={interaction}
          contextItems={contextItems ?? []}
          value={Array.isArray(value) && value.every((item) => typeof item === "string")
            ? value
            : []}
          disabled={disabled}
          onChange={onChange}
        />
      );
    default:
      return (
        <p
          className="workspace-first-day__error"
          role="alert"
          data-testid={`mission-interaction-unsupported-${interaction.id}`}
        >
          Type d’interaction non pris en charge pour le moment.
        </p>
      );
  }
}

export function buildGenericResponses(
  interactions: readonly InteractionDefinition[],
  responses: InteractionResponses,
): Array<{
  interactionId: string;
  value: string | number | string[] | Array<{ leftKey: string; rightKey: string }>;
}> {
  return interactions.map((interaction) => {
    const current = responses[interaction.id];

    if (interaction.type === "ORDERING") {
      const options = interaction.options ?? [];
      const order =
        Array.isArray(current) && current.every((item) => typeof item === "string")
          ? current
          : options.map((option) => option.key);
      return { interactionId: interaction.id, value: order };
    }

    if (interaction.type === "NUMERIC_INPUT") {
      return {
        interactionId: interaction.id,
        value: typeof current === "number" ? current : Number.NaN,
      };
    }

    if (
      interaction.type === "MULTI_CHOICE" ||
      interaction.type === "PROCESS_MAP_ACKNOWLEDGEMENT"
    ) {
      return {
        interactionId: interaction.id,
        value: Array.isArray(current) && current.every((item) => typeof item === "string")
          ? current
          : [],
      };
    }

    if (interaction.type === "DIAGNOSIS_RECOMMENDATION") {
      return {
        interactionId: interaction.id,
        value:
          Array.isArray(current) &&
          current.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "leftKey" in item &&
              "rightKey" in item,
          )
            ? (current as Array<{ leftKey: string; rightKey: string }>)
            : [],
      };
    }

    return {
      interactionId: interaction.id,
      value: typeof current === "string" ? current : "",
    };
  });
}
