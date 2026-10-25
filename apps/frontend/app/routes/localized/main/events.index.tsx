import type { Route } from './+types/events.index'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import type { Event } from '@app/types/payload'
import { useFetcher, useRouteLoaderData } from 'react-router'
import { useEffect, useState } from 'react'
import { getPayload } from '~/util/getPayload.server'
import { getInstance } from '~/middleware/i18next'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { EventsList } from '~/components/EventsList'
import { Gutter } from '~/components/Gutter'
import { useTranslation } from 'react-i18next'
import { CTAButton } from '~/components/CTAButton'
import { measureServerTiming } from '~/util/serverTiming.server'
import { eventListQuery, mediaListPopulate } from '~/util/eventListQuery.server'

export const meta: Route.MetaFunction = ({ loaderData, matches }) =>
  generateMetadata({
    title: loaderData?.page.meta?.title,
    description: loaderData?.page.meta?.description,
    image: loaderData?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({ request, params: { lang: locale }, url, context }: Route.LoaderArgs) => {
  const { t } = getInstance(context)
  const payload = await getPayload()
  const pageNumber = parseInt(new URL(url).searchParams.get('page') || '1')

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [pages, events] = await Promise.all([
    measureServerTiming(request, 'events.page', () =>
      payload.find({
        collection: 'pages',
        select: {
          layoutType: true,
          hero: {
            type: true,
            headline: true,
            image: true,
          },
          meta: {
            title: true,
            description: true,
            image: true,
          },
        },
        where: {
          slug: {
            equals: 'events',
          },
        },
        depth: 1,
        populate: {
          media: mediaListPopulate,
        },
        limit: 1,
        pagination: false,
        locale: locale as Locale,
      }),
    ),
    measureServerTiming(request, 'events.list', () =>
      payload.find({
        collection: 'events',
        ...eventListQuery,
        limit: 12,
        page: pageNumber,
        where: {
          _status: {
            equals: 'published',
          },
          and: [
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
        draft: false,
        sort: 'date',
        locale: locale as Locale,
      }),
    ),
  ])

  const page = pages.docs[0]

  if (!page) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  return {
    page,
    events,
  }
}

export default function EventsPage({ loaderData: { page, events } }: Route.ComponentProps) {
  return <UpcomingEvents key={page.id} page={page} events={events} />
}

function UpcomingEvents({ page, events }: Route.ComponentProps['loaderData']) {
  const { t } = useTranslation()
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')
  const fetcher = useFetcher<typeof loader>()
  const [loadedEvents, setLoadedEvents] = useState<Event[]>(events.docs)

  useEffect(() => {
    if (!fetcher.data) return

    const fetchedEvents = fetcher.data.events.docs
    setLoadedEvents((current) => {
      const loadedIds = new Set(current.map(({ id }) => id))
      return [...current, ...fetchedEvents.filter(({ id }) => !loadedIds.has(id))]
    })
  }, [fetcher.data])

  const latestPage = fetcher.data?.events ?? events

  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      <Gutter>
        <EventsList
          events={loadedEvents}
          site={rootLoaderData?.site}
          className={latestPage.hasNextPage ? 'mt-12 mb-8' : 'mt-12 mb-24'}
        />
        {latestPage.hasNextPage ? (
          <CTAButton
            type="button"
            className="mx-auto mb-24"
            disabled={fetcher.state !== 'idle'}
            onClick={() => fetcher.load(`?page=${latestPage.nextPage}`)}
          >
            {fetcher.state === 'loading' ? t('Loading...') : t('Load more events')}
          </CTAButton>
        ) : null}
      </Gutter>
    </PageLayout>
  )
}
