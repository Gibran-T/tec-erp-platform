import { getPrismaClient } from "@tec-platform/database-erp";

export interface DatabaseReadinessResult {
  readonly isReady: boolean;
  readonly detail: "up" | "down";
}

export async function probeDatabaseReadiness(): Promise<DatabaseReadinessResult> {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;

    return {
      isReady: true,
      detail: "up",
    };
  } catch {
    return {
      isReady: false,
      detail: "down",
    };
  }
}
