import { startServer } from "./server.js";

startServer().catch((error: unknown) => {
  console.error(
    JSON.stringify({
      level: "error",
      scope: "bootstrap",
      message: "Failed to start API server",
      timestamp: new Date().toISOString(),
      meta: {
        error: error instanceof Error ? error.message : String(error),
      },
    }),
  );
  process.exit(1);
});
