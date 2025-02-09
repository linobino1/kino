import type {
  NestedKeysStripped,
  TFunction,
  DefaultTranslationKeys,
} from '@payloadcms/translations'
import de from './translations/de.json'
import en from './translations/en.json'

export const locales = ['de', 'en'] as const
export const defaultLocale = 'en'

export type Locale = (typeof locales)[number]

export const translate = (text: Record<Locale, string>, locale: Locale): string => {
  return text[locale]
}

export const translations = {
  de,
  en,
}

export type PayloadTFunction = TFunction<NestedKeysStripped<typeof de> | DefaultTranslationKeys>
