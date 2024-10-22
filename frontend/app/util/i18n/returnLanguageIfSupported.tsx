import { Locale, locales } from 'shared/config'

export const returnLanguageIfSupported = (lang?: string): Locale | undefined => {
  if (locales.includes(lang as Locale)) {
    return lang as Locale
  }
  return undefined
}
