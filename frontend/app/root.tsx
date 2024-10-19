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
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css'
import { envClient } from './env.server'
import { i18nCookie } from './cookies'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useChangeLanguage } from 'remix-i18next/react'
import i18next from './i18next.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { returnLanguageIfSupported } from './util/i18n/returnLanguageIfSupported'
import { localizeTo } from './util/i18n/localizeTo'
import { defaultLocale } from 'shared/config'
import LanguageSwitch from './components/LanguageSwitch'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const locale = returnLanguageIfSupported(url.pathname.split('/')[1])

  // redirect unlocalized routes to the user's preferred language
  if (!locale) {
    const lang = await i18next.getLocale(request)
    const to = localizeTo(url.pathname, lang) as string
    throw redirect(to)
  }

  return {
    locale,
    i18nCookie: await i18nCookie.serialize(locale),
    envClient,
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
    <html lang={locale} dir={i18n.dir()} className="">
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
        <LanguageSwitch />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
