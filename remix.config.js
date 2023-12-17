/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: ["html-escaper"],
  ignoredRouteFiles: ["**/*.css"],
  serverModuleFormat: "cjs",
};
