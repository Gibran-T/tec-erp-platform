import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m01-saisir-commande-institutionnelle",
  "missionCode": "M4-M01",
  "moduleCode": "M4",
  "title": "Saisir la commande institutionnelle",
  "preview": "Creez la commande Sacre-Coeur pour l'aile pediatrique avec controle credit et ATP.",
  "briefing": "Bonjour,\n\nL'Hopital du Sacre-Coeur confirme la commande pour l'aile pediatrique : 40 unites de SKU-HVAC-4421, livraison jeudi. Patrick insiste sur la priorite; le Dr. Meunier attend une date ferme.\n\nAvant de promettre quoi que ce soit, verifiez le credit client et la disponibilite (ATP). Rappel : la reception partielle ThermoControl (36/40) a deja tendu le stock.\n\nNe promettez pas une date que nous ne pouvons tenir. Documentez tout conflit honnetement.\n\nElodie Moreau\nVentes institutionnelles — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 3 (reception partielle PO-88421) pour débloquer Order-to-Cash.",
  "sequence": 1,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-O2C-01"
  ],
  "contextItems": [
    {
      "key": "ctx-so-draft",
      "title": "Commande Sacre-Coeur SO-12047",
      "body": "Client institutionnel Sacre-Coeur; 40 x SKU-HVAC-4421 a 1 250 CAD; valeur 50 000 CAD; livraison demandee jeudi; entrepot cible DC-TRT.",
      "required": true
    },
    {
      "key": "ctx-credit",
      "title": "Fiche credit client",
      "body": "Limite credit 75 000 CAD; encours actuel 18 400 CAD; marge disponible 56 600 CAD. Statut : actif, paiement Net-30.",
      "required": true
    },
    {
      "key": "ctx-atp",
      "title": "Disponibilite ATP DC-TRT",
      "body": "SKU-HVAC-4421 : stock libre DC-TRT = 28 unités; DC-MTL = 52 unités; allocation hospitaliere en attente. Delai appro fournisseur : 14 jours.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "credit-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle verification effectuez-vous en premier avant de creer la commande de vente ?",
      "options": [
        {
          "key": "credit-check",
          "label": "Controle de credit client"
        },
        {
          "key": "promise-date",
          "label": "Promettre jeudi pour satisfaire Patrick"
        },
        {
          "key": "skip-all",
          "label": "Creer la commande sans controle"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "credit-check"
        ]
      }
    },
    {
      "id": "so-controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont obligatoires pour une commande institutionnelle valide ?",
      "options": [
        {
          "key": "credit-ok",
          "label": "Credit disponible confirme"
        },
        {
          "key": "atp-check",
          "label": "Verification ATP par article"
        },
        {
          "key": "create-so",
          "label": "Creation de la commande de vente"
        },
        {
          "key": "false-promise",
          "label": "Date promise sans verification stock"
        },
        {
          "key": "emoji",
          "label": "Emoji dans le libelle client"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "credit-ok",
          "atp-check",
          "create-so"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "o2c-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le deroulement controle de la saisie de commande.",
      "options": [
        {
          "key": "credit",
          "label": "Verifier le credit client"
        },
        {
          "key": "atp",
          "label": "Controler la disponibilite ATP"
        },
        {
          "key": "create",
          "label": "Creer la commande de vente"
        },
        {
          "key": "flag",
          "label": "Signaler le conflit d'allocation si ATP insuffisant"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "credit",
          "atp",
          "create",
          "flag"
        ]
      }
    },
    {
      "id": "atp-gap",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien d'unités manquent a DC-TRT pour couvrir la commande de 40 unités (stock libre = 28) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 12,
        "numericTolerance": 0
      }
    },
    {
      "id": "honest-conflict",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "L'ATP montre 28 unités disponibles pour 40 demandees. Que recommandez-vous a Elodie : fausse promesse ou conflit documente ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "conflit",
          "allocation",
          "transparence",
          "client"
        ]
      }
    }
  ],
  "completionFeedback": "Commande SO-12047 creee avec conflit d'allocation documente. L'equipe logistique peut maintenant planifier le transfert inter-DC.\n\nElodie Moreau"
} as const satisfies MissionDefinitionDocument;
