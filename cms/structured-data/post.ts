import type { Media, Post } from "payload/generated-types";
import type {
  ItemList,
  BlogPosting,
} from "schema-dts";
import { itemList } from ".";
import { serializeToPlainText } from "~/components/RichText/Serialize";

export const postPreviewSchema = (post: Post): BlogPosting => {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    articleBody: serializeToPlainText({ content: post.content }),
    datePublished: post.date,
    url: post.url,
    image: (post.header as Media)?.url,
  };
};

export const postsListSchema = (posts: Post[]): ItemList => {
  return itemList(posts.map((p) => postPreviewSchema(p)));
}
