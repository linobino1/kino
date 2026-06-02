import i18next from 'i18next'
import { defaultLocale, locales, type Locale, type BackendTFunction } from './index'
import { translations } from './translations'

export const getBackendTFunction = async (lang: Locale): Promise<BackendTFunction> => {
  await i18next.init({
    ns: ['backend'],
    defaultNS: 'backend',
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    resources: {
      de: { backend: translations.de.backend },
      en: { backend: translations.en.backend },
    },
  })

  return i18next.getFixedT(lang, 'backend')
}
