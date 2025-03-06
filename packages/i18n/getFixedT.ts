import i18next from 'i18next'
import { defaultLocale, locales, type Locale } from './index'
import { translations } from './translations'

export const getFixedT = async (locale: Locale, ns: string = 'common') => {
  await i18next.init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    resources: translations,
  })
  return i18next.getFixedT(locale, ns)
}
