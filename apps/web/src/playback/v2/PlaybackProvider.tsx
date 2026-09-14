import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { BRANDING_PRESETS, type BrandingMode, type PlaybackBranding } from "./branding.js";
import { COPY, type PlaybackCopy, type PlaybackLocale } from "./content.js";
import { PLAYBACK_MODULES, type PlaybackModule } from "./modules.js";

export type { PlaybackLocale };
export type PlaybackTheme = "light" | "dark" | "projector";
export type PlaybackLevel = "novice" | "intermediate" | "advanced";
export type PlaybackViewport = "desktop" | "laptop" | "tablet" | "mobile";
export type AmbientEventId = "supplier" | "warehouse" | "finance" | "supervisor";
export type SimulationRole = "learner" | "professor";

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
  brandingMode: BrandingMode;
  setBrandingMode: (mode: BrandingMode) => void;
  branding: PlaybackBranding;
  simulationRole: SimulationRole;
  setSimulationRole: (role: SimulationRole) => void;
  missionPreviewOpen: boolean;
  setMissionPreviewOpen: (open: boolean) => void;
  controlsOpen: boolean;
  setControlsOpen: (open: boolean) => void;
  copy: PlaybackCopy;
  tModuleTitle: (module: PlaybackModule) => string;
  tRole: (role: PlaybackModule["role"]) => string;
  endorsement: string;
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
  const [selectedModuleCode, setSelectedModuleCode] = useState<PlaybackModule["code"]>("M1");
  const [ambientEvent, setAmbientEvent] = useState<AmbientEventId>("supplier");
  const [brandingMode, setBrandingMode] = useState<BrandingMode>("college");
  const [simulationRole, setSimulationRole] = useState<SimulationRole>("learner");
  const [missionPreviewOpen, setMissionPreviewOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const setLocale = useCallback((next: PlaybackLocale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const selectedModule =
    PLAYBACK_MODULES.find((module) => module.code === selectedModuleCode) ?? PLAYBACK_MODULES[0]!;
  const branding = BRANDING_PRESETS[brandingMode];
  const copy = COPY[locale];
  const endorsement =
    locale === "fr" ? branding.institutionEndorsementFr : branding.institutionEndorsementEn;

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
      selectedModule,
      ambientEvent,
      setAmbientEvent,
      brandingMode,
      setBrandingMode,
      branding,
      simulationRole,
      setSimulationRole,
      missionPreviewOpen,
      setMissionPreviewOpen,
      controlsOpen,
      setControlsOpen,
      copy,
      endorsement,
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
      brandingMode,
      branding,
      simulationRole,
      missionPreviewOpen,
      controlsOpen,
      copy,
      endorsement,
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
