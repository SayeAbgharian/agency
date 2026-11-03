import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This project is a static frontend. No proxy, API, or server routes are configured.
export default defineConfig({ plugins: [react()], base: "./" });
