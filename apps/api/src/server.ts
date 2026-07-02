import type { Server } from "node:http";

import type { Express } from "express";

import { createApp } from "./app.js";
import { loadConfig, type AppConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { disconnectPrismaClient } from "@tec-platform/database-erp";

export interface RunningServer {
  readonly app: Express;
  readonly config: AppConfig;
  readonly server: Server;
}

export async function startServer(): Promise<RunningServer> {
  const config = loadConfig();
  const logger = createLogger(config, "server");
  const app = createApp(config);

  return new Promise((resolve, reject) => {
    const server = app.listen(config.port, () => {
      logger.info("server_started", {
        port: config.port,
        nodeEnv: config.nodeEnv,
      });
      resolve({ app, config, server });
    });

    server.on("error", (error) => {
      logger.error("server_start_failed", { message: String(error) });
      reject(error);
    });
  });
}

export async function stopServer(running: RunningServer): Promise<void> {
  const logger = createLogger(running.config, "server");

  await new Promise<void>((resolve, reject) => {
    running.server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await disconnectPrismaClient();
  logger.info("server_stopped");
}
