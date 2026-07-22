export const colors = {
  brand: {
    primary: "#0a6ed1",
    primaryDark: "#0854a0",
    accent: "#e9730c",
  },
  living: {
    paleBlue: "#d9ecf8",
    strongBlue: "#0a6ed1",
    green: "#107e3e",
    amber: "#c97800",
    red: "#bb0000",
    purple: "#6b4fa0",
    gold: "#b58900",
    gray: "#6a6d70",
    canvas: "#eef6fb",
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
    warning: "#c97800",
    error: "#bb0000",
    info: "#0a6ed1",
    ai: "#6b4fa0",
    certification: "#b58900",
    historical: "#6a6d70",
  },
  surface: {
    background: "#eef6fb",
    panel: "#ffffff",
    border: "#d7e6f2",
  },
} as const;

export type ColorTokens = typeof colors;
