import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Terminal from "vite-plugin-terminal";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Terminal({
      output: ["terminal", "console"],
    }),
  ],
  // base: process.env.NODE_ENV === "production" ? "/kidpix/" : "/", // OLD
  base: '/kidpix/', // NEW, TESTING
  publicDir: false, // Don't copy files automatically, they're already referenced
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
