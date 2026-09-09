import type { Route } from './+types/seasons.detail'
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
import { Gutter } from '~/components/Gutter'
import { EventsList } from '~/components/EventsList'
import { useTranslation } from 'react-i18next'
import { Button } from '~/components/Button'

export const meta: Route.MetaFunction = ({ loaderData, matches }) =>
  generateMetadata({
    title: loaderData?.season?.name,
    image: loaderData?.season?.header,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  url,
  context,
}: Route.LoaderArgs) => {
  const { t } = getInstance(context)
  const payload = await getPayload()

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
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          season: {
            equals: season.id,
          },
        },
      ],
    },
    draft: false,
    locale: locale as Locale,
    depth: 3,
    sort: 'date',
    page,
    limit: 12,
  })

  return {
    season,
    events,
  }
}

export default function SeasonsDetailPage({
  loaderData: { season, events },
}: Route.ComponentProps) {
  return <SeasonEvents key={season.id} season={season} events={events} />
}

function SeasonEvents({ season, events }: Route.ComponentProps['loaderData']) {
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
    <PageLayout type="default">
      <Hero type="image" image={season.header} headline={season.name} />
      <Gutter className="mt-4">
        <EventsList
          events={loadedEvents}
          site={rootLoaderData?.site}
          className={latestPage.hasNextPage ? 'mt-12 mb-8' : 'mt-12 mb-24'}
          emptyMessage={t('No screenings for this season.')}
        />
        {latestPage.hasNextPage ? (
          <Button
            type="button"
            size="lg"
            className="mx-auto mb-24 disabled:cursor-wait disabled:opacity-50"
            disabled={fetcher.state !== 'idle'}
            onClick={() => fetcher.load(`?page=${latestPage.nextPage}`)}
          >
            {fetcher.state === 'loading' ? t('Loading...') : t('Load more events')}
          </Button>
        ) : null}
      </Gutter>
    </PageLayout>
  )
}
