import { Router } from "express";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { TransactionsService } from "./transactions.service.js";
import { TransactionActionRequestSchema } from "./transactions.validation.js";

/**
 * Wave 2 — employee-scoped transactional workspace mounted under /api/v1/me/transactions.
 */
export function createTransactionsMeRouter(service: TransactionsService): Router {
  const router = Router();

  router.get("/documents", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.listDocuments(employee.id);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/documents/:id", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getDocument(employee.id, req.params.id ?? "");
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/inventory", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getInventory(employee.id);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/finance", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getFinance(employee.id);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/actions", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = TransactionActionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Corps d'action transactionnelle invalide.");
      }
      const result = await service.executeAction(
        employee.id,
        parsed.data.action,
        parsed.data.payload,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json({ result: result.value });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
