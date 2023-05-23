import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostsList } from "~/components/PostsList";
import { Page } from "~/components/Page";
import classes from "./index.module.css";
import i18next from "~/i18next.server";

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

export default function Index() {
  const { page, posts } = useLoaderData<typeof loader>();


  return (
    <Page layout={page.layout}>
      <div className={classes.postsWrapper}>
        <PostsList posts={posts} />
      </div>
    </Page>
  );
}
