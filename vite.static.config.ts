// Static export for shared hosting (cPanel): `bunx vite build --config vite.static.config.ts`
// Produces a client-only SPA shell; all data is fetched in the browser.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true, prerender: { outputPath: "/index.html" } },
  },
});
