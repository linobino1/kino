import { locales } from '@app/i18n'
import { env } from '@app/util/env/frontend.server'
import {
  eventPath,
  eventSeriesPath,
  filmPrintPath,
  hfgArchiveFilmPrintPath,
  pagePath,
  postPath,
  seasonPath,
} from '@app/util/routes'
import type { Where } from 'payload'
import { getPayload } from '~/util/getPayload.server'
import type { Route } from './+types/sitemap.xml'

const limit = 999
const defaultPriority = 0.8

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return char
    }
  })

const getSitemapRoutes = async () => {
  const payload = await getPayload()
  const publishedOnly: Where = { _status: { equals: 'published' } }
  const eventsWhere: Where = {
    and: [
      publishedOnly,
      {
        excludeFromUpcoming: {
          not_equals: true,
        },
      },
    ],
  }
  const select = { slug: true, updatedAt: true } as const

  const [pages, posts, events, filmprints, seasons, eventSeries] = await Promise.all([
    payload.find({ collection: 'pages', select, pagination: false }),
    payload.find({
      collection: 'posts',
      select: { ...select, hasDetailPage: true },
      where: publishedOnly,
      pagination: false,
    }),
    payload.find({ collection: 'events', select, where: eventsWhere, pagination: false }),
    payload.find({
      collection: 'filmPrints',
      select: { ...select, isRented: true },
      where: publishedOnly,
      pagination: false,
    }),
    payload.find({ collection: 'seasons', select, pagination: false }),
    payload.find({ collection: 'eventSeries', select, pagination: false }),
  ])

  const latestDate = (dates: (string | null | undefined)[]) =>
    new Date(
      dates.reduce(
        (latest, date) => Math.max(latest, new Date(date || 0).getTime()),
        0,
      ),
    )
  const postsLastUpdatedAt = latestDate(posts.docs.map(({ updatedAt }) => updatedAt))
  const eventsLastUpdatedAt = latestDate(events.docs.map(({ updatedAt }) => updatedAt))
  const filmprintsLastUpdatedAt = latestDate(filmprints.docs.map(({ updatedAt }) => updatedAt))
  const seasonsLastUpdatedAt = latestDate(seasons.docs.map(({ updatedAt }) => updatedAt))
  const hfgArchiveLastUpdatedAt = latestDate(
    filmprints.docs
      .filter(({ isRented }) => isRented === false)
      .map(({ updatedAt }) => updatedAt),
  )
  const landingPageLastUpdatedAt = latestDate([
    postsLastUpdatedAt.toISOString(),
    eventsLastUpdatedAt.toISOString(),
  ])

  const routes = [
    ...pages.docs.map(({ slug, updatedAt }) => {
      const path = pagePath(slug)
      return {
        path: path === '/' ? '' : path,
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
                      : new Date(updatedAt || 0),
        priority: slug === 'home' ? 1.0 : defaultPriority,
      }
    }),
    ...posts.docs
      .filter(({ hasDetailPage }) => hasDetailPage)
      .map(({ slug, updatedAt }) => ({
        path: postPath(slug),
        lastmod: new Date(updatedAt || 0),
        priority: defaultPriority,
      })),
    ...events.docs.map(({ slug, updatedAt }) => ({
      path: eventPath(slug),
      lastmod: new Date(updatedAt || 0),
      priority: defaultPriority,
    })),
    ...filmprints.docs.map(({ slug, updatedAt }) => ({
      path: filmPrintPath(slug),
      lastmod: new Date(updatedAt || 0),
      priority: 0.5,
    })),
    ...seasons.docs.map(({ slug, updatedAt }) => ({
      path: seasonPath(slug),
      lastmod: new Date(updatedAt || 0),
      priority: defaultPriority,
    })),
    ...eventSeries.docs.map(({ slug, updatedAt }) => ({
      path: eventSeriesPath(slug),
      lastmod: new Date(updatedAt || 0),
      priority: defaultPriority,
    })),
    ...filmprints.docs
      .filter(({ isRented }) => isRented === false)
      .map(({ slug, updatedAt }) => ({
        path: hfgArchiveFilmPrintPath(slug),
        lastmod: new Date(updatedAt || 0),
        priority: defaultPriority,
      })),
  ]

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `/${locale}${route.path}`,
      lastmod: route.lastmod,
      priority: route.priority,
    })),
  )
}

/**
 * this endpoint serves the sitemap.xml index and individual pages at /sitemap.xml?page=1, /sitemap.xml?page=2, etc.
 */
export const loader = async ({ request }: Route.LoaderArgs) => {
  const page = new URL(request.url).searchParams.get('page')
  const isIndex = page === null
  const routes = await getSitemapRoutes()
  let content: string

  if (isIndex) {
    const totalPages = Math.ceil(routes.length / limit)
    content = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(
          (pageNum) => `
          <sitemap>
              <loc>${escapeXml(`${env.FRONTEND_URL}/sitemap.xml?page=${pageNum}`)}</loc>
          </sitemap>
        `,
        )
        .join('\n')}
    </sitemapindex>
    `
  } else {
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1)
    const sortedRoutes = routes.sort(
      (a, b) =>
        b.priority - a.priority ||
        b.lastmod.getTime() - a.lastmod.getTime() ||
        a.url.localeCompare(b.url),
    )
    const pageRoutes = sortedRoutes.slice((pageNumber - 1) * limit, pageNumber * limit)
    content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pageRoutes
        .map(
          ({ url, lastmod, priority }) => `
          <url>
              <loc>${escapeXml(`${env.FRONTEND_URL}${url}`)}</loc>
              <lastmod>${lastmod.toISOString()}</lastmod>
              <priority>${priority}</priority>
          </url>
        `,
        )
        .join('\n')}
    </urlset>
    `
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
