import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import { type loader as rootLoader } from '~/root'
import { MetaFunction, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import Gutter from '~/components/Gutter'
import Pagination from '~/components/Pagination'
import EventsList from '~/components/EventsList'
import { useTranslation } from 'react-i18next'
import ErrorPage from '~/components/ErrorPage'

export const ErrorBoundary = ErrorPage

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.season?.name,
    image: data?.season?.header,
    env: getEnvFromMatches(matches),
  })

// export const errorBoundary = ErrorPage

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const season = (
    await payload.find({
      collection: 'seasons',
      where: {
        slug: {
          equals: slug,
        },
      },
      locale: locale as Locale,
      depth: 1,
    })
  ).docs[0]

  if (!season) {
    throw new Response(t('Season not found.'), { status: 404 })
  }

  const page = parseInt(new URL(url).searchParams.get('page') || '1')
  const events = await payload.find({
    collection: 'events',
    where: {
      season: {
        equals: season.id,
      },
    },
    locale: locale as Locale,
    depth: 2,
    sort: 'date',
    pagination: true,
    page,
    limit: 20,
  })

  return {
    season,
    events,
  }
}

export default function SeasonsDetailPage() {
  const { t } = useTranslation()
  const { season, events } = useLoaderData<typeof loader>()
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')
  return (
    <PageLayout type="default">
      <Hero type="image" image={season.header} headline={season.name} />
      <Gutter className="mt-4">
        <EventsList
          items={events.docs}
          site={rootLoaderData?.site}
          className="mb-24 mt-12"
          emptyMessage={t('No screenings for this season.')}
        />
        <Pagination {...events} linkProps={{ prefetch: 'intent' }} />
      </Gutter>
    </PageLayout>
  )
}
