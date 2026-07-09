/**
 * Canonical environment variable catalog for TEC.ERP RC00.
 * Used by validate-env.ts to ensure .env.example stays synchronized.
 */

export type EnvClassification = "server_config" | "server_secret" | "client_public" | "feature_flag";

export interface EnvVariableDefinition {
  readonly key: string;
  readonly classification: EnvClassification;
  readonly requiredInExample: boolean;
  readonly description: string;
}

export const ENV_CATALOG: readonly EnvVariableDefinition[] = [
  {
    key: "NODE_ENV",
    classification: "server_config",
    requiredInExample: true,
    description: "Runtime environment",
  },
  {
    key: "PORT",
    classification: "server_config",
    requiredInExample: true,
    description: "API listen port",
  },
  {
    key: "CORS_ORIGIN",
    classification: "server_config",
    requiredInExample: true,
    description: "Allowed browser origin for CORS",
  },
  {
    key: "LOG_LEVEL",
    classification: "server_config",
    requiredInExample: true,
    description: "Log verbosity",
  },
  {
    key: "DATABASE_URL",
    classification: "server_secret",
    requiredInExample: true,
    description: "PostgreSQL connection string",
  },
  {
    key: "VITE_API_BASE_URL",
    classification: "client_public",
    requiredInExample: true,
    description: "API base URL for erp-web",
  },
  {
    key: "FEATURE_AI_COACH_ENABLED",
    classification: "feature_flag",
    requiredInExample: true,
    description: "AI Coach feature flag scaffold",
  },
  {
    key: "JWT_ACCESS_SECRET",
    classification: "server_secret",
    requiredInExample: false,
    description: "JWT access-token signing secret (required in production)",
  },
  {
    key: "JWT_REFRESH_SECRET",
    classification: "server_secret",
    requiredInExample: false,
    description: "JWT refresh-token signing secret (required in production)",
  },
  {
    key: "JWT_ACCESS_TTL_SECONDS",
    classification: "server_config",
    requiredInExample: false,
    description: "Access-token lifetime in seconds (default 900)",
  },
  {
    key: "JWT_REFRESH_TTL_SECONDS",
    classification: "server_config",
    requiredInExample: false,
    description: "Refresh-token lifetime in seconds (default 1209600)",
  },
] as const;

export const REQUIRED_EXAMPLE_KEYS = ENV_CATALOG.filter((entry) => entry.requiredInExample).map(
  (entry) => entry.key,
);

export const FORBIDDEN_VITE_SECRET_PREFIX = /^VITE_.*(SECRET|PASSWORD|TOKEN|KEY|PRIVATE)/i;
