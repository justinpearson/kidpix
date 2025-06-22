import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist", "tests/e2e/**", "site/**"] }, // Ignore site/ for now as it has external deps
  // Config files (need module mode)
  {
    files: ["*.config.{js,mjs}", "vite.config.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  // JavaScript test files (module mode for imports)
  {
    files: ["js/**/*.test.js", "js/**/*.spec.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "import/no-unresolved": "off",
    },
  },
  // KidPix JavaScript files (script mode for globals)
  {
    files: ["js/**/*.js"],
    ignores: ["js/**/*.test.js", "js/**/*.spec.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Node.js globals for export bridge
        module: "readonly",
        exports: "readonly",
        // Main KidPix namespace
        KiddoPaint: "writable",
        // Canvas elements and contexts
        bnimCanvas: "writable",
        bnimContext: "writable",
        animCanvas: "writable",
        animContext: "writable",
        previewCanvas: "writable",
        previewContext: "writable",
        tmpCanvas: "writable",
        tmpContext: "writable",
        // Global variables from other files
        x: "writable",
        y: "writable",
        offset: "writable",
        trimmed: "writable",
        sourceX: "writable",
        sourceY: "writable",
        // Utility functions (mark as writable to avoid redeclare warnings)
        getRandomInt: "writable",
        getRandomFloat: "writable",
        clamp: "writable",
        randn_bm: "writable",
        ziggurat: "writable",
        boxmuller: "writable",
        trimCanvas2: "readonly",
        trimCanvas3: "readonly",
        trimAndFlattenCanvas: "readonly",
        flattenImage: "writable",
        makeComposite: "readonly",
        jitter: "writable",
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn", // Make this a warning for now
      "prefer-const": "warn",
      "no-redeclare": "warn", // Allow redeclaration in global scope
      "no-global-assign": "off", // Allow modification of globals
      "no-self-assign": "off", // Allow canvas width/height self-assign
      "no-cond-assign": "off", // Allow assignment in conditions
      "import/no-unresolved": "off",
    },
  },
  // TypeScript configuration (non-test files)
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/test-setup.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {},
    rules: {},
  },
  // TypeScript test files (without project mode)
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.test.{ts,tsx}", "**/test-setup.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {},
    rules: {},
  },
);
