import type { Post } from "payload/generated-types";
import type {
  ItemList,
  BlogPosting,
} from "schema-dts";
import { itemList } from ".";
import { serializeToPlainText } from "~/components/RichText/Serialize";

export const postSchema = (post: Post): BlogPosting => {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    articleBody: serializeToPlainText({ content: post.content }),
  };
};

export const postsListSchema = (posts: Post[]): ItemList => {
  return itemList(posts.map((p) => postSchema(p)));
}
