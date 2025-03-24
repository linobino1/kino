import type { Route } from './+types/_layout'
import { Outlet, redirect } from 'react-router'
import { i18nCookie } from '~/cookies'
import { getRequestLanguage } from '~/util/i18n/getRequestLanguage'
import { getUrlLanguage } from '~/util/i18n/getUrlLanguage'
import { localizeTo } from '~/util/i18n/localizeTo'
import { useChangeLanguage } from 'remix-i18next/react'
import { useEffect } from 'react'

export async function loader({ request }: Route.LoaderArgs) {
  // get the locale from the URL
  const locale = getUrlLanguage(request)

  // redirect unlocalized routes to the user's preferred language
  if (!locale) {
    const url = new URL(request.url)
    const lang = getRequestLanguage(request)
    const to = localizeTo(url.pathname + url.search, lang) as string
    throw redirect(to)
  }

  const [serializedI18nCookie] = await Promise.all([i18nCookie.serialize(locale)])

  return {
    locale,
    i18nCookie: serializedI18nCookie,
  }
}

export default function LocalizedLayout({
  loaderData: { locale, i18nCookie },
}: Route.ComponentProps) {
  useChangeLanguage(locale)

  // Set the locale cookie
  useEffect(() => {
    document.cookie = i18nCookie
  }, [locale, i18nCookie])

  return <Outlet />
}
