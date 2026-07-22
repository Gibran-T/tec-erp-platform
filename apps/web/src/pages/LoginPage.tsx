import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { useLocale } from "../i18n/LocaleProvider.js";

export function LoginPage(): ReactNode {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const { t, locale, setLocale, localizeLoginError } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/workspace", { replace: true });
    }
  }, [status, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError(t("login.error.invalidEmail"));
      return;
    }

    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/workspace", { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? localizeLoginError(submitError.message)
          : t("login.error.generic");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main data-testid="login-page" className="living-login">
      <div className="living-shell-controls" style={{ justifyContent: "flex-end" }}>
        <label>
          {t("shell.language")}
          <select
            data-testid="login-locale-switch"
            value={locale}
            onChange={(event) => setLocale(event.target.value === "en" ? "en" : "fr")}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </label>
      </div>
      <h1>{t("login.title")}</h1>
      <p>{t("login.subtitle")}</p>

      <form onSubmit={(event) => void handleSubmit(event)} aria-label={t("login.submit")} noValidate>
        <div>
          <label htmlFor="email">{t("login.email")}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">{t("login.password")}</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p role="alert" data-testid="login-error">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={submitting}>
          {submitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>
    </main>
  );
}
