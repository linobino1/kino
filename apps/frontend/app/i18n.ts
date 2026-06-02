import { defaultLocale, locales } from '@app/i18n'
import { translations } from '@app/i18n/translations'

export default {
  // This is the list of languages your application supports
  supportedLngs: locales,
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: defaultLocale,
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: 'common',
  resources: {
    de: translations.de,
    en: translations.en,
  },
}
