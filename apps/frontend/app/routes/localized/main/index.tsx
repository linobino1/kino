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
import { Hero } from '~/components/Hero'
import { cn } from '@app/util/cn'
import { CTAButton } from '~/components/CTAButton'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { PostsList } from '~/components/PostsList'
import { getInstance } from '~/middleware/i18next'
import { measureServerTiming } from '~/util/serverTiming.server'
import { cache } from '~/util/cache.server'

export const loader = async ({ request, params: { lang: locale }, context }: Route.LoaderArgs) => {
  const payload = await getPayload()
  const { t } = getInstance(context)

  // compare date for upcoming events
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [pages, posts, events] = await Promise.all([
    measureServerTiming(request, 'home.page', () =>
      cache({
        key: `home-page_${locale}`,
        ttl: 1000 * 60,
        forceFresh: process.env.NODE_ENV === 'development',
        getFreshValue: () =>
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
                equals: 'home',
              },
            },
            depth: 1,
            limit: 1,
            locale: locale as Locale,
          }),
      }),
    ),
    measureServerTiming(request, 'home.posts', () =>
      cache({
        key: `home-posts_${locale}`,
        ttl: 1000 * 60,
        forceFresh: process.env.NODE_ENV === 'development',
        getFreshValue: () =>
          payload.find({
            collection: 'posts',
            select: {
              updatedAt: true,
              createdAt: true,
              title: true,
              date: true,
              header: true,
              link: {
                type: true,
                doc: true,
                url: true,
              },
              content: true,
              hasDetailPage: true,
              url: true,
            },
            where: {
              _status: {
                equals: 'published',
              },
            },
            draft: false,
            sort: '-date',
            depth: 1,
            limit: 5,
            pagination: false,
            locale: locale as Locale,
          }),
      }),
    ),
    measureServerTiming(request, 'home.events', () =>
      cache({
        key: `home-events_${locale}_${today.toISOString().slice(0, 10)}`,
        ttl: 1000 * 60,
        forceFresh: process.env.NODE_ENV === 'development',
        getFreshValue: () =>
          payload.find({
            collection: 'events',
            locale: locale as Locale,
            select: {
              updatedAt: true,
              createdAt: true,
              title: true,
              subtitle: true,
              date: true,
              date_tz: true,
              season: true,
              header: true,
              comment: true,
              series: true,
              url: true,
              isScreeningEvent: true,
              mainProgramFilmPrint: true,
              shortDescription: true,
            },
            depth: 3,
            populate: {
              eventSeries: {
                name: true,
                slug: true,
              },
              filmPrints: {
                movie: true,
                format: true,
                languageVersion: true,
              },
              movies: {
                title: true,
                synopsis: true,
                poster: true,
                duration: true,
                year: true,
                directors: true,
                countries: true,
              },
              persons: {
                name: true,
              },
              countries: {
                id: true,
                name: true,
              },
              formats: {
                name: true,
              },
              languageVersions: {
                abbreviation: true,
              },
              seasons: {
                name: true,
              },
              media: {
                filename: true,
                url: true,
                alt: true,
                width: true,
                height: true,
                focalX: true,
                focalY: true,
              },
            },
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
            draft: false,
            sort: 'date',
            limit: 3,
            pagination: false,
          }),
      }),
    ),
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

export const meta: Route.MetaFunction = ({ loaderData, matches }) =>
  generateMetadata({
    title: loaderData?.page.meta?.title,
    description: loaderData?.page.meta?.description,
    image: loaderData?.page.meta?.image,
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
        <EventsList events={events.docs} site={site} showICSDownload={false} />
        <CTAButton as={Link} to="/events" prefetch="intent" className="mx-auto my-12" icon="arrow">
          {t('See all screenings')}
        </CTAButton>

        <h2 className={cn(h2, 'mb-0')}>{t('News')}</h2>
        <PostsList posts={posts} pagination={false} />
        <CTAButton as={Link} to="/news" prefetch="intent" className="mx-auto my-12" icon="arrow">
          {t('See all posts')}
        </CTAButton>
      </Gutter>
    </PageLayout>
  )
}
