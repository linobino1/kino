import { redirect, type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node'
import { useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { Page } from '~/components/Page'
import { mergeMeta, pageMeta } from '~/util/pageMeta'
import Pagination from '~/components/Pagination'
import PostPreview from '~/components/PostPreview'
import { JsonLd } from '~/structured-data'
import { postsListSchema } from '~/structured-data/post'
import EventsList from '~/components/EventsList'
import type { loader as rootLoader } from '~/root'
import Gutter from '~/components/Gutter'
// import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
// import { routeHeaders } from '~/util/cache-control/routeHeaders'
import { Link } from '~/components/localized-link'
import { payload } from '~/util/payload.server'
import { Locale } from 'shared/config'
import { classes } from '~/classes'

// export const headers = routeHeaders

export const loader = async ({ request, params: { lang: locale } }: LoaderFunctionArgs) => {
  // compare date for upcoming screenings
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // pagination for posts
  const postsPage = parseInt(new URL(request.url).searchParams.get('page') || '1')

  const [page, posts, events] = await Promise.all([
    payload.findGlobal({
      slug: 'blog',
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'posts',
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

  // Redirect to the last page if the requested page is greater than the total number of page
  if (postsPage > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    })
  }

  return json(
    {
      page,
      posts,
      events,
    },
    // {
    //   headers: {
    //     // cache this data for 10 minutes, and allow stale data to be served while revalidating for 1h
    //     'Cache-Control': cacheControlShortWithSWR,
    //   },
    // },
  )
}

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === 'root')?.data.site
  return pageMeta(data?.page.meta, site?.meta)
})

export default function Index() {
  const { page, posts, events } = useLoaderData<typeof loader>()
  const { site } = useRouteLoaderData<typeof rootLoader>('root')!
  const { t } = useTranslation()

  return (
    <Page layout={page.layout} className={classes.page}>
      <Gutter>
        <section className={classes.upcoming}>
          <h2>{t('Our Next Screenings')}</h2>
          <EventsList items={events.docs} site={site} />
          <Link to="/events" className={classes.allScreeningsButton} prefetch="intent">
            {t('See all screenings')}
          </Link>
        </section>
        <section className={classes.news}>
          <h2>{t('News')}</h2>
          {posts.docs?.length ? (
            <>
              {JsonLd(postsListSchema(posts.docs))}
              <ul className={classes.posts}>
                {posts.docs.map((post, index) => (
                  <li key={index}>
                    <PostPreview post={post} />
                    <hr />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={classes.empty}>{t('No posts.')}</div>
          )}
          <Pagination {...posts} linkProps={{ prefetch: 'intent' }} />
        </section>
      </Gutter>
    </Page>
  )
}
