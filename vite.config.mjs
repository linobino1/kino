import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { customRouteConfig } from "./app/customRouteConfig";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
      serverModuleFormat: "cjs",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPth: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
        unstable_lazyRouteDiscovery: true,
      },
      routes: customRouteConfig,
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "leo-hilsheimer",
      project: "kino-im-blauen-salon",
    }),
  ],
  ssr: {
    noExternal: ["remix-i18next"],
  },
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
  },
});
