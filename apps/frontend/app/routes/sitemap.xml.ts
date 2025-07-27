import { env } from '@app/util/env/frontend.server'
import { getPayload } from '~/util/getPayload.server'
import type { Route } from './+types/sitemap.xml'

const limit = 999

/**
 * this endpoint serves the sitemap.xml index and individual pages at /sitemap.xml?page=1, /sitemap.xml?page=2, etc.
 */
export const loader = async ({ request }: Route.LoaderArgs) => {
  const payload = await getPayload()
  const page = new URL(request.url).searchParams.get('page')
  const isIndex = page === null

  let content = ''

  if (isIndex) {
    const totalPages = Math.ceil(
      (
        await payload.count({
          collection: 'sitemap',
        })
      ).totalDocs / limit,
    )
    content = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(
          (pageNum) => `
          <sitemap>
              <loc>${env.FRONTEND_URL}/sitemap.xml?page=${pageNum}</loc>
          </sitemap>
        `,
        )
        .join('\n')}
    </sitemapindex>
    `
  } else {
    const routes = await payload.find({
      collection: 'sitemap',
      sort: ['-priority', '-lastModified', 'url'],
      page: parseInt(page, 10),
      limit,
    })
    content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.docs
        .map(
          ({ url, lastModified, priority }) => `
          <url>
              <loc>${env.FRONTEND_URL}${url}</loc>
              <lastmod>${lastModified}</lastmod>
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
