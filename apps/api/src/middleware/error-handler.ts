import { DomainError } from "@tec-platform/core";
import { toApiErrorEnvelope } from "@tec-platform/contracts";
import type { NextFunction, Request, Response } from "express";

import type { Logger } from "@tec-platform/core";

import { getRequestId } from "./request-id.js";

const DOMAIN_ERROR_STATUS: Record<DomainError["code"], number> = {
  NOT_FOUND: 404,
  VALIDATION: 400,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL: 500,
};

export function createErrorHandler(logger: Logger) {
  return (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (res.headersSent) {
      next(error);
      return;
    }

    const requestId = getRequestId(req);

    if (error instanceof DomainError) {
      const status = DOMAIN_ERROR_STATUS[error.code];

      logger.warn("domain_error", {
        code: error.code,
        message: error.message,
        requestId,
      });

      res.status(status).json(toApiErrorEnvelope(error, requestId));
      return;
    }

    const message = error instanceof Error ? error.message : "Unexpected error";

    logger.error("unhandled_error", {
      message,
      requestId,
    });

    res.status(500).json({
      error: {
        code: "INTERNAL",
        message: "An unexpected error occurred.",
        requestId,
      },
    });
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  const requestId = getRequestId(req);

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.path}`,
      requestId,
    },
  });
}
