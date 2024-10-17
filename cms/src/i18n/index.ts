import { de } from '@/translations/de'
import { en } from '@/translations/en'

export type TranslationKeyEN = keyof typeof en.backend
export type TranslationKeyDE = keyof typeof de.backend

/**
 * get an array of the translations in all languages with replacers applied
 * @param key Key of the translation, e.g. 'Hello {name}!'
 * @param replacers { name: 'John' }
 * @returns { en: 'Hello John!', de: 'Hallo John!' }
 */
export const t = (key: string, replacers: Record<string, string> = {}): Record<string, string> => {
  return {
    en: replace(
      en.backend.hasOwnProperty(key) ? en.backend[key as TranslationKeyEN] : key,
      replacers,
    ),
    de: replace(
      de.backend.hasOwnProperty(key) ? de.backend[key as TranslationKeyDE] : key,
      replacers,
    ),
  }
}

export const fixedT = (
  key: string,
  locale: string,
  replacers: Record<string, string> = {},
): string => {
  const data = locale == 'en' ? en : de
  return replace(
    data.backend.hasOwnProperty(key) ? data.backend[key as TranslationKeyEN] : key,
    replacers,
  )
}

/**
 * @param s Hello {name}!
 * @param replacers { name: 'John' }
 * @returns Hello John!
 */
const replace = (s: string, replacers: Record<string, string> = {}): string => {
  let res = s
  Object.keys(replacers).forEach((key) => {
    res = res?.replace(`{${key}}`, replacers[key] ?? '')
  })
  return res
}
