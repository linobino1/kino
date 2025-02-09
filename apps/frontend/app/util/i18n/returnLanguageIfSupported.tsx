import type { Locale} from '@app/i18n';
import { locales } from '@app/i18n'

export const returnLanguageIfSupported = (lang?: string): Locale | undefined => {
  if (locales.includes(lang as Locale)) {
    return lang as Locale
  }
  return undefined
}
