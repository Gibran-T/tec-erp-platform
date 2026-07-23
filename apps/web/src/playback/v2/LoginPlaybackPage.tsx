import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";

export function LoginPlaybackPage(): ReactNode {
  const { copy } = usePlayback();
  const navigate = useNavigate();
  const [email, setEmail] = useState(copy.login.demoEmail);
  const [password, setPassword] = useState("playback-demo");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"learner" | "professor">("learner");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError(copy.login.validationEmail);
      return;
    }
    if (!password.trim()) {
      setError(copy.login.validationPassword);
      return;
    }
    // Prototype only — no production auth call, no credential persistence.
    navigate("/playback/v2/orientation", { replace: false, state: { role } });
  }

  return (
    <main className="playback-login" data-testid="playback-login">
      <p className="playback-eyebrow">TEC.ERP</p>
      <h1>{copy.login.title}</h1>
      <p className="playback-lead">{copy.login.support}</p>
      <p className="playback-note">{copy.login.prototypeNote}</p>

      <form onSubmit={handleSubmit} noValidate aria-label={copy.login.title}>
        <label htmlFor="playback-role">{copy.login.roleLearner} / {copy.login.roleProfessor}</label>
        <select
          id="playback-role"
          value={role}
          onChange={(event) => setRole(event.target.value === "professor" ? "professor" : "learner")}
        >
          <option value="learner">{copy.login.roleLearner}</option>
          <option value="professor">{copy.login.roleProfessor}</option>
        </select>

        <label htmlFor="playback-email">{copy.login.email}</label>
        <input
          id="playback-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <div className="playback-field-row">
          <label htmlFor="playback-password">{copy.login.password}</label>
          <button
            type="button"
            className="playback-btn playback-btn--small playback-btn--ghost"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
          >
            {showPassword ? copy.login.hidePassword : copy.login.showPassword}
          </button>
        </div>
        <input
          id="playback-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? (
          <p className="playback-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="playback-btn playback-btn--primary" style={{ width: "100%" }}>
          {copy.login.submit}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <Link className="playback-btn playback-btn--ghost" to="/playback/v2/portal">
          {copy.login.back}
        </Link>
      </p>
    </main>
  );
}
