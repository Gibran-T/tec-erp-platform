import { DomainError, Result } from "@tec-platform/core";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  RefreshRequestSchema,
  RefreshResponseSchema,
  SessionResponseSchema,
} from "@tec-platform/contracts";
import type { NextFunction, Request, Response } from "express";

import type { AuthService } from "./auth.service.js";

function extractBearerToken(req: Request): string | null {
  const header = req.header("authorization");

  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = header.slice("bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export interface AuthHandlers {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  session(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function createAuthHandlers(service: AuthService): AuthHandlers {
  return {
    async login(req, res, next) {
      try {
        const parsed = LoginRequestSchema.safeParse(req.body);

        if (!parsed.success) {
          throw DomainError.validation("A valid email and password are required.");
        }

        const outcome = await service.login(parsed.data);

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(LoginResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },

    async refresh(req, res, next) {
      try {
        const parsed = RefreshRequestSchema.safeParse(req.body);

        if (!parsed.success) {
          throw DomainError.validation("A refresh token is required.");
        }

        const outcome = await service.refresh(parsed.data.refreshToken);

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(RefreshResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },

    async logout(_req, res, next) {
      try {
        // RC01 tokens are stateless; logout is acknowledged and the client
        // discards its tokens. Server-side revocation is a later-release concern.
        res.status(200).json(LogoutResponseSchema.parse({ success: true }));
      } catch (error) {
        next(error);
      }
    },

    async session(req, res, next) {
      try {
        const token = extractBearerToken(req);

        if (!token) {
          throw DomainError.unauthorized("Authentication is required.");
        }

        const outcome = await service.session(token);

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(SessionResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },
  };
}
