import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { useTheme } from "../../theme/ThemeProvider.js";

import "./academic-portal.css";

const SAP_LEARNING_HUB_URL = "https://learning.sap.com/students";

export function AcademicPortalPage(): ReactNode {
  const { status } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const { preference, resolved, setPreference } = useTheme();
  const isAuthenticated = status === "authenticated";

  return (
    <main
      data-testid="academic-portal"
      className="academic-portal"
      data-resolved-theme={resolved}
    >
      <header className="academic-portal__toolbar living-shell-controls">
        <label>
          {t("shell.language")}
          <select
            data-testid="portal-locale-switch"
            value={locale}
            onChange={(event) => setLocale(event.target.value === "en" ? "en" : "fr")}
            aria-label={t("shell.language")}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </label>
        <label>
          {t("shell.theme")}
          <select
            data-testid="portal-theme-switch"
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
      </header>

      <div className="academic-portal__inner">
        {isAuthenticated ? (
          <section className="academic-portal__authenticated" data-testid="portal-authenticated-banner">
            <p>{t("portal.authenticated.hint")}</p>
            <Link className="academic-portal__cta academic-portal__cta--primary" to="/workspace">
              {t("portal.authenticated.workstation")}
            </Link>
          </section>
        ) : null}

        <section className="academic-portal__hero" aria-labelledby="portal-hero-title">
          <span className="academic-portal__kicker">{t("portal.hero.kicker")}</span>
          <h1 id="portal-hero-title">{t("portal.hero.title")}</h1>
          <p>{t("portal.hero.subtitle")}</p>
        </section>

        <section aria-labelledby="portal-doors-title">
          <h2 id="portal-doors-title" className="sr-only">
            {t("portal.doors.title")}
          </h2>
          <div className="academic-portal__doors" data-testid="portal-dual-doors">
            <article className="academic-portal__door" data-testid="portal-door-sap">
              <span className="academic-portal__door-tag">{t("portal.doors.sap.tag")}</span>
              <h2>{t("portal.doors.sap.title")}</h2>
              <p>{t("portal.doors.sap.description")}</p>
              <a
                className="academic-portal__cta academic-portal__cta--secondary"
                href={SAP_LEARNING_HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="portal-sap-hub-link"
              >
                {t("portal.doors.sap.cta")}
              </a>
            </article>

            <article className="academic-portal__door" data-testid="portal-door-tec">
              <span className="academic-portal__door-tag">{t("portal.doors.tec.tag")}</span>
              <h2>{t("portal.doors.tec.title")}</h2>
              <p>{t("portal.doors.tec.description")}</p>
              <Link
                className="academic-portal__cta academic-portal__cta--primary"
                to="/login"
                data-testid="portal-login-link"
              >
                {t("portal.doors.tec.cta")}
              </Link>
            </article>
          </div>
        </section>

        <section
          className="academic-portal__panel academic-portal__panel--emphasis"
          aria-labelledby="portal-rule-title"
          data-testid="portal-five-second-rule"
        >
          <h3 id="portal-rule-title">{t("portal.rule.title")}</h3>
          <p>{t("portal.rule.body")}</p>
        </section>

        <section
          className="academic-portal__panel"
          aria-labelledby="portal-semaine-zero-title"
          data-testid="portal-semaine-zero"
        >
          <h3 id="portal-semaine-zero-title">{t("portal.semaineZero.title")}</h3>
          <p>{t("portal.semaineZero.body")}</p>
        </section>

        <p data-testid="portal-not-sap-clone">{t("portal.notSapClone")}</p>

        <footer className="academic-portal__footer-links">
          <Link to="/login">{t("portal.footer.login")}</Link>
          <Link to="/playback/v2/portal" className="academic-portal__prototype-note" data-testid="portal-prototype-link">
            {t("portal.footer.prototype")}
          </Link>
        </footer>
      </div>
    </main>
  );
}
