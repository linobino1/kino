import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { customRouteConfig } from "./app/customRouteConfig";

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
  ],
  ssr: {
    noExternal: ["remix-i18next"],
  },
  server: {
    open: true,
  },
});
