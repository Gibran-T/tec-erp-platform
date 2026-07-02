import type { Config } from "tailwindcss";
import uiPreset from "@tec-platform/ui/tailwind.preset";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [uiPreset],
};

export default config;
