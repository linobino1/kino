import type { MetaFunction } from 'react-router'
import type { Route } from './+types/root'
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from 'react-router'
import './global.css'
import '@fontsource-variable/dm-sans'
import { getLocale, i18nextMiddleware } from '~/middleware/i18next'
import { useTranslation } from 'react-i18next'
import { type Locale, locales } from '@app/i18n'
import { siteTitle } from '@app/util/config'
import { getPayload } from './util/getPayload.server'
import { cache } from './util/cache.server'
import { generateMetadata } from './util/generateMetadata'
import { getCanonicalLink, getHreflangLinks } from './util/i18n/getHreflangLinks'
import { parseFrontendBrowserEnv, type FrontendBrowserEnvironment } from '@app/util/env'
import { ErrorComponent } from './components/Error'
import { useEffect } from 'react'
import { i18nCookie } from './cookies'
import { measureServerTiming, serverTimingMiddleware } from './util/serverTiming.server'
import { authMiddleware, userContext } from './util/authContext.server'

export const middleware = [serverTimingMiddleware, authMiddleware, i18nextMiddleware]

export async function loader({ request, context }: Route.LoaderArgs) {
  const locale = getLocale(context) as Locale
  const userPromise = context.get(userContext)()

  const payload = await measureServerTiming(request, 'payload.init', getPayload)

  const [user, site] = await Promise.all([
    userPromise,
    measureServerTiming(request, 'site', () =>
      cache({
        key: `site_${locale}`,
        ttl: 1000 * 60 * 5,
        forceFresh: process.env.NODE_ENV === 'development',
        getFreshValue: () =>
          payload.findGlobal({
            slug: 'site',
            depth: 3,
            locale,
          }),
      }),
    ),
  ])

  const serializedI18nCookie = await i18nCookie.serialize(locale)

  return data(
    {
      locale,
      user: user,
      env: parseFrontendBrowserEnv(process.env),
      site,
    },
    { headers: { 'Set-Cookie': serializedI18nCookie } },
  )
}

// fallback meta
export const meta: MetaFunction = () => generateMetadata({ title: siteTitle })

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const data = useRouteLoaderData<typeof loader>('root')
  const { env } = data ?? {
    env: {} as FrontendBrowserEnvironment,
  }

  const { i18n } = useTranslation()

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {getHreflangLinks(location, env).map((link) => (
          <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
        ))}
        <link rel="canonical" href={getCanonicalLink(location, env).href} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
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

export default function App({ loaderData: { locale } }: Route.ComponentProps) {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorComponent error={error} />
}
