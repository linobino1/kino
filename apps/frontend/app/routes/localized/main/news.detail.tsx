import type { Route } from './+types/news.detail'
import type { Media } from '@app/types/payload'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Gutter } from '~/components/Gutter'
import { JsonLd } from '~/structured-data'
import { postSchema } from '~/structured-data/post'
import { Date } from '~/components/Date'
import { Image } from '~/components/Image'
import { RichText } from '~/components/RichText'
import { RenderBlocks } from '~/components/Blocks/RenderBlocks'
import { getMetaDescription } from '~/util/posts/getMetaDescription'
import { isPreview } from '~/util/isPreview'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  data?.post
    ? generateMetadata({
        title: data.post.title,
        description: getMetaDescription(data.post, data.locale),
        image: data?.post.header,
        env: getEnvFromMatches(matches),
      })
    : []

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: Route.LoaderArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const post = (
    await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            hasDetailPage: {
              equals: true,
            },
          },
        ],
      },
      locale: locale as Locale,
      depth: 2,
      draft: isPreview(url),
    })
  ).docs[0]

  if (!post) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  return {
    locale: locale as Locale,
    post,
  }
}

export default function PostDetailPage({ loaderData: { post } }: Route.ComponentProps) {
  return (
    <PageLayout type={'default'}>
      <JsonLd {...postSchema(post)} />
      <Gutter size="small" className="mt-12">
        <Date date={post.date} format="PPP" className="text-sm text-neutral-100" />
        <h1 className="mt-6 text-3xl font-semibold uppercase tracking-widest">{post.title}</h1>
        <Image
          className="mt-6 aspect-[16/9] w-full object-contain object-left"
          image={post.header as Media}
          srcSet={[
            { options: { width: 500 }, size: '500w' },
            { options: { width: 768 }, size: '768w' },
            { options: { width: 1500 }, size: '1500w' },
          ]}
          sizes="(max-width: 768px) 100vw, 720px"
          applyFocalPoint={false}
        />
        <RichText content={post.content} enableProse={false} className="mt-6 text-lg font-normal" />
      </Gutter>
      <RenderBlocks blocks={post.details as []} />
    </PageLayout>
  )
}
