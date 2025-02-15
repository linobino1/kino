import type { Route } from './+types/news.index'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Gutter } from '~/components/Gutter'
import { PostsList } from '~/components/PostsList'
import { redirect } from 'react-router'
import { getMetaDescription } from '~/util/posts/getMetaDescription'

export const meta: Route.MetaFunction = ({ data, matches }) => {
  const featuredPost = data.posts.docs[0]
  return generateMetadata({
    title: data?.page.meta?.title,
    description: featuredPost
      ? getMetaDescription(featuredPost, data.locale)
      : data?.page.meta?.description,
    image: featuredPost ? featuredPost.header : data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })
}

export const loader = async ({ params: { lang: locale }, request: { url } }: Route.LoaderArgs) => {
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  const pageNumber = parseInt(new URL(url).searchParams.get('page') || '1')

  const [pages, posts] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'news',
        },
      },
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: 10,
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-date',
      locale: locale as Locale,
      pagination: true,
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
  if (pageNumber > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    })
  }

  return {
    locale: locale as Locale,
    page,
    posts,
  }
}

export default function NewsPage({ loaderData: { page, posts } }: Route.ComponentProps) {
  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      <Gutter>
        <PostsList posts={posts} className="mb-24 mt-12" />
      </Gutter>
    </PageLayout>
  )
}
