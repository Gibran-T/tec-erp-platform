import { getPrismaClient, disconnectPrismaClient } from "@tec-platform/database-erp";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { loadConfig } from "../../config.js";

const databaseUrl = process.env.DATABASE_URL;
const describeIntegration = databaseUrl ? describe : describe.skip;

describeIntegration("database integration (RC00)", () => {
  beforeAll(async () => {
    const client = getPrismaClient();
    await client.$connect();
  });

  afterAll(async () => {
    await disconnectPrismaClient();
  });

  it("connects to PostgreSQL via Prisma", async () => {
    const client = getPrismaClient();
    const result = await client.$queryRaw<Array<{ value: number }>>`SELECT 1 AS value`;

    expect(result[0]?.value).toBe(1);
  });

  it("returns ready when database is reachable", async () => {
    const config = loadConfig({
      NODE_ENV: "test",
      PORT: "3000",
      CORS_ORIGIN: "http://localhost:5173",
      LOG_LEVEL: "error",
      DATABASE_URL: databaseUrl,
    });

    const app = createApp(config);
    const response = await request(app).get("/ready").expect(200);

    expect(response.body).toMatchObject({
      status: "ready",
      checks: {
        database: "up",
      },
    });
  });
});
