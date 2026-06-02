import type {
  NestedKeysStripped,
  TFunction,
  DefaultTranslationKeys,
} from '@payloadcms/translations'
import type { TFunction as I18nextTFunction } from 'i18next'
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

export type AppNamespace = keyof typeof translations.de
export type AppTFunction<Ns extends AppNamespace = 'common'> = I18nextTFunction<Ns>
export type CommonTFunction = AppTFunction<'common'>
export type BackendTFunction = AppTFunction<'backend'>
