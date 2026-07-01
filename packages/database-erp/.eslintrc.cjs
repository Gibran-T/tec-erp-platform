/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@tec-platform/config/eslint/node")],
  ignorePatterns: ["dist/", "prisma/"],
};
