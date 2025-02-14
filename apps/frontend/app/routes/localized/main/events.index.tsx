import type { Route } from './+types/events.index'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { useRouteLoaderData } from 'react-router'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { EventsList } from '~/components/EventsList'
import { Gutter } from '~/components/Gutter'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({ params: { lang: locale }, request: { url } }: Route.LoaderArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [pages, screenings] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'events',
        },
      },
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'events',
      depth: 7,
      limit: 50,
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
      sort: 'date',
      locale: locale as Locale,
    }),
  ])

  const page = pages.docs[0]

  if (!page) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  return {
    page,
    screenings,
  }
}

export default function EventsPage({ loaderData: { page, screenings } }: Route.ComponentProps) {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')
  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      <Gutter>
        <EventsList items={screenings.docs} site={rootLoaderData?.site} className="mb-24 mt-12" />
      </Gutter>
    </PageLayout>
  )
}
