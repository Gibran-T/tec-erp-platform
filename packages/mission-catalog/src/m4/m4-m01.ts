import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m01-saisir-commande-institutionnelle",
  "missionCode": "M4-M01",
  "moduleCode": "M4",
  "title": "Saisir la commande institutionnelle",
  "preview": "Creez la commande Sacre-Coeur avec controle credit et ATP.",
  "briefing": "Bonjour,\n\nCreez la commande Sacre-Coeur avec controle credit et ATP.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nElodie Moreau",
  "unlockExplanation": "Completez d'abord « Module 3 ».",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intro",
  "competencyCodes": [
    "C-O2C-01"
  ],
  "contextItems": [
    {
      "key": "ctx-m4-m01",
      "title": "Contexte mission",
      "body": "Creez la commande Sacre-Coeur avec controle credit et ATP.",
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
          "key": "credit",
          "label": "credit"
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
          "credit"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "credit",
          "label": "credit"
        },
        {
          "key": "atp",
          "label": "atp"
        },
        {
          "key": "create-so",
          "label": "create-so"
        },
        {
          "key": "flag-conflict",
          "label": "flag-conflict"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "credit",
          "atp",
          "create-so"
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
          "key": "credit",
          "label": "credit"
        },
        {
          "key": "atp",
          "label": "atp"
        },
        {
          "key": "create-so",
          "label": "create-so"
        },
        {
          "key": "flag-conflict",
          "label": "flag-conflict"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "credit",
          "atp",
          "create-so",
          "flag-conflict"
        ]
      }
    },
    {
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 1,
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
          "credit",
          "disponibilite",
          "commande"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M4-M01 completee.\n\nElodie Moreau"
} as const satisfies MissionDefinitionDocument;
