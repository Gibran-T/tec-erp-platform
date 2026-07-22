import type { MissionDefinitionDocument } from "../schema.js";

export const M8_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m8-m02-revue-acces-sod",
  "missionCode": "M8-M02",
  "moduleCode": "M8",
  "title": "Revue d'accès et ségrégation des tâches",
  "preview": "Identifiez les conflits SoD sur les accès achats et finance apres PO-URG-9033.",
  "briefing": "Bonjour,\n\nL'audit interne demande une revue d'acces trimestrielle. PO-URG-9033 a revele que Julie peut creer ET approuver des PO jusqu'a 15 000 CAD — conflit SoD potentiel avec Marc sur le rapprochement.\n\nVotre role : cartographier les roles ERP, identifier les conflits segregation des taches et proposer des remediations tracees. Aucune suppression d'acces sans validation metier.\n\nLa securite des processus commence par des acces propres.\n\nIsabelle Roy\nGouvernance — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Matrice d'approbation sous pression » (PO-URG-9033 tracee).",
  "sequence": 2,
  "estimatedMinutes": 45,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-GOV-03",
    "C-SEC-01"
  ],
  "contextItems": [
    {
      "key": "ctx-role-map",
      "title": "Cartographie roles ERP",
      "body": "Julie : createur PO + approbateur <= 15K; Marc : approbateur comite + rapprochement factures; Patrick : approbateur VP <= 25K; stagiaire : lecture seule.",
      "required": true
    },
    {
      "key": "ctx-sod-rules",
      "title": "Regles SoD NordHabitat",
      "body": "Interdit : creer PO + approuver PO meme utilisateur; interdit : approuver PO + rapprocher facture liee; tolerance : lecture seule sur tous modules.",
      "required": true
    },
    {
      "key": "ctx-access-review",
      "title": "Revue trimestrielle Q3",
      "body": "Perimetre : P2P + Finance; 47 comptes actifs; 3 conflits SoD detectes automatiquement; delai remediation : 10 jours ouvrables.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "sod-conflict",
      "type": "SINGLE_CHOICE",
      "prompt": "Quel conflit SoD est le plus critique a corriger en priorite ?",
      "options": [
        {
          "key": "create-approve",
          "label": "Julie : creer PO + approuver PO (<= 15K)"
        },
        {
          "key": "read-only",
          "label": "Stagiaire : lecture seule sur tous modules"
        },
        {
          "key": "vp-limit",
          "label": "Patrick : limite approbation 25K respectee"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "create-approve"
        ]
      }
    },
    {
      "id": "sod-violations",
      "type": "MULTI_CHOICE",
      "prompt": "Quels conflits SoD doivent etre remediés selon les regles NordHabitat ?",
      "options": [
        {
          "key": "julie-create-approve",
          "label": "Julie : separation creation et approbation PO"
        },
        {
          "key": "marc-approve-match",
          "label": "Marc : approbation PO + rapprochement facture liee"
        },
        {
          "key": "trace-remediation",
          "label": "Remediation tracee avec validation metier"
        },
        {
          "key": "keep-conflict",
          "label": "Conserver les conflits pour la rapidite"
        },
        {
          "key": "remove-all",
          "label": "Supprimer tous les accès sans analyse"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "julie-create-approve",
          "marc-approve-match",
          "trace-remediation"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "sod-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la revue d'accès et remediation SoD.",
      "options": [
        {
          "key": "inventory",
          "label": "Inventorier les roles et accès actifs"
        },
        {
          "key": "detect",
          "label": "Detecter les conflits SoD automatiques"
        },
        {
          "key": "remediate",
          "label": "Proposer remediation avec validation metier"
        },
        {
          "key": "verify",
          "label": "Verifier la correction et archiver la revue"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "inventory",
          "detect",
          "remediate",
          "verify"
        ]
      }
    },
    {
      "id": "conflict-count",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de conflits SoD la revue Q3 a-t-elle detectes automatiquement ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 3,
        "numericTolerance": 0
      }
    },
    {
      "id": "sod-explanation",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez pourquoi la ségrégation des tâches entre creation PO et approbation PO protege NordHabitat contre la fraude.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "segregation",
          "fraude",
          "controle",
          "approbation"
        ]
      }
    }
  ],
  "completionFeedback": "Revue Q3 completee. Trois conflits SoD remediés avec validation metier. Acces ERP alignes sur la gouvernance NordHabitat.\n\nIsabelle Roy"
} as const satisfies MissionDefinitionDocument;
