import type { MetaFunction } from 'react-router'
import type { Route } from './+types/root'
import type { Media } from '@app/types/payload'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from 'react-router'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './global.css'
import { useTranslation } from 'react-i18next'
import { defaultLocale, locales } from '@app/i18n'
import { siteTitle } from '@app/util/config'
import { getPayload } from './util/getPayload.server'
import { generateMetadata } from './util/generateMetadata'
import { setCachedUser } from './util/userCache.server'
import { getOptimizedImageUrl } from '@app/util/media/getOptimizedImageUrl'
import { getCanonicalLink, getHreflangLinks } from './util/i18n/getHreflangLinks'
import { parseFrontendBrowserEnv, type FrontendBrowserEnvironment } from '@app/util/env'
import { getUrlLanguage } from './util/i18n/getUrlLanguage'
import { ErrorComponent } from './components/Error'

export async function loader({ request }: Route.LoaderArgs) {
  // get the locale from the URL
  const locale = getUrlLanguage(request) ?? defaultLocale

  const payload = await getPayload()

  const [user, site] = await Promise.all([
    (await payload.auth(request)).user,
    payload.findGlobal({
      slug: 'site',
      depth: 3,
      locale,
    }),
  ])

  // save the user globally
  setCachedUser(user)

  return {
    locale,
    user: user,
    env: parseFrontendBrowserEnv(process.env),
    site,
  }
}

// fallback meta
export const meta: MetaFunction = () => generateMetadata({ title: siteTitle })

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const data = useRouteLoaderData<typeof loader>('root')
  const { site, env } = data ?? {
    env: {} as FrontendBrowserEnvironment,
  }

  const { i18n } = useTranslation()

  return (
    <html lang={i18n.language} dir={i18n.dir()} className="font-sans">
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorComponent error={error} />
}
