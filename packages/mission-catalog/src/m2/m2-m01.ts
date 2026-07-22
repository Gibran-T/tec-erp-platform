import type { MissionDefinitionDocument } from "../schema.js";

export const M2_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m2-m01-structurer-organisation",
  "missionCode": "M2-M01",
  "moduleCode": "M2",
  "title": "Structurer l'organisation",
  "preview": "Définissez les unités organisationnelles, usines et centres de coûts avant toute transaction.",
  "briefing": "Bonjour,\n\nLe Module 1 est complete. Avant toute transaction, NordHabitat doit structurer son organisation ERP.\n\nCartographiez sieges, DC-MTL, DC-TRT et centres de couts.\n\nClaire Fontaine\nGestionnaire — NordHabitat",
  "unlockExplanation": "Complétez le Module 1 pour débloquer la structuration organisationnelle.",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intro",
  "competencyCodes": [
    "C-MDM-01",
    "C-ORG-02"
  ],
  "contextItems": [
    {
      "key": "ctx-org-map",
      "title": "Carte organisationnelle provisoire",
      "body": "NordHabitat dispose d'un siege, de DC-MTL et DC-TRT, et de centres de coûts encore mal relies.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "org-units",
      "type": "MULTI_CHOICE",
      "prompt": "Quelles unités doivent etre creees avant les transactions ?",
      "options": [
        {
          "key": "hq",
          "label": "Siege social"
        },
        {
          "key": "dc-mtl",
          "label": "DC-MTL"
        },
        {
          "key": "dc-trt",
          "label": "DC-TRT"
        },
        {
          "key": "personal",
          "label": "Dossier personnel etudiant"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "hq",
          "dc-mtl",
          "dc-trt"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "cost-center-owner",
      "type": "SINGLE_CHOICE",
      "prompt": "Qui valide la creation des centres de coûts ?",
      "options": [
        {
          "key": "finance",
          "label": "Finance"
        },
        {
          "key": "sales",
          "label": "Ventes"
        },
        {
          "key": "warehouse",
          "label": "Entrepot"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "finance"
        ]
      }
    },
    {
      "id": "setup-order",
      "type": "ORDERING",
      "prompt": "Ordonnez la mise en place organisationnelle.",
      "options": [
        {
          "key": "legal",
          "label": "Confirmer l'entite legale"
        },
        {
          "key": "plants",
          "label": "Creer les sites/DC"
        },
        {
          "key": "cc",
          "label": "Creer les centres de coûts"
        },
        {
          "key": "assign",
          "label": "Assigner les responsables"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "legal",
          "plants",
          "cc",
          "assign"
        ]
      }
    },
    {
      "id": "governance-note",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez pourquoi la structure organisationnelle doit preceder les données de reference.",
      "scoring": {
        "maxPoints": 25,
        "requiredConcepts": [
          "organisation",
          "donnees",
          "gouvernance"
        ]
      }
    }
  ],
  "completionFeedback": "Structure validee. Vous pouvez maintenant creer les données de reference essentielles.\n\nClaire Fontaine"
} as const satisfies MissionDefinitionDocument;
