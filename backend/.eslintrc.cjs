/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  env: {
    node: true,
    es2021: true,
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "commonjs", // backend, no ESM
    project: null, // avoid TS Project config issues
    tsconfigRootDir: __dirname,
  },

  plugins: ["@typescript-eslint", "import"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],

  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },

  rules: {
    // TypeScript best practices
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "off",

    // Import sorting
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      },
    ],

    // Consistency
    "no-console": "off",
  },
};
