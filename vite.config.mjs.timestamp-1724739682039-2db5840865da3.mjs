// vite.config.mjs
import { vitePlugin as remix } from "file:///Users/leohilsheimer/Sites/repos/kino/node_modules/.pnpm/@remix-run+dev@2.11.2_@remix-run+react@2.11.2_@types+node@22.1.0_ts-node@10.9.2_typescript@5.4.5_vite@5.4.2/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/leohilsheimer/Sites/repos/kino/node_modules/.pnpm/vite@5.4.2_@types+node@22.1.0/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/leohilsheimer/Sites/repos/kino/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.4.5_vite@5.4.2/node_modules/vite-tsconfig-paths/dist/index.js";

// app/customRouteConfig.ts
import { glob } from "file:///Users/leohilsheimer/Sites/repos/kino/node_modules/.pnpm/glob@11.0.0/node_modules/glob/dist/esm/index.js";
import path from "path";
import {
  ensureRootRouteExists,
  getRouteIds,
  getRouteManifest
} from "file:///Users/leohilsheimer/Sites/repos/kino/node_modules/.pnpm/remix-custom-routes@1.0.1/node_modules/remix-custom-routes/index.js";
var customRouteConfig = async () => {
  const appDir = path.join(process.cwd(), "app");
  ensureRootRouteExists(appDir);
  const files = glob.sync("routes/**/*.{ts,tsx}", { cwd: appDir });
  const routeIds = getRouteIds(files, {
    indexNames: ["_index", "route"]
  }).map(([id, filepath]) => [`($lang).${id}`, filepath]);
  return getRouteManifest(routeIds);
};

// vite.config.mjs
var vite_config_default = defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
      serverModuleFormat: "cjs",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
        // unstable_singleFetch: true,
        // unstable_lazyRouteDiscovery: true,
      },
      routes: customRouteConfig
    }),
    tsconfigPaths()
  ],
  ssr: {
    noExternal: ["remix-i18next"]
  },
  server: {
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIiwgImFwcC9jdXN0b21Sb3V0ZUNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9sZW9oaWxzaGVpbWVyL1NpdGVzL3JlcG9zL2tpbm9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9sZW9oaWxzaGVpbWVyL1NpdGVzL3JlcG9zL2tpbm8vdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sZW9oaWxzaGVpbWVyL1NpdGVzL3JlcG9zL2tpbm8vdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgeyBjdXN0b21Sb3V0ZUNvbmZpZyB9IGZyb20gXCIuL2FwcC9jdXN0b21Sb3V0ZUNvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVtaXgoe1xuICAgICAgaWdub3JlZFJvdXRlRmlsZXM6IFtcIioqLyouY3NzXCJdLFxuICAgICAgc2VydmVyTW9kdWxlRm9ybWF0OiBcImNqc1wiLFxuICAgICAgZnV0dXJlOiB7XG4gICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxuICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcbiAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcbiAgICAgICAgLy8gdW5zdGFibGVfc2luZ2xlRmV0Y2g6IHRydWUsXG4gICAgICAgIC8vIHVuc3RhYmxlX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICByb3V0ZXM6IGN1c3RvbVJvdXRlQ29uZmlnLFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogW1wicmVtaXgtaTE4bmV4dFwiXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgb3BlbjogdHJ1ZSxcbiAgfSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGVvaGlsc2hlaW1lci9TaXRlcy9yZXBvcy9raW5vL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xlb2hpbHNoZWltZXIvU2l0ZXMvcmVwb3Mva2luby9hcHAvY3VzdG9tUm91dGVDb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xlb2hpbHNoZWltZXIvU2l0ZXMvcmVwb3Mva2luby9hcHAvY3VzdG9tUm91dGVDb25maWcudHNcIjtpbXBvcnQgeyBnbG9iIH0gZnJvbSBcImdsb2JcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICBlbnN1cmVSb290Um91dGVFeGlzdHMsXG4gIGdldFJvdXRlSWRzLFxuICBnZXRSb3V0ZU1hbmlmZXN0LFxufSBmcm9tIFwicmVtaXgtY3VzdG9tLXJvdXRlc1wiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tUm91dGVDb25maWcgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGFwcERpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImFwcFwiKTtcbiAgZW5zdXJlUm9vdFJvdXRlRXhpc3RzKGFwcERpcik7XG5cbiAgY29uc3QgZmlsZXMgPSBnbG9iLnN5bmMoXCJyb3V0ZXMvKiovKi57dHMsdHN4fVwiLCB7IGN3ZDogYXBwRGlyIH0pO1xuXG4gIGNvbnN0IHJvdXRlSWRzID0gZ2V0Um91dGVJZHMoZmlsZXMsIHtcbiAgICBpbmRleE5hbWVzOiBbXCJfaW5kZXhcIiwgXCJyb3V0ZVwiXSxcbiAgfSkubWFwKChbaWQsIGZpbGVwYXRoXSkgPT4gW2AoJGxhbmcpLiR7aWR9YCwgZmlsZXBhdGhdKSBhcyBbc3RyaW5nLCBzdHJpbmddW107XG5cbiAgcmV0dXJuIGdldFJvdXRlTWFuaWZlc3Qocm91dGVJZHMpO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVMsU0FBUyxjQUFjLGFBQWE7QUFDdlUsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7OztBQ0YrUixTQUFTLFlBQVk7QUFDOVUsT0FBTyxVQUFVO0FBQ2pCO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsT0FDSztBQUVBLElBQU0sb0JBQW9CLFlBQVk7QUFDM0MsUUFBTSxTQUFTLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLO0FBQzdDLHdCQUFzQixNQUFNO0FBRTVCLFFBQU0sUUFBUSxLQUFLLEtBQUssd0JBQXdCLEVBQUUsS0FBSyxPQUFPLENBQUM7QUFFL0QsUUFBTSxXQUFXLFlBQVksT0FBTztBQUFBLElBQ2xDLFlBQVksQ0FBQyxVQUFVLE9BQU87QUFBQSxFQUNoQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRLENBQUM7QUFFdEQsU0FBTyxpQkFBaUIsUUFBUTtBQUNsQzs7O0FEZEEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osbUJBQW1CLENBQUMsVUFBVTtBQUFBLE1BQzlCLG9CQUFvQjtBQUFBLE1BQ3BCLFFBQVE7QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLHNCQUFzQjtBQUFBLFFBQ3RCLHFCQUFxQjtBQUFBO0FBQUE7QUFBQSxNQUd2QjtBQUFBLE1BQ0EsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxZQUFZLENBQUMsZUFBZTtBQUFBLEVBQzlCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
