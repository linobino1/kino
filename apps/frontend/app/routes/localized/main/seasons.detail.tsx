import type { Route } from './+types/seasons.detail'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { useRouteLoaderData } from 'react-router'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Gutter } from '~/components/Gutter'
import { Pagination } from '~/components/Pagination'
import { EventsList } from '~/components/EventsList'
import { useTranslation } from 'react-i18next'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    title: data?.season?.name,
    image: data?.season?.header,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: Route.LoaderArgs) => {
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
    locale: locale as Locale,
    depth: 3,
    sort: 'date',
    pagination: true,
    page,
    limit: 21,
  })

  return {
    season,
    events,
  }
}

export default function SeasonsDetailPage({
  loaderData: { season, events },
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')
  return (
    <PageLayout type="default">
      <Hero type="image" image={season.header} headline={season.name} />
      <Gutter className="mt-4">
        <EventsList
          events={events.docs}
          site={rootLoaderData?.site}
          className="mb-24 mt-12"
          emptyMessage={t('No screenings for this season.')}
        />
        <Pagination {...events} linkProps={{ prefetch: 'intent' }} />
      </Gutter>
    </PageLayout>
  )
}
