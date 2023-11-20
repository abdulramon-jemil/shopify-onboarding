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
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true }
    ],

    "no-restricted-syntax": "off",
    "arrow-parens": ["error", "always"],
    semi: ["error", "never"],
    quotes: ["error", "double"]
  },

  root: true
}
