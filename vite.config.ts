import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: process.env.NODE_ENV === "production" ? "/kidpix/" : "/",
  publicDir: false, // Don't copy files automatically, they're already referenced
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});
