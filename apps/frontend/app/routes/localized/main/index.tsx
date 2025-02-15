import type { Route } from './+types'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { useRouteLoaderData } from 'react-router'
import { useTranslation } from 'react-i18next'
import { EventsList } from '~/components/EventsList'
import { Gutter } from '~/components/Gutter'
import { Link } from '~/components/localized-link'
import { getPayload } from '~/util/getPayload.server'
import { PageLayout } from '~/components/PageLayout'
import i18next from '~/i18next.server'
import { Hero } from '~/components/Hero'
import { cn } from '@app/util/cn'
import { Button } from '~/components/Button'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { PostsList } from '~/components/PostsList'

export const loader = async ({ params: { lang: locale } }: Route.LoaderArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  // compare date for upcoming events
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [pages, posts, events] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 1,
      limit: 1,
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-date',
      depth: 1,
      limit: 5,
      pagination: true,
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'events',
      locale: locale as Locale,
      depth: 3,
      where: {
        and: [
          {
            _status: {
              equals: 'published',
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
      limit: 3,
    }),
  ])

  // if we cannot find the page in the database, we throw a 404 error
  const page = pages.docs[0]
  if (!page) {
    throw new Error(t('error.404', { url: 'home', interpolation: { escapeValue: false } }))
  }

  return {
    page,
    posts,
    events,
  }
}

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

const h2 = 'text-xl font-bold my-8'

export default function LandingPage({ loaderData: { page, posts, events } }: Route.ComponentProps) {
  const { site } = useRouteLoaderData<typeof rootLoader>('root')!
  const { t } = useTranslation()

  return (
    <PageLayout type={page?.layoutType}>
      <Hero {...page.hero} />
      <Gutter>
        <h2 className={h2}>{t('Our Next Screenings')}</h2>
        <EventsList items={events.docs} site={site} />
        <Link to="/events" prefetch="intent" className="contents">
          <Button className="mx-auto my-12" size="lg">
            {t('See all screenings')}
          </Button>
        </Link>

        <h2 className={cn(h2, 'mb-0')}>{t('News')}</h2>
        <PostsList posts={posts} pagination={false} />
        <Link to="/news" prefetch="intent" className="contents">
          <Button className="mx-auto my-12" size="lg">
            {t('See all posts')}
          </Button>
        </Link>
      </Gutter>
    </PageLayout>
  )
}
