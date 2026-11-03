import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This project is a static frontend. No proxy, API, or server routes are configured.
// GitHub Pages serves the site from /agency/, so production builds use that base;
// the dev server keeps "/" so localhost works as before.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === "build" || isPreview ? "/agency/" : "/",
}));
