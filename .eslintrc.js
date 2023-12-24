module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier"
  ],

  env: { browser: true },
  ignorePatterns: ["!.*"],
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.eslint.json"
  },

  plugins: ["@typescript-eslint"],

  rules: {
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",

    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true }
    ],

    "max-classes-per-file": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "arrow-parens": ["error", "always"],
    semi: ["error", "never"],
    "spaced-comment": "off",
    quotes: ["error", "double"]
  },

  root: true
}
