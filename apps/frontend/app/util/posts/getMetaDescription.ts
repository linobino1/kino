import type { Locale } from '@app/i18n'
import type { Post } from '@app/types/payload'
import { formatDate } from '@app/util/formatDate'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'

export const getMetaDescription = (post: Post, locale: Locale) => {
  return `${formatDate(post.date, 'PP', locale)} - ${post.title}: ${lexicalToPlainText(post?.content)}`
}
