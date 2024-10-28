import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { RenderBlocks } from '~/components/Blocks/RenderBlocks'

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, page: pageSlug },
  request: { url },
}: LoaderFunctionArgs) => {
  const payload = await getPayload()

  const [res, t] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: pageSlug,
        },
      },
      locale: locale as Locale,
      depth: 3,
    }),
    i18next.getFixedT(locale as string),
  ])

  const page = res.docs[0]

  if (!page) {
    throw new Error(t('error.404', { url }))
  }

  return {
    page,
  }
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>()
  return (
    <PageLayout type={page.layoutType}>
      {/* <pre>{JSON.stringify(page, null, 2)}</pre> */}
      <Hero {...page.hero} />
      <RenderBlocks blocks={page.blocks ?? []} />
    </PageLayout>
  )
}
