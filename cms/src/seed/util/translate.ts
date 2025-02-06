import { Locale } from 'shared/config'

export const translate = (text: Record<Locale, string>, locale: Locale): string => {
  return text[locale]
}
