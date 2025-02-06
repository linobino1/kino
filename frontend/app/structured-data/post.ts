import type { Media, Post } from '@/payload-types'
import type { ItemList, BlogPosting } from 'schema-dts'
import { itemList } from '.'
import { lexicalToPlainText } from '~/components/RichText/lexicalToPlainText'

export const postSchema = (post: Post): BlogPosting => {
  return {
    '@type': 'BlogPosting',
    headline: post.title,
    articleBody: lexicalToPlainText(post.content),
    datePublished: post.date,
    url: post.url ?? '',
    image: (post.header as Media)?.url || undefined,
  }
}

export const postsListSchema = (posts: Post[]): ItemList => {
  return itemList(posts.map((p) => postSchema(p)))
}
