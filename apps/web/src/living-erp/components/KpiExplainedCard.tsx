import type { ReactNode } from "react";

import { useLocale } from "../../i18n/LocaleProvider.js";
import { StatusChip, toneForStatus } from "./StatusChip.js";

export interface KpiExplainedCardProps {
  readonly name: string;
  readonly definition: string;
  readonly formula: string;
  readonly unit: string;
  readonly period: string;
  readonly target: string;
  readonly actual: string;
  readonly variance: string;
  readonly trend: string;
  readonly source: string;
  readonly interpretation: string;
  readonly risk: string;
  readonly recommendedAction: string;
  readonly testId?: string;
}

export function KpiExplainedCard(props: KpiExplainedCardProps): ReactNode {
  const { t } = useLocale();
  return (
    <article className="living-kpi-card" data-testid={props.testId ?? "kpi-explained-card"}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <h3>{props.name}</h3>
        <StatusChip label={props.trend} tone={toneForStatus(props.trend)} />
      </header>
      <dl>
        <div>
          <dt>{t("kpi.definition")}</dt>
          <dd>{props.definition}</dd>
        </div>
        <div>
          <dt>{t("kpi.formula")}</dt>
          <dd>{props.formula}</dd>
        </div>
        <div>
          <dt>{t("kpi.unit")}</dt>
          <dd>{props.unit}</dd>
        </div>
        <div>
          <dt>{t("kpi.period")}</dt>
          <dd>{props.period}</dd>
        </div>
        <div>
          <dt>{t("kpi.target")}</dt>
          <dd>{props.target}</dd>
        </div>
        <div>
          <dt>{t("kpi.actual")}</dt>
          <dd>{props.actual}</dd>
        </div>
        <div>
          <dt>{t("kpi.variance")}</dt>
          <dd>{props.variance}</dd>
        </div>
        <div>
          <dt>{t("kpi.source")}</dt>
          <dd>{props.source}</dd>
        </div>
        <div>
          <dt>{t("kpi.interpretation")}</dt>
          <dd>{props.interpretation}</dd>
        </div>
        <div>
          <dt>{t("kpi.risk")}</dt>
          <dd>{props.risk}</dd>
        </div>
        <div>
          <dt>{t("kpi.action")}</dt>
          <dd>{props.recommendedAction}</dd>
        </div>
      </dl>
    </article>
  );
}
