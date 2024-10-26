import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { ErrorPage } from '~/components/ErrorPage'
import type { loader as rootLoader } from '~/root'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { cache } from '~/util/cache.server'
import { getCachedUser } from '~/util/userCache.server'

export const headers = {
  'Cache-Control': cacheControlShortWithSWR,
}

export const ErrorBoundary = ErrorPage

export const loader = async ({ params: { lang: locale } }: LoaderFunctionArgs) => {
  const payload = await getPayload()
  const navigations = await cache({
    key: 'navigations',
    forceFresh: !!getCachedUser(),
    async getFreshValue() {
      console.log('fetching navigations')
      return await payload.find({
        collection: 'navigations',
        // TODO: we should use depth: 0 here to save ca. 80kb of data, but we need the slug from each page doc.
        // we could use a beforeChange hook on the navigation collection to add the slug to each navigation item.
        depth: 1,
        locale: locale as Locale,
      })
    },
  })

  return {
    navigations: navigations.docs,
  }
}

export const handle = {
  i18n: ['common'],
}

export default function Layout() {
  const navigations = useLoaderData<typeof loader>().navigations
  const { site } = useRouteLoaderData<typeof rootLoader>('root')!
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {navigations && site && <Header site={site} navigations={navigations} />}
        <Outlet />
      </div>
      {navigations && site && <Footer site={site} navigations={navigations} />}
    </>
  )
}
