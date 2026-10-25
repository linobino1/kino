import type { Route } from './+types/_layout'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { Outlet, useRouteLoaderData } from 'react-router'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { getPayload } from '~/util/getPayload.server'
import { cache } from '~/util/cache.server'
import { userContext } from '~/util/authContext.server'
import { ErrorComponent } from '~/components/Error'
import { PageLayout } from '~/components/PageLayout'
import { measureServerTiming } from '~/util/serverTiming.server'

export const loader = async ({ request, params: { lang: locale }, context }: Route.LoaderArgs) => {
  const [payload, user] = await Promise.all([getPayload(), context.get(userContext)()])
  const navigations = await measureServerTiming(request, 'navigation', () =>
    cache({
      key: `navigations_${locale}`,
      ttl: 1000 * 60 * 5,
      forceFresh: !!user || process.env.NODE_ENV === 'development',
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
    }),
  )

  return {
    navigations,
  }
}

export const Layout = ({
  children,
  navigations,
}: {
  children: React.ReactNode
  navigations?: Route.ComponentProps['loaderData']['navigations']
}) => {
  const { site } = useRouteLoaderData<typeof rootLoader>('root')!
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {navigations && site && <Header site={site} navigations={navigations} />}
        {children}
      </div>
      {navigations && site && <Footer site={site} navigations={navigations} />}
    </>
  )
}

export default function MainLayout({ loaderData: { navigations } }: Route.ComponentProps) {
  return (
    <Layout navigations={navigations}>
      <Outlet />
    </Layout>
  )
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  return (
    <Layout navigations={loaderData?.navigations}>
      <PageLayout type={'info'}>
        <ErrorComponent error={error} />
      </PageLayout>
    </Layout>
  )
}
