import { redirect, type MetaFunction } from '@remix-run/node';
import type { LoaderArgs} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Page } from '~/components/Page';
import { pageDescription, pageKeywords, pageTitle } from '~/util/pageMeta';
import classes from './index.module.css';
import i18next from '~/i18next.server';
import Pagination from '~/components/Pagination';
import PostPreview from '~/components/PostPreview';

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'blog',
    locale,
  });
  const postsPage  = parseInt(new URL(request.url).searchParams.get('page') || '1');
  const posts = await payload.find({
    collection: 'posts',
    sort: '-date',
    limit: 10,
    pagination: true,
    page: postsPage,
    locale,
  });

  // Redirect to the last page if the requested page is greater than the total number of page
  if (postsPage > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    });
  }

  return {
    page,
    posts,
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data?.page?.meta?.title),
  description: pageDescription(parentsData.root?.site?.meta?.description, data?.page?.meta?.description),
  keywords: pageKeywords(parentsData.root?.site?.meta?.keywords, data?.page?.meta?.keywords),
});

export default function Index() {
  const { page, posts } = useLoaderData<typeof loader>();
  const { t } = useTranslation(); 

  return (
    <Page layout={page.layout}>
      <main>
        { posts.docs?.length ? (
        <>
          <ul className={classes.posts}>
            {posts.docs.map((post) => (
              <li key={post.slug}>
                <PostPreview post={post} />
                <hr />
              </li>
            ))}
          </ul>
        </>
        ) : (
          <div className={classes.empty}>{t('No posts.')}</div>
        )}
        <Pagination {...posts} linkProps={{ prefetch: 'intent' }}/>
      </main>
    </Page>
  );
}
