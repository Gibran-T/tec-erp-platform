export {
  disconnectPrismaClient,
  getPrismaClient,
  PrismaClient,
} from "./client.js";

export {
  buildDemoSeed,
  DEMO_EMPLOYEE_DISPLAY_NAME,
  DEMO_EMPLOYEE_EMAIL,
  DEMO_EMPLOYEE_NUMBER,
  DEMO_EMPLOYEE_PASSWORD,
  DEMO_EMPLOYEE_ROLE,
  NORDHABITAT_COMPANY,
  type DemoCompanySeed,
  type DemoEmployeeSeed,
  type DemoSeed,
} from "./seed-data.js";

export type { PlatformSchemaMetadata } from "@prisma/client";
