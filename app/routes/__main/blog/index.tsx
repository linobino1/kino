import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostsList } from "~/components/PostsList";
import { Page } from "~/components/Page";
import classes from "./index.module.css";

export const loader = async ({ context: { payload }}: LoaderArgs) => {
  const page = await payload.findGlobal({
    slug: 'blog',
  });
  const posts = await payload.find({
    collection: 'posts',
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
