import { createCookie } from "@remix-run/node";

export let i18nCookie = createCookie("i18n", {
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
});
