import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // base: process.env.NODE_ENV === "production" ? "/kidpix/" : "/", // OLD
  // base: process.env.VITE_GITHUB_PAGES === "true" ? "/kidpix/" : "/", // OLD 2
  base: "/",
  publicDir: "src/assets", // Copy src/assets to build output
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@js": "/js",
    },
  },
});
