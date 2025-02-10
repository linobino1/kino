import { RemixI18Next } from 'remix-i18next/server'
import i18n from './i18n'
import { i18nCookie } from './cookies'
import { translations } from '@app/i18n/translations'

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
      de: { common: translations.de.common, auth: translations.de.auth },
      en: { common: translations.en.common, auth: translations.en.auth },
    },
  },
})

export default i18next
