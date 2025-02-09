import type { Locale } from './index'
import { translations } from './index'
import i18next from 'i18next'

export type { TFunction } from 'i18next'

export const getI18NextInstance = async (lng: Locale) => {
  return i18next.init({
    lng: lng ?? undefined,
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      de: {
        common: translations.de,
      },
      en: {
        common: translations.en,
      },
    },
  })
}
