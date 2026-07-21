import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m01-reception-facture",
  "missionCode": "M6-M01",
  "moduleCode": "M6",
  "title": "Receptionner la facture fournisseur",
  "preview": "Saisissez la facture ThermoControl et preparez le rapprochement.",
  "briefing": "Bonjour,\n\nSaisissez la facture ThermoControl et preparez le rapprochement.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nMarc Tremblay",
  "unlockExplanation": "Completez d'abord « Module 5 ».",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intro",
  "competencyCodes": [
    "C-FIN-02"
  ],
  "contextItems": [
    {
      "key": "ctx-m6-m01",
      "title": "Contexte mission",
      "body": "Saisissez la facture ThermoControl et preparez le rapprochement.",
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
          "key": "receive",
          "label": "receive"
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
          "receive"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "receive",
          "label": "receive"
        },
        {
          "key": "enter",
          "label": "enter"
        },
        {
          "key": "preview",
          "label": "preview"
        },
        {
          "key": "flag",
          "label": "flag"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "receive",
          "enter",
          "preview"
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
          "key": "receive",
          "label": "receive"
        },
        {
          "key": "enter",
          "label": "enter"
        },
        {
          "key": "preview",
          "label": "preview"
        },
        {
          "key": "flag",
          "label": "flag"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "receive",
          "enter",
          "preview",
          "flag"
        ]
      }
    },
    {
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 36,
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
          "facture",
          "rapprochement",
          "payable"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M6-M01 completee.\n\nMarc Tremblay"
} as const satisfies MissionDefinitionDocument;
