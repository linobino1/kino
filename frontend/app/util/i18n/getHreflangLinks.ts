import { returnLanguageIfSupported } from './returnLanguageIfSupported'
import type { Path } from '@remix-run/react'
import { Locale } from 'shared/config'
import type { ClientEnvironment } from '~/env.server'

const absoluteUrl = (location: Path, env: ClientEnvironment) => {
  return env.FRONTEND_URL + location.pathname + location.search + location.hash
}

export const getLocalizedPathnames = (pathname: string): Record<Locale | 'none', string> => {
  const urlLanguage = returnLanguageIfSupported(pathname.split('/')[1])
  const pathnames: Record<Locale | 'none', string> = {
    en: '/en',
    de: '/de',
    none: '/',
  }

  if (['/en', '/de', '/', ''].includes(pathname)) {
    return pathnames
  }

  switch (urlLanguage) {
    case 'en':
      pathnames.en = pathname
      pathnames.de = pathname.replace('/en/', '/de/')
      pathnames.none = pathname.replace('/en/', '/')
      break
    case 'de':
      pathnames.en = pathname.replace('/de/', '/en/')
      pathnames.de = pathname
      pathnames.none = pathname.replace('/de/', '/')
      break
    case undefined:
      pathnames.en = '/en' + pathname
      pathnames.de = '/de' + pathname
      pathnames.none = pathname
      break
  }
  return pathnames
}

export const getHreflangLinks = (location: Path, env: ClientEnvironment) => {
  const pathnames = getLocalizedPathnames(location.pathname)
  return Object.keys(pathnames).map((lang) => ({
    tagName: 'link',
    rel: 'alternate',
    href: absoluteUrl(
      {
        ...location,
        pathname: pathnames[lang as keyof typeof pathnames],
      },
      env,
    ),
    hrefLang: lang === 'none' ? 'x-default' : lang,
  }))
}

/**
 * get the canonical link for the current page. We'll use the language-agnostic URL
 */
export const getCanonicalLink = (location: Path, env: ClientEnvironment) => {
  const pathnames = getLocalizedPathnames(location.pathname)
  return {
    tagName: 'link',
    rel: 'canonical',
    href: absoluteUrl(
      {
        ...location,
        pathname: pathnames['none'] as string,
      },
      env,
    ),
  }
}