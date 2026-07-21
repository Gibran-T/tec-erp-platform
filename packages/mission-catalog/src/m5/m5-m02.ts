import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m02-decision-transfert-inter-dc",
  "missionCode": "M5-M02",
  "moduleCode": "M5",
  "title": "Decider un transfert inter-DC",
  "preview": "Approuvez un transfert MTL-TRT avec impact fret.",
  "briefing": "Bonjour,\n\nApprouvez un transfert MTL-TRT avec impact fret.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nDenise Roy",
  "unlockExplanation": "Completez d'abord « Analyser les stocks et le signal de reapprovisionnement ».",
  "sequence": 2,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-SC-03",
    "C-FIN-01"
  ],
  "contextItems": [
    {
      "key": "ctx-m5-m02",
      "title": "Contexte mission",
      "body": "Approuvez un transfert MTL-TRT avec impact fret.",
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
          "key": "balance",
          "label": "balance"
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
          "balance"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "balance",
          "label": "balance"
        },
        {
          "key": "quote",
          "label": "quote"
        },
        {
          "key": "approve",
          "label": "approve"
        },
        {
          "key": "post",
          "label": "post"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "balance",
          "quote",
          "approve"
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
          "key": "balance",
          "label": "balance"
        },
        {
          "key": "quote",
          "label": "quote"
        },
        {
          "key": "approve",
          "label": "approve"
        },
        {
          "key": "post",
          "label": "post"
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
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 47,
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
          "transfert",
          "fret",
          "stock"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M5-M02 completee.\n\nDenise Roy"
} as const satisfies MissionDefinitionDocument;
