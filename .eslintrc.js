const { init } = require("@fullstacksjs/eslint-config/init");

module.exports = init({
  root: true,
  modules: {
    react: true,
    import: true,
    strict: true,
    prettier: true,
    typescript: { parserProject: ["./tsconfig.json"], resolverProject: ["./tsconfig.json"] },
  },
  extends: ["universe/native"],
  rules: {
    "no-void": ["error", { allowAsStatement: true }],
    "fp/no-nil": "off",
    "fp/no-mutating-methods": "off",
    "fp/no-unused-expression": "off",
    "@typescript-eslint/no-use-before-define": "off",

    "react/jsx-pascal-case": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
});
