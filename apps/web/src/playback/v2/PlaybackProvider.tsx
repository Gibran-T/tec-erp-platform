import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { COPY, type PlaybackCopy, type PlaybackLocale } from "./content.js";
import { PLAYBACK_MODULES, type PlaybackModule } from "./modules.js";

export type { PlaybackLocale };
export type PlaybackTheme = "light" | "dark" | "projector";
export type PlaybackLevel = "novice" | "intermediate" | "advanced";
export type PlaybackViewport = "desktop" | "laptop" | "tablet" | "mobile";
export type AmbientEventId = "supplier" | "warehouse" | "finance" | "supervisor";

interface PlaybackContextValue {
  locale: PlaybackLocale;
  setLocale: (locale: PlaybackLocale) => void;
  theme: PlaybackTheme;
  setTheme: (theme: PlaybackTheme) => void;
  level: PlaybackLevel;
  setLevel: (level: PlaybackLevel) => void;
  viewport: PlaybackViewport;
  setViewport: (viewport: PlaybackViewport) => void;
  selectedModuleCode: PlaybackModule["code"];
  setSelectedModuleCode: (code: PlaybackModule["code"]) => void;
  selectedModule: PlaybackModule;
  ambientEvent: AmbientEventId;
  setAmbientEvent: (event: AmbientEventId) => void;
  controlsOpen: boolean;
  setControlsOpen: (open: boolean) => void;
  copy: PlaybackCopy;
  tModuleTitle: (module: PlaybackModule) => string;
  tRole: (role: PlaybackModule["role"]) => string;
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

const ROLE_LABEL: Record<PlaybackLocale, Record<PlaybackModule["role"], string>> = {
  fr: {
    observer: "Observateur",
    junior: "Analyste junior",
    process: "Analyste de processus",
    consultant: "Consultant ERP",
    advisor: "Conseiller de confiance",
  },
  en: {
    observer: "Observer",
    junior: "Junior analyst",
    process: "Process analyst",
    consultant: "ERP consultant",
    advisor: "Trusted advisor",
  },
};

export function PlaybackProvider({ children }: { children: ReactNode }): ReactNode {
  const [locale, setLocaleState] = useState<PlaybackLocale>("fr");
  const [theme, setTheme] = useState<PlaybackTheme>("light");
  const [level, setLevel] = useState<PlaybackLevel>("novice");
  const [viewport, setViewport] = useState<PlaybackViewport>("desktop");
  const [selectedModuleCode, setSelectedModuleCode] = useState<PlaybackModule["code"]>("M3");
  const [ambientEvent, setAmbientEvent] = useState<AmbientEventId>("supplier");
  const [controlsOpen, setControlsOpen] = useState(false);

  const setLocale = useCallback((next: PlaybackLocale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const selectedModule =
    PLAYBACK_MODULES.find((module) => module.code === selectedModuleCode) ?? PLAYBACK_MODULES[0]!;

  const value = useMemo<PlaybackContextValue>(
    () => ({
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
      selectedModule: selectedModule as PlaybackModule,
      ambientEvent,
      setAmbientEvent,
      controlsOpen,
      setControlsOpen,
      copy: COPY[locale],
      tModuleTitle: (module) => (locale === "fr" ? module.titleFr : module.titleEn),
      tRole: (role) => ROLE_LABEL[locale][role],
    }),
    [
      locale,
      setLocale,
      theme,
      level,
      viewport,
      selectedModuleCode,
      selectedModule,
      ambientEvent,
      controlsOpen,
    ],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback(): PlaybackContextValue {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }
  return ctx;
}
