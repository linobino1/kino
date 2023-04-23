import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostsList from "~/components/PostsList";
import classes from "./index.module.css";

export const loader = async ({ context: { payload }}: LoaderArgs) => {
  const site = await payload.findGlobal({
    slug: 'site',
  });
  
  const posts = await payload.find({
    collection: 'posts',
  });
  
  return {
    site,
    posts: posts.docs || [],
  }
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();


  return (
    <main className={classes.main}>
      <PostsList posts={posts} />
    </main>
  );
}
