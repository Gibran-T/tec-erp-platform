import { colors } from "./src/tokens/colors.js";
import { spacing } from "./src/tokens/spacing.js";
import { typography } from "./src/tokens/typography.js";

const preset = {
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        neutral: colors.neutral,
        semantic: colors.semantic,
        surface: colors.surface,
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      spacing,
    },
  },
};

export default preset;
