/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@tec-platform/config/eslint/react")],
  ignorePatterns: ["dist/", "vite.config.ts", "vitest.config.ts"],
};
