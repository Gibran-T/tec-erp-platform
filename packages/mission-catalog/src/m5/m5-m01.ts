import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m01-analyser-stock-reappro",
  "missionCode": "M5-M01",
  "moduleCode": "M5",
  "title": "Analyser les stocks et le signal de reapprovisionnement",
  "preview": "Interpretez le stockout DC-TRT sur SKU-HVAC-4421 et proposez un signal de reappro.",
  "briefing": "Bonjour,\n\nCanicule en Ontario : la demande HVAC explose. Tom signale un stockout imminents a DC-TRT sur SKU-HVAC-4421. DC-MTL a encore du stock, mais les couvertures divergent fortement.\n\nKarim te challenge sur le MAPE de la prevision. Denise veut une proposition de reapprovisionnement avec preuves avant le S&OP de la semaine prochaine.\n\nAnalyse les rapports, identifie le signal de reappro et documente l'evidence.\n\nDenise Roy\nSupply Chain — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 4 (cloture Sacre-Coeur) pour débloquer Supply Chain.",
  "sequence": 1,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-SC-01"
  ],
  "contextItems": [
    {
      "key": "ctx-stockout",
      "title": "Alerte stock DC-TRT",
      "body": "SKU-HVAC-4421 : stock libre DC-TRT = 0 unités (stockout). Demande hebdomadaire moyenne post-canicule : 28 unités. Seuil de reappro = 14 jours de couverture.",
      "required": true
    },
    {
      "key": "ctx-imbalance",
      "title": "Desequilibre inter-DC",
      "body": "DC-MTL : 47 jours de couverture (excès). DC-TRT : 0 jour (rupture). Dernier transfert STO-4408 : 12 unités pour Sacre-Coeur.",
      "required": true
    },
    {
      "key": "ctx-reorder",
      "title": "Politique reapprovisionnement",
      "body": "Point de commande : 14 jours de stock de securite. Lead time ThermoControl : 14 jours. Quantite economique suggeree : 40 unités.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "report-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est la premiere source d'information pour analyser la rupture DC-TRT ?",
      "options": [
        {
          "key": "stock-report",
          "label": "Rapport de stock par entrepot (DC-MTL / DC-TRT)"
        },
        {
          "key": "guess",
          "label": "Estimer la demande sans données"
        },
        {
          "key": "email-only",
          "label": "Se fier uniquement a l'email de Tom"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "stock-report"
        ]
      }
    },
    {
      "id": "analysis-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements doivent figurer dans votre analyse de reapprovisionnement ?",
      "options": [
        {
          "key": "stock-level",
          "label": "Niveau de stock actuel par DC"
        },
        {
          "key": "demand-trend",
          "label": "Tendance de demande (canicule)"
        },
        {
          "key": "reorder-qty",
          "label": "Quantite de reappro recommandee"
        },
        {
          "key": "evidence",
          "label": "Evidence documentee pour le S&OP"
        },
        {
          "key": "ignore-trt",
          "label": "Ignorer DC-TRT car MTL a du stock"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "stock-level",
          "demand-trend",
          "reorder-qty",
          "evidence"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "analysis-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la demarche d'analyse inventaire et signal de reappro.",
      "options": [
        {
          "key": "report",
          "label": "Consulter les rapports de stock inter-DC"
        },
        {
          "key": "analyze",
          "label": "Analyser demande et couverture (14 jours)"
        },
        {
          "key": "propose",
          "label": "Proposer quantite de reappro (40 unités)"
        },
        {
          "key": "evidence",
          "label": "Documenter l'evidence pour S&OP"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "report",
          "analyze",
          "propose",
          "evidence"
        ]
      }
    },
    {
      "id": "reorder-qty",
      "type": "NUMERIC_INPUT",
      "prompt": "Quelle quantite economique de reappro est suggeree pour SKU-HVAC-4421 ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 40,
        "numericTolerance": 0
      }
    },
    {
      "id": "mape-reflection",
      "type": "TEXT_ANALYSIS",
      "prompt": "Pourquoi la canicule a-t-elle provoque une rupture malgre le stock disponible a DC-MTL ?",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "prevision",
          "desequilibre",
          "demande",
          "reapprovisionnement"
        ]
      }
    }
  ],
  "completionFeedback": "Analyse validee. Proposition de reappro 40 unités prete pour le S&OP. Karim note la qualite de l'evidence.\n\nDenise Roy"
} as const satisfies MissionDefinitionDocument;
