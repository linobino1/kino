import { defaultLocale, type Locale } from '@app/i18n'
import i18next, { type Namespace, type TFunction } from 'i18next'
import i18nextConfig from '~/i18n'

/**
 * This t() function can be used outside the react-router request context. In CLI, for example.
 */
export async function getTFunction(language?: Locale): Promise<TFunction<'common'>>
export async function getTFunction<Ns extends Namespace>(
  language: Locale | undefined,
  namespace: Ns,
): Promise<TFunction<Ns>>
export async function getTFunction<Ns extends Namespace = 'common'>(
  language: Locale = defaultLocale,
  namespace?: Ns,
) {
  await i18next.init(i18nextConfig)
  await i18next.changeLanguage(language)
  return i18next.getFixedT(language, namespace ?? 'common')
}
