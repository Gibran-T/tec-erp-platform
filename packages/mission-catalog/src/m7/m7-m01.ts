import type { MissionDefinitionDocument } from "../schema.js";

export const M7_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m7-m01-ouvrir-dossier-client",
  "missionCode": "M7-M01",
  "moduleCode": "M7",
  "title": "Ouvrir le dossier client",
  "preview": "Qualifiez la reclamation garantie du Dr Meunier sur les unités HVAC Sacre-Coeur.",
  "briefing": "Bonjour,\n\nLe Dr Meunier signale deux unites SKU-HVAC-4421 defectueuses sur la commande Sacre-Coeur (SO-12047). Il exige un remplacement sous 48 h et menace de suspendre les futurs achats.\n\nAvant toute promesse, ouvrez un dossier CRM structure : identifiez le client, la garantie, la preuve de livraison et le niveau de severite. Patrick insiste pour calmer la situation; moi je veux un dossier propre et tracable.\n\nNe promettez rien sans verifier la couverture garantie et l'historique service.\n\nSophie Lambert\nService client — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 6 (narration finance M3-M6) pour débloquer le CRM post-vente.",
  "sequence": 1,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-CRM-02"
  ],
  "contextItems": [
    {
      "key": "ctx-case-intake",
      "title": "Signalement Dr Meunier — CAS-7701",
      "body": "Client Sacre-Coeur; contact Dr Meunier; 2 unités SKU-HVAC-4421 bruit anormal apres 72 h; livraison SO-12047 du 12 juin; demande remplacement express.",
      "required": true
    },
    {
      "key": "ctx-warranty",
      "title": "Politique garantie institutionnelle",
      "body": "Garantie fabricant 24 mois; garantie NordHabitat service 12 mois sur installation; remplacement express si severite P1 et preuve GR valide; delai standard P2 : 5 jours ouvrables.",
      "required": true
    },
    {
      "key": "ctx-delivery-proof",
      "title": "Preuve livraison et GR",
      "body": "Bon de livraison BL-8847 confirme 40 unités recues; GR partiel ThermoControl non applicable ici; photos Dr Meunier jointes; numero de serie SN-4421-A17 et SN-4421-B03.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "case-first-step",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est votre premiere action pour ouvrir le dossier CAS-7701 ?",
      "options": [
        {
          "key": "qualify",
          "label": "Qualifier client, produit, garantie et preuve de livraison"
        },
        {
          "key": "promise",
          "label": "Promettre le remplacement sous 48 h sans verification"
        },
        {
          "key": "close",
          "label": "Clore le signalement comme non fonde"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "qualify"
        ]
      }
    },
    {
      "id": "case-fields",
      "type": "MULTI_CHOICE",
      "prompt": "Quels champs sont obligatoires dans un dossier CRM garantie valide ?",
      "options": [
        {
          "key": "client-id",
          "label": "Identifiant client et contact"
        },
        {
          "key": "so-ref",
          "label": "Reference commande SO-12047"
        },
        {
          "key": "serial",
          "label": "Numeros de serie des unités concernees"
        },
        {
          "key": "severity",
          "label": "Niveau de severite P1 ou P2"
        },
        {
          "key": "emoji",
          "label": "Emoji dans le titre du cas"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "client-id",
          "so-ref",
          "serial",
          "severity"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "case-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez l'ouverture controlee du dossier garantie.",
      "options": [
        {
          "key": "identify",
          "label": "Identifier le client et la commande"
        },
        {
          "key": "verify-warranty",
          "label": "Verifier la couverture garantie"
        },
        {
          "key": "classify",
          "label": "Classer la severite et documenter les preuves"
        },
        {
          "key": "open-case",
          "label": "Creer le dossier CAS-7701 dans le CRM"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "identify",
          "verify-warranty",
          "classify",
          "open-case"
        ]
      }
    },
    {
      "id": "units-affected",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien d'unités defectueuses le Dr Meunier signale-t-il sur SO-12047 ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 2,
        "numericTolerance": 0
      }
    },
    {
      "id": "warranty-stance",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "La garantie couvre les unités mais le delai express depend de la severite P1. Que recommandez-vous a Sophie : promesse immediate ou qualification documentee ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "garantie",
          "severite",
          "preuve",
          "client"
        ]
      }
    }
  ],
  "completionFeedback": "Dossier CAS-7701 ouvert avec qualification garantie complete. Le Dr Meunier est informe du processus sans promesse prematuree.\n\nSophie Lambert"
} as const satisfies MissionDefinitionDocument;
