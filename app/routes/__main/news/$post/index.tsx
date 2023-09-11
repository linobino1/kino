import { type MetaFunction } from '@remix-run/node';
import type { LoaderArgs} from '@remix-run/node';
import type { Media } from 'payload/generated-types';
import { useLoaderData } from '@remix-run/react';
import { Page } from '~/components/Page';
import { pageTitle } from '~/util/pageMeta';
import i18next from '~/i18next.server';
import classes from './index.module.css';
import { Image } from '~/components/Image';
import Date from '~/components/Date';
import Blocks from '~/components/Blocks';
import RichText from '~/components/RichText';

export const loader = async ({ request, params, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const data = await payload.find({
    collection: 'posts',
    locale,
    where: {
      slug: {
        equals: params.post,
      },
    },
  });

  if (!data.docs.length) {
    throw new Response('Post not found', { status: 404 });
  }
  
  return {
    post: data.docs[0],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data.post.title),
  'og:image': (data.post.header as Media)?.url,
});

export default function Index() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Page className={classes.container}>
    <div className={classes.header}>
      <Date iso={post.date} format='PPP' />
      { ' ' }
      { post.title }
    </div>
    <Image
      className={classes.image}
      image={post.header as Media}
    />
    <main>
      <h1>{post.title}</h1>
      <RichText
        content={post.content}
        className={classes.preview}
      />
      <Blocks
        blocks={post.details as []}
      />
    </main>
    </Page>
  );
}
