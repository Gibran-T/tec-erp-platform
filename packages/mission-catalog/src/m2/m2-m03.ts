import type { MissionDefinitionDocument } from "../schema.js";

export const M2_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m2-m03-corriger-qualite-donnees",
  "missionCode": "M2-M03",
  "moduleCode": "M2",
  "title": "Corriger les problemes de qualite des données",
  "preview": "Detectez doublons, champs manquants et enregistrements bloques.",
  "briefing": "Bonjour,\n\nLe rapport qualite signale des doublons fournisseurs et un client inactif encore utilise. Corrigez sans casser l'integrite referentielle.\n\nClaire Fontaine",
  "unlockExplanation": "Complétez d'abord la creation des données de reference.",
  "sequence": 3,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-QLT-01",
    "C-MDM-01"
  ],
  "contextItems": [
    {
      "key": "ctx-quality",
      "title": "Rapport qualite",
      "body": "Deux fournisseurs ThermoControl quasi identiques; un client bloque; UoM manquante sur un article satellite.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "defect-types",
      "type": "MULTI_CHOICE",
      "prompt": "Quels defauts bloquent les transactions ?",
      "options": [
        {
          "key": "dup",
          "label": "Doublon fournisseur"
        },
        {
          "key": "blocked",
          "label": "Partenaire bloque"
        },
        {
          "key": "uom",
          "label": "UoM manquante"
        },
        {
          "key": "logo",
          "label": "Logo manquant"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "dup",
          "blocked",
          "uom"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "fix-action",
      "type": "SINGLE_CHOICE",
      "prompt": "Action correcte sur le doublon fournisseur ?",
      "options": [
        {
          "key": "merge",
          "label": "Fusionner vers le golden record"
        },
        {
          "key": "delete-both",
          "label": "Supprimer les deux"
        },
        {
          "key": "ignore",
          "label": "Ignorer"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "merge"
        ]
      }
    },
    {
      "id": "quality-order",
      "type": "ORDERING",
      "prompt": "Ordonnez le cycle qualite.",
      "options": [
        {
          "key": "detect",
          "label": "Detecter"
        },
        {
          "key": "classify",
          "label": "Classifier"
        },
        {
          "key": "correct",
          "label": "Corriger"
        },
        {
          "key": "validate",
          "label": "Valider et auditer"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctOrder": [
          "detect",
          "classify",
          "correct",
          "validate"
        ]
      }
    },
    {
      "id": "blocked-count",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de partenaires bloques doivent rester non utilisables en transaction ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 1,
        "numericTolerance": 0
      }
    },
    {
      "id": "control",
      "type": "TEXT_ANALYSIS",
      "prompt": "Recommandez un controle de gouvernance pour prevenir les doublons.",
      "scoring": {
        "maxPoints": 20,
        "requiredConcepts": [
          "gouvernance",
          "doublon",
          "validation"
        ]
      }
    }
  ],
  "completionFeedback": "Qualite corrigee. Module 2 complete — eligibilite Silver ouverte apres evaluation.\n\nClaire Fontaine"
} as const satisfies MissionDefinitionDocument;
