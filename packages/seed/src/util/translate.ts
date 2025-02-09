import type { Locale } from '@app/i18n'

export const translate = (text: Record<Locale, string>, locale: Locale): string => {
  return text[locale]
}
