import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m01-analyser-stock-reappro",
  "missionCode": "M5-M01",
  "moduleCode": "M5",
  "title": "Analyser les stocks et le signal de reapprovisionnement",
  "preview": "Interpretez le stockout DC-TRT et proposez le reappro.",
  "briefing": "Bonjour,\n\nInterpretez le stockout DC-TRT et proposez le reappro.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nDenise Roy",
  "unlockExplanation": "Completez d'abord « Module 4 ».",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intro",
  "competencyCodes": [
    "C-SC-02",
    "C-ANL-02"
  ],
  "contextItems": [
    {
      "key": "ctx-m5-m01",
      "title": "Contexte mission",
      "body": "Interpretez le stockout DC-TRT et proposez le reappro.",
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
          "key": "report",
          "label": "report"
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
          "report"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "report",
          "label": "report"
        },
        {
          "key": "analyze",
          "label": "analyze"
        },
        {
          "key": "propose",
          "label": "propose"
        },
        {
          "key": "evidence",
          "label": "evidence"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "report",
          "analyze",
          "propose"
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
          "key": "report",
          "label": "report"
        },
        {
          "key": "analyze",
          "label": "analyze"
        },
        {
          "key": "propose",
          "label": "propose"
        },
        {
          "key": "evidence",
          "label": "evidence"
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
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 14,
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
          "stock",
          "seuil",
          "reapprovisionnement"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M5-M01 completee.\n\nDenise Roy"
} as const satisfies MissionDefinitionDocument;
