import type { InitOptions } from "i18next";

export interface Options extends InitOptions {
  supportedLngs: string[];
  fallbackLng: string;
}

export const supportedLngs = ["en", "de"];
export type Language = (typeof supportedLngs)[number];

export const options: Options = {
  // This is the list of languages your application supports
  supportedLngs,
  // This is the language you want to use in case the user language is not in the supportedLngs
  // Also, use the language that you are using in the source code here, so the translation keys will be used as texts
  // the translations for it
  fallbackLng: "de",
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: "common",
  fallbackNS: "common",
  // Disabling suspense is recommended
  react: { useSuspense: false },
};

export const returnLanguageIfSupported = (
  lang?: string
): string | undefined => {
  if (supportedLngs.includes(lang as Language)) {
    return lang;
  }
  return undefined;
};

export default options;
