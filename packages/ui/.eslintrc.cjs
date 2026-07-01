/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@tec-platform/config/eslint/react")],
  ignorePatterns: ["dist/", "vitest.config.ts"],
};
