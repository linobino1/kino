import type { Route } from './+types/generate-sitemap'
import { type Payload, type Where } from 'payload'
import { env } from '@app/util/env/frontend.server'
import { getPayload } from '~/util/getPayload.server'
import { locales } from '@app/i18n'

const defaultPriority = 0.8

const getLastUpdatedAt = async ({
  payload,
  collection,
  where,
}: {
  payload: Payload
  collection: 'pages' | 'posts' | 'events' | 'filmPrints' | 'seasons' | 'eventSeries'
  where?: Where
}) =>
  new Date(
    (
      await payload.find({
        collection,
        where,
        sort: '-updatedAt',
        limit: 1,
      })
    ).docs[0]?.updatedAt || new Date(0),
  )

export const loader = async ({ request }: Route.LoaderArgs) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV !== 'development') {
    return new Response('Unauthorized', { status: 401 })
  }

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

  const postsLastUpdatedAt = await getLastUpdatedAt({
    payload,
    collection: 'posts',
    where: publishedOnly,
  })
  const eventsLastUpdatedAt = await getLastUpdatedAt({
    payload,
    collection: 'events',
    where: eventsWhere,
  })
  const filmprintsLastUpdatedAt = await getLastUpdatedAt({
    payload,
    collection: 'filmPrints',
    where: publishedOnly,
  })
  const seasonsLastUpdatedAt = await getLastUpdatedAt({
    payload,
    collection: 'seasons',
  })
  const hfgArchiveLastUpdatedAt = await getLastUpdatedAt({
    payload,
    collection: 'filmPrints',
    where: {
      and: [publishedOnly, { isRented: { equals: false } }],
    },
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

  await payload.delete({
    collection: 'sitemap',
    where: {
      id: { exists: true },
    },
    overrideAccess: true,
  })

  for await (const locale of locales) {
    for await (const route of routes) {
      try {
        await payload.create({
          collection: 'sitemap',
          data: {
            url: `/${locale}${route.path}`,
            lastModified: route.lastmod.toISOString(),
            priority: route.priority,
          },
          overrideAccess: true,
        })
      } catch (error) {
        console.error('Error generating sitemap:', error, { route })
      }
    }
  }

  return {
    ok: true,
  }
}
