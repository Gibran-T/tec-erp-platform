import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPlaybackPage } from "./LoginPlaybackPage.js";
import { OrientationPage } from "./OrientationPage.js";
import { PlaybackControls } from "./PlaybackControls.js";
import { PlaybackProvider, usePlayback } from "./PlaybackProvider.js";
import { PortalPage } from "./PortalPage.js";
import "./playback.css";

function PlaybackShell(): ReactNode {
  const { copy, theme, viewport, locale } = usePlayback();

  return (
    <div
      className="playback-v2"
      data-testid="playback-v2-root"
      data-pb-theme={theme}
      data-pb-viewport={viewport}
      data-pb-locale={locale}
      data-pb-owner-canvas="#eef4f8"
      lang={locale}
    >
      <div className="playback-marker" data-testid="playback-marker" role="status">
        {copy.marker}
      </div>
      <Routes>
        <Route index element={<Navigate to="portal" replace />} />
        <Route path="portal" element={<PortalPage />} />
        <Route path="login" element={<LoginPlaybackPage />} />
        <Route path="orientation" element={<OrientationPage />} />
        <Route path="*" element={<Navigate to="portal" replace />} />
      </Routes>
      <PlaybackControls />
    </div>
  );
}

export function PlaybackV2Root(): ReactNode {
  return (
    <PlaybackProvider>
      <PlaybackShell />
    </PlaybackProvider>
  );
}
