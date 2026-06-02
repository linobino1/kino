import type { Route } from './+types/seasons.index'
import type { Locale } from '@app/i18n'
import type { Media } from '@app/types/payload'
import { redirect } from 'react-router'
import { getPayload } from '~/util/getPayload.server'
import { getInstance } from '~/middleware/i18next'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Gutter } from '~/components/Gutter'
import { Image } from '~/components/Image'
import { Pagination } from '~/components/Pagination'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({ params: { lang: locale }, url, context }: Route.LoaderArgs) => {
  const { t } = getInstance(context)
  const payload = await getPayload()

  const pageNumber = parseInt(new URL(url).searchParams.get('page') || '1')
  const [pages, seasons] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'seasons',
        },
      },
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'seasons',
      locale: locale as Locale,
      depth: 3,
      limit: 12,
      pagination: true,
      sort: '-from',
      page: pageNumber,
    }),
  ])

  const page = pages.docs[0]

  if (!page) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  // Redirect to the last page if the requested page is greater than the total number of page
  if (pageNumber > seasons.totalPages) {
    throw redirect(`?page=${seasons.totalPages}`, {
      status: 302,
    })
  }

  return {
    page,
    seasons,
  }
}

export default function EventsPage({ loaderData: { page, seasons } }: Route.ComponentProps) {
  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      <Gutter className="mt-4">
        {seasons.docs?.length ? (
          <ul className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-[repeat(auto-fill,19rem)] sm:items-center sm:justify-center">
            {seasons.docs.map((season, index) => (
              <li key={index} className="relative aspect-[34/22]">
                <a href={`/seasons/${season.slug}`}>
                  <Image
                    image={season.header as Media}
                    alt={season.name}
                    srcSet={[
                      { options: { width: 304, height: 197 }, size: '304w' },
                      // { options: { width: 608, height: 394 }, size: "608w" },
                      { options: { width: 768, height: 498 }, size: '768w' },
                    ]}
                    sizes="(max-width: 768px) 100vw, 304px"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="upercase absolute inset-0 flex items-end bg-[linear-gradient(0deg,#000000_-50%,#00000000_54%)] p-4 text-xl font-semibold">
                    <h2>{season.name}</h2>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <Pagination {...seasons} linkProps={{ prefetch: 'intent' }} className="mt-8 mb-16" />
      </Gutter>
    </PageLayout>
  )
}
