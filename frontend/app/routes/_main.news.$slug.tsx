import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import Gutter from '~/components/Gutter'
import { JsonLd } from '~/structured-data'
import { postSchema } from '~/structured-data/post'
import Date from '~/components/Date'
import Image from '~/components/Image'
import { Media } from '@/payload-types'
import RichText from '~/components/RichText'
import RenderBlocks from '~/components/Blocks'
import { lexicalToPlainText } from '~/components/RichText/lexicalToPlainText'

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  data?.post &&
  generateMetadata({
    title: data.post.title,
    description: lexicalToPlainText(data?.post.content),
    image: data?.post.header,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale as Locale,
  })

  const post = posts.docs[0]

  if (!post) {
    throw new Error(t('error.404', { url }))
  }

  return {
    post,
  }
}

export default function PostDetailPage() {
  const { post } = useLoaderData<typeof loader>()

  return (
    <PageLayout type={'default'}>
      {JsonLd(postSchema(post))}
      <Gutter size="small" className="mt-12">
        <Date iso={post.date} format="PPP" className="text-sm text-neutral-100" />
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
        />
        <RichText content={post.content} enableProse={false} className="mt-6 text-lg font-normal" />
      </Gutter>
      <RenderBlocks blocks={post.details as []} />
    </PageLayout>
  )
}
