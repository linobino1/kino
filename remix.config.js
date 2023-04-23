/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [
    "html-escaper",
  ],
  ignoredRouteFiles: [
    "**/*.css",
  ],
  future: {
    unstable_cssModules: true,
    v2_errorBoundary: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
