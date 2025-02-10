import type { LoaderFunctionArgs } from '@remix-run/node'
import type { loader as rootLoader } from '~/root'
import type { MetaFunction } from '@remix-run/react'
import type { Locale } from '@app/i18n'
import { useLoaderData, useRouteLoaderData } from '@remix-run/react'
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
import ErrorPage from '~/components/ErrorPage'

export const ErrorBoundary = ErrorPage

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.eventSeries?.name,
    image: data?.eventSeries?.hero?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const eventSeries = (
    await payload.find({
      collection: 'eventSeries',
      where: {
        slug: {
          equals: slug,
        },
      },
      locale: locale as Locale,
      depth: 1,
    })
  ).docs[0]

  if (!eventSeries) {
    throw new Response(t('eventSeries not found.'), { status: 404 })
  }

  const page = parseInt(new URL(url).searchParams.get('page') || '1')
  const depth = 3
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          {
            series: {
              equals: eventSeries.id,
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
              equals: eventSeries.id,
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
    eventSeries,
    upcoming,
    past,
  }
}

export default function EventSeriesDetailPage() {
  const { t } = useTranslation()
  const { eventSeries, upcoming, past } = useLoaderData<typeof loader>()
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')

  const h2 = 'text-xl font-semibold my-12'
  return (
    <PageLayout type="default">
      <Hero {...eventSeries.hero} />
      <Gutter className="mt-4">
        <RenderBlocks blocks={eventSeries?.blocks ?? []} />
        {upcoming.docs.length > 0 && (
          <>
            <h2 className={h2}>{t('Upcoming Screenings')}</h2>
            <EventsList
              items={upcoming.docs}
              activeEventSery={eventSeries}
              site={rootLoaderData?.site}
            />
          </>
        )}
        {past.docs.length > 0 && (
          <>
            <h2 className={h2}>{t('Past Screenings')}</h2>
            <EventsList
              items={past.docs}
              activeEventSery={eventSeries}
              site={rootLoaderData?.site}
            />
          </>
        )}
        <Pagination {...past} linkProps={{ prefetch: 'intent' }} />
      </Gutter>
    </PageLayout>
  )
}
