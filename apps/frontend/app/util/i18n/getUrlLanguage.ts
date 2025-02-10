import type { Locale } from '@app/i18n'
import { returnLanguageIfSupported } from './returnLanguageIfSupported'

export const getUrlLanguage = (request: Request): Locale | undefined => {
  const url = new URL(request.url)
  const urlLanguage = url.pathname.split('/')[1]
  return returnLanguageIfSupported(urlLanguage)
}
