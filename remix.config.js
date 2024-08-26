import { customRoutesConfig } from "./app/customRouteConfig";

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: ["html-escaper"],
  ignoredRouteFiles: ["**/*.css"],
  serverModuleFormat: "cjs",
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    unstable_singleFetch: true,
    unstable_lazyRouteDiscovery: true,
  },
  routes: customRoutesConfig,
};
