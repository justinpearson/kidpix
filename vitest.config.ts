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
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
