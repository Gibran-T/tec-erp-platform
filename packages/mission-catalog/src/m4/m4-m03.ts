import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m03-confirmer-livraison-cloture",
  "missionCode": "M4-M03",
  "moduleCode": "M4",
  "title": "Confirmer la livraison et cloturer",
  "preview": "Confirmez la livraison, declenchez la facturation et cloturez le dossier.",
  "briefing": "Bonjour,\n\nConfirmez la livraison, declenchez la facturation et cloturez le dossier.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nElodie Moreau",
  "unlockExplanation": "Completez d'abord « Allouer entre entrepots (DC) ».",
  "sequence": 3,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-O2C-03",
    "C-CRM-01"
  ],
  "contextItems": [
    {
      "key": "ctx-m4-m03",
      "title": "Contexte mission",
      "body": "Confirmez la livraison, declenchez la facturation et cloturez le dossier.",
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
          "key": "deliver",
          "label": "deliver"
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
          "deliver"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "deliver",
          "label": "deliver"
        },
        {
          "key": "confirm",
          "label": "confirm"
        },
        {
          "key": "bill",
          "label": "bill"
        },
        {
          "key": "close",
          "label": "close"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "deliver",
          "confirm",
          "bill"
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
          "key": "deliver",
          "label": "deliver"
        },
        {
          "key": "confirm",
          "label": "confirm"
        },
        {
          "key": "bill",
          "label": "bill"
        },
        {
          "key": "close",
          "label": "close"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "deliver",
          "confirm",
          "bill",
          "close"
        ]
      }
    },
    {
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 53,
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
          "livraison",
          "facture",
          "client"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M4-M03 completee.\n\nElodie Moreau"
} as const satisfies MissionDefinitionDocument;
