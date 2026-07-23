import { getPrismaClient } from "@tec-platform/database-erp";
import { seedHcmM8AssessmentBank } from "../src/modules/assessment/hcm/hcm-m8.seed.ts";

const client = getPrismaClient();
const result = await seedHcmM8AssessmentBank(client);
console.log(JSON.stringify(result, null, 2));
await client.$disconnect();
