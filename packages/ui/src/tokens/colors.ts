export const colors = {
  brand: {
    primary: "#0a6ed1",
    primaryDark: "#0854a0",
    accent: "#e9730c",
  },
  neutral: {
    50: "#f5f6f7",
    100: "#e8eaed",
    200: "#d5dadd",
    300: "#89919a",
    500: "#6a6d70",
    700: "#32363a",
    900: "#1d2d3e",
  },
  semantic: {
    success: "#107e3e",
    warning: "#e9730c",
    error: "#bb0000",
    info: "#0a6ed1",
  },
  surface: {
    background: "#f5f6f7",
    panel: "#ffffff",
    border: "#d5dadd",
  },
} as const;

export type ColorTokens = typeof colors;
