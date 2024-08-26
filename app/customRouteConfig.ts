import { glob } from "glob";
import path from "path";
import {
  ensureRootRouteExists,
  getRouteIds,
  getRouteManifest,
} from "remix-custom-routes";

export const customRouteConfig = async () => {
  const appDir = path.join(process.cwd(), "app");
  ensureRootRouteExists(appDir);

  const files = glob.sync("routes/**/*.{ts,tsx}", { cwd: appDir });

  const routeIds = getRouteIds(files, {
    indexNames: ["_index", "route"],
  }).map(([id, filepath]) => [`($lang).${id}`, filepath]) as [string, string][];

  return getRouteManifest(routeIds);
};
