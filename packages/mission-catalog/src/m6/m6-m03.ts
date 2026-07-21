import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m03-expliquer-ecart-finance",
  "missionCode": "M6-M03",
  "moduleCode": "M6",
  "title": "Expliquer l'ecart a la finance",
  "preview": "Expliquez a Marc l'impact cash et marge de la chaine M3-M6.",
  "briefing": "Bonjour,\n\nExpliquez a Marc l'impact cash et marge de la chaine M3-M6.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nMarc Tremblay",
  "unlockExplanation": "Completez d'abord « Traiter l'exception de rapprochement trois voies ».",
  "sequence": 3,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-FIN-04",
    "C-COM-04"
  ],
  "contextItems": [
    {
      "key": "ctx-m6-m03",
      "title": "Contexte mission",
      "body": "Expliquez a Marc l'impact cash et marge de la chaine M3-M6.",
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
          "key": "trace",
          "label": "trace"
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
          "trace"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "trace",
          "label": "trace"
        },
        {
          "key": "quantify",
          "label": "quantify"
        },
        {
          "key": "narrate",
          "label": "narrate"
        },
        {
          "key": "release",
          "label": "release"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "trace",
          "quantify",
          "narrate"
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
          "key": "trace",
          "label": "trace"
        },
        {
          "key": "quantify",
          "label": "quantify"
        },
        {
          "key": "narrate",
          "label": "narrate"
        },
        {
          "key": "release",
          "label": "release"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "trace",
          "quantify",
          "narrate",
          "release"
        ]
      }
    },
    {
      "id": "metric",
      "type": "NUMERIC_INPUT",
      "prompt": "Valeur cle a retenir pour cette mission ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 3,
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
          "marge",
          "tresorerie",
          "ecart"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M6-M03 completee.\n\nMarc Tremblay"
} as const satisfies MissionDefinitionDocument;
