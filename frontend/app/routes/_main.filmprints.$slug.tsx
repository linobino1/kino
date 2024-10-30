import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/cloudflare'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Gutter } from '~/components/Gutter'
import { Media, Movie as MovieType } from '@/payload-types'
import { FilmPrintDetails } from '~/components/FilmPrintDetails'
import ErrorPage from '~/components/ErrorPage'

export const ErrorBoundary = ErrorPage

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    // TODO: title and description should clarify that this is a film print
    title: (data?.filmPrint.movie as MovieType).title,
    description: (data?.filmPrint.movie as MovieType).synopsis,
    image: (data?.filmPrint.movie as MovieType).still as Media,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const payload = await getPayload()
  const [res, t] = await Promise.all([
    payload.find({
      collection: 'filmPrints',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      locale: locale as Locale,
    }),
    i18next.getFixedT(locale as string),
  ])

  const filmPrint = res.docs[0]

  if (!filmPrint) {
    throw new Response(t('error.404', { url }), { status: 404 })
  }

  return {
    filmPrint,
  }
}

export default function FilmPrintDetailPage() {
  const { filmPrint } = useLoaderData<typeof loader>()

  const movie = filmPrint.movie as MovieType

  return (
    <PageLayout>
      <Hero type="image" image={movie.still as Media} />
      <Gutter className="mt-4">
        <FilmPrintDetails filmPrint={filmPrint} />
      </Gutter>
    </PageLayout>
  )
}
