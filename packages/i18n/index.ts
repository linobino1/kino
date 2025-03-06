import type {
  NestedKeysStripped,
  TFunction,
  DefaultTranslationKeys,
} from '@payloadcms/translations'
import type { translations } from './translations'

export type { TFunction } from 'i18next'

export const locales = ['de', 'en'] as const
export const defaultLocale = 'de' as const
export const mailingsLocale = 'de' as const

export type Locale = (typeof locales)[number]

export const translate = (text: Record<Locale, string>, locale: Locale): string => {
  return text[locale]
}

export type PayloadTFunction = TFunction<
  NestedKeysStripped<typeof translations.de.backend> | DefaultTranslationKeys
>
