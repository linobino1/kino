import type { MetaFunction } from '@remix-run/react'
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from '@remix-run/react'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './global.css'
import { i18nCookie } from './cookies'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useChangeLanguage } from 'remix-i18next/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { localizeTo } from './util/i18n/localizeTo'
import { defaultLocale, locales } from '@app/i18n'
import { siteTitle } from '@app/util/config'
import { getPayload } from './util/getPayload.server'
import { generateMetadata } from './util/generateMetadata'
import { setCachedUser } from './util/userCache.server'
import type { Media } from '@app/types/payload'
import { getOptimizedImageUrl } from './util/media/getOptimizedImageUrl'
import { getCanonicalLink, getHreflangLinks } from './util/i18n/getHreflangLinks'
import { parseFrontendBrowserEnv, type FrontendBrowserEnvironment } from '@app/util/env'
import { getUrlLanguage } from './util/i18n/getUrlLanguage'
import { getRequestLanguage } from './util/i18n/getRequestLanguage'

export async function loader({ request }: LoaderFunctionArgs) {
  // get the locale from the URL
  const locale = getUrlLanguage(request)

  // redirect unlocalized routes to the user's preferred language
  if (!locale) {
    const lang = getRequestLanguage(request)
    const url = new URL(request.url)
    const to = localizeTo(url.pathname, lang) as string
    throw redirect(to)
  }

  const payload = await getPayload()

  const [user, site, serializedI18nCookie] = await Promise.all([
    (await payload.auth(request)).user,
    payload.findGlobal({
      slug: 'site',
      depth: 3,
      locale,
    }),
    i18nCookie.serialize(locale),
  ])

  // save the user globally
  setCachedUser(user)

  return {
    user: user,
    locale,
    i18nCookie: serializedI18nCookie,
    env: parseFrontendBrowserEnv(process.env),
    site,
  }
}

// fallback meta
export const meta: MetaFunction = () => generateMetadata({ title: siteTitle })

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const data = useRouteLoaderData<typeof loader>('root')
  const { locale, i18nCookie, site, env } = data ?? {
    locale: defaultLocale,
    i18nCookie: '',
    env: {} as FrontendBrowserEnvironment,
  }

  const { i18n } = useTranslation()

  useChangeLanguage(locale)

  // Set the locale cookie
  useEffect(() => {
    document.cookie = i18nCookie
  }, [locale, i18nCookie])

  return (
    <html lang={locale} dir={i18n.dir()} className="font-sans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {getHreflangLinks(location, env).map((link, index) => (
          <link key={index} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
        ))}
        <link rel="canonical" href={getCanonicalLink(location, env).href} />
        <link rel="icon" href={getOptimizedImageUrl(site?.favicon as Media, env)} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration
          getKey={(location) => {
            // strip locale from pathname
            const regex = new RegExp(`^/(${locales.join('|')})`)
            return (
              location.pathname.replace(regex, '/').replace('//', '/') +
              location.search +
              location.hash
            )
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
