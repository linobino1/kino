import type { Route } from './+types/_layout'
import { Outlet, redirect } from 'react-router'
import { locales } from '@app/i18n'
import { getLocale } from '~/middleware/i18next'

export async function loader({ context, url, params }: Route.LoaderArgs) {
  // get the locale from the URL
  const locale = getLocale(context)

  // redirect to localized url
  if (!('lang' in params)) {
    const pathname = url.pathname === '/' ? '' : url.pathname
    return redirect(`/${locale}${pathname}${url.search}${url.hash}`)
  }

  if (!locales.includes(params.lang as (typeof locales)[number])) {
    throw new Response('Not Found', { status: 404 })
  }

  return null
}

export default function LocalizedLayout() {
  return <Outlet />
}
