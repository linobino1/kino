import i18next, { type Namespace, type TFunction } from 'i18next'
import { defaultLocale, locales, type Locale } from './index'
import { translations } from './translations'

export async function getFixedT(locale: Locale): Promise<TFunction<'common'>>
export async function getFixedT<Ns extends Namespace>(
  locale: Locale,
  ns: Ns,
): Promise<TFunction<Ns>>
export async function getFixedT<Ns extends Namespace = 'common'>(locale: Locale, ns?: Ns) {
  await i18next.init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    defaultNS: 'common',
    resources: translations,
  })

  return i18next.getFixedT(locale, ns ?? 'common')
}
