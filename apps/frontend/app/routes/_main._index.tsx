import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import Pagination from '~/components/Pagination'
import PostPreview from '~/components/PostPreview'
import { JsonLd } from '~/structured-data'
import { postsListSchema } from '~/structured-data/post'
import { EventsList } from '~/components/EventsList'
import Gutter from '~/components/Gutter'
import { Link } from '~/components/localized-link'
import { classes } from '~/classes'
import { getPayload } from '~/util/getPayload.server'
import PageLayout from '~/components/PageLayout'
import i18next from '~/i18next.server'
import ErrorPage from '~/components/ErrorPage'
import Hero from '~/components/Hero'
import { cn } from '~/util/cn'
import Button from '~/components/Button'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'

export const ErrorBoundary = ErrorPage

export const loader = async ({ request, params: { lang: locale } }: LoaderFunctionArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  // compare date for upcoming screenings
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // pagination for posts
  const postsPage = parseInt(new URL(request.url).searchParams.get('page') || '1')

  const [pages, posts, events] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 1,
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
      limit: 10,
      pagination: true,
      page: postsPage,
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'events',
      locale: locale as Locale,
      depth: 3,
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
      limit: 3,
    }),
  ])

  // if we cannot find the page in the database, we throw a 404 error
  const page = pages.docs[0]
  if (!page) {
    throw new Error(t('error.404', { url: 'home' }))
  }

  // Redirect to the last page if the requested page is greater than the total number of page
  if (postsPage > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    })
  }

  return {
    page,
    posts,
    events,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

const h2 = 'text-xl font-bold my-8'

export default function LandingPage() {
  const { page, posts, events } = useLoaderData<typeof loader>()
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
        {JsonLd(postsListSchema(posts.docs))}
        {posts.docs?.length ? (
          <ul className={classes.posts}>
            {posts.docs.map((post, index) => (
              <li key={index}>
                <PostPreview post={post} className="py-8" />
                {index !== posts.docs.length - 1 && <hr />}
              </li>
            ))}
          </ul>
        ) : (
          <div className={classes.empty}>{t('No posts.')}</div>
        )}
        <Pagination className="my-8" {...posts} linkProps={{ prefetch: 'intent' }} />
      </Gutter>
    </PageLayout>
  )
}
