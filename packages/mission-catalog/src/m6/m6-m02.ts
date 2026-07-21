import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m02-exception-rapprochement-trois-voies",
  "missionCode": "M6-M02",
  "moduleCode": "M6",
  "title": "Traiter l'exception de rapprochement trois voies",
  "preview": "Resolvez l'ecart PO (40) / GR (36) / facture (36) avant de debloquer le paiement.",
  "briefing": "Bonjour,\n\nL'exception est confirmee : PO-88421 commandait 40 unites, GR-88421 n'en a recu que 36, et la facture ThermoControl couvre 36 unites. Le paiement est bloque.\n\nJulie connait l'historique : ThermoControl a livre partiellement en mai. Renee veut une explication claire avant que je signe.\n\nIdentifie la cause racine, propose l'action corrective et decide : payer les 36 ou maintenir le blocage.\n\nMarc Tremblay\nFinance — NordHabitat",
  "unlockExplanation": "Completez d'abord « Receptionner la facture fournisseur » (exception signalee sur INV-TC-88421).",
  "sequence": 2,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-FIN-02"
  ],
  "contextItems": [
    {
      "key": "ctx-variance",
      "title": "Rapport exception match",
      "body": "PO-88421 : 40 unites x 125 CAD = 5 000 CAD. GR-88421 : 36 unites recues. Facture INV-TC-88421 : 36 unites = 4 500 CAD. Ecart PO-GR : 4 unites.",
      "required": true
    },
    {
      "key": "ctx-root-cause",
      "title": "Historique livraison partielle",
      "body": "ThermoControl a confirme livraison partielle 36/40 en mai. Julie a accepte avec reserve. 4 unites en reliquat — bon de livraison partiel signe par Tom.",
      "required": true
    },
    {
      "key": "ctx-policy",
      "title": "Politique resolution exception",
      "body": "Payer uniquement quantite recue et facturee (36). PO ouverte pour reliquat 4 unites. Debit note requis si surfacturation. Approbation Marc pour tout ecart > 0 CAD.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "detect-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est la premiere action face a l'exception de rapprochement ?",
      "options": [
        {
          "key": "detect",
          "label": "Analyser l'ecart PO (40) vs GR/facture (36)"
        },
        {
          "key": "pay-40",
          "label": "Payer 40 unites pour fermer rapidement"
        },
        {
          "key": "ignore",
          "label": "Ignorer l'exception et poster le paiement"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "detect"
        ]
      }
    },
    {
      "id": "exception-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis pour resoudre l'exception trois voies ?",
      "options": [
        {
          "key": "root-cause",
          "label": "Cause racine documentee (livraison partielle)"
        },
        {
          "key": "correct-action",
          "label": "Action corrective (payer 36, PO ouverte pour 4)"
        },
        {
          "key": "julie-confirm",
          "label": "Confirmation Julie sur reliquat fournisseur"
        },
        {
          "key": "release-hold",
          "label": "Decision payer/maintenir blocage justifiee"
        },
        {
          "key": "pay-full",
          "label": "Payer 5 000 CAD sans verification GR"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "root-cause",
          "correct-action",
          "julie-confirm",
          "release-hold"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "exception-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la resolution de l'exception rapprochement PO-88421.",
      "options": [
        {
          "key": "detect",
          "label": "Detecter ecart 4 unites (40 PO vs 36 GR)"
        },
        {
          "key": "explain",
          "label": "Expliquer cause racine (livraison partielle mai)"
        },
        {
          "key": "correct",
          "label": "Corriger : payer 4 500 CAD pour 36 unites"
        },
        {
          "key": "release",
          "label": "Debloquer paiement avec PO ouverte pour reliquat"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "detect",
          "explain",
          "correct",
          "release"
        ]
      }
    },
    {
      "id": "unit-gap",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien d'unites d'ecart entre la PO (40) et le GR/facture (36) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 4,
        "numericTolerance": 0
      }
    },
    {
      "id": "variance-diagnosis",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Diagnostiquez l'exception et recommandez : payer 4 500 CAD (36 unites) ou bloquer en attendant les 4 unites restantes ?",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "ecart",
          "partiel",
          "paiement",
          "politique"
        ]
      }
    }
  ],
  "completionFeedback": "Exception resolue. Paiement 4 500 CAD debloque pour 36 unites. PO-88421 reste ouverte pour reliquat 4 unites.\n\nJulie Chen — Approvisionnements"
} as const satisfies MissionDefinitionDocument;
