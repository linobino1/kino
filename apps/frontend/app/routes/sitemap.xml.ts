import type { CollectionSlug, Where } from 'payload'
import { locales } from '@app/i18n'
import { env } from '@app/util/env/frontend.server'
import { getPayload } from '~/util/getPayload.server'

const defaultPriority = 0.8

const getLastUpdatedAt = async (collection: CollectionSlug, where?: Where) =>
  new Date(
    (
      await (
        await getPayload()
      ).find({
        collection,
        where,
        sort: '-updatedAt',
        limit: 1,
      })
    ).docs[0]?.updatedAt || new Date(0),
  )

export const loader = async () => {
  console.time('Sitemap generation')
  const payload = await getPayload()
  const publishedOnly: Where = {
    _status: {
      equals: 'published',
    },
  }
  const select = {
    slug: true,
    url: true,
    updatedAt: true,
  } as const
  const eventsWhere: Where = {
    and: [
      publishedOnly,
      {
        excludeFromUpcoming: {
          not_equals: true,
        },
      },
    ] as const,
  }

  const pages = await payload.find({
    collection: 'pages',
    select,
    pagination: false,
  })
  const posts = await payload.find({
    collection: 'posts',
    select,
    where: {
      and: [
        publishedOnly,
        {
          hasDetailPage: {
            equals: true,
          },
        },
      ],
    },
    pagination: false,
  })
  const events = await payload.find({
    collection: 'events',
    select,
    where: eventsWhere,
    pagination: false,
  })
  const filmprints = await payload.find({
    collection: 'filmPrints',
    select,
    where: publishedOnly,
    pagination: false,
  })
  const seasons = await payload.find({
    collection: 'seasons',
    select,
    pagination: false,
  })
  const eventSeries = await payload.find({
    collection: 'eventSeries',
    select,
    pagination: false,
  })
  const hfgArchiveFilmprints = await payload.find({
    collection: 'filmPrints',
    select,
    where: {
      and: [publishedOnly, { isRented: { equals: false } }],
    },
    pagination: false,
  })

  const postsLastUpdatedAt = await getLastUpdatedAt('posts', publishedOnly)
  const eventsLastUpdatedAt = await getLastUpdatedAt('events', eventsWhere)
  const filmprintsLastUpdatedAt = await getLastUpdatedAt('filmPrints', publishedOnly)
  const seasonsLastUpdatedAt = await getLastUpdatedAt('seasons')
  const hfgArchiveLastUpdatedAt = await getLastUpdatedAt('filmPrints', {
    and: [publishedOnly, { isRented: { equals: false } }],
  })

  const landingPageLastUpdatedAt = new Date(
    Math.max(postsLastUpdatedAt.getTime(), eventsLastUpdatedAt.getTime()),
  )

  const routes = [
    ...pages.docs.map(({ url, slug, updatedAt }) => ({
      path: url === '/' ? '' : url, // trim trailing slash from root URL
      lastmod:
        slug === 'home'
          ? landingPageLastUpdatedAt
          : slug === 'news'
            ? postsLastUpdatedAt
            : slug === 'events'
              ? eventsLastUpdatedAt
              : slug === 'filmprints'
                ? filmprintsLastUpdatedAt
                : slug === 'seasons'
                  ? seasonsLastUpdatedAt
                  : slug === 'hfg-archive'
                    ? hfgArchiveLastUpdatedAt
                    : new Date(updatedAt),
      priority: slug === 'home' ? 1.0 : defaultPriority,
    })),
    ...posts.docs.map((post) => ({
      path: post.url,
      lastmod: new Date(post.updatedAt),
      priority: defaultPriority,
    })),
    ...events.docs.map((event) => ({
      path: event.url,
      lastmod: new Date(event.updatedAt),
      priority: defaultPriority,
    })),
    ...filmprints.docs.map((filmprint) => ({
      path: filmprint.url,
      lastmod: new Date(filmprint.updatedAt),
      priority: 0.5,
    })),
    ...seasons.docs.map((season) => ({
      path: season.url,
      lastmod: new Date(season.updatedAt),
      priority: defaultPriority,
    })),
    ...eventSeries.docs.map((series) => ({
      path: series.url,
      lastmod: new Date(series.updatedAt),
      priority: defaultPriority,
    })),
    ...hfgArchiveFilmprints.docs.map((filmprint) => ({
      path: filmprint.url?.replace('/filmprints/', '/hfg-archive/'),
      lastmod: new Date(filmprint.updatedAt),
      priority: defaultPriority,
    })),
  ]
  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${locales
        .map((locale) =>
          routes.map((route) => ({
            ...route,
            path: `/${locale}${route.path}`,
          })),
        )
        .flat()
        .map(
          ({ path, lastmod, priority }) => `
          <url>
              <loc>${env.FRONTEND_URL}${path}</loc>
              <lastmod>${lastmod.toISOString()}</lastmod>
              <priority>${priority}</priority>
          </url>
        `,
        )
        .join('\n')}
    </urlset>
    `

  console.timeEnd('Sitemap generation')
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
