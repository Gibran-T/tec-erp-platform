import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m02-allocation-inter-entrepots",
  "missionCode": "M4-M02",
  "moduleCode": "M4",
  "title": "Allouer entre entrepots (DC)",
  "preview": "Resolvez le conflit d'allocation DC-MTL vers DC-TRT.",
  "briefing": "Bonjour,\n\nResolvez le conflit d'allocation DC-MTL vers DC-TRT.\n\nContexte NordHabitat — completez les controles et documentez les consequences.\n\nElodie Moreau",
  "unlockExplanation": "Completez d'abord « Saisir la commande institutionnelle ».",
  "sequence": 2,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-O2C-02",
    "C-COM-02"
  ],
  "contextItems": [
    {
      "key": "ctx-m4-m02",
      "title": "Contexte mission",
      "body": "Resolvez le conflit d'allocation DC-MTL vers DC-TRT.",
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
          "key": "assess",
          "label": "assess"
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
          "assess"
        ]
      }
    },
    {
      "id": "controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis ?",
      "options": [
        {
          "key": "assess",
          "label": "assess"
        },
        {
          "key": "transfer",
          "label": "transfer"
        },
        {
          "key": "freight",
          "label": "freight"
        },
        {
          "key": "commit",
          "label": "commit"
        },
        {
          "key": "ignore",
          "label": "Aucun"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "assess",
          "transfer",
          "freight"
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
          "key": "assess",
          "label": "assess"
        },
        {
          "key": "transfer",
          "label": "transfer"
        },
        {
          "key": "freight",
          "label": "freight"
        },
        {
          "key": "commit",
          "label": "commit"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "assess",
          "transfer",
          "freight",
          "commit"
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
          "allocation",
          "transfert",
          "livraison"
        ]
      }
    }
  ],
  "completionFeedback": "Mission M4-M02 completee.\n\nElodie Moreau"
} as const satisfies MissionDefinitionDocument;
