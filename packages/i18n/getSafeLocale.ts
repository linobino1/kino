import { defaultLocale, locales, type Locale } from '.'

export const getSafeLocale = (locale: any): Locale => {
  if (!locales.includes(locale)) {
    return defaultLocale
  }
  return locale
}
