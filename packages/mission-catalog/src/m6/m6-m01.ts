import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m01-reception-facture",
  "missionCode": "M6-M01",
  "moduleCode": "M6",
  "title": "Réceptionner la facture fournisseur",
  "preview": "Saisissez la facture ThermoControl pour PO-88421 et preparez le rapprochement trois voies.",
  "briefing": "Bonjour,\n\nThermoControl a envoye sa facture INV-TC-88421 pour la livraison partielle liee a PO-88421. Julie a deja valide la reception de 36 unites sur 40 commandees.\n\nAvant de poster quoi que ce soit, saisis la facture et lance l'apercu de rapprochement (match preview). Je bloque tout paiement sans controle.\n\nIdentifie le statut de match avant la prochaine etape.\n\nMarc Tremblay\nFinance — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 5 (decision S&OP) pour débloquer Finance.",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-FIN-01"
  ],
  "contextItems": [
    {
      "key": "ctx-invoice",
      "title": "Facture INV-TC-88421",
      "body": "Fournisseur ThermoControl; reference PO-88421; 36 unités SKU-HVAC-4421 a 125 CAD; montant 4 500 CAD; date facture 5 septembre.",
      "required": true
    },
    {
      "key": "ctx-po-gr",
      "title": "PO et reception GR-88421",
      "body": "PO-88421 : 40 unités commandees a 125 CAD (5 000 CAD). GR-88421 : 36 unités recues le 15 mai. 4 unités en attente fournisseur.",
      "required": true
    },
    {
      "key": "ctx-match-policy",
      "title": "Politique rapprochement AP",
      "body": "Rapprochement trois voies obligatoire : PO + GR + facture. Tolerance quantite : 0 %. Tolerance prix : 2 %. Paiement bloque si exception non resolue.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "receive-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est la premiere etape dans le traitement de la facture fournisseur ?",
      "options": [
        {
          "key": "receive",
          "label": "Réceptionner et enregistrer la facture"
        },
        {
          "key": "pay",
          "label": "Declencher le paiement immediat"
        },
        {
          "key": "discard",
          "label": "Rejeter la facture sans analyse"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "receive"
        ]
      }
    },
    {
      "id": "ap-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels controles AP sont requis avant validation du paiement ?",
      "options": [
        {
          "key": "enter-invoice",
          "label": "Saisie facture avec reference PO-88421"
        },
        {
          "key": "match-preview",
          "label": "Apercu rapprochement trois voies"
        },
        {
          "key": "flag-exception",
          "label": "Signaler exception si écart detecte"
        },
        {
          "key": "verify-gr",
          "label": "Verifier GR-88421 (36 unités)"
        },
        {
          "key": "blind-post",
          "label": "Poster sans apercu de match"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "enter-invoice",
          "match-preview",
          "flag-exception",
          "verify-gr"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "ap-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le workflow de reception facture fournisseur.",
      "options": [
        {
          "key": "receive",
          "label": "Réceptionner la facture INV-TC-88421"
        },
        {
          "key": "enter",
          "label": "Saisir montant et reference PO"
        },
        {
          "key": "preview",
          "label": "Lancer l'apercu rapprochement trois voies"
        },
        {
          "key": "flag",
          "label": "Signaler l'exception quantite (36 vs 40 PO)"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "receive",
          "enter",
          "preview",
          "flag"
        ]
      }
    },
    {
      "id": "invoice-qty",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien d'unités figurent sur la facture INV-TC-88421 ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 36,
        "numericTolerance": 0
      }
    },
    {
      "id": "match-rationale",
      "type": "TEXT_ANALYSIS",
      "prompt": "Pourquoi Marc exige un apercu de rapprochement avant tout paiement sur PO-88421 ?",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "rapprochement",
          "controle",
          "facture",
          "paiement"
        ]
      }
    }
  ],
  "completionFeedback": "Facture INV-TC-88421 saisie. Exception quantite signalee : facture 36 unités alignee sur GR, PO reste a 40. Pret pour resolution.\n\nMarc Tremblay"
} as const satisfies MissionDefinitionDocument;
