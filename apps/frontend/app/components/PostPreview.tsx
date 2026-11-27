import type { Post, Media } from '@app/types/payload'
import type React from 'react'
import { Date } from '~/components/Date'
import { Image } from '~/components/Image'
import { RichText } from '~/components/RichText'
import { useTranslation } from 'react-i18next'
import { Link } from '~/components/localized-link'
import { cn } from '@app/util/cn'
import { postHref } from '~/util/routeHrefs'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

export const PostPreview: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation()
  const { post } = props
  const detailHref = postHref(post.slug)

  const image = (
    <Image
      image={post.header as Media}
      srcSet={[
        { options: { width: 500 }, size: '500w' },
        { options: { width: 768 }, size: '768w' },
        { options: { width: 1000 }, size: '1000w' },
        { options: { width: 1500 }, size: '1500w' },
      ]}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  )
  return (
    <div {...props} className={cn('gap-x-8 sm:grid sm:grid-cols-2', className)}>
      <Link to={detailHref} prefetch="intent">
        {image}
      </Link>
      <div className="max-sm:mt-4">
        <Date className="text-sm" date={post.date} format="PPP" />
        <h2 className="mt-1 mb-4 text-2xl font-semibold break-words uppercase">{post.title}</h2>
        <RichText content={post.content} className="prose prose-white" />
        <Link to={detailHref} prefetch="intent" className="mt-4 inline-block text-sm underline">
          {t('Read more')}
        </Link>
      </div>
    </div>
  )
}
