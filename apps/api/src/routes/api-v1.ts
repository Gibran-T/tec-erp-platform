import { API_VERSION } from "@tec-platform/contracts";
import { Router } from "express";
import { z } from "zod";

const ApiV1RootResponseSchema = z.object({
  message: z.string(),
  apiVersion: z.literal(API_VERSION),
});

export function createApiV1Router(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    const payload = {
      message: "TEC.ERP API scaffold",
      apiVersion: API_VERSION,
    };

    res.status(200).json(ApiV1RootResponseSchema.parse(payload));
  });

  return router;
}
