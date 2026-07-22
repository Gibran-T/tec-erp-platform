import type { MissionDefinitionDocument } from "../schema.js";

export const M7_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m7-m02-coordonner-escalade",
  "missionCode": "M7-M02",
  "moduleCode": "M7",
  "title": "Coordonner l'escalade",
  "preview": "Escaladez CAS-7701 vers qualite et logistique sans perdre la trace client.",
  "briefing": "Bonjour,\n\nCAS-7701 est qualifie P1 : deux unites bruyantes, impact salle pediatrique. Qualite suspecte un lot ThermoControl; logistique doit confirmer le stock de remplacement a DC-TRT.\n\nVotre role : coordonner l'escalade multi-departements sans que le Dr Meunier recoive trois versions differentes. Chaque action doit etre tracee dans le CRM avec proprietaire et echeance.\n\nPatrick veut une reponse unifiee avant 16 h. Moi je veux une chaine d'escalade propre.\n\nSophie Lambert\nService client — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Ouvrir le dossier client » (CAS-7701 qualifie).",
  "sequence": 2,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-CRM-03",
    "C-QLT-03"
  ],
  "contextItems": [
    {
      "key": "ctx-escalation-matrix",
      "title": "Matrice d'escalade NordHabitat",
      "body": "P1 : notification qualite + logistique sous 2 h; proprietaire CRM reste Sophie; seule Sophie communique au client; delai cible resolution P1 : 24 h.",
      "required": true
    },
    {
      "key": "ctx-quality-hold",
      "title": "Alerte qualite lot LT-8842",
      "body": "Qualite ouvre QH-221 sur lot ThermoControl LT-8842; 3 signalements similaires cette semaine; echantillon en analyse; remplacement possible si stock disponible.",
      "required": true
    },
    {
      "key": "ctx-replacement-stock",
      "title": "Stock remplacement DC-TRT",
      "body": "SKU-HVAC-4421 : 6 unités libres apres allocation Sacre-Coeur; transfert express possible depuis DC-MTL (52 unités) si validation qualite sous 4 h.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "escalation-owner",
      "type": "SINGLE_CHOICE",
      "prompt": "Qui doit rester le point de contact unique du Dr Meunier pendant l'escalade ?",
      "options": [
        {
          "key": "crm-owner",
          "label": "Sophie Lambert — proprietaire CRM"
        },
        {
          "key": "quality-direct",
          "label": "L'ingenieur qualite contacte directement le client"
        },
        {
          "key": "logistics-direct",
          "label": "La logistique promet la date au client"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "crm-owner"
        ]
      }
    },
    {
      "id": "escalation-parties",
      "type": "MULTI_CHOICE",
      "prompt": "Quels departements devez-vous mobiliser pour CAS-7701 P1 ?",
      "options": [
        {
          "key": "quality",
          "label": "Qualite — analyse lot LT-8842"
        },
        {
          "key": "logistics",
          "label": "Logistique — disponibilite remplacement"
        },
        {
          "key": "crm-trace",
          "label": "CRM — journal d'escalade et echeances"
        },
        {
          "key": "finance-only",
          "label": "Finance seule — sans qualite ni logistique"
        },
        {
          "key": "silent",
          "label": "Escalade interne sans trace CRM"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "quality",
          "logistics",
          "crm-trace"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "escalation-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la coordination d'escalade multi-departements.",
      "options": [
        {
          "key": "notify",
          "label": "Notifier qualite et logistique avec echeance 2 h"
        },
        {
          "key": "consolidate",
          "label": "Consolider les retours dans le dossier CRM"
        },
        {
          "key": "respond",
          "label": "Communiquer une reponse unifiee au Dr Meunier"
        },
        {
          "key": "monitor",
          "label": "Suivre les echeances jusqu'a resolution"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "notify",
          "consolidate",
          "respond",
          "monitor"
        ]
      }
    },
    {
      "id": "escalation-hours",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel est le delai cible de resolution (heures) pour un cas P1 selon la matrice ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 24,
        "numericTolerance": 0
      }
    },
    {
      "id": "escalation-communication",
      "type": "TEXT_ANALYSIS",
      "prompt": "Redigez en deux phrases la communication unifiee que Sophie envoie au Dr Meunier apres consolidation qualite/logistique.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "escalade",
          "delai",
          "remplacement",
          "trace"
        ]
      }
    }
  ],
  "completionFeedback": "Escalade CAS-7701 coordonnee. Qualite et logistique alignees; le Dr Meunier recoit une seule reponse tracee avant 16 h.\n\nSophie Lambert"
} as const satisfies MissionDefinitionDocument;
