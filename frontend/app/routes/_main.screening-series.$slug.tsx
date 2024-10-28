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
import { RenderBlocks } from '~/components/Blocks/RenderBlocks'

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.screeningSeries?.name,
    image: data?.screeningSeries?.hero?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const screeningSeries = (
    await payload.find({
      collection: 'screeningSeries',
      where: {
        slug: {
          equals: slug,
        },
      },
      locale: locale as Locale,
      depth: 1,
    })
  ).docs[0]

  if (!screeningSeries) {
    throw new Response(t('screeningSeries not found.'), { status: 404 })
  }

  const page = parseInt(new URL(url).searchParams.get('page') || '1')
  const depth = 2
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          {
            series: {
              equals: screeningSeries.id,
            },
          },
          {
            date: {
              greater_than_equal: today,
            },
          },
          {
            excludeFromUpcoming: {
              not_equals: true,
            },
          },
        ],
      },
      sort: 'date',
      locale: locale as Locale,
      depth,
      pagination: false,
    }),
    payload.find({
      collection: 'events',
      where: {
        and: [
          {
            series: {
              equals: screeningSeries.id,
            },
          },
          {
            date: {
              less_than: today,
            },
          },
        ],
      },
      sort: '-date',
      locale: locale as Locale,
      depth,
      pagination: true,
      page,
      limit: 20,
    }),
  ])

  return {
    screeningSeries,
    upcoming,
    past,
  }
}

export default function ScreeningSeriesDetailPage() {
  const { t } = useTranslation()
  const { screeningSeries, upcoming, past } = useLoaderData<typeof loader>()
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')

  const h2 = 'text-xl font-semibold my-12'
  return (
    <PageLayout type="default">
      <Hero {...screeningSeries.hero} />
      <Gutter className="mt-4">
        <RenderBlocks blocks={screeningSeries?.blocks ?? []} />
        {upcoming.docs.length > 0 && (
          <>
            <h2 className={h2}>{t('Upcoming Screenings')}</h2>
            <EventsList
              items={upcoming.docs}
              activeScreeningSery={screeningSeries}
              site={rootLoaderData?.site}
            />
          </>
        )}
        {past.docs.length > 0 && (
          <>
            <h2 className={h2}>{t('Past Screenings')}</h2>
            <EventsList
              items={past.docs}
              activeScreeningSery={screeningSeries}
              site={rootLoaderData?.site}
            />
          </>
        )}
        <Pagination {...past} linkProps={{ prefetch: 'intent' }} />
      </Gutter>
    </PageLayout>
  )
}
