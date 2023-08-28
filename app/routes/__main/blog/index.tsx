import type { MetaFunction } from '@remix-run/node';
import type { LoaderArgs} from '@remix-run/node';
import type { Media } from 'payload/generated-types';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Page } from '~/components/Page';
import { pageDescription, pageKeywords, pageTitle } from '~/util/pageMeta';
import { Date } from '~/components/Date';
import { Image } from '~/components/Image';
import { RichText } from '~/components/RichText';
import classes from './index.module.css';
import i18next from '~/i18next.server';

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'blog',
    locale,
  });
  const posts = await payload.find({
    collection: 'posts',
    locale,
  });
  
  return {
    page,
    posts: posts.docs || [],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data.page?.meta?.title),
  description: pageDescription(parentsData.root?.site?.meta?.description, data.page?.meta?.description),
  keywords: pageKeywords(parentsData.root?.site?.meta?.keywords, data.page?.meta?.keywords),
});

export default function Index() {
  const { page, posts } = useLoaderData<typeof loader>();
  const { t } = useTranslation(); 

  return (
    <Page layout={page.layout}>
      { posts?.length ? (
        <ul className={classes.posts}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Image
                image={post.header as Media}
                onClick={post.link ? () => window.open(post.link, '_self') : undefined}
                className={post.link ? classes.link : undefined}
              />
              <Date className={classes.date} iso={post.date} format='PPP' />
              <h2>{post.title}</h2>
              <RichText content={post.content} className={classes.content} />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <div className={classes.empty}>{t('No posts.')}</div>
      )}
    </Page>
  );
}
