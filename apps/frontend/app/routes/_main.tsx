import type { LoaderFunctionArgs } from '@remix-run/node'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { Outlet, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { getPayload } from '~/util/getPayload.server'
import { cache } from '~/util/cache.server'
import { getCachedUser } from '~/util/userCache.server'

export const loader = async ({ params: { lang: locale } }: LoaderFunctionArgs) => {
  const payload = await getPayload()
  const navigations = await cache({
    key: 'navigations',
    forceFresh: !!getCachedUser() || process.env.NODE_ENV === 'development',
    async getFreshValue() {
      return (
        await payload.find({
          collection: 'navigations',
          depth: 1,
          locale: locale as Locale,
          select: {
            items: true,
            type: true,
          },
          populate: {
            pages: {
              url: true,
              slug: true,
            },
          },
        })
      ).docs
    },
  })

  return {
    navigations,
  }
}

export const handle = {
  i18n: ['common'],
}

export default function Layout() {
  const { navigations } = useLoaderData<typeof loader>()
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
