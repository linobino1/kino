import type { Locale } from '@app/i18n'
import type { Post } from '@app/types/payload'
import { formatDate } from 'date-fns'
import { enUS, de } from 'date-fns/locale'
import { lexicalToPlainText } from '~/components/RichText/lexicalToPlainText'

export const getMetaDescription = (post: Post, locale: Locale) => {
  return `${formatDate(post.date, 'PP', { locale: locale === 'de' ? de : enUS })} - ${post.title}: ${lexicalToPlainText(post?.content)}`
}
