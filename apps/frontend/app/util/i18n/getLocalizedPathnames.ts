import type { Locale } from '@app/i18n'
import { locales } from '@app/i18n'
import { returnLanguageIfSupported } from './returnLanguageIfSupported'

export const getLocalizedPathnames = (
  pathname: string,
): {
  [key in Locale | 'none']: string
} => {
  const urlLanguage = returnLanguageIfSupported(pathname.split('/')[1])
  const pathnames = [...locales, 'none'].reduce(
    (acc, language) => ({ ...acc, [language]: pathname }),
    {} as Record<Locale | 'none', string>,
  )

  switch (urlLanguage) {
    case 'en':
      pathnames.de = pathname.replace('/en', '/de')
      pathnames.none = pathname.replace('/en', '')
      break
    case 'de':
      pathnames.en = pathname.replace('/de', '/en')
      pathnames.none = pathname.replace('/de', '')
      break
    case undefined:
      pathnames.en = '/en' + pathname
      pathnames.de = '/de' + pathname
      break
  }
  return pathnames
}
