import type { MissionDefinitionDocument } from "../schema.js";

export const M8_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m8-m01-matrice-approbation-pression",
  "missionCode": "M8-M01",
  "moduleCode": "M8",
  "title": "Matrice d'approbation sous pression",
  "preview": "Traitez une demande d'achat de 32 000 CAD sous pression sans contourner la gouvernance.",
  "briefing": "Bonjour,\n\nUn remplacement d'urgence pour CAS-7701 necessite une commande fournisseur de 32 000 CAD (256 unites de rechange preventif lot LT-8842). Patrick insiste pour liberer avant 17 h; Marc rappelle que la limite VP est 25 000 CAD.\n\nVotre role : appliquer la matrice d'approbation sans raccourci, documenter la justification metier et obtenir le bon niveau d'autorisation. Aucune PO ne sort sans trace audit.\n\nLa pression n'annule pas la gouvernance.\n\nIsabelle Roy\nGouvernance — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 7 (cloture CAS-7701) pour débloquer la gouvernance.",
  "sequence": 1,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-GOV-02"
  ],
  "contextItems": [
    {
      "key": "ctx-approval-matrix",
      "title": "Matrice d'approbation achats",
      "body": "Auto-approbation : 5 000 CAD; Manager (Julie) : 15 000 CAD; VP Operations (Patrick) : 25 000 CAD; Comite achats (Marc + DG) : > 25 000 CAD.",
      "required": true
    },
    {
      "key": "ctx-urgent-po",
      "title": "Demande PO-URG-9033",
      "body": "256 unités SKU-HVAC-4421 a 125 CAD = 32 000 CAD; fournisseur ThermoControl; justification : remplacement preventif lot LT-8842; delai Patrick : 17 h.",
      "required": true
    },
    {
      "key": "ctx-audit-trail",
      "title": "Exigences piste audit",
      "body": "Chaque approbation doit inclure : demandeur, montant, niveau requis, approbateur, horodatage, justification metier. Contournement = violation GOV-02.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "approval-level",
      "type": "SINGLE_CHOICE",
      "prompt": "Quel niveau d'approbation est requis pour PO-URG-9033 (32 000 CAD) ?",
      "options": [
        {
          "key": "committee",
          "label": "Comite achats (Marc + DG) — au-dela de 25 000 CAD"
        },
        {
          "key": "vp-only",
          "label": "VP Operations seul — Patrick peut approuver"
        },
        {
          "key": "manager",
          "label": "Manager Julie — limite 15 000 CAD"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "committee"
        ]
      }
    },
    {
      "id": "approval-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements doivent figurer dans la demande d'approbation ?",
      "options": [
        {
          "key": "amount",
          "label": "Montant exact 32 000 CAD"
        },
        {
          "key": "justification",
          "label": "Justification metier lot LT-8842"
        },
        {
          "key": "approver-level",
          "label": "Niveau d'approbation requis identifie"
        },
        {
          "key": "audit-trail",
          "label": "Piste audit complete"
        },
        {
          "key": "verbal-only",
          "label": "Approbation verbale de Patrick sans trace"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "amount",
          "justification",
          "approver-level",
          "audit-trail"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "approval-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le traitement gouverne sous pression.",
      "options": [
        {
          "key": "document",
          "label": "Documenter la demande avec justification metier"
        },
        {
          "key": "route",
          "label": "Router vers le comite achats (niveau requis)"
        },
        {
          "key": "obtain",
          "label": "Obtenir l'approbation formelle tracee"
        },
        {
          "key": "release",
          "label": "Liberer la PO uniquement apres approbation"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "document",
          "route",
          "obtain",
          "release"
        ]
      }
    },
    {
      "id": "po-amount",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel est le montant (CAD) de PO-URG-9033 (256 x 125) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 32000,
        "numericTolerance": 0
      }
    },
    {
      "id": "pressure-response",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Patrick insiste pour liberer sans attendre le comite. Que recommandez-vous a Isabelle : contourner ou tenir la matrice ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "gouvernance",
          "audit",
          "approbation",
          "pression"
        ]
      }
    }
  ],
  "completionFeedback": "PO-URG-9033 approuvee par le comite achats avec piste audit complete. Gouvernance respectee malgre la pression de 17 h.\n\nIsabelle Roy"
} as const satisfies MissionDefinitionDocument;
