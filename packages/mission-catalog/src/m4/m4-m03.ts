import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m03-confirmer-livraison-cloture",
  "missionCode": "M4-M03",
  "moduleCode": "M4",
  "title": "Confirmer la livraison et cloturer",
  "preview": "Confirmez la sortie de marchandises, declenchez la facturation et cloturez le dossier Sacre-Coeur.",
  "briefing": "Bonjour,\n\nBonne nouvelle : les 40 unites sont livrees a l'aile pediatrique. Le Dr. Meunier a confirme la reception. Patrick envoie un message de remerciement.\n\nIl reste a poster la sortie de marchandises (GI), declencher la facturation client et mettre a jour le dossier AR. Marc attend la piece comptable propre.\n\nCloturez le cycle Order-to-Cash avec rigueur.\n\nElodie Moreau\nVentes institutionnelles — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Allouer entre entrepots (DC) » (transfert STO-4408 execute).",
  "sequence": 3,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-O2C-03"
  ],
  "contextItems": [
    {
      "key": "ctx-delivery",
      "title": "Bon de livraison BL-12047",
      "body": "SO-12047 Sacre-Coeur : 40 x SKU-HVAC-4421 livrees le 18 juillet; signature Dr. Meunier; entrepot expediteur DC-TRT.",
      "required": true
    },
    {
      "key": "ctx-billing",
      "title": "Parametres facturation",
      "body": "Prix unitaire 1 250 CAD; montant total 50 000 CAD; conditions Net-30; centre de profit Ventes institutionnelles.",
      "required": true
    },
    {
      "key": "ctx-nps",
      "title": "Suivi satisfaction client",
      "body": "NPS Sacre-Coeur avant livraison : 51. Objectif post-cloture : 53. Dossier CRM case #SC-884 ouvert depuis M4-M01.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "gi-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle transaction ERP declenche la reconnaissance de la livraison ?",
      "options": [
        {
          "key": "gi",
          "label": "Sortie de marchandises (Goods Issue)"
        },
        {
          "key": "quote",
          "label": "Mise a jour du devis initial"
        },
        {
          "key": "po",
          "label": "Creation d'une commande d'achat"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "gi"
        ]
      }
    },
    {
      "id": "closure-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis pour cloturer le cycle Order-to-Cash ?",
      "options": [
        {
          "key": "confirm-delivery",
          "label": "Confirmation de livraison (GI poste)"
        },
        {
          "key": "trigger-billing",
          "label": "Declenchement de la facturation client"
        },
        {
          "key": "update-ar",
          "label": "Mise a jour creances clients (AR)"
        },
        {
          "key": "close-case",
          "label": "Cloture du dossier CRM"
        },
        {
          "key": "skip-gi",
          "label": "Facturer sans sortie de marchandises"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "confirm-delivery",
          "trigger-billing",
          "update-ar",
          "close-case"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "closure-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la sequence de cloture client Sacre-Coeur.",
      "options": [
        {
          "key": "deliver",
          "label": "Confirmer livraison physique (BL signe)"
        },
        {
          "key": "gi",
          "label": "Poster la sortie de marchandises"
        },
        {
          "key": "bill",
          "label": "Generer la facture client"
        },
        {
          "key": "close",
          "label": "Clôturer le dossier CRM et AR"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "deliver",
          "gi",
          "bill",
          "close"
        ]
      }
    },
    {
      "id": "invoice-amount",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel est le montant de la facture client (CAD) pour 40 unités a 1 250 CAD ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 50000,
        "numericTolerance": 0
      }
    },
    {
      "id": "nps-impact",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez comment la transparence sur le conflit ATP (M4-M01) a contribue a la recuperation NPS Sacre-Coeur.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "confiance",
          "livraison",
          "client",
          "communication"
        ]
      }
    }
  ],
  "completionFeedback": "Cycle Order-to-Cash cloture. Facture FI-12047 emise; NPS Sacre-Coeur remonte a 53. Bravo pour la chaine complete.\n\nElodie Moreau"
} as const satisfies MissionDefinitionDocument;
