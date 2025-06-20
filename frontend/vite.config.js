import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/baseball_stats/",
  plugins: [react()],
  root: "./",
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
