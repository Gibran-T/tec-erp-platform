import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "../auth/AuthContext.js";
import { enMessages } from "./messages/en.js";
import { frMessages, type MessageKey } from "./messages/fr.js";
import { humanizeTechnicalId, statusMessageKey } from "./statusLabels.js";

export type AppLocale = "fr" | "en";

const LOCALE_STORAGE_KEY = "tec-erp.locale";

function localeStorageKey(employeeId?: string | null): string {
  return employeeId ? `${LOCALE_STORAGE_KEY}.${employeeId}` : LOCALE_STORAGE_KEY;
}

function readStoredLocale(employeeId?: string | null): AppLocale {
  try {
    const raw = localStorage.getItem(localeStorageKey(employeeId)) ?? localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw === "en" || raw === "fr") {
      return raw;
    }
  } catch {
    // ignore storage failures
  }
  return "fr";
}

export interface LocaleContextValue {
  readonly locale: AppLocale;
  setLocale(next: AppLocale): void;
  t(key: MessageKey): string;
  statusLabel(raw: string | null | undefined): string;
  formatDate(value: string | Date | null | undefined): string;
  formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions): string;
  localizeLoginError(message: string): string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { readonly children: ReactNode }): ReactNode {
  const auth = useContext(AuthContext);
  const employee = auth?.employee ?? null;
  const [locale, setLocaleState] = useState<AppLocale>(() => readStoredLocale(null));

  useEffect(() => {
    setLocaleState(readStoredLocale(employee?.id));
  }, [employee?.id]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: AppLocale) => {
      setLocaleState(next);
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
        if (employee?.id) {
          localStorage.setItem(localeStorageKey(employee.id), next);
        }
      } catch {
        // ignore
      }
    },
    [employee?.id],
  );

  const catalog = locale === "en" ? enMessages : frMessages;

  const t = useCallback(
    (key: MessageKey): string => {
      return catalog[key] ?? frMessages[key] ?? key;
    },
    [catalog],
  );

  const statusLabel = useCallback(
    (raw: string | null | undefined): string => {
      const key = statusMessageKey(raw);
      if (key === "status.unknown" && raw) {
        return humanizeTechnicalId(raw);
      }
      return t(key);
    },
    [t],
  );

  const formatDate = useCallback(
    (value: string | Date | null | undefined): string => {
      if (!value) {
        return "—";
      }
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "—";
      }
      return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    },
    [locale],
  );

  const formatNumber = useCallback(
    (value: number | null | undefined, options?: Intl.NumberFormatOptions): string => {
      if (value === null || value === undefined || Number.isNaN(value)) {
        return "—";
      }
      return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", options).format(value);
    },
    [locale],
  );

  const localizeLoginError = useCallback(
    (message: string): string => {
      const normalized = message.trim().toLowerCase();
      if (
        normalized.includes("invalid email or password") ||
        normalized.includes("courriel ou mot de passe")
      ) {
        return t("login.error.invalidCredentials");
      }
      if (
        normalized.includes("valid email") ||
        normalized.includes("a valid email") ||
        normalized.includes("type mismatch")
      ) {
        return t("login.error.invalidEmail");
      }
      if (!message.trim()) {
        return t("login.error.generic");
      }
      // Prefer localized generic when API leaks English technical copy in FR mode.
      if (locale === "fr" && /^[A-Za-z0-9 ,.'’\-!?]+$/.test(message) && /email|password|invalid|valid/i.test(message)) {
        return t("login.error.invalidCredentials");
      }
      return message;
    },
    [locale, t],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      statusLabel,
      formatDate,
      formatNumber,
      localizeLoginError,
    }),
    [locale, setLocale, t, statusLabel, formatDate, formatNumber, localizeLoginError],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

const fallbackLocale: LocaleContextValue = {
  locale: "fr",
  setLocale: () => undefined,
  t: (key) => frMessages[key] ?? key,
  statusLabel: (raw) => frMessages[statusMessageKey(raw)] ?? "Non précisé",
  formatDate: (value) => {
    if (!value) return "—";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium", timeStyle: "short" }).format(date);
  },
  formatNumber: (value, options) => {
    if (value === null || value === undefined || Number.isNaN(value)) return "—";
    return new Intl.NumberFormat("fr-CA", options).format(value);
  },
  localizeLoginError: (message) => {
    const normalized = message.trim().toLowerCase();
    if (normalized.includes("invalid email or password") || normalized.includes("valid email")) {
      return frMessages["login.error.invalidCredentials"];
    }
    return message || frMessages["login.error.generic"];
  },
};

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext) ?? fallbackLocale;
}
