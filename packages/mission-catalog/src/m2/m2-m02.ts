import type { MissionDefinitionDocument } from "../schema.js";

export const M2_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m2-m02-creer-donnees-reference",
  "missionCode": "M2-M02",
  "moduleCode": "M2",
  "title": "Creer les données de reference essentielles",
  "preview": "Creez clients, fournisseurs, articles et unités de mesure coherents.",
  "briefing": "Bonjour,\n\nLa structure est en place. Creez les enregistrements maitre : client Sacre-Coeur, fournisseur ThermoControl, article SKU-HVAC-4421 et UoM EA.\n\nClaire Fontaine",
  "unlockExplanation": "Complétez d'abord la mission de structuration organisationnelle.",
  "sequence": 2,
  "estimatedMinutes": 35,
  "difficulty": "intro",
  "competencyCodes": [
    "C-MDM-01",
    "C-QLT-01"
  ],
  "contextItems": [
    {
      "key": "ctx-mdm-pack",
      "title": "Paquet MDM",
      "body": "Champs obligatoires : statut, UoM, conditions de paiement, adresse, cle metier unique.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "mandatory-fields",
      "type": "MULTI_CHOICE",
      "prompt": "Quels champs sont obligatoires pour un fournisseur actif ?",
      "options": [
        {
          "key": "status",
          "label": "Statut"
        },
        {
          "key": "payment",
          "label": "Conditions de paiement"
        },
        {
          "key": "bank",
          "label": "Coordonnees bancaires"
        },
        {
          "key": "nickname",
          "label": "Surnom interne"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "status",
          "payment",
          "bank"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "uom",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle UoM utiliser pour SKU-HVAC-4421 ?",
      "options": [
        {
          "key": "ea",
          "label": "EA (unite)"
        },
        {
          "key": "kg",
          "label": "KG"
        },
        {
          "key": "hr",
          "label": "Heure"
        }
      ],
      "scoring": {
        "maxPoints": 15,
        "correctKeys": [
          "ea"
        ]
      }
    },
    {
      "id": "create-order",
      "type": "ORDERING",
      "prompt": "Ordonnez la creation des données de reference.",
      "options": [
        {
          "key": "uom",
          "label": "Unites de mesure"
        },
        {
          "key": "material",
          "label": "Articles"
        },
        {
          "key": "bp",
          "label": "Partenaires (client/fournisseur)"
        },
        {
          "key": "validate",
          "label": "Valider la completude"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "uom",
          "material",
          "bp",
          "validate"
        ]
      }
    },
    {
      "id": "duplicate-risk",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien d'enregistrements clients distincts doivent exister pour Sacre-Coeur (golden record) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 1,
        "numericTolerance": 0
      }
    },
    {
      "id": "mdm-rationale",
      "type": "TEXT_ANALYSIS",
      "prompt": "Pourquoi un golden record client evite les erreurs Order-to-Cash ?",
      "scoring": {
        "maxPoints": 20,
        "requiredConcepts": [
          "client",
          "doublon",
          "commande"
        ]
      }
    }
  ],
  "completionFeedback": "Donnees de reference creees. Passez a la qualite des données.\n\nClaire Fontaine"
} as const satisfies MissionDefinitionDocument;
