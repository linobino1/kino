import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './global.css'
import { envClient } from './env.server'
import { i18nCookie } from './cookies'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useChangeLanguage } from 'remix-i18next/react'
import i18next from './i18next.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { returnLanguageIfSupported } from './util/i18n/returnLanguageIfSupported'
import { localizeTo } from './util/i18n/localizeTo'
import { defaultLocale, locales } from 'shared/config'
import { getPayload } from './util/getPayload.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const locale = returnLanguageIfSupported(url.pathname.split('/')[1])

  // redirect unlocalized routes to the user's preferred language
  if (!locale) {
    const lang = await i18next.getLocale(request)
    const to = localizeTo(url.pathname, lang) as string
    throw redirect(to)
  }

  const [site, serializedI18nCookie] = await Promise.all([
    (await getPayload()).findGlobal({
      slug: 'site',
      depth: 3,
      locale,
    }),
    i18nCookie.serialize(locale),
  ])

  return {
    locale,
    i18nCookie: serializedI18nCookie,
    envClient,
    site,
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const { locale, i18nCookie, envClient } = data ?? {
    locale: defaultLocale,
    i18nCookie: '',
    envClient: {},
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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({ env: envClient })}`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
