import {
  Links,
  Meta,
  MetaFunction,
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
import { ClientEnvironment, envClient } from './env.server'
import { i18nCookie } from './cookies'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useChangeLanguage } from 'remix-i18next/react'
import i18next from './i18next.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { returnLanguageIfSupported } from './util/i18n/returnLanguageIfSupported'
import { localizeTo } from './util/i18n/localizeTo'
import { defaultLocale, locales, siteTitle } from 'shared/config'
import { getPayload } from './util/getPayload.server'
import { generateMetadata } from './util/generateMetadata'
import { setCachedUser } from './util/userCache.server'
import { Media } from '@/payload-types'
import { getOptimizedImageUrl } from './util/media/getOptimizedImageUrl'
import { getCanonicalLink, getHreflangLinks } from './util/i18n/getHreflangLinks'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const locale = returnLanguageIfSupported(url.pathname.split('/')[1])
  const payload = await getPayload()

  // redirect unlocalized routes to the user's preferred language
  if (!locale) {
    const lang = await i18next.getLocale(request)
    const to = localizeTo(url.pathname, lang) as string
    throw redirect(to)
  }

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
    env: envClient,
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
    env: {} as ClientEnvironment,
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
