import { RemixI18Next } from 'remix-i18next/server'
import i18n from './i18n'
import { i18nCookie } from './cookies'
import de from '../public/locales/de/common.json'
import en from '../public/locales/en/common.json'

const i18next = new RemixI18Next({
  detection: {
    // persist language selection in cookie
    cookie: i18nCookie,

    supportedLanguages: [...i18n.supportedLngs],
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    resources: {
      en: {
        common: en,
      },
      de: {
        common: de,
      },
    },
  },
})

export default i18next
