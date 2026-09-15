import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { useLocale } from "../i18n/LocaleProvider.js";
import { useTheme } from "../theme/ThemeProvider.js";
import { SAP_ANALYSTE_PROGRAM_TITLE } from "../workspace/sapAnalysteProduct.js";

import "./login-entrance.css";

const SUITE_MARKERS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"] as const;

export function LoginPage(): ReactNode {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const { t, locale, setLocale, localizeLoginError } = useLocale();
  const { preference, setPreference, resolved } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/workspace", { replace: true });
    }
  }, [status, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedEmail = email.trim();
    const emailOk = Boolean(trimmedEmail) && trimmedEmail.includes("@");
    const passwordOk = password.length > 0;
    setEmailInvalid(!emailOk);
    setPasswordInvalid(!passwordOk);

    if (!emailOk) {
      setError(t("login.error.invalidEmail"));
      return;
    }

    if (!passwordOk) {
      setError(t("login.error.generic"));
      return;
    }

    setSubmitting(true);

    try {
      await login(trimmedEmail, password);
      setSuccess(true);
      navigate("/workspace", { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? localizeLoginError(submitError.message)
          : t("login.error.generic");
      setError(message);
      setPasswordInvalid(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main data-testid="login-page" className="living-login" data-resolved-theme={resolved}>
      <div className="living-login__horizon" aria-hidden="true" />

      <header className="living-login__chrome">
        <div className="living-login__lockup">
          <span className="living-login__mark" aria-hidden="true">
            AE
          </span>
          <div className="living-login__lockup-text">
            <span className="living-login__institution">{t("login.institution")}</span>
            <span className="living-login__chrome-product">{SAP_ANALYSTE_PROGRAM_TITLE}</span>
          </div>
        </div>

        <div className="living-shell-controls living-login__controls">
          <label>
            <span className="sr-only">{t("shell.language")}</span>
            <select
              data-testid="login-locale-switch"
              value={locale}
              onChange={(event) => setLocale(event.target.value === "en" ? "en" : "fr")}
              aria-label={t("shell.language")}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>
          <label>
            <span className="sr-only">{t("shell.theme")}</span>
            <select
              data-testid="login-theme-switch"
              value={preference}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "light" || value === "dark" || value === "system") {
                  setPreference(value);
                }
              }}
              aria-label={t("shell.theme")}
            >
              <option value="light">{t("shell.theme.light")}</option>
              <option value="dark">{t("shell.theme.dark")}</option>
              <option value="system">{t("shell.theme.system")}</option>
            </select>
          </label>
        </div>
      </header>

      <p className="living-login__system-strip" aria-label={t("login.system")}>
        <span>{t("login.institution")}</span>
        <span aria-hidden="true">·</span>
        <span>{t("login.title")}</span>
        <span aria-hidden="true">·</span>
        <span>{t("login.subtitle")}</span>
      </p>

      <div className="living-login__stage">
        <section className="living-login__brief" aria-labelledby="login-title">
          <p className="living-login__kicker">{t("login.institution")}</p>
          <h1 id="login-title">{t("login.title")}</h1>
          <p className="living-login__program">{t("login.subtitle")}</p>
          <p className="living-login__orientation">{t("login.orientation")}</p>
          <ul className="living-login__principles">
            <li>{t("login.principle.learn")}</li>
            <li>{t("login.principle.organize")}</li>
            <li>{t("login.principle.attest")}</li>
          </ul>
          <ol className="living-login__suite" aria-label="S1–S10">
            {SUITE_MARKERS.map((marker) => (
              <li key={marker}>{marker}</li>
            ))}
          </ol>
        </section>

        <section className="living-login__panel">
          <form
            className="living-login__form"
            onSubmit={(event) => void handleSubmit(event)}
            aria-label={t("login.access")}
            aria-busy={submitting}
            noValidate
          >
            <p className="living-login__form-kicker">{t("login.system")}</p>
            <h2 className="living-login__form-lead">{t("login.access")}</h2>
            <p className="living-login__form-help">{t("login.subtitle")}</p>

            <div className="living-login__field" data-invalid={emailInvalid ? "true" : "false"}>
              <label htmlFor="email">{t("login.email")}</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailInvalid(false);
                }}
                required
                aria-invalid={emailInvalid}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div className="living-login__field" data-invalid={passwordInvalid ? "true" : "false"}>
              <label htmlFor="password">{t("login.password")}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordInvalid(false);
                }}
                required
                aria-invalid={passwordInvalid}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            {error ? (
              <p role="alert" id="login-error" data-testid="login-error" className="living-login__error">
                {error}
              </p>
            ) : null}

            {success ? (
              <p role="status" className="living-login__success">
                {t("login.success")}
              </p>
            ) : null}

            <button className="living-login__submit" type="submit" disabled={submitting || success}>
              {submitting ? t("login.submitting") : t("login.submit")}
            </button>
          </form>
          <p className="living-login__footnote">{t("login.footnote")}</p>
        </section>
      </div>
    </main>
  );
}
