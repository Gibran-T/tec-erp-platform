import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";

export function LoginPlaybackPage(): ReactNode {
  const { copy, branding, endorsement } = usePlayback();
  const navigate = useNavigate();
  const [email, setEmail] = useState("camille.demo@example.com");
  const [password, setPassword] = useState("playback-only");
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // Playback-only — no production authentication call.
    navigate("/playback/v2/orientation");
  }

  return (
    <main className="playback-shell" data-testid="playback-login">
      <div className="pb-login">
        <aside className="pb-login__context" data-testid="login-product-context">
          <div>
            <div className="playback-brand" style={{ color: "#fff" }}>
              {branding.productName}
            </div>
            {branding.showInstitution && endorsement ? (
              <p className="playback-endorsement" data-testid="login-institution-endorsement" style={{ color: "#d7e8f7" }}>
                {endorsement}
              </p>
            ) : (
              <p data-testid="login-independent-state" style={{ color: "#d7e8f7" }}>
                {branding.productName}
              </p>
            )}
            <p style={{ marginTop: "1.25rem", maxWidth: "36ch" }}>{copy.login.promise}</p>
          </div>
          <div>
            <div className="pb-live-preview__title">{copy.hero.previewTitle}</div>
            <div className="pb-live-flow" aria-hidden="true" />
            <p style={{ margin: "0.65rem 0 0", fontWeight: 650 }}>{copy.login.signal}</p>
            <p style={{ margin: "0.35rem 0 0", opacity: 0.85 }}>{copy.hero.processValue}</p>
          </div>
        </aside>

        <section className="pb-login__auth" aria-labelledby="login-title">
          <h1 id="login-title">{copy.login.title}</h1>
          <p style={{ margin: 0, color: "var(--pb-muted)" }}>{copy.login.lead}</p>
          <form onSubmit={onSubmit} data-testid="playback-login-form" noValidate>
            <label>
              {copy.login.email}
              <input
                data-testid="playback-login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              {copy.login.password}
              <div className="pb-password-row">
                <input
                  data-testid="playback-login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="playback-btn playback-btn--ghost playback-btn--small"
                  data-testid="playback-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? copy.login.hidePassword : copy.login.showPassword}
                </button>
              </div>
            </label>
            {/* Role selection intentionally absent from learner-facing auth form */}
            <button type="submit" className="playback-btn" data-testid="playback-login-submit">
              {copy.login.submit}
            </button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            <Link to="/playback/v2/portal">{copy.login.back}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
