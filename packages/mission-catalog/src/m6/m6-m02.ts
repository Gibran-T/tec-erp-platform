import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m02-exception-rapprochement-trois-voies",
  "missionCode": "M6-M02",
  "moduleCode": "M6",
  "title": "Traiter l'exception de rapprochement trois voies",
  "preview": "Resolvez l'ecart PO/GR/facture avant paiement.",
  "briefing": "Bonjour,\n\nResolvez l'ecart PO/GR/facture avant paiement.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nMarc Tremblay",
  "unlockExplanation": "Completez d'abord « Receptionner la facture fournisseur ».",
  "sequence": 2,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-FIN-03",
    "C-P2P-04"
  ],
  "contextItems": [
    {
      "key": "ctx-m6-m02",
      "title": "Contexte mission",
      "body": "Resolvez l'ecart PO/GR/facture avant paiement.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "primary",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est la premiere action controlee ?",
      "options": [
        {
          "key": "detect",
          "label": "detect"
        },
        {
          "key": "skip-control",
          "label": "Ignorer les controles"
        },
        {
          "key": "random",
          "label": "Action hors processus"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "detect"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "detect",
          "label": "detect"
        },
        {
          "key": "explain",
          "label": "explain"
        },
        {
          "key": "correct",
          "label": "correct"
        },
        {
          "key": "release-or-hold",
          "label": "release-or-hold"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "detect",
          "explain",
          "correct"
        ],
        "minimumSelections": 2
      }
    },
    {
      "id": "sequence",
      "type": "ORDERING",
      "prompt": "Ordonnez le deroulement.",
      "options": [
        {
          "key": "detect",
          "label": "detect"
        },
        {
          "key": "explain",
          "label": "explain"
        },
        {
          "key": "correct",
          "label": "correct"
        },
        {
          "key": "release-or-hold",
          "label": "release-or-hold"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "detect",
          "explain",
          "correct",
          "release-or-hold"
        ]
      }
    },
    {
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 4,
        "numericTolerance": 0
      }
    },
    {
      "id": "analysis",
      "type": "TEXT_ANALYSIS",
      "prompt": "Justifiez la decision et ses consequences transverses.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "ecart",
          "trois",
          "paiement"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M6-M02 completee.\n\nMarc Tremblay"
} as const satisfies MissionDefinitionDocument;
