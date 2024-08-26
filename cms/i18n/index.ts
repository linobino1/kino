/**
 * This file contains the translations for the payloadCMS admin panel only!
 * Even though the actual translation strings are saved in `public/locales`,
 * this file is the only place where they are used. The `backend` namespace
 * is not used anywhere else in the app.
 */
import en from "./../../public/locales/en/backend.json";
import de from "./../../public/locales/de/backend.json";

export type TranslationKeyEN = keyof typeof en;
export type TranslationKeyDE = keyof typeof de;

/**
 * get an array of the translations in all languages with replacers applied
 * @param key Key of the translation, e.g. 'Hello {name}!'
 * @param replacers { name: 'John' }
 * @returns { en: 'Hello John!', de: 'Hallo John!' }
 */
export const t = (
  key: string,
  replacers: Record<string, string> = {}
): Record<string, string> => {
  return {
    en: replace(
      en.hasOwnProperty(key) ? en[key as TranslationKeyEN] : key,
      replacers
    ),
    de: replace(
      de.hasOwnProperty(key) ? de[key as TranslationKeyDE] : key,
      replacers
    ),
  };
};

export const fixedT = (
  key: string,
  locale: string,
  replacers: Record<string, string> = {}
): string => {
  switch (locale) {
    case "en":
      return replace(
        en.hasOwnProperty(key) ? en[key as TranslationKeyEN] : key,
        replacers
      );
    case "de":
      return replace(
        de.hasOwnProperty(key) ? de[key as TranslationKeyDE] : key,
        replacers
      );
  }
  return key;
};

/**
 * @param s Hello {name}!
 * @param replacers { name: 'John' }
 * @returns Hello John!
 */
const replace = (s: string, replacers: Record<string, string> = {}): string => {
  let res = s;
  Object.keys(replacers).forEach((key) => {
    res = res?.replace(`{${key}}`, replacers[key] ?? "");
  });
  return res;
};
