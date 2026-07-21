import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m03-presentation-sop",
  "missionCode": "M5-M03",
  "moduleCode": "M5",
  "title": "Presenter la recommandation S&OP",
  "preview": "Defenduez la recommandation S&OP devant Finance et Ventes.",
  "briefing": "Bonjour,\n\nDefenduez la recommandation S&OP devant Finance et Ventes.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nDenise Roy",
  "unlockExplanation": "Completez d'abord « Decider un transfert inter-DC ».",
  "sequence": 3,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-COM-03",
    "C-LEAD-01"
  ],
  "contextItems": [
    {
      "key": "ctx-m5-m03",
      "title": "Contexte mission",
      "body": "Defenduez la recommandation S&OP devant Finance et Ventes.",
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
          "key": "prepare",
          "label": "prepare"
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
          "prepare"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "prepare",
          "label": "prepare"
        },
        {
          "key": "present",
          "label": "present"
        },
        {
          "key": "defend",
          "label": "defend"
        },
        {
          "key": "log",
          "label": "log"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "prepare",
          "present",
          "defend"
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
          "key": "prepare",
          "label": "prepare"
        },
        {
          "key": "present",
          "label": "present"
        },
        {
          "key": "defend",
          "label": "defend"
        },
        {
          "key": "log",
          "label": "log"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "prepare",
          "present",
          "defend",
          "log"
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
          "sop",
          "recommandation",
          "decision"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M5-M03 completee.\n\nDenise Roy"
} as const satisfies MissionDefinitionDocument;
