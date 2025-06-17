import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    // Include JavaScript files from js/ directory
    include: ["**/*.{test,spec}.{js,ts,tsx}", "**/js/**/*.{test,spec}.js"],
  },
});
