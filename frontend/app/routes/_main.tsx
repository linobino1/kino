import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { ErrorPage } from '~/components/ErrorPage'
import type { loader as rootLoader } from '~/root'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
// import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
// import { routeHeaders } from '~/util/cache-control/routeHeaders'

export const ErrorBoundary = ErrorPage

export const loader = async ({ params: { lang: locale } }: LoaderFunctionArgs) => {
  const navigations = await (
    await getPayload()
  ).find({
    collection: 'navigations',
    depth: 12,
    locale: locale as Locale,
  })

  return json(
    {
      navigations: navigations.docs,
    },
    // {
    //   headers: {
    //     'Cache-Control': cacheControlShortWithSWR,
    //   },
    // },
  )
}

// export const headers = routeHeaders

export const handle = {
  i18n: ['common'],
}

export default function Layout() {
  const navigations = useLoaderData<typeof loader>()?.navigations
  const { site } = useRouteLoaderData<typeof rootLoader>('root')!

  return (
    <>
      <div className="min-h-screen">
        {navigations && site && <Header site={site} navigations={navigations} />}
        <Outlet />
      </div>
      {navigations && site && <Footer site={site} navigations={navigations} />}
    </>
  )
}
