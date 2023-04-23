import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";
import { options } from "./i18n"
import { i18nCookie } from "./cookie";

let i18next = new RemixI18Next({
  detection: {
    // persist language selection in cookie
    cookie: i18nCookie,

    supportedLanguages: options.supportedLngs,
    fallbackLanguage: options.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...options,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend,
});

export default i18next;
