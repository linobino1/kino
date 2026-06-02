import type { Route } from './+types/page'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'
import { getInstance } from '~/middleware/i18next'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { RenderBlocks } from '~/components/Blocks/RenderBlocks'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  url,
  context,
}: Route.LoaderArgs) => {
  const payload = await getPayload()
  const { t } = getInstance(context)

  const res = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale as Locale,
    depth: 3,
  })

  const page = res.docs[0]

  if (!page) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  return {
    page,
  }
}

export default function Page({ loaderData: { page } }: Route.ComponentProps) {
  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      <RenderBlocks blocks={page.blocks ?? []} />
    </PageLayout>
  )
}
