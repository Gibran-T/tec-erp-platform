import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m02-decision-transfert-inter-dc",
  "missionCode": "M5-M02",
  "moduleCode": "M5",
  "title": "Decider un transfert inter-DC",
  "preview": "Approuvez un transfert MTL-TRT pour equilibrer les stocks avec impact fret documente.",
  "briefing": "Bonjour,\n\nTon analyse confirme le desequilibre : DC-MTL a 47 jours de couverture, DC-TRT est en rupture. Avant de commander 40 unites a ThermoControl (14 jours de delai), nous devons servir les clients cette semaine.\n\nTom propose un transfert de 20 unites MTL vers TRT. Marc veut connaitre l'impact tresorerie du fret d'urgence vs le delai standard.\n\nPrends la decision de transfert et documente le cout.\n\nDenise Roy\nSupply Chain — NordHabitat",
  "unlockExplanation": "Completez d'abord « Analyser les stocks et le signal de reapprovisionnement ».",
  "sequence": 2,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-SC-02"
  ],
  "contextItems": [
    {
      "key": "ctx-coverage",
      "title": "Couverture stock inter-DC",
      "body": "DC-MTL : 52 unites, couverture 47 jours. DC-TRT : 0 unite, couverture 0 jour. Demande TRT : 20 unites/semaine post-canicule.",
      "required": true
    },
    {
      "key": "ctx-transfer-request",
      "title": "Demande transfert STO-4512",
      "body": "Transfert propose : 20 unites SKU-HVAC-4421 DC-MTL vers DC-TRT. Tom confirme disponibilite physique au comptage gemba.",
      "required": true
    },
    {
      "key": "ctx-freight-options",
      "title": "Options fret et tresorerie",
      "body": "Express 24 h : 680 CAD (impact tresorerie immediat). Standard 3 jours : 290 CAD (risque 2 clients en attente). Marc : plafond urgence 750 CAD sans comite.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "balance-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle analyse precede la decision de transfert inter-DC ?",
      "options": [
        {
          "key": "balance",
          "label": "Equilibrer couverture MTL (47 j) vs TRT (0 j)"
        },
        {
          "key": "order-only",
          "label": "Commander directement 40 unites sans transfert"
        },
        {
          "key": "wait",
          "label": "Attendre le reappro ThermoControl (14 jours)"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "balance"
        ]
      }
    },
    {
      "id": "transfer-controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis pour un transfert inter-DC approuve ?",
      "options": [
        {
          "key": "qty-verified",
          "label": "Quantite verifiee par Tom (gemba)"
        },
        {
          "key": "freight-quote",
          "label": "Devis fret documente"
        },
        {
          "key": "approval",
          "label": "Approbation selon plafond Marc (750 CAD)"
        },
        {
          "key": "sto-post",
          "label": "Creation et suivi de l'ordre STO"
        },
        {
          "key": "skip-finance",
          "label": "Approuver sans informer Finance"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "qty-verified",
          "freight-quote",
          "approval",
          "sto-post"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "transfer-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le workflow de decision de transfert inter-DC.",
      "options": [
        {
          "key": "balance",
          "label": "Analyser desequilibre couverture inter-DC"
        },
        {
          "key": "quote",
          "label": "Obtenir devis fret (express vs standard)"
        },
        {
          "key": "approve",
          "label": "Obtenir approbation (Marc / plafond 750 CAD)"
        },
        {
          "key": "post",
          "label": "Creer et suivre STO-4512"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "balance",
          "quote",
          "approve",
          "post"
        ]
      }
    },
    {
      "id": "mtl-coverage",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de jours de couverture DC-MTL avait-on avant transfert (selon contexte) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 47,
        "numericTolerance": 0
      }
    },
    {
      "id": "cash-tradeoff",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Recommandez-vous le fret express (680 CAD) ou standard (290 CAD) pour STO-4512. Justifiez l'arbitrage service client vs tresorerie.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "fret",
          "tresorerie",
          "service",
          "transfert"
        ]
      }
    }
  ],
  "completionFeedback": "STO-4512 approuve avec fret express 680 CAD. Tom lance la preparation; TRT sera reapprovisionne demain.\n\nTom Leclerc — Entrepot DC-MTL"
} as const satisfies MissionDefinitionDocument;
