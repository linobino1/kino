import type { Route } from './+types/_layout'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { Outlet, useRouteLoaderData } from 'react-router'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { getPayload } from '~/util/getPayload.server'
import { cache } from '~/util/cache.server'
import { getCachedUser } from '~/util/userCache.server'
import { ErrorComponent } from '~/components/Error'
import { PageLayout } from '~/components/PageLayout'

export const loader = async ({ params: { lang: locale } }: Route.LoaderArgs) => {
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
