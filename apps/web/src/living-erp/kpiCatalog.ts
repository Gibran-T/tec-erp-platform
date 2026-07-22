import type { AnalyticsKpiCard } from "../api/analytics.js";
import type { KpiExplainedCardProps } from "./components/KpiExplainedCard.js";

const DEFAULT_KPI_META = {
  definition: "Indicateur opérationnel issu des transactions et missions du parcours actif.",
  formula: "Agrégation des preuves ERP disponibles pour la période du parcours.",
  unit: "selon indicateur",
  period: "Parcours pédagogique sélectionné",
  source: "Moteur analytique TEC.ERP (données réelles du parcours)",
  interpretation:
    "Lisez la valeur avec le contexte processus : une variation n’est pas un classement entre apprenants.",
  risk: "Données partielles, délais d’enregistrement ou exceptions non reprises peuvent fausser la lecture.",
  recommendedAction: "Relier l’indicateur à un document, une mission ou une exception avant de décider.",
  targetHint: "Cible pédagogique du module / processus",
} as const;

export function explainKpi(kpi: AnalyticsKpiCard): KpiExplainedCardProps {
  const actual = kpi.formattedValue || (kpi.value === null ? "—" : String(kpi.value));
  return {
    name: kpi.label,
    definition: `${kpi.label} — indicateur métier suivi dans le poste de travail ERP.`,
    formula: DEFAULT_KPI_META.formula,
    unit: kpi.unit || DEFAULT_KPI_META.unit,
    period: DEFAULT_KPI_META.period,
    target: DEFAULT_KPI_META.targetHint,
    actual,
    variance: kpi.stale ? "Données potentiellement anciennes" : "Écart non fourni par la source",
    trend: kpi.trend === "unknown" ? "stable" : kpi.trend,
    source: DEFAULT_KPI_META.source,
    interpretation: DEFAULT_KPI_META.interpretation,
    risk: DEFAULT_KPI_META.risk,
    recommendedAction: DEFAULT_KPI_META.recommendedAction,
    testId: `kpi-explained-${kpi.key}`,
  };
}
