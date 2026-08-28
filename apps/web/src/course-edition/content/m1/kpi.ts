import type { ModuleKpiLearningView } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_KPI: ModuleKpiLearningView = {
  name: "Exactitude d’inventaire",
  definition:
    "Proportion des quantités système alignées avec l’observation physique sur l’article et le site observés.",
  formula: "Quantité physique ÷ Quantité système × 100",
  unit: "%",
  period: "Signal M1 — DC-MTL",
  target: "≥ 98 %",
  actual: "90 %",
  variance: "−8 pts",
  trend: "À risque",
  source: `Mémo ${M1_SPINE.documentRefs.inventorySignal} · ${M1_SPINE.materialSku}`,
  interpretation:
    "L’écart 40/36 indique une exactitude insuffisante pour soutenir promesse client et valorisation sans réconciliation.",
  risk: "Décisions ventes/approvisionnement/finance sur une disponibilité incorrecte.",
  recommendedAction:
    "Clarifier le propriétaire inventaire, aligner système/terrain, partager l’impact avant ajustement.",
  affectedProcess: "Inventaire / coordination inter-départements",
  affectedDepartment: "Entrepôt · TI · Opérations · Ventes · Finance",
};
