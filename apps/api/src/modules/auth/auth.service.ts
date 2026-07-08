import { DomainError, Password, Result, type Result as ResultType } from "@tec-platform/core";
import type {
  AuthenticatedEmployee,
  AuthTokens,
  LoginRequest,
} from "@tec-platform/contracts";

import { issueToken, verifyToken } from "./auth.tokens.js";
import { toAuthenticatedEmployee, type EmployeeRepository } from "./auth.types.js";

export interface AuthServiceConfig {
  readonly jwtAccessSecret: string;
  readonly jwtRefreshSecret: string;
  readonly accessTokenTtlSeconds: number;
  readonly refreshTokenTtlSeconds: number;
}

export interface AuthServiceDependencies {
  readonly employeeRepository: EmployeeRepository;
  readonly config: AuthServiceConfig;
  readonly now?: () => number;
}

export interface AuthService {
  login(request: LoginRequest): Promise<ResultType<{ employee: AuthenticatedEmployee; tokens: AuthTokens }>>;
  refresh(refreshToken: string): Promise<ResultType<{ tokens: AuthTokens }>>;
  session(accessToken: string): Promise<ResultType<{ employee: AuthenticatedEmployee }>>;
}

const INVALID_CREDENTIALS = "Invalid email or password.";

export function createAuthService(dependencies: AuthServiceDependencies): AuthService {
  const { employeeRepository, config } = dependencies;
  const now = dependencies.now ?? (() => Date.now());

  function issueTokensFor(employeeId: string): AuthTokens {
    const nowMs = now();

    const access = issueToken(
      { sub: employeeId, typ: "access" },
      config.jwtAccessSecret,
      config.accessTokenTtlSeconds,
      nowMs,
    );

    const refresh = issueToken(
      { sub: employeeId, typ: "refresh" },
      config.jwtRefreshSecret,
      config.refreshTokenTtlSeconds,
      nowMs,
    );

    return {
      accessToken: access.token,
      refreshToken: refresh.token,
      accessTokenExpiresAt: access.expiresAt.toISOString(),
      refreshTokenExpiresAt: refresh.expiresAt.toISOString(),
    };
  }

  return {
    async login(request) {
      const record = await employeeRepository.findByEmail(request.email.toLowerCase());

      // Same failure for unknown email and wrong password — no user enumeration.
      if (!record || !Password.verify(request.password, record.passwordHash)) {
        return Result.fail(DomainError.unauthorized(INVALID_CREDENTIALS));
      }

      return Result.ok({
        employee: toAuthenticatedEmployee(record),
        tokens: issueTokensFor(record.id),
      });
    },

    async refresh(refreshToken) {
      const verified = verifyToken(
        refreshToken,
        config.jwtRefreshSecret,
        "refresh",
        now(),
      );

      if (Result.isFail(verified)) {
        return verified;
      }

      const record = await employeeRepository.findById(verified.value.sub);

      if (!record) {
        return Result.fail(DomainError.unauthorized("Session is no longer valid."));
      }

      return Result.ok({ tokens: issueTokensFor(record.id) });
    },

    async session(accessToken) {
      const verified = verifyToken(
        accessToken,
        config.jwtAccessSecret,
        "access",
        now(),
      );

      if (Result.isFail(verified)) {
        return verified;
      }

      const record = await employeeRepository.findById(verified.value.sub);

      if (!record) {
        return Result.fail(DomainError.unauthorized("Session is no longer valid."));
      }

      return Result.ok({ employee: toAuthenticatedEmployee(record) });
    },
  };
}
