import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import type { AuthenticatedEmployee } from "@tec-platform/contracts";

import {
  clearStoredTokens,
  loadStoredTokens,
  requestLogin,
  requestLogout,
  requestRefresh,
  requestSession,
  saveStoredTokens,
} from "../api/auth.js";

export type AuthStatus = "restoring" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  readonly status: AuthStatus;
  readonly employee: AuthenticatedEmployee | null;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  readonly children: ReactNode;
  /** Test seam: skip network session restore on mount. */
  readonly skipRestore?: boolean;
  /** Test seam: pre-authenticated employee when restore is skipped. */
  readonly initialEmployee?: AuthenticatedEmployee | null;
}

export function AuthProvider({
  children,
  skipRestore = false,
  initialEmployee = null,
}: AuthProviderProps): ReactNode {
  const [status, setStatus] = useState<AuthStatus>(() => {
    if (skipRestore) {
      return initialEmployee ? "authenticated" : "unauthenticated";
    }
    return "restoring";
  });
  const [employee, setEmployee] = useState<AuthenticatedEmployee | null>(initialEmployee);

  useEffect(() => {
    if (skipRestore) {
      return;
    }

    let cancelled = false;

    async function restore(): Promise<void> {
      const tokens = loadStoredTokens();

      if (!tokens) {
        if (!cancelled) {
          setStatus("unauthenticated");
        }
        return;
      }

      try {
        const restored = await requestSession(tokens.accessToken);
        if (!cancelled) {
          setEmployee(restored);
          setStatus("authenticated");
        }
        return;
      } catch {
        // Access token likely expired — attempt a refresh below.
      }

      try {
        const refreshed = await requestRefresh(tokens.refreshToken);
        saveStoredTokens(refreshed);
        const restored = await requestSession(refreshed.accessToken);
        if (!cancelled) {
          setEmployee(restored);
          setStatus("authenticated");
        }
      } catch {
        clearStoredTokens();
        if (!cancelled) {
          setEmployee(null);
          setStatus("unauthenticated");
        }
      }
    }

    void restore();

    return () => {
      cancelled = true;
    };
  }, [skipRestore]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const result = await requestLogin(email, password);
    saveStoredTokens(result.tokens);
    setEmployee(result.employee);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const tokens = loadStoredTokens();
    await requestLogout(tokens?.accessToken ?? null);
    clearStoredTokens();
    setEmployee(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ status, employee, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
