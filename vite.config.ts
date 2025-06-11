import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: process.env.NODE_ENV === "production" ? "/kidpix/" : "/",
  publicDir: ".",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});
