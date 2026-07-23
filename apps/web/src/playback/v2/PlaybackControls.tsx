import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  usePlayback,
  type AmbientEventId,
  type PlaybackLevel,
  type PlaybackLocale,
  type PlaybackTheme,
  type PlaybackViewport,
} from "./PlaybackProvider.js";
import { PLAYBACK_MODULES, type PlaybackModule } from "./modules.js";

export function PlaybackControls(): ReactNode {
  const {
    copy,
    locale,
    setLocale,
    theme,
    setTheme,
    level,
    setLevel,
    viewport,
    setViewport,
    selectedModuleCode,
    setSelectedModuleCode,
    ambientEvent,
    setAmbientEvent,
    controlsOpen,
    setControlsOpen,
  } = usePlayback();
  const navigate = useNavigate();

  return (
    <div className="playback-controls">
      {!controlsOpen ? (
        <button
          type="button"
          className="playback-btn playback-btn--small"
          data-testid="playback-controls-open"
          onClick={() => setControlsOpen(true)}
        >
          {copy.controls.open}
        </button>
      ) : (
        <div className="playback-controls-panel" data-testid="playback-controls-panel" role="region" aria-label={copy.controls.title}>
          <div className="playback-field-row">
            <strong>{copy.controls.title}</strong>
            <button type="button" className="playback-btn playback-btn--small playback-btn--ghost" onClick={() => setControlsOpen(false)}>
              {copy.controls.close}
            </button>
          </div>

          <label>
            {copy.controls.locale}
            <select
              data-testid="playback-locale"
              value={locale}
              onChange={(event) => setLocale(event.target.value as PlaybackLocale)}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>

          <label>
            {copy.controls.theme}
            <select
              data-testid="playback-theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value as PlaybackTheme)}
            >
              <option value="light">{copy.controls.light}</option>
              <option value="dark">{copy.controls.dark}</option>
              <option value="projector">{copy.controls.projector}</option>
            </select>
          </label>

          <label>
            {copy.controls.viewport}
            <select
              data-testid="playback-viewport"
              value={viewport}
              onChange={(event) => setViewport(event.target.value as PlaybackViewport)}
            >
              <option value="desktop">1440</option>
              <option value="laptop">1024</option>
              <option value="tablet">768</option>
              <option value="mobile">390</option>
            </select>
          </label>

          <label>
            {copy.controls.level}
            <select
              data-testid="playback-level"
              value={level}
              onChange={(event) => setLevel(event.target.value as PlaybackLevel)}
            >
              <option value="novice">{copy.controls.novice}</option>
              <option value="intermediate">{copy.controls.intermediate}</option>
              <option value="advanced">{copy.controls.advanced}</option>
            </select>
          </label>

          <label>
            {copy.controls.module}
            <select
              data-testid="playback-module"
              value={selectedModuleCode}
              onChange={(event) => setSelectedModuleCode(event.target.value as PlaybackModule["code"])}
            >
              {PLAYBACK_MODULES.map((module) => (
                <option key={module.code} value={module.code}>
                  {module.code}
                </option>
              ))}
            </select>
          </label>

          <label>
            {copy.controls.event}
            <select
              data-testid="playback-ambient-event"
              value={ambientEvent}
              onChange={(event) => setAmbientEvent(event.target.value as AmbientEventId)}
            >
              <option value="supplier">supplier</option>
              <option value="warehouse">warehouse</option>
              <option value="finance">finance</option>
              <option value="supervisor">supervisor</option>
            </select>
          </label>

          <label>
            {copy.controls.screen}
            <select
              data-testid="playback-screen"
              defaultValue="portal"
              onChange={(event) => {
                const value = event.target.value;
                if (value === "portal") navigate("/playback/v2/portal");
                if (value === "login") navigate("/playback/v2/login");
                if (value === "orientation") navigate("/playback/v2/orientation");
              }}
            >
              <option value="portal">portal</option>
              <option value="login">login</option>
              <option value="orientation">orientation</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
