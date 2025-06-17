import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    // Include JavaScript files from js/ directory
    include: ["**/*.{test,spec}.{js,ts,tsx}", "**/js/**/*.{test,spec}.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/*.test.{js,ts}",
        "**/*.spec.{js,ts}",
        "tests/**",
        "site/**",
      ],
      include: ["js/**/*.js", "src/**/*.{js,ts,tsx}"],
      all: true,
      // TODO: Increase coverage thresholds as we add more tests
      // Current coverage (as of 2025-06-17): ~1.76% lines, ~14.96% functions, ~25% branches
      // Target coverage goals: 70% lines, 70% functions, 60% branches, 70% statements
      thresholds: {
        lines: 1, // Currently 1.76% - increase as tests are added
        functions: 10, // Currently 14.96% - increase as tests are added
        branches: 20, // Currently 25% - increase as tests are added
        statements: 1, // Currently 1.76% - increase as tests are added
      },
    },
  },
});
